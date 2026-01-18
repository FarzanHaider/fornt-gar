/**
 * Game Configuration
 * Centralized configuration for all slot games
 * Add new games here - they'll automatically work with the game selector
 */

export interface GameConfig {
  id: string
  name: string
  displayName: string
  provider: string
  image: string
  thumbnail?: string
  description?: string
  rtp?: string
  category?: string[]
  isNew?: boolean
  isPopular?: boolean
  theme?: {
    backgroundImage?: string
    colorScheme?: string
    gradient?: string
  }
}

export const GAMES_CONFIG: GameConfig[] = [
  {
    id: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    displayName: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    image: 'https://media.pinkcasino.co.uk/images/games/sweet-bonanza-super-scatter/sweet-bonanza-super-scatter-tile-auth.jpg',
    description: 'Classic cluster pays slot with tumbling reels',
    rtp: '96.51%',
    category: ['popular', 'cluster-pays', 'cascading'],
    isPopular: true,
    theme: {
      gradient: 'from-pink-500 to-purple-500'
    }
  },
  {
    id: 'gates-of-olympus',
    name: 'Gates of Olympus',
    displayName: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/gates-of-olympus-1000/gates-of-olympus-1000.jpg',
    description: 'Mythological adventure with multipliers',
    rtp: '96.50%',
    category: ['popular', 'multiplier', 'mythology'],
    isPopular: true,
    theme: {
      gradient: 'from-blue-500 to-purple-600'
    }
  },
  // Placeholder entries for future games - uncomment and customize as games are added
  /*
  {
    id: 'sugar-rush',
    name: 'Sugar Rush',
    displayName: 'Sugar Rush',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/sugar-rush/sugar-rush.jpg',
    description: 'Sweet cascading wins',
    rtp: '96.50%',
    category: ['cluster-pays', 'cascading'],
    theme: {
      gradient: 'from-yellow-400 to-orange-500'
    }
  },
  {
    id: 'big-bass-bonanza',
    name: 'Big Bass Bonanza',
    displayName: 'Big Bass Bonanza',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/big-bass-bonanza/big-bass-bonanza.jpg',
    description: 'Fishing adventure with free spins',
    rtp: '96.71%',
    category: ['fishing', 'free-spins'],
    isPopular: true,
    theme: {
      gradient: 'from-blue-400 to-cyan-500'
    }
  },
  {
    id: 'starlight-princess',
    name: 'Starlight Princess',
    displayName: 'Starlight Princess',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/starlight-princess/starlight-princess.jpg',
    description: 'Anime-themed cascading wins',
    rtp: '96.50%',
    category: ['anime', 'cluster-pays', 'cascading'],
    theme: {
      gradient: 'from-purple-400 to-pink-500'
    }
  },
  {
    id: 'the-dog-house',
    name: 'The Dog House',
    displayName: 'The Dog House',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/the-dog-house/the-dog-house.jpg',
    description: 'Wild wins with sticky wilds',
    rtp: '96.51%',
    category: ['wilds', 'free-spins'],
    theme: {
      gradient: 'from-amber-400 to-orange-600'
    }
  },
  {
    id: 'wild-west-gold',
    name: 'Wild West Gold',
    displayName: 'Wild West Gold',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/wild-west-gold/wild-west-gold.jpg',
    description: 'Western adventure with expanding symbols',
    rtp: '96.51%',
    category: ['western', 'expanding-symbols'],
    theme: {
      gradient: 'from-yellow-600 to-red-700'
    }
  },
  {
    id: 'gates-of-olympus-1000',
    name: 'Gates of Olympus 1000',
    displayName: 'Gates of Olympus 1000',
    provider: 'Pragmatic Play',
    image: 'https://media.pragmaticplay.net/marketing-tools/pragmaticplay/gates-of-olympus-1000/gates-of-olympus-1000.jpg',
    description: 'Enhanced version with 1000x multipliers',
    rtp: '96.50%',
    category: ['multiplier', 'mythology'],
    isNew: true,
    theme: {
      gradient: 'from-indigo-500 to-purple-700'
    }
  },
  {
    id: 'book-of-dead',
    name: 'Book of Dead',
    displayName: 'Book of Dead',
    provider: 'Play\'n GO',
    image: 'https://www.playngo.com/sites/default/files/games/book-of-dead/Book_of_Dead_Thumbnail.jpg',
    description: 'Egyptian adventure with expanding symbols',
    rtp: '96.21%',
    category: ['egypt', 'expanding-symbols'],
    isPopular: true,
    theme: {
      gradient: 'from-amber-600 to-yellow-700'
    }
  },
  {
    id: 'razor-shark',
    name: 'Razor Shark',
    displayName: 'Razor Shark',
    provider: 'Push Gaming',
    image: 'https://www.pushgaming.com/wp-content/uploads/2020/03/Razor-Shark-Game-Thumbnail.png',
    description: 'Underwater cluster pays with mystery symbols',
    rtp: '96.70%',
    category: ['cluster-pays', 'mystery-symbols'],
    theme: {
      gradient: 'from-blue-500 to-teal-600'
    }
  },
  {
    id: 'jammin-jars',
    name: 'Jammin\' Jars',
    displayName: 'Jammin\' Jars',
    provider: 'Push Gaming',
    image: 'https://www.pushgaming.com/wp-content/uploads/2018/05/Jammin-Jars-Game-Thumbnail.png',
    description: 'Fruit cascading cluster pays',
    rtp: '96.83%',
    category: ['cluster-pays', 'cascading'],
    theme: {
      gradient: 'from-green-400 to-emerald-600'
    }
  },
  */
]

/**
 * Get game config by ID
 */
export function getGameConfig(gameId: string): GameConfig | undefined {
  return GAMES_CONFIG.find(game => game.id === gameId)
}

/**
 * Get all available games
 */
export function getAllGames(): GameConfig[] {
  return GAMES_CONFIG
}

/**
 * Get games by category
 */
export function getGamesByCategory(category: string): GameConfig[] {
  return GAMES_CONFIG.filter(game => 
    game.category?.includes(category.toLowerCase())
  )
}

/**
 * Get popular games
 */
export function getPopularGames(): GameConfig[] {
  return GAMES_CONFIG.filter(game => game.isPopular)
}

/**
 * Get new games
 */
export function getNewGames(): GameConfig[] {
  return GAMES_CONFIG.filter(game => game.isNew)
}

