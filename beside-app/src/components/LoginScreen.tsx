'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LoginScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function LoginScreen({ onNext, onBack }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    phone: '',
    code: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.phone && formData.code) {
      onNext()
    }
  }

  return (
    <div className="h-full">
      <div className="status-bar">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span>●●●</span>
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>

      <div className="p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-pink-300 flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H17c-.8 0-1.54.5-1.85 1.26L14.5 10H12v8h2v6h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5C9 8.12 7.88 7 6.5 7S4 8.12 4 9.5V15H2.5v7h5z"/>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h1>
          <p className="text-sm text-gray-500">继续你的陪伴之旅</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">手机号码</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="输入你的手机号码"
              className="form-input"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">验证码</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="输入验证码"
              className="form-input"
              required
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary mt-8"
          >
            登录
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onBack}
            className="btn-secondary"
          >
            返回注册
          </motion.button>
        </form>
      </div>
    </div>
  )
}


