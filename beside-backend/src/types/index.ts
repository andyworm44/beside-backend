export interface User {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface LonelySignal {
  id: string;
  user_id: string;
  user_name: string;
  user_gender: 'male' | 'female' | 'other';
  user_age: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  timestamp: number;
  responses: SignalResponse[];
  created_at: string;
  updated_at: string;
}

export interface SignalResponse {
  id: string;
  signal_id: string;
  responder_id: string;
  responder_name: string;
  responder_gender: 'male' | 'female' | 'other';
  responder_age: string;
  message: string;
  timestamp: number;
  created_at: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface SocketUser {
  id: string;
  socketId: string;
  userId: string;
  location?: Location;
  isOnline: boolean;
  lastSeen: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request types
export interface CreateSignalRequest {
  latitude?: number;
  longitude?: number;
}

export interface RespondToSignalRequest {
  signalId: string;
  message?: string;
}

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
