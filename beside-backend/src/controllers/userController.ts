import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

export const userController = {
  // 獲取用戶資料
  getProfile: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: userData
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 更新用戶資料
  updateProfile: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { name, gender, birthday } = req.body;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          name,
          gender,
          birthday,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (userError) {
        return res.status(400).json({
          success: false,
          error: userError.message
        });
      }

      res.json({
        success: true,
        data: userData,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 更新位置
  updateLocation: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided'
        });
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }

      const { latitude, longitude, accuracy } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }

      const { data: locationData, error: locationError } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          latitude,
          longitude,
          accuracy,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (locationError) {
        return res.status(400).json({
          success: false,
          error: locationError.message
        });
      }

      res.json({
        success: true,
        data: locationData,
        message: 'Location updated successfully'
      });

    } catch (error) {
      console.error('Update location error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // 獲取附近用戶
  getNearbyUsers: async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, radius = 5 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }

      // 這裡可以實現基於位置的查詢
      // 暫時返回所有用戶（實際應用中需要地理位置查詢）
      const { data: users, error } = await supabase
        .from('user_locations')
        .select(`
          *,
          users!user_locations_user_id_fkey (
            id,
            name,
            gender,
            birthday
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: users || []
      });

    } catch (error) {
      console.error('Get nearby users error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};
