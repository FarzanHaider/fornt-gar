// import { useState, useEffect, useRef } from 'react'
// import { authAPI } from '../../lib/api/auth.api'
// import sweetBonanzaAPI from '../../lib/api/sweetBonanza.api'
// import { updateUserData } from '../../lib/utils/auth'
// import SlotGameEngine, { SlotGameTheme } from '../components/SlotGameEngine'
// import { GameSelector } from '../components/GameSelector'

// interface SweetBonanzaPageProps {
//   onClose?: () => void
//   onSwitchGame?: (gameId?: string) => void
// }

// function SweetBonanzaPage({ onClose, onSwitchGame }: SweetBonanzaPageProps = {}) {
  
//   const [user, setUser] = useState<any>(null)
//   const [balance, setBalance] = useState(() => {
//     // Initialize balance from localStorage if available
//     try {
//       const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//       return storedUser?.balance || 0
//     } catch {
//       return 0
//     }
//   })
//   const [loading, setLoading] = useState(true)
//   const [gameLoading, setGameLoading] = useState(true)
//   const [loadingProgress, setLoadingProgress] = useState(0)
//   const [logoLoaded, setLogoLoaded] = useState(false)
//   const [bgImageLoaded, setBgImageLoaded] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [betAmount, setBetAmount] = useState('10')
//   const [spinning, setSpinning] = useState(false)
//   const [selectedOutcome, setSelectedOutcome] = useState(null) // 'win' or 'loss'
//   const [gameState, setGameState] = useState('betting') // 'betting', 'spinning', 'result'
//   const [timer, setTimer] = useState(10)
//   const [spinTrigger, setSpinTrigger] = useState(0) // Trigger for external spin (Buy Free Spins, etc.)

//   // Theme configuration for Sweet Bonanza
//   const sweetBonanzaTheme: SlotGameTheme = {
//     themeName: 'Sweet Bonanza',
//     backgroundImage: '/sweet-bonanza-bg.jpg',
//     symbolImages: {
//       '🍇': '/icons/icon.png',      // Grapes (weight: 30 - most common)
//       '🍊': '/icons/icon1.png',     // Orange (weight: 25)
//       '🍋': '/icons/icon7.png',     // Lemon (weight: 20)
//       '🍉': '/icons/icon3.png',     // Watermelon (weight: 15)
//       '🍌': '/icons/icon4.png',     // Banana (weight: 12)
//       '🍎': '/icons/icon5.png',     // Apple (weight: 8)
//       '🍓': '/icons/icon6.png',     // Strawberry (weight: 5)
//       '⭐': '/icons/icon2.png',     // Star (weight: 3)
//       '💎': '/icons/bomb.png',      // Diamond/Lollipop (weight: 2 - least common)
//     },
//     symbolWeights: {
//       '🍇': 30, '🍊': 25, '🍋': 20, '🍉': 15, '🍌': 12,
//       '🍎': 8, '🍓': 5, '⭐': 3, '💎': 2
//     },
//     defaultSymbol: '🍇',
//     gridColumns: 6,
//     gridRows: 5,
//     gridWidth: 560,
//     gridHeight: 466.67
//   }

//   // Original emoji symbols for reference (keeping for weight mapping)
//   const symbolKeys = ['🍇', '🍊', '🍋', '🍉', '🍌', '🍎', '🍓', '⭐', '💎']

//   // Game state - winAmount and gameHistory kept for display purposes
//   const [winAmount, setWinAmount] = useState(0)
//   const [gameHistory, setGameHistory] = useState<any[]>([])
//   const [autoSpin, setAutoSpin] = useState(false)
//   const [autoSpinCount, setAutoSpinCount] = useState(0)
//   const [isWinning, setIsWinning] = useState(false)
//   const bgMusicRef = useRef<HTMLAudioElement | null>(null)
//   const winSoundRef = useRef<HTMLAudioElement | null>(null)
//   const lossSoundRef = useRef<HTMLAudioElement | null>(null)
//   const spinSoundRef = useRef<HTMLAudioElement | null>(null)
//   const [musicEnabled, setMusicEnabled] = useState(true)
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [showGameRules, setShowGameRules] = useState(false)
//   const [doNotShowAgain, setDoNotShowAgain] = useState(false)
//   const [showGamesSidebar, setShowGamesSidebar] = useState(false)
//   const [showBetPopup, setShowBetPopup] = useState(false)
//   const [thunderCount, setThunderCount] = useState(5) // Track remaining spins (starts at 5, game ends after 5 spins)

//   const quickBetAmounts = ['10', '50', '100', '500', '1000']

//   // Helper function to create beep sound using Web Audio API
//   const createBeepSound = (frequency, duration, type = 'sine') => {
//     if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) {
//       return
//     }
    
//     try {
//       const AudioContext = window.AudioContext || window.webkitAudioContext
//       const audioContext = new AudioContext()
//       const oscillator = audioContext.createOscillator()
//       const gainNode = audioContext.createGain()
      
//       oscillator.connect(gainNode)
//       gainNode.connect(audioContext.destination)
      
//       oscillator.frequency.value = frequency
//       oscillator.type = type
      
//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
//       gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
//       oscillator.start(audioContext.currentTime)
//       oscillator.stop(audioContext.currentTime + duration)
//     } catch (error) {
//       console.error('Error creating beep sound:', error)
//     }
//   }

//   // Helper function to play sound
//   const playSound = (soundRef, volume = 0.7, useBeep = false, beepFreq = 800) => {
//     if (!soundEnabled) return
    
//     // If beep requested or no sound ref, use beep sound
//     if (useBeep || !soundRef?.current) {
//       createBeepSound(beepFreq, 0.3)
//       return
//     }
    
//     const audio = soundRef.current
//     if (!audio) {
//       createBeepSound(beepFreq, 0.3)
//       return
//     }
    
//     // Check if audio has error state
//     if (audio.error) {
//       // Audio file has error - fallback to beep
//       createBeepSound(beepFreq, 0.3)
//       return
//     }
    
//     try {
//       // Reset audio to start
//       audio.currentTime = 0
//       audio.volume = volume
      
//       // Try to play - handle errors gracefully
//       const playPromise = audio.play()
//       if (playPromise !== undefined) {
//         playPromise.catch(() => {
//           // Any play error - fallback to beep sound silently
//           createBeepSound(beepFreq, 0.3)
//         })
//       }
//     } catch (error: any) {
//       // Catch any other errors and fallback silently
//       createBeepSound(beepFreq, 0.3)
//     }
//   }

//   // Initialize audio
//   useEffect(() => {
//     // Create audio elements for sounds
//     try {
//       // Background music
//       bgMusicRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
//       bgMusicRef.current.loop = true
//       bgMusicRef.current.volume = 0.3
//       bgMusicRef.current.preload = 'auto'
      
//       // Try to load audio files from public folder, fallback to beep sounds
//       // Use lazy loading to prevent 416 errors with empty/missing files
//       try {
//         // Win sound - create but don't load immediately
//         const winAudio = new Audio('/sweet-bonanza-win.mp3')
//         winAudio.volume = 0.7
//         winAudio.preload = 'none'
//         // Suppress errors - will fallback to beep sound
//         winAudio.addEventListener('error', () => {
//           // Audio file failed to load - set to null to use beep fallback
//           winSoundRef.current = null
//         }, { once: true })
//         winSoundRef.current = winAudio
//       } catch (e) {
//         winSoundRef.current = null
//       }
      
//       try {
//         // Loss sound - create but don't load immediately
//         const lossAudio = new Audio('/sweet-bonanza-loss.mp3')
//         lossAudio.volume = 0.7
//         lossAudio.preload = 'none'
//         // Suppress errors - will fallback to beep sound
//         lossAudio.addEventListener('error', () => {
//           // Audio file failed to load - set to null to use beep fallback
//           lossSoundRef.current = null
//         }, { once: true })
//         lossSoundRef.current = lossAudio
//       } catch (e) {
//         lossSoundRef.current = null
//       }
      
//       try {
//         // Spin sound - create but don't load immediately
//         const spinAudio = new Audio('/sweet-bonanza-spin.mp3')
//         spinAudio.volume = 0.5
//         spinAudio.preload = 'none'
//         // Suppress errors - will fallback to beep sound
//         spinAudio.addEventListener('error', () => {
//           // Audio file failed to load - set to null to use beep fallback
//           spinSoundRef.current = null
//         }, { once: true })
//         spinSoundRef.current = spinAudio
//       } catch (e) {
//         spinSoundRef.current = null
//       }

//       // Start background music if enabled
//       if (musicEnabled && bgMusicRef.current) {
//         bgMusicRef.current.play().catch(() => {
//           // Autoplay blocked, ignore silently
//         })
//       }
//     } catch (error) {
//       console.error('Error initializing audio:', error)
//     }

//     return () => {
//       // Cleanup audio on unmount
//       if (bgMusicRef.current) {
//         bgMusicRef.current.pause()
//         bgMusicRef.current = null
//       }
//       if (winSoundRef.current) {
//         winSoundRef.current.pause()
//         winSoundRef.current = null
//       }
//       if (lossSoundRef.current) {
//         lossSoundRef.current.pause()
//         lossSoundRef.current = null
//       }
//       if (spinSoundRef.current) {
//         spinSoundRef.current.pause()
//         spinSoundRef.current = null
//       }
//     }
//   }, [])

//   // Handle music toggle
//   useEffect(() => {
//     if (bgMusicRef.current) {
//       if (musicEnabled) {
//         bgMusicRef.current.play().catch(() => {})
//       } else {
//         bgMusicRef.current.pause()
//       }
//     }
//   }, [musicEnabled])

//   // Preload background images
//   useEffect(() => {
//     const bgImage = new Image()
//     bgImage.onload = () => setBgImageLoaded(true)
//     bgImage.onerror = () => {
//       console.warn('Background image failed to load, continuing anyway')
//       setBgImageLoaded(true) // Continue even if image fails
//     }
//     bgImage.src = sweetBonanzaTheme.backgroundImage || '/sweet-bonanza-bg.jpg'
    
//     // Set timeout to ensure loading doesn't get stuck
//     const timeout = setTimeout(() => {
//       setBgImageLoaded(true)
//     }, 3000)
    
//     return () => clearTimeout(timeout)
//   }, [])

//   // Loading screen progress animation - only start after logo and bg image are loaded, and user data is loaded
//   useEffect(() => {
//     // Immediately set loading to false to allow game to open quickly
//     setLoading(false)
    
//     // Auto-set images as loaded after a short delay if they haven't loaded (ensures game always opens)
//     const imageTimeout = setTimeout(() => {
//       setLogoLoaded(true)
//       setBgImageLoaded(true)
//     }, 1000) // Reduced to 1 second for faster loading

//     // Safety timeout - if loading takes too long, force completion (ensures game always opens)
//     const safetyTimeout = setTimeout(() => {
//       setGameLoading(false)
//       setLoading(false)
//       setLogoLoaded(true)
//       setBgImageLoaded(true)
//       setLoadingProgress(100)
//     }, 2000) // 2 second timeout - game should open quickly
    
//     return () => {
//       clearTimeout(imageTimeout)
//       clearTimeout(safetyTimeout)
//     }
//   }, []) // Empty dependency array - only run once on mount

//   // Progress bar animation - separate effect (runs independently)
//   useEffect(() => {
//     if (gameLoading && logoLoaded && bgImageLoaded && !loading && loadingProgress < 100) {
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 100) {
//             clearInterval(interval)
//             setTimeout(() => {
//               setGameLoading(false)
//             }, 200)
//             return 100
//           }
//           return prev + 3 // Faster progress
//         })
//       }, 50)
//       return () => clearInterval(interval)
//     }
//   }, [gameLoading, logoLoaded, bgImageLoaded, loading, loadingProgress])

//   useEffect(() => {
//     // Try to get balance from localStorage first (faster initial load)
//     try {
//       const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//       if (storedUser?.balance !== undefined && storedUser.balance !== null) {
//         const initialBalance = parseFloat(storedUser.balance) || 0
//         setBalance(initialBalance)
//         setUser(storedUser)
//         setLoading(false) // Set loading to false immediately if we have localStorage data
//       } else {
//         // No stored user, but still set loading to false after a short delay
//         setLoading(false)
//       }
//     } catch (e) {
//       // Ignore localStorage errors, but still set loading to false
//       setLoading(false)
//     }
    
//     // Then fetch fresh data from server (don't block on this)
//     fetchUserData()
    
//     // Listen for balance updates from other components
//     const handleUserDataUpdate = (event) => {
//       if (event.detail?.balance !== undefined && event.detail.balance !== null) {
//         const newBalance = parseFloat(event.detail.balance) || 0
//         setBalance(newBalance)
//         setUser(event.detail)
//       }
//     }
    
//     window.addEventListener('userDataUpdated', handleUserDataUpdate)
    
//     // Also poll for balance updates periodically (every 10 seconds - reduced frequency)
//     const balanceInterval = setInterval(() => {
//       // Only fetch if not loading and component is still mounted
//       if (!loading) {
//         fetchUserData()
//       }
//     }, 10000) // Increased to 10 seconds to reduce load
    
//     return () => {
//       window.removeEventListener('userDataUpdated', handleUserDataUpdate)
//       clearInterval(balanceInterval)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const fetchUserData = async () => {
//     try {
//       // Always ensure loading is false (don't block game)
//       setLoading(false)
      
//       // Check if user is authenticated
//       const token = localStorage.getItem('token')
//       if (!token) {
//         // Don't block game from opening, just use localStorage data
//         try {
//           const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//           if (storedUser?.balance !== undefined) {
//             setBalance(storedUser.balance)
//             setUser(storedUser)
//             return
//           }
//         } catch (e) {
//           // Continue to try API call
//         }
//         return
//       }

//       const response = await authAPI.me()
      
//       // Response data extraction (no logging in production)
      
//       // Handle different response structures
//       // Backend returns user directly, axios wraps it in response.data
//       const userData = response?.data || response || null
      
//       if (userData) {
//         setUser(userData)
//         // Get balance - check multiple possible locations
//         const userBalance = userData.balance !== undefined ? userData.balance : 
//                           (userData.user?.balance !== undefined ? userData.user.balance : 0)
        
//         setBalance(userBalance)
        
//         // Update localStorage to sync with navbar
//         updateUserData(userData)
        
//       } else {
//         // Try to get balance from localStorage as fallback
//         try {
//           const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//           if (storedUser?.balance !== undefined) {
//             setBalance(storedUser.balance)
//             setUser(storedUser)
//           } else {
//             setError('Unable to load user data. Please try again.')
//           }
//         } catch (e) {
//           // Ignore localStorage errors
//           setError('Unable to load user data. Please try again.')
//         }
//       }
//     } catch (err: any) {
//       console.error('Sweet Bonanza - API Error:', err)
//       if (import.meta.env.DEV) {
//         console.error('Sweet Bonanza - Error fetching user data:', err)
//         console.error('Sweet Bonanza - Error response:', err.response)
//       }
      
//       // Handle authentication errors
//       if (err.response?.status === 401) {
//         setError('Session expired. Please log in again.')
//         localStorage.removeItem('token')
//         localStorage.removeItem('user')
//         setTimeout(() => {
//           if (onClose) {
//             onClose()
//           }
//         }, 2000)
//       }
      
//       // Try to get balance from localStorage as fallback
//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
//         if (storedUser?.balance !== undefined) {
//           setBalance(storedUser.balance)
//           setUser(storedUser)
//         } else {
//           setError('Unable to load user data. Please try again.')
//         }
//       } catch (e) {
//         // Ignore localStorage errors - game should still open
//       }
//       // Always set loading to false even on error
//       setLoading(false)
//     } finally {
//       // Always ensure loading is false in finally block
//       setLoading(false)
//       setLoading(false)
//     }
//   }

//   // NOTE: All game logic (spinReels, processCascadeAnimation, etc.) has been moved to SlotGameEngine component
//   // This component now only handles page-level UI (balance display, title, banners, sidebar, etc.)

//   // Quick bet handler
//   const handleQuickBet = (amount) => {
//     setBetAmount(amount)
//   }

//   // Reset thunder count when autoplay finishes
//   useEffect(() => {
//     if (autoSpinCount === 0 && autoSpin) {
//       setThunderCount(5) // Reset to 5 for next game
//     }
//   }, [autoSpinCount, autoSpin])

//   // All game logic (spin, cascade animations, win calculations) has been moved to SlotGameEngine component
//   // This component now only handles page-level UI (balance display, title, banners, sidebar, etc.)

//   // Loading Screen with Pragmatic Play Logo - Show this for all loading states
//   if (loading || gameLoading) {
//     return (
//       <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
//           <div className="flex flex-col items-center justify-center">
//             {/* PRAGMATIC PLAY Logo Image - Display first */}
//             <div className="mb-8 text-center">
//               <img 
//                 src="/pragmaticplay.jpeg" 
//                 alt="Pragmatic Play" 
//                 className="w-48 md:w-64 h-auto mx-auto"
//                 style={{ maxWidth: '300px' }}
//                 onLoad={() => setLogoLoaded(true)}
//                 onError={() => setLogoLoaded(true)} // Continue even if logo fails
//               />
//             </div>
            
//             {/* Loading Bar - Only show after logo and bg image are loaded, and user data is loaded */}
//             {logoLoaded && bgImageLoaded && !loading && (
//               <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-orange-500 transition-all duration-300 ease-out"
//                   style={{ 
//                     width: `${loadingProgress}%`,
//                     boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)'
//                   }}
//                 ></div>
//               </div>
//             )}
//             {/* Show loading indicator while user data is being fetched */}
//             {loading && (
//               <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-orange-500 transition-all duration-300 ease-out animate-pulse"
//                   style={{ 
//                     width: '30%',
//                     boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)'
//                   }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         </div>
//     )
//   }





import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../lib/api/auth.api'
import sweetBonanzaAPI from '../../lib/api/sweetBonanza.api'
import { updateUserData } from '../../lib/utils/auth'
import SlotGameEngine, { SlotGameTheme } from '../components/SlotGameEngine'
import { GameSelector } from '../components/GameSelector'

interface SweetBonanzaPageProps {
  onSwitchGame?: (gameId?: string) => void
}

function SweetBonanzaPage({ onSwitchGame }: SweetBonanzaPageProps = {}) {
  const navigate = useNavigate() // ✅ added navigate hook

  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      return storedUser?.balance || 0
    } catch {
      return 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [gameLoading, setGameLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [betAmount, setBetAmount] = useState('10')
  const [spinning, setSpinning] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState(null)
  const [gameState, setGameState] = useState('betting')
  const [timer, setTimer] = useState(10)
  const [spinTrigger, setSpinTrigger] = useState(0)

  const sweetBonanzaTheme: SlotGameTheme = {
    themeName: 'Sweet Bonanza',
    backgroundImage: '/sweet-bonanza-bg.jpg',
    symbolImages: {
      '🍇': '/icons/icon.png',
      '🍊': '/icons/icon1.png',
      '🍋': '/icons/icon7.png',
      '🍉': '/icons/icon3.png',
      '🍌': '/icons/icon4.png',
      '🍎': '/icons/icon5.png',
      '🍓': '/icons/icon6.png',
      '⭐': '/icons/icon2.png',
      '💎': '/icons/bomb.png',
    },
    symbolWeights: {
      '🍇': 30, '🍊': 25, '🍋': 20, '🍉': 15, '🍌': 12,
      '🍎': 8, '🍓': 5, '⭐': 3, '💎': 2
    },
    defaultSymbol: '🍇',
    gridColumns: 6,
    gridRows: 5,
    gridWidth: 560,
    gridHeight: 466.67
  }

  const [winAmount, setWinAmount] = useState(0)
  const [gameHistory, setGameHistory] = useState<any[]>([])
  const [autoSpin, setAutoSpin] = useState(false)
  const [autoSpinCount, setAutoSpinCount] = useState(0)
  const [isWinning, setIsWinning] = useState(false)

  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const lossSoundRef = useRef<HTMLAudioElement | null>(null)
  const spinSoundRef = useRef<HTMLAudioElement | null>(null)

  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showGameRules, setShowGameRules] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const [showGamesSidebar, setShowGamesSidebar] = useState(false)
  const [showBetPopup, setShowBetPopup] = useState(false)
  const [thunderCount, setThunderCount] = useState(5)

  const quickBetAmounts = ['10', '50', '100', '500', '1000']

  const createBeepSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || typeof window === 'undefined' || !window.AudioContext && !(window as any).webkitAudioContext) return
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.error('Error creating beep sound:', error)
    }
  }

  const playSound = (soundRef, volume = 0.7, useBeep = false, beepFreq = 800) => {
    if (!soundEnabled) return
    if (useBeep || !soundRef?.current) {
      createBeepSound(beepFreq, 0.3)
      return
    }
    const audio = soundRef.current
    if (!audio) {
      createBeepSound(beepFreq, 0.3)
      return
    }
    if (audio.error) {
      createBeepSound(beepFreq, 0.3)
      return
    }
    try {
      audio.currentTime = 0
      audio.volume = volume
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => createBeepSound(beepFreq, 0.3))
      }
    } catch (error: any) {
      createBeepSound(beepFreq, 0.3)
    }
  }

  // Initialize audio
  useEffect(() => {
    try {
      bgMusicRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.3
      bgMusicRef.current.preload = 'auto'

      const winAudio = new Audio('/sweet-bonanza-win.mp3')
      winAudio.volume = 0.7
      winAudio.preload = 'none'
      winSoundRef.current = winAudio

      const lossAudio = new Audio('/sweet-bonanza-loss.mp3')
      lossAudio.volume = 0.7
      lossAudio.preload = 'none'
      lossSoundRef.current = lossAudio

      const spinAudio = new Audio('/sweet-bonanza-spin.mp3')
      spinAudio.volume = 0.5
      spinAudio.preload = 'none'
      spinSoundRef.current = spinAudio

      if (musicEnabled && bgMusicRef.current) bgMusicRef.current.play().catch(() => {})
    } catch (error) {
      console.error('Error initializing audio:', error)
    }

    return () => {
      bgMusicRef.current?.pause()
      bgMusicRef.current = null
      winSoundRef.current?.pause()
      winSoundRef.current = null
      lossSoundRef.current?.pause()
      lossSoundRef.current = null
      spinSoundRef.current?.pause()
      spinSoundRef.current = null
    }
  }, [])

  useEffect(() => {
    if (bgMusicRef.current) {
      if (musicEnabled) bgMusicRef.current.play().catch(() => {})
      else bgMusicRef.current.pause()
    }
  }, [musicEnabled])

  // Navigation helper to replace onClose
  const closeGame = () => {
    navigate('/') // ⬅ now uses router instead of onClose
  }

  // Fetch user data function
  const fetchUserData = async () => {
    try {
      const response = await authAPI.me()
      const userData = response.data?.data || response.data
      if (userData) {
        setUser(userData)
        setBalance(userData.balance || 0)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Error fetching user data:', err)
      }
    }
  }

  const handleQuickBet = (amount: string) => setBetAmount(amount)

  useEffect(() => {
    if (autoSpinCount === 0 && autoSpin) setThunderCount(5)
  }, [autoSpinCount, autoSpin])

  if (loading || gameLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8 text-center">
            <img 
              src="/pragmaticplay.jpeg" 
              alt="Pragmatic Play" 
              className="w-48 md:w-64 h-auto mx-auto"
              style={{ maxWidth: '300px' }}
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(true)}
            />
          </div>
          {logoLoaded && bgImageLoaded && !loading && (
            <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%`, boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)' }}
              ></div>
            </div>
          )}
          {loading && (
            <div className="w-64 md:w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out animate-pulse"
                style={{ width: '30%', boxShadow: '0 0 10px rgba(255, 165, 0, 0.8)' }}
              ></div>
            </div>
          )}
        </div>
      </div>
    )
  }







  return (
    <div className="fixed inset-0 z-[9999] bg-black relative flex w-full flex-col" style={{ 
        width: '100%',
        minHeight: '100vh',
        overflow: 'visible'
      }}>
        {/* Background Image - Sweet Bonanza BG */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${sweetBonanzaTheme.backgroundImage || '/sweet-bonanza-bg.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </div>
        
        

        <main className="relative flex flex-row items-start justify-center z-10 w-full main-content" style={{ padding: '0.2rem', overflowY: 'auto', height: '100vh', maxHeight: '100vh', position: 'relative', width: '100%' }}>
          {/* Wrapped Container - Title, Golden Banner, Grid, Sidebar, Controls with Game BG */}
          <div className="w-full relative z-20 flex flex-row gap-3 hide-scrollbar" style={{
            backgroundImage: `url(${sweetBonanzaTheme.backgroundImage || '/sweet-bonanza-bg.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '12px',
            padding: '0.75rem',
            margin: '0 auto',
            maxWidth: '100%',
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            position: 'relative',
            overflow: 'auto',
            boxSizing: 'border-box'
          }}>
            {/* Main Game Content Area */}
            <div className="flex-1 flex flex-col items-center relative h-full min-h-0 hide-scrollbar" style={{ minWidth: 0, overflowY: 'auto', maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* Balance Display */}
              <div className="w-full text-center relative z-20 mb-1 flex-shrink-0">
                <div className="bg-green-600/90 text-white px-4 py-2 rounded-lg shadow-lg inline-block">
                  <p className="text-lg md:text-xl font-bold">
                    Balance: ₺{balance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Game Title - SWEET BONANZA Logo Image */}
              <div className="w-full text-center relative z-20 mb-1 mt-1 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/icons/sweet bonanza.PNG"
                  alt="Sweet Bonanza"
                  className="mx-auto object-contain"
                  style={{
                    height: '70px',
                    width: 'auto',
                    maxWidth: '95%',
                    minHeight: '140px',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(255,215,0,0.3))',
                    animation: 'titleBlink 2s ease-in-out infinite'
                  }}
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('h1');
                    fallback.textContent = 'SWEET BONANZA';
                    fallback.className = 'text-xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-0 leading-tight relative z-10 titleBlink';
                    fallback.style.cssText = `
                      font-family: Arial Black, sans-serif;
                      font-weight: 900;
                      background: linear-gradient(135deg, #FF1493 0%, #FFD700 25%, #FF69B4 50%, #FFD700 75%, #FF1493 100%);
                      background-size: 200% 200%;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                      animation: gradientShift 3s ease infinite, titleBlink 2s ease-in-out infinite;
                      letter-spacing: 2px;
                      line-height: 1.1;
                      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    `;
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              

              {/* Mobile Golden Banner - Show above grid on small/medium screens */}
              <div className="lg:hidden w-full mb-2 flex justify-center flex-shrink-0">
                <div className="relative rounded-xl p-2 text-center glowBox " style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  border: '3px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5)',
                  animation: 'glowPulse 2s ease-in-out infinite',
                  maxWidth: '250px'
                }}>
                  <div className="text-2xl font-black text-white mb-1" style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '2px'
                  }}>
                    10,000X
                  </div>
                  <div className="text-xs font-bold text-white" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    BAHİS KADAR KAZANIN
                  </div>
                </div>
              </div>

              {/* Game Area - Side-by-side Layout with Golden Banner */}
              <div className="w-full z-20 flex flex-col lg:flex-row items-center lg:items-start justify-center flex-1 min-h-0" style={{ minHeight: 0, maxWidth: '100%', boxSizing: 'border-box', gap: '1rem' }}>
                {/* Left Side - Golden Banner and Green Boxes - Desktop only */}
                <div className="relative hidden lg:flex flex-col items-center gap-2 flex-shrink-0" style={{ minWidth: '160px', maxWidth: '180px', marginTop: '1rem', alignSelf: 'flex-start' }}>
                  {/* 10000x Banner - Golden Box, Glowing */}
                  <div className="relative rounded-xl p-2 md:p-2.5 text-center glowBox flex-shrink-0" style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                    border: '3px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5)',
                    animation: 'glowPulse 2s ease-in-out infinite'
                  }}>
                    <div className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-1" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      letterSpacing: '2px'
                    }}>
                      10,000X
                    </div>
                    <div className="text-xs font-bold text-white" style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      BAHİS KADAR
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5" style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      KAZANIN
                    </div>
                  </div>

                  {/* Green Divs - Wrapped with Neon Glow */}
                  <div className="w-full p-1.5 rounded-xl flex-shrink-0" style={{
                    background: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1)',
                    animation: 'neonGlow 2s ease-in-out infinite'
                  }}>
                    <div className="flex flex-col gap-1.5 items-center justify-start w-full">
                      <button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const freeSpinsCost = 2000
                          if (balance < freeSpinsCost) {
                            setError(`Insufficient balance. Need ₺${freeSpinsCost.toFixed(2)} for Free Spins`)
                            return
                          }
                          if (spinning) {
                            setError('Please wait for current spin to finish')
                            return
                          }
                          // Deduct cost and trigger free spins
                          setSuccess(`Free Spins purchased! Starting game...`)
                          // Trigger spin with current bet amount
                          setTimeout(() => {
                            setSpinTrigger(prev => prev + 1)
                          }, 500)
                        }}
                        disabled={spinning || balance < 2000}
                        className="w-full bg-green-600 rounded-lg p-1.5 text-white text-center cursor-pointer hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                        }}
                      >
                        <div className="text-xs font-bold mb-0.5">BUY FREE SPINS</div>
                        <div className="text-xs">₺2,000.00</div>
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const superFreeSpinsCost = 10000
                          if (balance < superFreeSpinsCost) {
                            setError(`Insufficient balance. Need ₺${superFreeSpinsCost.toFixed(2)} for Super Free Spins`)
                            return
                          }
                          if (spinning) {
                            setError('Please wait for current spin to finish')
                            return
                          }
                          // Deduct cost and trigger super free spins
                          setSuccess(`Super Free Spins purchased! Starting game...`)
                          // Trigger spin with current bet amount
                          setTimeout(() => {
                            setSpinTrigger(prev => prev + 1)
                          }, 500)
                        }}
                        disabled={spinning || balance < 10000}
                        className="w-full bg-orange-600 rounded-lg p-1.5 text-white text-center cursor-pointer hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95" style={{
                          boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)'
                        }}
                      >
                        <div className="text-xs font-bold mb-0.5">BUY SUPER FREE SPINS</div>
                        <div className="text-xs">₺10,000.00</div>
                      </button>
                      <div className="w-full bg-green-500 rounded-lg p-1.5 text-white text-center font-bold text-sm shadow-lg" style={{
                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                      }}>
                        BET ₺{betAmount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Game Grid and Sidebar Toggle */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative w-full pt-2 md:pt-4" style={{ minWidth: 0, position: 'relative', overflow: 'visible', zIndex: 30, pointerEvents: 'auto', width: '100%' }}>
                  {/* Sidebar Toggle Button - Hidden on mobile for full-width game */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowGamesSidebar(!showGamesSidebar)
                    }}
                    className="hidden md:flex absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-50 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-purple-600 text-white rounded-full items-center justify-center hover:bg-purple-700 transition-all shadow-xl border-2 border-white/30 hover:scale-110 cursor-pointer"
                    style={{ 
                      right: showGamesSidebar ? 'calc(100% + 8px)' : '4px',
                      transition: 'right 0.3s ease-in-out',
                      pointerEvents: 'auto'
                    }}
                    title={showGamesSidebar ? 'Hide Games' : 'Show Games'}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showGamesSidebar ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                    </svg>
                  </button>

                  {/* SlotGameEngine - Handles all game logic, animations, and grid rendering */}
                  <SlotGameEngine
                    theme={sweetBonanzaTheme}
                    balance={balance}
                    betAmount={betAmount}
                    onBetAmountChange={setBetAmount}
                    spinning={spinning}
                    onSpinningChange={setSpinning}
                    onSpin={async (bet) => {
                      try {
                        // Validate bet before API call
                        if (!bet || bet <= 0 || isNaN(bet)) {
                          throw new Error('Invalid bet amount')
                        }
                        
                        if (bet > balance) {
                          throw new Error(`Insufficient balance. You have ₺${balance.toFixed(2)}, but need ₺${bet.toFixed(2)}`)
                        }

                        const response = await sweetBonanzaAPI.playGame(bet)
                        const gameData = response.data?.data || response.data || {}
                        
                        if (!gameData || !Array.isArray(gameData.reels)) {
                          console.error('Invalid game data received:', gameData)
                          throw new Error('Invalid response from server. Please try again.')
                        }
                        
                        // Update balance and user data
                        const newBalance = gameData.userBalance || gameData.newBalance || gameData.balanceAfter || (balance - bet + (gameData.winAmount || 0))
                        setBalance(newBalance)
                        
                        if (user) {
                          const updatedUser = { ...user, balance: newBalance }
                          updateUserData(updatedUser)
                          setUser(updatedUser)
                        }
                        
                        // Update win amount for display
                        const win = gameData.winAmount || gameData.actualWin || 0
                        setWinAmount(win)
                        
                        // Return game data in format expected by SlotGameEngine
                        return {
                          reels: gameData.reels || [],
                          winAmount: win,
                          winningPositions: gameData.winningPositions || [],
                          netChange: gameData.netChange || 0,
                          percentageChange: gameData.percentageChange || 0,
                          userBalance: newBalance
                        }
                      } catch (error: any) {
                        console.error('Spin error:', error)
                        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to spin. Please check your connection and try again.'
                        setError(errorMessage)
                        // Re-throw to let SlotGameEngine handle it
                        throw error
                      }
                    }}
                    onWin={(winAmount) => {
                      const percentageChange = (winAmount / balance) * 100
                      setSuccess(`🎉 You won ₺${winAmount.toFixed(2)}! (+${percentageChange.toFixed(2)}%)`)
                      setIsWinning(true)
                      setError('')
                      
                      // Play win sound - use beep if audio not available
                      playSound(winSoundRef, 0.7, !winSoundRef.current || !!winSoundRef.current?.error, 1000)
                      
                      setGameHistory(prev => [{
                        id: Date.now(),
                        bet: parseFloat(betAmount),
                        win: winAmount,
                        result: [],
                        timestamp: new Date(),
                        percentageChange: percentageChange
                      }, ...prev].slice(0, 10))
                      
                      setTimeout(() => {
                        setIsWinning(false)
                        setSuccess('')
                      }, 5000)
                      
                      // Refresh user data
                      setTimeout(async () => {
                        try {
                          await fetchUserData()
                        } catch (fetchErr) {
                          if (import.meta.env.DEV) {
                            console.warn('Error refreshing user data:', fetchErr)
                          }
                        }
                      }, 500)
                    }}
                    onLoss={() => {
                      setError('')
                      setSuccess('')
                      playSound(lossSoundRef, 0.7, !lossSoundRef.current || !!lossSoundRef.current?.error, 300)
                    }}
                    onError={(errorMessage) => {
                      setError(errorMessage)
                      setSuccess('')
                      setTimeout(() => setError(''), 7000)
                    }}
                    autoSpin={autoSpin}
                    autoSpinCount={autoSpinCount}
                    onAutoSpinChange={(autoSpin, count) => {
                      setAutoSpin(autoSpin)
                      setAutoSpinCount(count)
                    }}
                    spinTrigger={spinTrigger}
                    renderControls={({ betAmount: engineBetAmount, onBetAmountChange, onSpin, onAutoSpin, spinning: engineSpinning, balance: engineBalance, autoSpin: engineAutoSpin, autoSpinCount: engineAutoSpinCount }) => (
                      <>
                        {/* Spin Controls - Responsive positioning */}
                        <div className="absolute right-0 sm:right-2 bottom-0 sm:bottom-2 flex flex-col items-center gap-1.5 sm:gap-2 z-50" style={{ 
                          pointerEvents: 'auto'
                        }}>
                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                            {/* Minus Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const current = parseFloat(engineBetAmount) || 10
                                const newBet = Math.max(10, current - 10)
                                onBetAmountChange(newBet.toString())
                                setShowBetPopup(true)
                                setTimeout(() => setShowBetPopup(false), 1500)
                              }}
                              disabled={engineSpinning || parseFloat(engineBetAmount) <= 10}
                              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                              title="Decrease Bet"
                            >
                              −
                            </button>
                            
                            {/* SPIN BUTTON (BIGGEST) */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const bet = parseFloat(engineBetAmount) || 0
                                if (engineSpinning) {
                                  return // Already spinning
                                }
                                if (bet <= 0) {
                                  setError('Please enter a bet amount')
                                  return
                                }
                                if (bet > engineBalance) {
                                  setError('Insufficient balance')
                                  return
                                }
                                // Clear any previous errors
                                setError('')
                                setSuccess('')
                                // Trigger spin
                                try {
                                  onSpin()
                                } catch (err: any) {
                                  setError(err?.message || 'Failed to start spin')
                                }
                              }}
                              disabled={engineSpinning || parseFloat(engineBetAmount) <= 0 || parseFloat(engineBetAmount) > engineBalance}
                              className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 active:scale-90 hover:ring-4 hover:ring-pink-500 spinButtonPop"
                              title="Spin"
                              style={{
                                animation: !engineSpinning && parseFloat(engineBetAmount) > 0 && parseFloat(engineBetAmount) <= engineBalance ? 'spinButtonPop 2s ease-in-out infinite' : 'none'
                              }}
                            >
                              <div className="absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 text-white text-xs sm:text-sm">✨</div>
                              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            
                            {/* Plus Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const current = parseFloat(engineBetAmount) || 10
                                const maxBet = Math.min(engineBalance, 1000)
                                const newBet = Math.min(maxBet, current + 10)
                                onBetAmountChange(newBet.toString())
                                setShowBetPopup(true)
                                setTimeout(() => setShowBetPopup(false), 1500)
                              }}
                              disabled={engineSpinning || parseFloat(engineBetAmount) >= engineBalance || parseFloat(engineBetAmount) >= 1000}
                              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                              title="Increase Bet"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* AUTOPLAY BUTTON */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onAutoSpin(5)
                            }}
                            disabled={engineSpinning || parseFloat(engineBetAmount) <= 0 || parseFloat(engineBetAmount) > engineBalance || engineAutoSpin}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-150 active:scale-95 hover:ring-2 hover:ring-purple-500 flex items-center gap-1 sm:gap-2"
                            title="Autoplay 5 Spins"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">AUTOPLAY</span>
                            <span className="sm:hidden">AUTO</span>
                            <span className="hidden md:inline">(5)</span>
                          </button>
                        </div>
                        
                        {/* Bottom Controls - Positioned at bottom corners */}
                        {/* Left Bottom - Mute and Info Buttons - Below grid */}
                        <div className="absolute left-1 sm:left-2 -bottom-12 sm:-bottom-16 flex flex-row gap-1 sm:gap-1.5 z-50" style={{ pointerEvents: 'auto' }}>
                          {/* Mute Button - Circular, Smaller */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const newSoundState = !soundEnabled
                              setSoundEnabled(newSoundState)
                              setMusicEnabled(newSoundState)
                              if (bgMusicRef.current) {
                                if (newSoundState) {
                                  bgMusicRef.current.play().catch(() => {})
                                } else {
                                  bgMusicRef.current.pause()
                                }
                              }
                            }}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                            title={soundEnabled && musicEnabled ? 'Mute' : 'Unmute'}
                            style={{ minWidth: '44px', minHeight: '44px' }}
                          >
                            {soundEnabled && musicEnabled ? (
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                            )}
                          </button>

                          {/* Info Icon Button - Circular, Smaller */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShowGameRules(true)
                            }}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                            title="Game Rules"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          </div>
                      </>
                    )}
                  />
                    
                  {/* Win/Error Messages - Immediately after grid with no spacing */}
                    {(error || success || (balance === 0 && !loading)) && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4">
                        {balance === 0 && !loading && !error && (
                          <div className="bg-yellow-600/90 text-white px-4 py-3 rounded-lg shadow-xl text-center animate-fade-in">
                            <p className="text-sm font-bold">⚠️ No balance available. Please deposit funds to play.</p>
                          </div>
                        )}
                        {error && (
                          <div className="bg-red-600/90 text-white px-4 py-3 rounded-lg shadow-xl text-center animate-fade-in">
                            <p className="text-sm font-bold">{error}</p>
                          </div>
                        )}
                        {success && (
                          <div className="bg-green-600/90 text-white px-4 py-3 rounded-lg shadow-xl text-center animate-fade-in">
                            <p className="text-sm font-bold">{success}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

          {/* Right Sidebar - Other Realtime Games - Hidden on mobile */}
            <div 
              className={`hidden md:block bg-white/95 backdrop-blur-md z-40 shadow-2xl overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out ${
                showGamesSidebar ? 'w-[280px] md:w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
              }`}
              style={{ 
                height: '100%', 
                maxHeight: '100%',
                minWidth: showGamesSidebar ? '280px' : '0',
                maxWidth: 'min(320px, 30vw)',
                boxSizing: 'border-box'
              }}
            >
              {showGamesSidebar && (
                <>
                  {/* Sidebar Header */}
                  <div className="bg-purple-600 p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span className="text-white font-semibold">Games</span>
                    </div>
                    <button
                      onClick={() => setShowGamesSidebar(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Game Selector */}
                  {onSwitchGame && (
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <GameSelector
                        currentGameId="sweet-bonanza"
                        onSelectGame={(gameId) => {
                          if (gameId !== 'sweet-bonanza') {
                            onSwitchGame(gameId)
                          }
                          setShowGamesSidebar(false)
                        }}
                        variant="sidebar"
                        showSearch={true}
                        className="h-full"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Bet Amount Popup */}
        {showBetPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl font-bold text-xl animate-bounce">
              BET: ₺{betAmount}
            </div>
          </div>
        )}

       
        {/* Game Rules Modal */}
        {showGameRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4" onClick={() => setShowGameRules(false)}>
            <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-2 border-white/20 shadow-2xl custom-scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 pr-2">
                  SWEET BONANZA - GAME RULES
                </h2>
                <button
                  onClick={() => setShowGameRules(false)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-white text-lg md:text-xl">close</span>
                </button>
              </div>

              <div className="space-y-4 md:space-y-6 text-white">
                {/* Game Overview */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Game Overview</h3>
                  <p className="text-white/80 leading-relaxed text-sm md:text-base">
                    Sweet Bonanza is a 6-reel, 5-row slot game with a cluster pays mechanic. Match symbols horizontally or vertically to win!
                  </p>
                </div>

                {/* How to Play */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">How to Play</h3>
                  <ul className="space-y-2 text-white/80 list-disc list-inside text-sm md:text-base">
                    <li>Set your bet amount using the +/- buttons or quick bet options</li>
                    <li>Click the SPIN button to start the game</li>
                    <li>Match 8 or more identical symbols anywhere on the reels to win</li>
                    <li>Symbols can connect horizontally or vertically</li>
                    <li>More symbols = Higher multiplier!</li>
                  </ul>
                </div>

                {/* Symbol Multipliers */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Symbol Multipliers</h3>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">💎</span>
                      <span className="font-bold text-yellow-400 text-sm md:text-base">100x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">⭐</span>
                      <span className="font-bold text-yellow-400 text-sm md:text-base">50x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍓</span>
                      <span className="font-bold text-pink-400 text-sm md:text-base">20x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍎</span>
                      <span className="font-bold text-red-400 text-sm md:text-base">15x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍌</span>
                      <span className="font-bold text-yellow-300 text-sm md:text-base">12x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍉</span>
                      <span className="font-bold text-green-400 text-sm md:text-base">10x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍊</span>
                      <span className="font-bold text-orange-400 text-sm md:text-base">8x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍋</span>
                      <span className="font-bold text-yellow-300 text-sm md:text-base">6x</span>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 md:p-3 flex items-center justify-between">
                      <span className="text-2xl md:text-3xl">🍇</span>
                      <span className="font-bold text-purple-400 text-sm md:text-base">5x</span>
                    </div>
                  </div>
                </div>

                {/* Special Features */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Special Features</h3>
                  <ul className="space-y-2 text-white/80 text-sm md:text-base">
                    <li><strong className="text-white">Scatter Symbols (⭐ and 💎):</strong> Can appear anywhere and count towards cluster wins</li>
                    <li><strong className="text-white">Free Spins:</strong> Triggered by 3+ scatter symbols</li>
                    <li><strong className="text-white">Random Multiplier:</strong> Up to 100x multiplier in free spins</li>
                    <li><strong className="text-white">Tumble Feature:</strong> Winning symbols disappear and new ones fall down</li>
                  </ul>
                </div>

                {/* Winning Rules */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Winning Rules</h3>
                  <ul className="space-y-2 text-white/80 list-disc list-inside text-sm md:text-base">
                    <li>Minimum 8 matching symbols required for a win</li>
                    <li>Symbols must be adjacent (horizontally or vertically)</li>
                    <li>Wins are calculated based on symbol multiplier × bet amount</li>
                    <li>Multiple clusters can win simultaneously</li>
                    <li>Maximum win: 21,100x your bet!</li>
                  </ul>
                </div>

                {/* Volatility */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-yellow-400">Volatility</h3>
                  <p className="text-white/80 text-sm md:text-base">
                    This game has <strong className="text-yellow-400">HIGH VOLATILITY</strong> (5/5). 
                    This means wins may be less frequent but can be significantly larger when they occur.
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-6 flex justify-end">
                <button
                  onClick={() => setShowGameRules(false)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all text-sm md:text-base min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Animations */}
        <style>{`
          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          @keyframes spinButtonPop {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.05);
            }
          }
          
          @keyframes titleBlink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          @keyframes glowPulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6), inset 0 2px 8px rgba(255,255,255,0.5);
            }
            50% {
              box-shadow: 0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.8), inset 0 2px 8px rgba(255,255,255,0.7);
            }
          }
          
          @keyframes neonGlow {
            0%, 100% {
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1);
              border-color: rgba(255, 215, 0, 0.5);
            }
            50% {
              box-shadow: 0 0 25px rgba(255, 215, 0, 0.7), 0 0 35px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.2);
              border-color: rgba(255, 215, 0, 0.8);
            }
          }
          
          /* Hide scrollbars but keep scrolling functionality */
          main.main-content,
          .hide-scrollbar,
          .hide-scrollbar * {
            scrollbar-width: none !important; /* Firefox */
            -ms-overflow-style: none !important; /* IE and Edge */
          }
          
          main.main-content::-webkit-scrollbar,
          .hide-scrollbar::-webkit-scrollbar,
          .hide-scrollbar *::-webkit-scrollbar {
            display: none !important; /* Chrome, Safari, Opera */
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
          
          /* Additional hiding for webkit browsers */
          main.main-content::-webkit-scrollbar-track,
          .hide-scrollbar::-webkit-scrollbar-track,
          .hide-scrollbar *::-webkit-scrollbar-track {
            display: none !important;
            background: transparent !important;
          }
          
          main.main-content::-webkit-scrollbar-thumb,
          .hide-scrollbar::-webkit-scrollbar-thumb,
          .hide-scrollbar *::-webkit-scrollbar-thumb {
            display: none !important;
            background: transparent !important;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ff6b9d, #9333ea);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ff8fb3, #a855f7);
          }
          
          /* Mobile Optimizations */
          @media (max-width: 640px) {
            /* Ensure touch targets are at least 44x44px */
            button {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Improve readability on small screens */
            body {
              -webkit-text-size-adjust: 100%;
              -moz-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }
            
            /* Prevent horizontal scroll */
            * {
              max-width: 100%;
            }
            
            /* Ensure containers don't overflow */
            .game-container,
            .reels-grid,
            .bet-controls {
              max-width: 100vw;
              box-sizing: border-box;
            }
            
            /* Sidebar responsive */
            .sidebar-container {
              max-width: min(320px, 90vw) !important;
            }
            
            /* Optimize animations for mobile performance */
            .animate-spin,
            .animate-pulse,
            .animate-bounce {
              will-change: transform;
            }
          }
          
          /* Tablet optimizations */
          @media (min-width: 641px) and (max-width: 1024px) {
            /* Adjust spacing for tablets */
            .game-container {
              padding: 1rem;
            }
          }
          
          /* Laptop optimizations - Make game smaller */
          @media (min-width: 1025px) and (max-width: 1440px) {
            /* Scale down game area for laptop screens */
            .game-area-laptop {
              transform: scale(0.85) !important;
              transform-origin: center top;
            }
          }
          
          /* Prevent text selection on game elements */
          .game-area * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Improve touch interactions */
          @media (hover: none) and (pointer: coarse) {
            button:active {
              transform: scale(0.95);
            }
          }
        `}</style>
        
        {/* Close Button */}
        <button
          onClick={closeGame}
          className="fixed top-4 right-4 z-50 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          title="Close Game"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
  )
}

export default SweetBonanzaPage
