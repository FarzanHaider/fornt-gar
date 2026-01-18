import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { GSAPAnimationHelpers } from '../../lib/utils/gsapPresets'

export interface SymbolEntity {
  id: string // Stable unique ID that never changes
  value: string // Symbol emoji/image identifier
}

export interface SlotGameTheme {
  backgroundImage?: string // Optional background image path
  symbolImages: { [key: string]: string } // Symbol emoji -> image path mapping
  themeName?: string // Optional theme name for identification
  symbolWeights: { [key: string]: number } // Symbol weights for generation
  defaultSymbol: string // Default symbol for initialization
  gridColumns: number // Number of columns in grid
  gridRows: number // Number of rows in grid
  gridWidth: number // Grid width in pixels
  gridHeight: number // Grid height in pixels
}

export interface SlotGameEngineProps {
  // Theme configuration
  theme: SlotGameTheme
  
  // Game state
  balance: number
  betAmount: string
  onBetAmountChange: (amount: string) => void
  spinning: boolean
  onSpinningChange: (spinning: boolean) => void
  
  // API integration
  onSpin: (bet: number) => Promise<{
    reels: string[][]
    winAmount: number
    winningPositions: Array<{ reel: number; position: number }>
    netChange?: number
    percentageChange?: number
    userBalance?: number
  }>
  
  // Callbacks
  onWin?: (winAmount: number) => void
  onLoss?: () => void
  onError?: (error: string) => void
  
  // Auto-spin
  autoSpin?: boolean
  autoSpinCount?: number
  onAutoSpinChange?: (autoSpin: boolean, count: number) => void
  
  // External spin trigger (increment to trigger spin)
  spinTrigger?: number
  
  // Custom rendering (optional)
  renderControls?: (props: {
    betAmount: string
    onBetAmountChange: (amount: string) => void
    onSpin: () => void
    onAutoSpin: (count: number) => void
    spinning: boolean
    balance: number
    autoSpin: boolean
    autoSpinCount: number
  }) => React.ReactNode
}

function SlotGameEngine({
  theme,
  balance,
  betAmount,
  onBetAmountChange,
  spinning: externalSpinning,
  onSpinningChange,
  onSpin,
  onWin,
  onLoss,
  onError,
  autoSpin: externalAutoSpin = false,
  autoSpinCount: externalAutoSpinCount = 0,
  onAutoSpinChange,
  spinTrigger = 0,
  renderControls
}: SlotGameEngineProps) {
  // Symbol ID counter - ensures unique stable IDs
  const symbolIdCounter = useRef(0)
  
  // Create a symbol entity with stable unique ID
  const createSymbolEntity = (value: string): SymbolEntity => {
    return {
      id: `symbol-${symbolIdCounter.current++}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: value
    }
  }
  
  // Get default symbol value (not random - for initialization only)
  const getDefaultSymbolValue = () => theme.defaultSymbol
  
  // Placeholder symbol index for deterministic animation (not random)
  const placeholderSymbolIndexRef = useRef(0)
  
  // Get placeholder symbol value for animation (not random - cycles through symbols deterministically)
  const getPlaceholderSymbolValue = () => {
    const symbols = Object.keys(theme.symbolWeights)
    const symbol = symbols[placeholderSymbolIndexRef.current % symbols.length]
    placeholderSymbolIndexRef.current++
    return symbol
  }
  
  // Reset placeholder index for new spins
  const resetPlaceholderIndex = () => {
    placeholderSymbolIndexRef.current = 0
  }
  
  // Helper function to get image path for a symbol
  const getSymbolImage = (symbolValue: string): string => {
    const imagePath = theme.symbolImages[symbolValue] || '/icons/icon.png'
    return imagePath
  }
  
  // Game state
  const [reels, setReels] = useState<SymbolEntity[][]>(() => 
    Array(theme.gridColumns).fill(null).map(() => 
      Array(theme.gridRows).fill(null).map(() => createSymbolEntity(getDefaultSymbolValue()))
    )
  )
  const [winAmount, setWinAmount] = useState(0)
  const [winningSymbols, setWinningSymbols] = useState<any[]>([])
  const [reelSpeeds, setReelSpeeds] = useState(Array(theme.gridColumns).fill(0))
  const [removingCells, setRemovingCells] = useState<Set<string>>(new Set())
  const [fallingCells, setFallingCells] = useState<Map<string, { fromRow: number, toRow: number }>>(new Map())
  const [isCascading, setIsCascading] = useState(false)
  const cascadeLockRef = useRef(false)
  
  // Process cascade animation - one symbol type at a time
  // Symbols MOVE between positions (tracked by stable IDs) instead of replacing
  const processCascadeAnimation = async (
    currentReels: SymbolEntity[][],
    winningBySymbol: Map<string, any[]>,
    betAmount: number
  ) => {
    // Set cascade lock to prevent state updates during animations
    cascadeLockRef.current = true
    setIsCascading(true)
    let workingReels = currentReels.map(col => col.map(symbol => ({ ...symbol })))
    const symbolTypes = Array.from(winningBySymbol.keys())
    
    // Process each symbol type one at a time
    for (let i = 0; i < symbolTypes.length; i++) {
      const symbolValue = symbolTypes[i]
      const positions = winningBySymbol.get(symbolValue) || []
      
      if (positions.length === 0) continue
      
      // Detect final cascade in sequence - slow down gravity and spawn animations
      const isFinalCascade = i === symbolTypes.length - 1
      const finalCascadeSlowdown = isFinalCascade ? (1.10 + Math.random() * 0.05) : 1.0
      
      // Step 1: Mark cells for removal (burst/crush animation)
      const cellKeys = positions.map((pos: any) => `${pos.reel}-${pos.position}`)
      
      // Reset transforms on symbol elements before burst animation
      await new Promise(resolve => requestAnimationFrame(resolve))
      const burstTargets: HTMLElement[] = []
      const burstCellTargets: HTMLElement[] = []
      cellKeys.forEach((cellKey) => {
        const cellElement = document.querySelector(`[data-cell-key="${cellKey}"]`) as HTMLElement | null
        const imgElement = cellElement?.querySelector('img') as HTMLElement | null
        if (cellElement && imgElement) {
          GSAPAnimationHelpers.reset([cellElement, imgElement])
          burstTargets.push(imgElement)
          burstCellTargets.push(cellElement)
        }
      })
      
      setRemovingCells(new Set(cellKeys))
      setWinningSymbols(positions)
      
      // Phase 1: Burst Animation
      await new Promise<void>((resolve) => {
        if (burstTargets.length === 0) {
          resolve()
          return
        }
        
        GSAPAnimationHelpers.applyBurst(
          burstCellTargets,
          burstTargets,
          () => {
            if (cascadeLockRef.current) {
              setRemovingCells((prev) => {
                const updated = new Set(prev)
                cellKeys.forEach(key => updated.delete(key))
                return updated
              })
            }
            resolve()
          }
        )
      })
      
      // Phase 2: Subtle delay after burst
      const burstDelay = 25 + Math.random() * 20
      await new Promise(resolve => setTimeout(resolve, burstDelay))
      
      // Step 2: Remove winning symbols and MOVE existing symbols down
      const newReels = workingReels.map((column, colIndex) => {
        const positionsToRemove = new Set<number>()
        positions.forEach((pos: any) => {
          if (pos.reel === colIndex && column[pos.position]?.value === symbolValue) {
            positionsToRemove.add(pos.position)
          }
        })
        
        const remainingSymbols: SymbolEntity[] = []
        const fallDistances: number[] = []
        
        for (let row = 0; row < theme.gridRows; row++) {
          if (!positionsToRemove.has(row) && column[row]) {
            remainingSymbols.push(column[row])
            const nullsAbove = Array.from(positionsToRemove).filter(pos => pos < row).length
            fallDistances.push(nullsAbove)
          }
        }
        
        const newSymbolsNeeded = positionsToRemove.size
        const newSymbols: SymbolEntity[] = []
        const symbolKeys = Object.keys(theme.symbolWeights)
        for (let j = 0; j < newSymbolsNeeded; j++) {
          const placeholderSymbol = symbolKeys[j % symbolKeys.length]
          newSymbols.push(createSymbolEntity(placeholderSymbol))
        }
        
        const finalColumn = [...newSymbols, ...remainingSymbols].slice(0, theme.gridRows)
        const finalFallDistances = [
          ...new Array(newSymbolsNeeded).fill(0),
          ...fallDistances
        ].slice(0, theme.gridRows)
        
        const symbolIdToNewPosition = new Map<string, number>()
        finalColumn.forEach((symbolEntity, rowIndex) => {
          symbolIdToNewPosition.set(symbolEntity.id, rowIndex)
        })
        
        return { 
          column: finalColumn,
          fallDistances: finalFallDistances,
          newSymbolCount: newSymbolsNeeded,
          symbolIdToNewPosition
        }
      })
      
      const finalReels = newReels.map(colData => colData.column)
      const fallingMap = new Map<string, { fromRow: number, toRow: number, isNew: boolean, symbolId: string }>()
      
      newReels.forEach((colData, colIndex) => {
        colData.column.forEach((symbolEntity, rowIndex) => {
          const fallDistance = colData.fallDistances[rowIndex] || 0
          const isNewSymbol = rowIndex < colData.newSymbolCount
          
          const originalColumn = workingReels[colIndex]
          const originalRowIndex = originalColumn.findIndex(s => s?.id === symbolEntity.id)
          
          if (fallDistance > 0 || isNewSymbol) {
            const fromRow = isNewSymbol 
              ? -1 - (colData.newSymbolCount - rowIndex)
              : (originalRowIndex >= 0 ? originalRowIndex : rowIndex + fallDistance)
            
            const cellKey = `${colIndex}-${rowIndex}`
            fallingMap.set(cellKey, { 
              fromRow: fromRow,
              toRow: rowIndex,
              isNew: isNewSymbol,
              symbolId: symbolEntity.id
            })
          }
        })
      })
      
      workingReels = finalReels
      
      await new Promise(resolve => setTimeout(resolve, 10))
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      
      const fallTargets: Array<{ element: HTMLElement, cellElement: HTMLElement | null, fromRow: number, toRow: number, isNew: boolean }> = []
      fallingMap.forEach((fallData, cellKey) => {
        const imgElement = document.querySelector(`img[data-symbol-id="${fallData.symbolId}"]`) as HTMLElement | null
        const cellElement = imgElement?.closest('[data-cell-key]') as HTMLElement | null
        if (imgElement) {
          GSAPAnimationHelpers.reset(imgElement)
          
          if (cellElement) {
            GSAPAnimationHelpers.reset(cellElement)
          }
          
          fallTargets.push({
            element: imgElement,
            cellElement: cellElement,
            fromRow: fallData.fromRow,
            toRow: fallData.toRow,
            isNew: fallData.isNew
          })
        }
      })
      
      // Separate gravity (falling existing symbols) from spawn (new symbols)
      const gravityTargets = fallTargets.filter(({ isNew }) => !isNew)
      const spawnTargets = fallTargets.filter(({ isNew }) => isNew)
      
      // Verify no symbol appears in both lists
      const gravitySymbolIds = new Set(gravityTargets.map(t => {
        const img = t.element as HTMLElement
        return img.getAttribute('data-symbol-id')
      }).filter(Boolean))
      const spawnSymbolIds = new Set(spawnTargets.map(t => {
        const img = t.element as HTMLElement
        return img.getAttribute('data-symbol-id')
      }).filter(Boolean))
      
      const conflictingSymbols = new Set([...gravitySymbolIds].filter(id => spawnSymbolIds.has(id)))
      if (conflictingSymbols.size > 0 && import.meta.env.DEV) {
        console.warn('Cascade audit: Found symbols in both gravity and spawn targets:', conflictingSymbols)
      }
      
      // Phase 3: Gravity Animation
      if (gravityTargets.length > 0) {
        gravityTargets.forEach(({ element, cellElement }) => {
          if (element) gsap.killTweensOf(element)
          if (cellElement) gsap.killTweensOf(cellElement)
        })
        
        if (cascadeLockRef.current) {
          const gravityMap = new Map<string, { fromRow: number, toRow: number }>()
          gravityTargets.forEach(({ fromRow, toRow }) => {
            const cellKey = `${fromRow}-${toRow}`
            gravityMap.set(cellKey, { fromRow, toRow })
          })
          setFallingCells(gravityMap as any)
        }
        
        await new Promise<void>((resolve) => {
          const gravityAnimations = gravityTargets.map(({ element, cellElement, fromRow, toRow }) => {
            const fallDistance = (fromRow - toRow) * 100
            return GSAPAnimationHelpers.applyGravity(
              element,
              fallDistance,
              cellElement || null,
              finalCascadeSlowdown
            )
          }).flat()
          
          const gravityTimeline = gsap.timeline({
            onComplete: () => {
              gravityTargets.forEach(({ element, cellElement }) => {
                if (element) gsap.killTweensOf(element)
                if (cellElement) gsap.killTweensOf(cellElement)
              })
              if (cascadeLockRef.current) {
                setFallingCells(new Map())
              }
              resolve()
            }
          })
          
          gravityAnimations.forEach(anim => gravityTimeline.add(anim, 0))
        })
        
        const gravityDelay = 25 + Math.random() * 20
        await new Promise(resolve => setTimeout(resolve, gravityDelay))
      }
      
      // Phase 4: Spawn Animation
      if (spawnTargets.length > 0) {
        spawnTargets.forEach(({ element, cellElement }) => {
          if (element) gsap.killTweensOf(element)
          if (cellElement) gsap.killTweensOf(cellElement)
        })
        
        if (cascadeLockRef.current) {
          const spawnMap = new Map<string, { fromRow: number, toRow: number }>()
          spawnTargets.forEach(({ fromRow, toRow }) => {
            const cellKey = `${fromRow}-${toRow}`
            spawnMap.set(cellKey, { fromRow, toRow })
          })
          setFallingCells(spawnMap as any)
        }
        
        await new Promise<void>((resolve) => {
          const spawnAnimations = spawnTargets.map(({ element, cellElement, fromRow, toRow }) => {
            const fallDistance = (fromRow - toRow) * 100
            return GSAPAnimationHelpers.applySpawn(
              element,
              fallDistance,
              cellElement || null,
              finalCascadeSlowdown
            )
          }).flat()
          
          const spawnTimeline = gsap.timeline({
            onComplete: () => {
              spawnTargets.forEach(({ element, cellElement }) => {
                if (element) gsap.killTweensOf(element)
                if (cellElement) gsap.killTweensOf(cellElement)
              })
              if (cascadeLockRef.current) {
                setFallingCells(new Map())
                setWinningSymbols([])
              }
              resolve()
            }
          })
          
          spawnAnimations.forEach(anim => spawnTimeline.add(anim, 0))
        })
      } else {
        if (cascadeLockRef.current) {
          setFallingCells(new Map())
          setWinningSymbols([])
        }
      }
      
      // Phase 5: Subtle delay after spawn
      const spawnDelay = 25 + Math.random() * 20
      await new Promise(resolve => setTimeout(resolve, spawnDelay))
      
      // Phase 6: Settle Animation
      if (cascadeLockRef.current) {
        const settleDistance = 2 + Math.random() * 2
        const settleDuration = 30 + Math.random() * 20
        const halfDuration = settleDuration / 1000 / 2
        
        const allSymbolElements: Array<{ element: HTMLElement, cellElement: HTMLElement | null }> = []
        finalReels.forEach((column) => {
          column.forEach((symbolEntity) => {
            const imgElement = document.querySelector(`img[data-symbol-id="${symbolEntity.id}"]`)
            const cellElement = imgElement?.closest('[data-cell-key]') as HTMLElement | null
            if (imgElement) {
              allSymbolElements.push({
                element: imgElement as HTMLElement,
                cellElement: cellElement
              })
            }
          })
        })
        
        if (allSymbolElements.length > 0) {
          await new Promise<void>((resolve) => {
            const settleTimeline = gsap.timeline({
              onComplete: () => {
                allSymbolElements.forEach(({ element, cellElement }) => {
                  gsap.set([element, cellElement].filter(Boolean) as HTMLElement[], { 
                    clearProps: 'transform' 
                  })
                })
                resolve()
              }
            })
            
            allSymbolElements.forEach(({ element, cellElement }) => {
              if (cellElement) {
                settleTimeline.to(cellElement, {
                  y: `${settleDistance}px`,
                  duration: halfDuration,
                  ease: 'power2.out'
                }, 0)
              }
              settleTimeline.to(element, {
                y: `${settleDistance}px`,
                duration: halfDuration,
                ease: 'power2.out'
              }, 0)
            })
            
            allSymbolElements.forEach(({ element, cellElement }) => {
              if (cellElement) {
                settleTimeline.to(cellElement, {
                  y: '0px',
                  duration: halfDuration,
                  ease: 'power2.in'
                }, halfDuration)
              }
              settleTimeline.to(element, {
                y: '0px',
                duration: halfDuration,
                ease: 'power2.in'
              }, halfDuration)
            })
          })
        }
      }
      
      // Small delay between symbol types
      if (i < symbolTypes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
    
    // Release cascade lock and update final state after all animations complete
    cascadeLockRef.current = false
    setIsCascading(false)
    setReels(workingReels)
  }
  
  // Spin reels function
  const spinReels = async () => {
    if (externalSpinning) return
    
    const bet = parseFloat(betAmount) || 0
    
    if (!betAmount || betAmount === '' || betAmount === null) {
      onError?.('Please enter a bet amount')
      return
    }
    
    if (isNaN(bet) || !isFinite(bet)) {
      onError?.('Invalid bet amount format')
      return
    }
    
    if (bet <= 0) {
      onError?.('Bet amount must be greater than 0')
      return
    }
    
    if (bet < 1) {
      onError?.('Minimum bet amount is ₺1')
      return
    }
    
    const currentBalance = parseFloat(balance.toString()) || 0
    if (bet > currentBalance) {
      onError?.('Insufficient balance')
      return
    }
    
    onSpinningChange(true)
    setWinAmount(0)
    
    // Kill any existing GSAP animations
    requestAnimationFrame(() => {
      for (let col = 0; col < theme.gridColumns; col++) {
        for (let row = 0; row < theme.gridRows; row++) {
          const cellKey = `${col}-${row}`
          const cellElement = document.querySelector(`[data-cell-key="${cellKey}"]`) as HTMLElement | null
          const imgElement = cellElement?.querySelector('img') as HTMLElement | null
          if (cellElement && imgElement) {
            gsap.killTweensOf([cellElement, imgElement])
            GSAPAnimationHelpers.reset([cellElement, imgElement])
          }
        }
      }
    })
    
    setWinningSymbols([])
    
    const baseSpinDuration = 2000
    const reelStopDelays = [0, 200, 400, 600, 800, 1000]
    const spinInterval = 50
    
    requestAnimationFrame(() => {
      for (let col = 0; col < theme.gridColumns; col++) {
        for (let row = 0; row < theme.gridRows; row++) {
          const cellKey = `${col}-${row}`
          const cellElement = document.querySelector(`[data-cell-key="${cellKey}"]`)
          const imgElement = cellElement?.querySelector('img')
          if (imgElement) {
            GSAPAnimationHelpers.reset(imgElement)
          }
        }
      }
    })
    
    setReelSpeeds(Array(theme.gridColumns).fill(100))
    resetPlaceholderIndex()
    
    const reelAnimations = reelStopDelays.map((delay, reelIndex) => {
      return new Promise((resolve) => {
        let currentSpin = 0
        const spins = Math.floor((baseSpinDuration + delay) / spinInterval)
        
        const interval = setInterval(() => {
          if (!cascadeLockRef.current) {
            setReels(prevReels => {
              const newReels = prevReels.map(col => [...col])
              newReels[reelIndex] = Array(theme.gridRows).fill(null).map(() => createSymbolEntity(getPlaceholderSymbolValue()))
              return newReels
            })
          }
          
          setReelSpeeds(prevSpeeds => {
            const newSpeeds = [...prevSpeeds]
            const progress = currentSpin / spins
            newSpeeds[reelIndex] = 100 * (1 - progress * 0.8)
            return newSpeeds
          })
          
          currentSpin++
          
          if (currentSpin >= spins) {
            clearInterval(interval)
            setReelSpeeds(prevSpeeds => {
              const newSpeeds = [...prevSpeeds]
              newSpeeds[reelIndex] = 0
              return newSpeeds
            })
            resolve(undefined)
          }
        }, spinInterval)
      })
    })
    
    try {
      // Call backend API
      let gameData
      try {
        gameData = await onSpin(bet)
      } catch (apiError: any) {
        // API call failed - stop animations and show error
        await Promise.all(reelAnimations)
        onSpinningChange(false)
        onError?.(apiError?.response?.data?.message || apiError?.message || 'Failed to connect to game server. Please check your connection and try again.')
        return
      }
      
      await Promise.all(reelAnimations)
      
      const finalReels = gameData.reels || []
      let formattedReels: SymbolEntity[][]
      
      if (finalReels.length === theme.gridColumns && finalReels.every(reel => Array.isArray(reel) && reel.length === theme.gridRows)) {
        formattedReels = finalReels.map((col: string[]) => 
          col.map((symbolValue: string) => createSymbolEntity(symbolValue))
        ) as SymbolEntity[][]
      } else {
        console.error('SlotGameEngine - Invalid reel format:', finalReels)
        onError?.('Invalid response from server. Please try again.')
        formattedReels = Array(theme.gridColumns).fill(null).map(() => 
          Array(theme.gridRows).fill(null).map(() => createSymbolEntity(getDefaultSymbolValue()))
        )
      }
      
      setReels(formattedReels)
      setReelSpeeds(Array(theme.gridColumns).fill(0))
      
      const win = gameData.winAmount || 0
      setWinAmount(win)
      
      const backendWinningPositions = gameData.winningPositions || []
      const validWinningPositions = backendWinningPositions
        .filter((pos: any) => {
          const col = pos.reel !== undefined ? pos.reel : (pos.column !== undefined ? pos.column : pos.col)
          const row = pos.position !== undefined ? pos.position : (pos.row !== undefined ? pos.row : pos.symbolIndex)
          const validReel = (col !== undefined && col >= 0 && col < theme.gridColumns)
          const validPosition = (row !== undefined && row >= 0 && row < theme.gridRows)
          return validReel && validPosition
        })
        .map((pos: any) => {
          const col = pos.reel !== undefined ? pos.reel : (pos.column !== undefined ? pos.column : pos.col)
          const row = pos.position !== undefined ? pos.position : (pos.row !== undefined ? pos.row : pos.symbolIndex)
          return { reel: col, position: row }
        })
      
      const uniquePositions = validWinningPositions.filter((pos: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p.reel === pos.reel && p.position === pos.position)
      )
      
      // Group winning positions by symbol VALUE for cascade animation
      const winningBySymbol: Map<string, any[]> = new Map()
      uniquePositions.forEach((pos: any) => {
        const symbolEntity = formattedReels[pos.reel]?.[pos.position]
        const symbolValue = symbolEntity?.value
        if (symbolValue) {
          if (!winningBySymbol.has(symbolValue)) {
            winningBySymbol.set(symbolValue, [])
          }
          winningBySymbol.get(symbolValue)!.push(pos)
        }
      })
      
      // Start cascade animation if there are wins
      if (win > 0 && winningBySymbol.size > 0) {
        await processCascadeAnimation(formattedReels, winningBySymbol, bet)
      } else {
        if (!cascadeLockRef.current) {
          setWinningSymbols(uniquePositions)
          requestAnimationFrame(() => {
            uniquePositions.forEach((pos: any) => {
              const cellKey = `${pos.reel}-${pos.position}`
              const cellElement = document.querySelector(`[data-cell-key="${cellKey}"]`) as HTMLElement | null
              const imgElement = cellElement?.querySelector('img') as HTMLElement | null
              if (cellElement && imgElement) {
                GSAPAnimationHelpers.reset([cellElement, imgElement])
                gsap.to(cellElement, {
                  scale: 1.05,
                  duration: 0.6,
                  ease: 'power2.inOut',
                  yoyo: true,
                  repeat: -1
                })
                gsap.to(imgElement, {
                  scale: 1.25,
                  duration: 0.6,
                  ease: 'power2.inOut',
                  yoyo: true,
                  repeat: -1
                })
              }
            })
          })
        }
      }
      
      if (win > 0) {
        onWin?.(win)
      } else {
        onLoss?.()
      }
    } catch (err: any) {
      setReelSpeeds(Array(theme.gridColumns).fill(0))
      const errorMessage = err.response?.data?.message || err.message || 'Failed to play game'
      onError?.(errorMessage)
    } finally {
      onSpinningChange(false)
    }
  }
  
  // Auto-spin effect
  useEffect(() => {
    if (externalAutoSpin && externalAutoSpinCount > 0 && !externalSpinning) {
      const timer = setTimeout(() => {
        const currentBalance = parseFloat(balance.toString()) || 0
        const bet = parseFloat(betAmount) || 0
        
        if (currentBalance < bet) {
          onAutoSpinChange?.(false, 0)
          onError?.('Insufficient balance for auto-spin')
          return
        }
        
        spinReels()
        onAutoSpinChange?.(externalAutoSpin, Math.max(0, externalAutoSpinCount - 1))
      }, 3500)
      return () => clearTimeout(timer)
    } else if (externalAutoSpinCount === 0 && externalAutoSpin) {
      onAutoSpinChange?.(false, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalAutoSpin, externalAutoSpinCount, externalSpinning, balance, betAmount])
  
  // External spin trigger effect (for Buy Free Spins, etc.)
  const prevSpinTriggerRef = useRef(spinTrigger)
  useEffect(() => {
    if (spinTrigger > 0 && spinTrigger !== prevSpinTriggerRef.current && !externalSpinning) {
      prevSpinTriggerRef.current = spinTrigger
      spinReels()
    }
  }, [spinTrigger, externalSpinning])
  
  const isWinningPosition = (reelIndex: number, symbolIndex: number) => {
    if (!winningSymbols || winningSymbols.length === 0) {
      return false
    }
    const isWinning = winningSymbols.some((pos: any) => {
      const col = pos.reel !== undefined ? pos.reel : (pos.column !== undefined ? pos.column : (pos.col !== undefined ? pos.col : -1))
      const row = pos.position !== undefined ? pos.position : (pos.row !== undefined ? pos.row : (pos.symbolIndex !== undefined ? pos.symbolIndex : -1))
      return col === reelIndex && row === symbolIndex
    })
    return isWinning
  }
  
  const handleAutoSpin = (count = 5) => {
    if (externalSpinning) return
    onAutoSpinChange?.(true, count)
    spinReels()
  }
  
  // Responsive scale based on viewport width and height
  // Fixed logical grid size - animations use logical coordinates
  const logicalWidth = theme.gridWidth
  const logicalHeight = theme.gridHeight
  const [scale, setScale] = useState(1)
  
  useEffect(() => {
    const updateScale = () => {
      if (typeof window === 'undefined') return
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Calculate available space based on screen size
      let availableWidth = width
      let availableHeight = height
      
      // Account for different screen sizes
      if (width < 640) {
        // Mobile: full width minus minimal padding (sidebar is hidden)
        availableWidth = width - 20 // Minimal padding for full-width game
        availableHeight = height - 280 // Space for controls above/below
      } else if (width < 768) {
        // Small tablet: sidebar hidden, more width for game
        availableWidth = width - 32
        availableHeight = height - 250
      } else if (width < 1024) {
        // Tablet: sidebar may be visible
        availableWidth = width - 100
        availableHeight = height - 200
      } else {
        // Desktop: account for sidebar, banner, and padding
        availableWidth = width - 400 // Sidebar + banner + padding
        availableHeight = height - 150
      }
      
      // Calculate scale based on both width and height
      const scaleByWidth = (availableWidth - 40) / logicalWidth // 20px margin each side
      const scaleByHeight = (availableHeight - 40) / logicalHeight // 20px margin top/bottom
      
      // Use the smaller scale to ensure grid fits both dimensions
      let calculatedScale = Math.min(scaleByWidth, scaleByHeight, 1.0)
      
      // Set min/max scale constraints
      // Minimum scale 0.3 for very small screens, max 1.0
      calculatedScale = Math.max(0.3, Math.min(1.0, calculatedScale))
      
      setScale(calculatedScale)
    }
    
    updateScale()
    const handleResize = () => updateScale()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [logicalWidth, logicalHeight])
  
  // Scaled display size
  const displayWidth = logicalWidth * scale
  const displayHeight = logicalHeight * scale
  
  return (
    <div className="relative mx-auto flex items-center justify-center w-full" style={{ 
      width: '100%',
      maxWidth: '100%',
      minHeight: `${displayHeight}px`,
      height: 'auto',
      padding: '10px'
    }}>
      <div 
        className="relative"
        style={{
          width: `${logicalWidth}px`,
          height: `${logicalHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          margin: '0 auto'
        }}
      >
      {/* Reels Grid */}
      <div className="relative rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl flex-shrink-0 border-4 sm:border-6 md:border-8 border-white" style={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #F8B500 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,182,193,0.5)',
        position: 'relative',
        overflow: 'visible',
        width: `${theme.gridWidth}px`,
        height: `${theme.gridHeight}px`,
        margin: '0 auto',
        boxSizing: 'border-box',
        flexShrink: 0,
        backgroundImage: `
          repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px),
          linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #F8B500 100%)
        `
      }}>
        <div className="grid grid-cols-6 grid-rows-5 gap-1 sm:gap-1.5 md:gap-2 relative z-10" style={{ 
          overflow: 'visible',
          padding: 0,
          margin: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          flexShrink: 0
        }}>
          {reels.map((reel, reelIndex) =>
            reel.map((symbolEntity, symbolIndex) => {
              const symbolValue = symbolEntity?.value || ''
              const symbolId = symbolEntity?.id || `${reelIndex}-${symbolIndex}`
              const cellKey = `${reelIndex}-${symbolIndex}`
              const isWinning = isWinningPosition(reelIndex, symbolIndex)
              const isRemoving = removingCells.has(cellKey)
              const isFalling = fallingCells.has(cellKey)
              const reelSpeed = reelSpeeds[reelIndex] || 0
              
              return (
                <div
                  key={symbolId}
                  data-cell-key={cellKey}
                  data-symbol-id={symbolId}
                  className={`flex items-center justify-center relative ${symbolValue === '⭐' ? 'overflow-visible' : 'overflow-hidden'} ${
                    externalSpinning && reelSpeed > 0
                      ? 'bg-gradient-to-br from-purple-300/60 to-pink-300/60'
                    : isRemoving
                      ? 'bg-gradient-to-br from-red-400/60 via-orange-500/60 to-yellow-500/60 animate-pulse'
                    : isWinning && !isCascading
                      ? 'bg-gradient-to-br from-yellow-400/40 via-yellow-500/50 to-orange-500/40'
                      : 'bg-white/95 backdrop-blur-sm'
                  }`}
                  style={{
                    borderRadius: '12px',
                    border: isWinning && !isRemoving
                      ? '2px solid #FFD700'
                      : externalSpinning && reelSpeed > 0
                      ? '2px solid rgba(147, 51, 234, 0.5)'
                      : '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: isWinning && !isRemoving
                      ? '0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.5)' 
                      : externalSpinning && reelSpeed > 0
                      ? '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255,255,255,0.3)'
                      : '0 2px 6px rgba(0,0,0,0.15), inset 0 0 8px rgba(255,255,255,0.4)',
                    filter: externalSpinning && reelSpeed > 0 ? 'blur(1.5px) brightness(1.2)' : 'none',
                    padding: 0,
                    margin: 0,
                    width: '100%',
                    height: '100%',
                    minWidth: 0,
                    minHeight: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: isFalling ? 20 : undefined
                  }}
                >
                  <img
                    src={getSymbolImage(symbolValue)}
                    alt=""
                    data-symbol-id={symbolId}
                    className={`${symbolValue === '⭐' ? 'absolute' : 'relative'} z-10 object-contain`}
                    style={{
                      filter: isWinning ? 'drop-shadow(0 0 8px rgba(255,215,0,0.8)) brightness(1.2)' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                      width: '85%',
                      height: '85%',
                      objectFit: 'contain',
                      imageRendering: 'auto' as const,
                      transform: symbolValue === '⭐' ? 'translate(-50%, -50%) scale(1.5)' : undefined,
                      left: symbolValue === '⭐' ? '50%' : undefined,
                      top: symbolValue === '⭐' ? '50%' : undefined,
                      position: symbolValue === '⭐' ? 'absolute' : 'relative',
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      margin: 0,
                      padding: 0,
                      verticalAlign: 'middle'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallbackPath = '/icons/icon.png';
                      const currentSrc = target.src || '';
                      
                      // Only try fallback if we haven't already tried it
                      if (!currentSrc.includes('icon.png') && !currentSrc.endsWith(fallbackPath)) {
                        // Try fallback image - ensure it's visible
                        target.src = fallbackPath;
                        target.style.display = 'block';
                        target.style.visibility = 'visible';
                        target.style.opacity = '1';
                        target.style.filter = 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))';
                      } else {
                        // If fallback also failed, show symbol emoji as text fallback
                        // Keep image visible but show emoji if image completely fails
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.symbol-fallback')) {
                          const symbolFallback = document.createElement('div');
                          symbolFallback.className = 'symbol-fallback absolute inset-0 flex items-center justify-center text-4xl md:text-5xl';
                          symbolFallback.textContent = symbolValue;
                          symbolFallback.style.zIndex = '10';
                          parent.appendChild(symbolFallback);
                        }
                      }
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Ensure image is fully visible when loaded
                      target.style.display = 'block';
                      target.style.visibility = 'visible';
                      target.style.opacity = '1';
                      // Remove any fallback text if image loads successfully
                      const parent = target.parentElement;
                      const fallback = parent?.querySelector('.symbol-fallback');
                      if (fallback) {
                        fallback.remove();
                      }
                    }}
                  />
                </div>
              )
            })
          )}
        </div>
        
        {/* Spin Controls - Positioned at bottom-right corner */}
        {renderControls ? (
          renderControls({
            betAmount,
            onBetAmountChange,
            onSpin: spinReels,
            onAutoSpin: handleAutoSpin,
            spinning: externalSpinning,
            balance,
            autoSpin: externalAutoSpin,
            autoSpinCount: externalAutoSpinCount
          })
        ) : (
          <div className="absolute right-0 bottom-0 flex flex-col items-center gap-2 z-50" style={{ 
            pointerEvents: 'auto',
            transform: 'translate(12px, 12px)'
          }}>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const current = parseFloat(betAmount) || 10
                  const newBet = Math.max(10, current - 10)
                  onBetAmountChange(newBet.toString())
                }}
                disabled={externalSpinning || parseFloat(betAmount) <= 10}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                title="Decrease Bet"
              >
                −
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!externalSpinning && parseFloat(betAmount) > 0 && parseFloat(betAmount) <= balance) {
                    spinReels()
                  }
                }}
                disabled={externalSpinning || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 active:scale-90 hover:ring-4 hover:ring-pink-500"
                title="Spin"
              >
                <svg
                  className="w-7 h-7 md:w-9 md:h-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const current = parseFloat(betAmount) || 10
                  const maxBet = Math.min(balance, 1000)
                  const newBet = Math.min(maxBet, current + 10)
                  onBetAmountChange(newBet.toString())
                }}
                disabled={externalSpinning || parseFloat(betAmount) >= balance || parseFloat(betAmount) >= 1000}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-2xl transition-all duration-150 active:scale-90 hover:ring-2 hover:ring-purple-500"
                title="Increase Bet"
              >
                +
              </button>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAutoSpin(5)
              }}
              disabled={externalSpinning || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance || externalAutoSpin}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-150 active:scale-95 hover:ring-2 hover:ring-purple-500 flex items-center gap-2"
              title="Autoplay 5 Spins"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AUTOPLAY (5)
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default SlotGameEngine
