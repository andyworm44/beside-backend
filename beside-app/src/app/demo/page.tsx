'use client'

import { useState } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import RegistrationScreen from '@/components/RegistrationScreen'
import LoginScreen from '@/components/LoginScreen'
import HomeScreen from '@/components/HomeScreen'
import ListScreen from '@/components/ListScreen'
import SettingsScreen from '@/components/SettingsScreen'
import BottomNavigation from '@/components/BottomNavigation'
import { UserProvider } from '@/context/UserContext'

export default function Demo() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentScreen('home')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentScreen('welcome')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="phone-frame">
          <div className="phone-screen">
            {currentScreen === 'welcome' && (
              <WelcomeScreen onNext={() => setCurrentScreen('register')} />
            )}
            {currentScreen === 'register' && (
              <RegistrationScreen 
                onNext={handleLogin}
                onBack={() => setCurrentScreen('welcome')}
              />
            )}
            {currentScreen === 'login' && (
              <LoginScreen 
                onNext={handleLogin}
                onBack={() => setCurrentScreen('welcome')}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <UserProvider>
      <div className="min-h-screen gradient-bg">
        <div className="phone-frame mx-auto">
          <div className="phone-screen">
            {currentScreen === 'home' && (
              <HomeScreen onScreenChange={handleScreenChange} />
            )}
            {currentScreen === 'list' && (
              <ListScreen onScreenChange={handleScreenChange} />
            )}
            {currentScreen === 'received' && (
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无收到回应</h2>
                  <p className="text-gray-500 text-sm">当有人回应你的焦虑信号时，会显示在这里</p>
                </div>
              </div>
            )}
            {currentScreen === 'settings' && (
              <SettingsScreen onLogout={handleLogout} />
            )}
            
            <BottomNavigation 
              currentScreen={currentScreen}
              onScreenChange={handleScreenChange}
            />
          </div>
        </div>
      </div>
    </UserProvider>
  )
}

