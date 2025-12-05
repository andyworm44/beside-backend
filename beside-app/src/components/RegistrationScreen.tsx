'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface RegistrationScreenProps {
  onNext: () => void
  onBack: () => void
}

export default function RegistrationScreen({ onNext }: RegistrationScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female' | 'other',
    ageRange: '25-34' as '18-24' | '25-34' | '35-44' | '45+'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">创建你的资料</h1>
          <p className="text-sm text-gray-500">简单几步，开始温暖的陪伴</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">昵称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入你的昵称"
              className="form-input"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">性别</label>
            <div className="flex gap-2">
              {[
                { value: 'male', label: '男生', icon: '♂️' },
                { value: 'female', label: '女生', icon: '♀️' },
                { value: 'other', label: '其他', icon: '⚧️' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: option.value as 'male' | 'female' | 'other' })}
                  className={`option-btn ${formData.gender === option.value ? 'active' : ''}`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-600 mb-2">年龄</label>
            <div className="grid grid-cols-2 gap-2">
              {['18-24', '25-34', '35-44', '45+'].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setFormData({ ...formData, ageRange: age as '18-24' | '25-34' | '35-44' | '45+' })}
                  className={`option-btn ${formData.ageRange === age ? 'active' : ''}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-pink-50 p-4 rounded-xl flex items-center gap-3"
          >
            <span className="text-pink-500">📍</span>
            <span className="text-sm text-gray-600">我们需要你的位置来寻找附近的人</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary mt-8"
          >
            完成注册
          </motion.button>
        </form>
      </div>
    </div>
  )
}


