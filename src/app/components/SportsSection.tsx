import { Button } from './ui/button';
import { Trophy, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function SportsSection() {
  const { t } = useLanguage();

  const matches = [
    {
      league: 'Premier League',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      homeOdds: '2.45',
      drawOdds: '3.20',
      awayOdds: '2.80',
      time: '20:00'
    },
    {
      league: 'La Liga',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      homeOdds: '2.10',
      drawOdds: '3.40',
      awayOdds: '3.25',
      time: '21:00'
    },
    {
      league: 'Serie A',
      homeTeam: 'Juventus',
      awayTeam: 'AC Milan',
      homeOdds: '2.20',
      drawOdds: '3.10',
      awayOdds: '3.00',
      time: '19:45'
    },
    {
      league: 'Bundesliga',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      homeOdds: '1.85',
      drawOdds: '3.60',
      awayOdds: '4.20',
      time: '18:30'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400" />
            <h2 className="text-base sm:text-xl md:text-2xl font-bold">{t('sports.sectionTitle')}</h2>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-purple-900 hover:bg-gray-100 text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1 sm:py-2 h-auto">
            {t('sports.allMatches')}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {matches.map((match, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/20 transition-all border border-white/20"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs text-purple-200 truncate">{match.league}</span>
                <span className="text-[10px] sm:text-xs font-bold text-yellow-400 flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {t('live.live')}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center gap-1 sm:gap-2 min-h-[40px] sm:min-h-[48px]">
                  <span className="font-medium text-[10px] xs:text-xs sm:text-sm text-center line-clamp-2 flex-1">{match.homeTeam}</span>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 flex-shrink-0 px-1">vs</span>
                  <span className="font-medium text-[10px] xs:text-xs sm:text-sm text-center line-clamp-2 flex-1">{match.awayTeam}</span>
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col py-1.5 sm:py-2 px-1 h-auto" size="sm">
                    <span className="text-[8px] sm:text-[9px] leading-tight">{t('sports.home')}</span>
                    <span className="font-bold text-xs sm:text-sm mt-0.5">{match.homeOdds}</span>
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col py-1.5 sm:py-2 px-1 h-auto" size="sm">
                    <span className="text-[8px] sm:text-[9px] leading-tight">{t('sports.draw')}</span>
                    <span className="font-bold text-xs sm:text-sm mt-0.5">{match.drawOdds}</span>
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 flex flex-col py-1.5 sm:py-2 px-1 h-auto" size="sm">
                    <span className="text-[8px] sm:text-[9px] leading-tight">{t('sports.away')}</span>
                    <span className="font-bold text-xs sm:text-sm mt-0.5">{match.awayOdds}</span>
                  </Button>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 text-center text-[10px] sm:text-xs text-purple-200">
                {t('sports.startTime')}: {match.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}