'use client'

import { motion } from 'framer-motion'

interface BottomNavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
}

export default function BottomNavigation({ currentScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'list', label: '附近', icon: '📋' },
    { id: 'received', label: '收到', icon: '❤️' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
    >
      <div className="flex justify-around py-4">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
              currentScreen === item.id
                ? 'text-pink-500 bg-pink-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}


