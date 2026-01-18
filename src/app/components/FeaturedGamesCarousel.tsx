import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FeaturedGamesCarouselProps {
  onGameClick?: (gameId: string) => void;
  onNavigate?: (page: string) => void;
}

export function FeaturedGamesCarousel({ onGameClick, onNavigate }: FeaturedGamesCarouselProps = {}) {
  const { t } = useLanguage();

  // Map game titles to game IDs
  const getGameId = (title: string): string | null => {
    const gameMap: Record<string, string> = {
      'Sweet Bonanza 1000': 'sweet-bonanza',
      'Sweet Bonanza': 'sweet-bonanza',
      'Sugar Rush': 'sweet-bonanza', // Map to available game
      'Starlight Princess': 'sweet-bonanza', // Map to available game
      'Gates of Gatot Kaca': 'gates-of-olympus',
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

  const featuredGames = [
    {
      title: 'Sweet Bonanza 1000',
      provider: 'Pragmatic Play',
      jackpot: '₺85,432',
      tag: 'JACKPOT',
      tagColor: 'bg-yellow-500',
      image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=800',
      gradient: 'from-pink-600 to-purple-600'
    },
    {
      title: 'Sugar Rush',
      provider: 'Pragmatic Play',
      jackpot: '₺45,231',
      tag: 'YENİ',
      tagColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=800',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Starlight Princess',
      provider: 'Pragmatic Play',
      jackpot: '₺92,150',
      tag: 'POPÜLER',
      tagColor: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=800',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Gates of Gatot Kaca',
      provider: 'Pragmatic Play',
      jackpot: '₺67,890',
      tag: 'HOT',
      tagColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=800',
      gradient: 'from-red-600 to-orange-600'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('games.featured')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredGames.map((game, index) => (
            <div 
              key={index}
              onClick={() => handleGameClick(game.title)}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
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
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} mix-blend-multiply opacity-60`}></div>
                
                {/* Tag */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                  <span className={`${game.tagColor} text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full`}>
                    {game.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="font-bold text-white text-sm sm:text-lg line-clamp-1">{game.title}</h3>
                    <p className="text-xs text-white/80 line-clamp-1">{game.provider}</p>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <div>
                        <p className="text-xs text-white/70">Jackpot</p>
                        <p className="text-yellow-400 font-bold text-sm sm:text-lg">{game.jackpot}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGameClick(game.title);
                        }}
                      >
                        {t('games.play')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover overlay with play button */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="text-center space-y-3 sm:space-y-4 pointer-events-none">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                    <div className="w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-purple-600 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-white font-bold text-sm sm:text-base">{t('games.playNow')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}