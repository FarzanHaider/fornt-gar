import { useState, useEffect, useRef } from 'react'
import { GAMES_CONFIG, GameConfig, getGameConfig } from '../../lib/config/games.config'

interface GameSelectorProps {
  currentGameId?: string
  onSelectGame: (gameId: string) => void
  onClose?: () => void
  className?: string
  variant?: 'sidebar' | 'modal' | 'dropdown'
  showSearch?: boolean
}

/**
 * GameSelector Component
 * Mobile-optimized game selection UI
 * Supports sidebar, modal, and dropdown variants
 */
export function GameSelector({
  currentGameId,
  onSelectGame,
  onClose,
  className = '',
  variant = 'modal',
  showSearch = true
}: GameSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Get unique categories from games
  const categories = ['all', ...new Set(
    GAMES_CONFIG.flatMap(game => game.category || [])
  )]

  // Filter games
  const filteredGames = GAMES_CONFIG.filter(game => {
    const matchesSearch = !searchQuery || 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' ||
      game.category?.includes(selectedCategory) ||
      (selectedCategory === 'popular' && game.isPopular) ||
      (selectedCategory === 'new' && game.isNew)

    return matchesSearch && matchesCategory
  })

  // Handle game selection
  const handleSelectGame = (gameId: string) => {
    if (gameId !== currentGameId) {
      onSelectGame(gameId)
    }
    if (variant === 'modal') {
      setIsOpen(false)
      onClose?.()
    }
  }

  // Close modal on outside click
  useEffect(() => {
    if (variant === 'modal' && isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          onClose?.()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, variant, onClose])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen, showSearch])

  // Modal variant
  if (variant === 'modal') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95 ${className}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="hidden sm:inline">Games</span>
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div
              ref={modalRef}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-500/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Select Game</h2>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onClose?.()
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search and Filters */}
              {showSearch && (
                <div className="p-4 sm:p-6 space-y-4 border-b border-purple-500/30">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Games Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {filteredGames.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No games found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        isSelected={game.id === currentGameId}
                        onClick={() => handleSelectGame(game.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`h-full flex flex-col ${className}`}>
        {showSearch && (
          <div className="p-4 space-y-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-3">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isSelected={game.id === currentGameId}
                onClick={() => handleSelectGame(game.id)}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
      >
        <span className="text-sm font-medium">
          {currentGameId ? getGameConfig(currentGameId)?.displayName : 'Select Game'}
        </span>
        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {filteredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => handleSelectGame(game.id)}
              className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${
                game.id === currentGameId ? 'bg-purple-100' : ''
              }`}
            >
              {game.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Game Card Component
 */
function GameCard({
  game,
  isSelected,
  onClick,
  compact = false
}: {
  game: GameConfig
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
          isSelected
            ? 'border-purple-500 bg-purple-50 shadow-md'
            : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={game.image}
            alt={game.displayName}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Show a placeholder instead of hiding
              target.style.display = 'block';
              target.style.backgroundColor = '#e5e7eb';
              target.style.opacity = '0.5';
            }}
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'block';
              target.style.opacity = '1';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{game.displayName}</h3>
            <p className="text-xs text-gray-500 truncate">{game.provider}</p>
          </div>
          {isSelected && (
            <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
        isSelected ? 'ring-4 ring-purple-500 shadow-2xl' : 'shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="aspect-[3/4] relative bg-gray-200">
        <img
          src={game.image}
          alt={game.displayName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.image-placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500';
              const text = document.createElement('div');
              text.className = 'text-white font-bold text-sm text-center px-2';
              text.textContent = game.displayName;
              placeholder.appendChild(text);
              parent.appendChild(placeholder);
            }
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'block';
            const placeholder = target.parentElement?.querySelector('.image-placeholder');
            if (placeholder) {
              placeholder.remove();
            }
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          game.theme?.gradient || 'from-black/80 to-black/40'
        } opacity-70 group-hover:opacity-90 transition-opacity`} />
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {game.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {game.isPopular && !game.isNew && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            HOT
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent">
          <h3 className="font-bold text-white text-sm sm:text-base truncate">{game.displayName}</h3>
          <p className="text-xs text-gray-300 truncate">{game.provider}</p>
          {game.rtp && (
            <p className="text-xs text-gray-400 mt-1">RTP: {game.rtp}</p>
          )}
        </div>
      </div>
    </button>
  )
}

export { GAMES_CONFIG }

