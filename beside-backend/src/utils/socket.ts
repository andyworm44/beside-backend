import { Server, Socket } from 'socket.io';
import { supabase } from './supabase';
import { SocketUser, Location } from '../types';

// 在線用戶管理
const onlineUsers = new Map<string, SocketUser>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // 用戶加入
    socket.on('user:join', async (data: { userId: string; location?: Location }) => {
      try {
        const { userId, location } = data;
        
        // 驗證用戶
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !userData) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // 添加到在線用戶列表
        const socketUser: SocketUser = {
          id: socket.id,
          socketId: socket.id,
          userId,
          location,
          isOnline: true,
          lastSeen: new Date().toISOString()
        };

        onlineUsers.set(socket.id, socketUser);

        // 加入用戶房間
        socket.join(`user:${userId}`);

        // 通知其他用戶
        socket.broadcast.emit('user:online', {
          userId,
          userData: {
            name: userData.name,
            gender: userData.gender
          }
        });

        console.log(`👤 User ${userData.name} joined`);
      } catch (error) {
        console.error('User join error:', error);
        socket.emit('error', { message: 'Failed to join' });
      }
    });

    // 更新位置
    socket.on('location:update', async (data: { userId: string; location: Location }) => {
      try {
        const { userId, location } = data;
        
        // 更新用戶位置
        await supabase
          .from('user_locations')
          .upsert({
            user_id: userId,
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            updated_at: new Date().toISOString()
          });

        // 更新在線用戶位置
        const user = onlineUsers.get(socket.id);
        if (user) {
          user.location = location;
          onlineUsers.set(socket.id, user);
        }

        // 通知附近用戶位置更新
        socket.broadcast.emit('location:updated', {
          userId,
          location
        });

      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // 發送焦慮信號
    socket.on('signal:send', async (data: { userId: string; location?: Location }) => {
      try {
        const { userId, location } = data;
        
        // 獲取用戶資料
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !userData) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // 創建焦慮信號
        const { data: signal, error: signalError } = await supabase
          .from('lonely_signals')
          .insert({
            user_id: userId,
            user_name: userData.name,
            user_gender: userData.gender,
            user_age: userData.birthday,
            latitude: location?.latitude,
            longitude: location?.longitude,
            is_active: true
          })
          .select()
          .single();

        if (signalError) {
          socket.emit('error', { message: 'Failed to create signal' });
          return;
        }

        // 通知所有在線用戶
        io.emit('signal:new', {
          signal: {
            id: signal.id,
            user_name: userData.name,
            user_gender: userData.gender,
            user_age: userData.birthday,
            distance: 0, // 需要計算距離
            timestamp: Date.now(),
            responses: 0
          }
        });

        console.log(`📡 Signal sent by ${userData.name}`);
      } catch (error) {
        console.error('Send signal error:', error);
        socket.emit('error', { message: 'Failed to send signal' });
      }
    });

    // 回應焦慮信號
    socket.on('signal:respond', async (data: { signalId: string; responderId: string; message?: string }) => {
      try {
        const { signalId, responderId, message = '我陪你' } = data;
        
        // 獲取回應者資料
        const { data: responderData, error: responderError } = await supabase
          .from('users')
          .select('*')
          .eq('id', responderId)
          .single();

        if (responderError || !responderData) {
          socket.emit('error', { message: 'Responder not found' });
          return;
        }

        // 創建回應
        const { data: response, error: responseError } = await supabase
          .from('signal_responses')
          .insert({
            signal_id: signalId,
            responder_id: responderId,
            responder_name: responderData.name,
            responder_gender: responderData.gender,
            responder_age: responderData.birthday,
            message
          })
          .select()
          .single();

        if (responseError) {
          socket.emit('error', { message: 'Failed to respond to signal' });
          return;
        }

        // 取消原信號
        await supabase
          .from('lonely_signals')
          .update({ is_active: false })
          .eq('id', signalId);

        // 通知信號發送者
        const { data: signalData } = await supabase
          .from('lonely_signals')
          .select('user_id')
          .eq('id', signalId)
          .single();

        if (signalData) {
          io.to(`user:${signalData.user_id}`).emit('signal:responded', {
            response: {
              id: response.id,
              responder_name: responderData.name,
              responder_gender: responderData.gender,
              responder_age: responderData.birthday,
              message,
              timestamp: Date.now()
            }
          });
        }

        // 通知所有用戶信號已被回應
        io.emit('signal:removed', { signalId });

        console.log(`💝 ${responderData.name} responded to signal ${signalId}`);
      } catch (error) {
        console.error('Respond to signal error:', error);
        socket.emit('error', { message: 'Failed to respond to signal' });
      }
    });

    // 用戶斷開連接
    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        console.log(`👋 User ${user.userId} disconnected`);
        
        // 通知其他用戶
        socket.broadcast.emit('user:offline', {
          userId: user.userId
        });

        // 從在線用戶列表中移除
        onlineUsers.delete(socket.id);
      }
    });

    // 錯誤處理
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('🔌 Socket.IO server configured');
};
