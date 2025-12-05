'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface HomeScreenProps {
  onScreenChange: (screen: string) => void
}

export default function HomeScreen({ onScreenChange }: HomeScreenProps) {
  const { user, lonelySignal, sendLonelySignal, cancelLonelySignal } = useUser()
  const [isPressed, setIsPressed] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [intensity, setIntensity] = useState(0)
  const pressStartTime = useRef<number | null>(null)
  const lastClickTime = useRef<number>(0)
  const intensityIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wasLongPress = useRef<boolean>(false)
  const currentClickCountRef = useRef<number>(0)
  
  const scale = useMotionValue(0)
  const scaleSpring = useSpring(scale, { 
    stiffness: 300, 
    damping: 30 
  })

  // 初始加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      scale.set(1)
    }, 200)
    return () => clearTimeout(timer)
  }, [scale])

  const handleLonelyClick = () => {
    // 如果刚刚有长按或按压，不触发点击
    if (wasLongPress.current) {
      wasLongPress.current = false
      return
    }
    
    // 只有在没有按压状态时才发送信号
    if (!isPressed && !pressStartTime.current) {
      if (lonelySignal) {
        cancelLonelySignal()
      } else {
        sendLonelySignal()
      }
    }
  }

  const handlePointerDown = () => {
    setIsPressed(true)
    wasLongPress.current = false
    pressStartTime.current = Date.now()
    const now = Date.now()
    
    // 检测连击（500ms内算连击）
    if (now - lastClickTime.current < 500) {
      currentClickCountRef.current += 1
      setClickCount(currentClickCountRef.current)
    } else {
      currentClickCountRef.current = 1
      setClickCount(1)
    }
    
    lastClickTime.current = now
    
    // 开始更新强度指数
    if (intensityIntervalRef.current) {
      clearInterval(intensityIntervalRef.current)
    }
    
    intensityIntervalRef.current = setInterval(() => {
      if (pressStartTime.current) {
        const pressDuration = (Date.now() - pressStartTime.current) / 1000 // 秒
        
        // 如果按压超过200ms，认为是长按
        if (pressDuration > 0.2) {
          wasLongPress.current = true
        }
        
        const calculatedIntensity = Math.min(
          Math.floor(pressDuration * 10 + currentClickCountRef.current * 15),
          100
        )
        setIntensity(calculatedIntensity)
        
        // 根据强度和连击次数计算缩放
        const baseScale = 1 + (currentClickCountRef.current * 0.05) + (pressDuration * 0.02)
        const targetScale = Math.min(baseScale, 1.4) // 最大1.4倍
        scale.set(targetScale)
      }
    }, 50) // 每50ms更新一次
  }

  const handlePointerUp = () => {
    const pressDuration = pressStartTime.current ? (Date.now() - pressStartTime.current) / 1000 : 0
    
    // 停止更新强度指数
    if (intensityIntervalRef.current) {
      clearInterval(intensityIntervalRef.current)
      intensityIntervalRef.current = null
    }
    
    // 爱心慢慢回到原来大小
    scale.set(1)
    
    // 如果按压时间很短（<100ms），认为是快速点击，延迟一点后允许 onClick
    // 如果按压时间较长，标记为长按，阻止 onClick
    if (pressDuration < 0.1) {
      // 快速点击，延迟重置状态以允许 onClick 触发
      setTimeout(() => {
        setIsPressed(false)
        pressStartTime.current = null
      }, 100)
    } else {
      // 长按，立即重置并阻止 onClick
      wasLongPress.current = true
      setIsPressed(false)
      pressStartTime.current = null
      
      // 延迟一下再重置长按标记，确保 onClick 不会触发
      setTimeout(() => {
        wasLongPress.current = false
      }, 300)
    }
    
    // 重置强度指数（延迟一点让用户看到最终值）
    clickTimeoutRef.current = setTimeout(() => {
      setIntensity(0)
      setClickCount(0)
      currentClickCountRef.current = 0
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (intensityIntervalRef.current) {
        clearInterval(intensityIntervalRef.current)
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

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

      <div className="p-6 flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{user?.name}</div>
            </div>
          </div>
          <button
            onClick={() => onScreenChange('settings')}
            className="icon-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!lonelySignal ? (
            <>
              <div className="relative mb-8">
                <motion.div
                  style={{ scale: scaleSpring }}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onClick={handleLonelyClick}
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-400 to-pink-300 flex items-center justify-center shadow-lg cursor-pointer select-none touch-none"
                >
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.div>
                
                {/* 孤单强度指数显示 */}
                {intensity > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10"
                  >
                    <div className="bg-gradient-to-r from-pink-100 to-pink-50 border-2 border-pink-300 rounded-full px-6 py-3 shadow-lg">
                      <div className="text-xs text-pink-600 font-semibold mb-1 tracking-wide">孤单强度指数</div>
                      <motion.div 
                        key={intensity}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-pink-600"
                      >
                        {intensity}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl font-semibold text-gray-800 mb-2"
              >
                感到焦虑了吗？
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-gray-500 leading-relaxed"
              >
                按住或连击爱心<br />
                让附近的人知道你需要陪伴
              </motion.p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-sm"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-300 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">你的信号已发出</h3>
              <p className="text-sm text-gray-500 mb-6">附近的人可以看到你需要陪伴</p>
              
              <div className="text-4xl font-bold text-pink-500 mb-2">
                {lonelySignal.responses.length}
              </div>
              <p className="text-sm text-gray-500 mb-6">人说「我陪你」</p>

              {lonelySignal.responses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {lonelySignal.responses.slice(0, 3).map((response, index) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl"
                    >
                      <div className="response-avatar">
                        <span>👤</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-800">{response.userName}</div>
                        <div className="text-xs text-gray-500">
                          {response.userGender} · {response.userAge} · {response.distance.toFixed(1)}km · 刚刚
                        </div>
                      </div>
                      <span className="text-pink-500">❤️</span>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={handleLonelyClick}
                className="w-full bg-pink-100 text-pink-600 border-2 border-pink-200 py-3 rounded-2xl font-semibold hover:bg-pink-200 transition-colors"
              >
                取消信号
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


