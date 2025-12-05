'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  ageRange: '18-24' | '25-34' | '35-44' | '45+'
  location?: {
    lat: number
    lng: number
    address: string
  }
}

export interface LonelySignal {
  id: string
  userId: string
  timestamp: number
  responses: Response[]
  isActive: boolean
}

export interface Response {
  id: string
  userId: string
  userName: string
  userGender: string
  userAge: string
  distance: number
  timestamp: number
}

interface UserContextType {
  user: User | null
  lonelySignal: LonelySignal | null
  nearbyLonely: LonelySignal[]
  setUser: (user: User | null) => void
  setLonelySignal: (signal: LonelySignal | null) => void
  setNearbyLonely: (signals: LonelySignal[]) => void
  sendLonelySignal: () => void
  cancelLonelySignal: () => void
  respondToLonely: (signalId: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: '小明',
    gender: 'male',
    ageRange: '25-34',
    location: {
      lat: 25.0330,
      lng: 121.5654,
      address: '台北市信義區'
    }
  })

  const [lonelySignal, setLonelySignal] = useState<LonelySignal | null>(null)
  
  const [nearbyLonely, setNearbyLonely] = useState<LonelySignal[]>([
    {
      id: '2',
      userId: '2',
      timestamp: Date.now() - 3 * 60 * 1000, // 3 minutes ago
      responses: [],
      isActive: true
    },
    {
      id: '3',
      userId: '3',
      timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      responses: [],
      isActive: true
    },
    {
      id: '4',
      userId: '4',
      timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
      responses: [],
      isActive: true
    }
  ])

  const sendLonelySignal = () => {
    if (!user) return
    
    const newSignal: LonelySignal = {
      id: Date.now().toString(),
      userId: user.id,
      timestamp: Date.now(),
      responses: [],
      isActive: true
    }
    
    setLonelySignal(newSignal)
  }

  const cancelLonelySignal = () => {
    setLonelySignal(null)
  }

  const respondToLonely = (_signalId: string) => {
    if (!user) return
    
    const response: Response = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userGender: user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '其他',
      userAge: user.ageRange,
      distance: Math.random() * 2, // Mock distance
      timestamp: Date.now()
    }

    // Add response to the signal
    setLonelySignal(prev => {
      if (!prev) return null
      return {
        ...prev,
        responses: [...prev.responses, response]
      }
    })

    // Show confirmation
    setTimeout(() => {
      alert('已送出陪伴！你的温暖已经送达。')
    }, 100)
  }

  return (
    <UserContext.Provider value={{
      user,
      lonelySignal,
      nearbyLonely,
      setUser,
      setLonelySignal,
      setNearbyLonely,
      sendLonelySignal,
      cancelLonelySignal,
      respondToLonely
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}


