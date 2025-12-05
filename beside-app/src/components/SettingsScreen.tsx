'use client'

import { useUser } from '@/context/UserContext'
import { motion } from 'framer-motion'

interface SettingsScreenProps {
  onLogout: () => void
}


export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const { user } = useUser()

  const settingsSections = [
    {
      title: '个人资料',
      items: [
        { label: '昵称', value: user?.name, hasArrow: true },
        { label: '性别', value: user?.gender === 'male' ? '男' : user?.gender === 'female' ? '女' : '其他', hasArrow: true },
        { label: '年龄', value: user?.ageRange, hasArrow: true }
      ]
    },
    {
      title: '隐私设置',
      items: [
        { label: '显示距离范围', value: '5km', hasArrow: true },
        { label: '接收通知', value: '', isToggle: true, isActive: true },
        { label: '显示在附近列表', value: '', isToggle: true, isActive: true }
      ]
    },
    {
      title: '关于',
      items: [
        { label: '版本', value: '1.0.0', hasArrow: false },
        { label: '使用条款', value: '', hasArrow: true },
        { label: '隐私政策', value: '', hasArrow: true }
      ]
    }
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold text-gray-800">设置</h1>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-800 mb-4">{section.title}</h3>
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    
                    {'isToggle' in item ? (
                      <div className={`toggle-switch ${item.isActive ? 'active' : ''}`}></div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-pink-500 font-semibold">{item.value}</span>
                        {'hasArrow' in item && item.hasArrow && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full bg-white text-pink-600 border-2 border-pink-200 py-4 rounded-2xl font-semibold mt-6 hover:bg-pink-50 transition-colors"
        >
          登出
        </motion.button>
      </div>
    </div>
  )
}


