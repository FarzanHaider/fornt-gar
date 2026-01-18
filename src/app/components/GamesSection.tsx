import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface GamesSectionProps {
  onGameClick?: (gameId: string) => void;
  onNavigate?: (page: string) => void;
}

export function GamesSection({ onGameClick, onNavigate }: GamesSectionProps = {}) {
  const { t } = useLanguage();

  // Map game titles to game IDs
  const getGameId = (title: string): string | null => {
    const gameMap: Record<string, string> = {
      'Sweet Bonanza': 'sweet-bonanza',
      'Gates of Olympus': 'gates-of-olympus',
    };
    return gameMap[title] || null;
  };

  const handleGameClick = (gameTitle: string) => {
    const gameId = getGameId(gameTitle);
    if (gameId && onGameClick) {
      onGameClick(gameId);
    } else {
      // If game not available, navigate to slots page
      if (onNavigate) {
        onNavigate('slots');
      }
    }
  };

  const games = [
    {
      title: 'Sweet Bonanza',
      provider: 'Pragmatic Play',
      color: 'from-pink-400 to-purple-400',
      image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400'
    },
    {
      title: 'Gates of Olympus',
      provider: 'Pragmatic Play',
      color: 'from-red-400 to-orange-400',
      image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=400'
    },
    {
      title: 'Book of Dead',
      provider: 'Play\'n GO',
      color: 'from-green-400 to-teal-400',
      image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=400'
    },
    {
      title: 'Starburst',
      provider: 'NetEnt',
      color: 'from-blue-400 to-purple-400',
      image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400'
    },
    {
      title: 'Big Bass Bonanza',
      provider: 'Pragmatic Play',
      color: 'from-yellow-400 to-orange-400',
      image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400'
    },
    {
      title: 'Wolf Gold',
      provider: 'Pragmatic Play',
      color: 'from-indigo-400 to-purple-400',
      image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400'
    },
    {
      title: 'Blackjack Live',
      provider: 'Evolution',
      color: 'from-gray-700 to-gray-900',
      image: 'https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?w=400'
    },
    {
      title: 'Mega Moolah',
      provider: 'Microgaming',
      color: 'from-green-500 to-yellow-500',
      image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=400'
    },
    {
      title: 'Crazy Time',
      provider: 'Evolution',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=400'
    },
    {
      title: 'Gonzo\'s Quest',
      provider: 'NetEnt',
      color: 'from-teal-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=400'
    },
    {
      title: 'Aviator',
      provider: 'Spribe',
      color: 'from-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=400'
    },
    {
      title: 'Roulette Live',
      provider: 'Evolution',
      color: 'from-red-700 to-black',
      image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=400'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('games.popular')}</h2>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">{t('games.viewAll')}</Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {games.map((game, index) => (
            <div 
              key={index}
              onClick={() => handleGameClick(game.title)}
              className="group relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleGameClick(game.title);
                }
              }}
              aria-label={`Play ${game.title}`}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-200">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Use a placeholder gradient instead of hiding
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.image-placeholder')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center';
                      placeholder.style.background = `linear-gradient(135deg, ${game.color.includes('pink') ? '#ec4899' : game.color.includes('red') ? '#ef4444' : game.color.includes('green') ? '#10b981' : game.color.includes('blue') ? '#3b82f6' : game.color.includes('purple') ? '#a855f7' : '#6b7280'} 0%, ${game.color.includes('pink') ? '#a855f7' : game.color.includes('red') ? '#f97316' : game.color.includes('green') ? '#14b8a6' : game.color.includes('blue') ? '#a855f7' : game.color.includes('purple') ? '#ec4899' : '#374151'} 100%)`;
                      parent.appendChild(placeholder);
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'block';
                    target.style.opacity = '1';
                    // Remove placeholder if image loads successfully
                    const placeholder = target.parentElement?.querySelector('.image-placeholder');
                    if (placeholder) {
                      placeholder.remove();
                    }
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.color} mix-blend-overlay opacity-60`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-1">{game.provider}</p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 pointer-events-auto" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGameClick(game.title);
                  }}
                >
                  {t('games.play')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}