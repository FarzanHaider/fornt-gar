import { Button } from './ui/button';
import { Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LiveCasinoSection() {
  const { t } = useLanguage();

  const liveTables = [
    {
      title: 'Blackjack VIP',
      dealer: 'Emily',
      players: 6,
      minBet: '₺100',
      maxBet: '₺50,000',
      image: 'https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?w=600',
      isVIP: true
    },
    {
      title: 'Roulette Turkish',
      dealer: 'Ayşe',
      players: 12,
      minBet: '₺50',
      maxBet: '₺25,000',
      image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=600',
      isVIP: false
    },
    {
      title: 'Baccarat Grand',
      dealer: 'Maria',
      players: 8,
      minBet: '₺200',
      maxBet: '₺100,000',
      image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=600',
      isVIP: true
    },
    {
      title: 'Poker Live',
      dealer: 'Alex',
      players: 5,
      minBet: '₺75',
      maxBet: '₺30,000',
      image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=600',
      isVIP: false
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-ping absolute top-0 left-0"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('live.title')}</h2>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-gray-900 hover:bg-gray-100 text-xs sm:text-sm">
            {t('live.allTables')}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {liveTables.map((table, index) => (
            <div 
              key={index}
              className="group relative rounded-lg sm:rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Navigate to live casino or open table
                }
              }}
              aria-label={`Join ${table.title}`}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={table.image} 
                  alt={table.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Live Badge */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 sm:gap-2 bg-red-600 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full pointer-events-none">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  {t('live.live')}
                </div>

                {/* VIP Badge */}
                {table.isVIP && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-yellow-500 text-black text-xs font-bold px-2 sm:px-3 py-1 rounded-full pointer-events-none">
                    {t('live.vip')}
                  </div>
                )}

                {/* Player Count */}
                <div className="absolute top-10 sm:top-12 right-2 sm:right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                  <Users className="w-3 h-3" />
                  <span>{table.players}</span>
                </div>

                {/* Table Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-lg line-clamp-1">{table.title}</h3>
                      <p className="text-xs sm:text-sm text-white/70 line-clamp-1">{t('live.dealer')}: {table.dealer}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-white/60">{t('live.minBet')}</p>
                        <p className="text-green-400 font-bold text-xs sm:text-sm">{table.minBet}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60">{t('live.maxBet')}</p>
                        <p className="text-yellow-400 font-bold text-xs sm:text-sm">{table.maxBet}</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs sm:text-sm pointer-events-auto" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {t('live.joinTable')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 sm:border-4 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg sm:rounded-xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}