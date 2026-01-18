import { Dice5, Flame, Trophy, Zap, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export function CategoryCards() {
  const { t } = useLanguage();

  const categories = [
    {
      title: t('cat.casino'),
      subtitle: t('cat.casinoSub'),
      icon: Dice5,
      gradient: 'from-blue-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?w=600'
    },
    {
      title: t('cat.slots'),
      subtitle: t('cat.slotsSub'),
      icon: Flame,
      gradient: 'from-orange-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=600'
    },
    {
      title: t('cat.live'),
      subtitle: t('cat.liveSub'),
      icon: Trophy,
      gradient: 'from-green-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1633629544357-14223c9837d2?w=600'
    },
    {
      title: t('cat.sports'),
      subtitle: t('cat.sportsSub'),
      icon: Zap,
      gradient: 'from-yellow-600 to-orange-600',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600'
    },
    {
      title: t('cat.jackpot'),
      subtitle: t('cat.jackpotSub'),
      icon: DollarSign,
      gradient: 'from-pink-600 to-purple-600',
      image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=600'
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Kategoriler</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Navigate to category
                  }
                }}
                aria-label={`Explore ${category.title}`}
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-200">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.image-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder absolute inset-0';
                        placeholder.style.background = `linear-gradient(135deg, ${category.gradient.includes('blue') ? '#2563eb' : category.gradient.includes('orange') ? '#ea580c' : category.gradient.includes('green') ? '#059669' : category.gradient.includes('yellow') ? '#eab308' : '#ec4899'} 0%, ${category.gradient.includes('blue') ? '#9333ea' : category.gradient.includes('orange') ? '#dc2626' : category.gradient.includes('green') ? '#14b8a6' : category.gradient.includes('yellow') ? '#f97316' : '#a855f7'} 100%)`;
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} mix-blend-multiply opacity-80`}></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                    {/* Icon */}
                    <div className="relative z-10">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white mb-2" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-2 sm:space-y-3">
                      <div className="text-center">
                        <h3 className="font-bold text-white text-base sm:text-lg md:text-xl mb-1">{category.title}</h3>
                        <p className="text-xs sm:text-sm text-white/90">{category.subtitle}</p>
                      </div>
                      
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white text-xs sm:text-sm"
                        size="sm"
                      >
                        {t('cat.explore')}
                      </Button>
                    </div>
                  </div>

                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {t('games.playNow')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}