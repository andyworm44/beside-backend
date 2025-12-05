'use client'

import { useUser } from '@/context/UserContext'
import { motion } from 'framer-motion'

interface ListScreenProps {
  onScreenChange: (screen: string) => void
}

export default function ListScreen({ }: ListScreenProps) {
  const { nearbyLonely, respondToLonely } = useUser()

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }

  const getDistance = () => {
    return (Math.random() * 2 + 0.1).toFixed(1)
  }

  const mockUsers = [
    { name: '小雨', gender: '女', age: '25岁' },
    { name: 'David', gender: '男', age: '29岁' },
    { name: '小美', gender: '女', age: '27岁' },
    { name: '阿强', gender: '男', age: '31岁' }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="status-bar">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span>●●●</span>
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>

      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-bold text-gray-800">附近的焦虑</h1>
          <button className="px-4 py-2 border-2 border-pink-200 rounded-2xl bg-white text-gray-600 text-sm font-medium hover:bg-pink-50 transition-colors">
            <span className="mr-1">🔍</span>
            筛选
          </button>
        </div>

        {/* Lonely Cards */}
        <div className="space-y-4">
          {nearbyLonely.map((signal, index) => {
            const user = mockUsers[index] || mockUsers[0]
            return (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="lonely-card"
              >
                {/* Distance Badge */}
                <div className="absolute top-5 right-5 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                  📍 {getDistance()}km
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="card-avatar">
                    <span>👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.gender} · {user.age}</div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  <span>🕐</span>
                  <span>{getTimeAgo(signal.timestamp)}发出</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => respondToLonely(signal.id)}
                  className="btn-accompany"
                >
                  <span>🤝</span>
                  我陪你
                </button>
              </motion.div>
            )
          })}
        </div>

        {nearbyLonely.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无附近的焦虑</h3>
            <p className="text-sm text-gray-500">当有人发出焦虑信号时，会显示在这里</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}


