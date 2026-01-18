import { useState } from 'react';
import { Play, Star, Info, Flame } from 'lucide-react';
import { Button } from './ui/button';

interface SlotGameCardProps {
  title: string;
  provider: string;
  image: string;
  isNew?: boolean;
  isHot?: boolean;
  isJackpot?: boolean;
  rtp?: string;
  onPlay?: () => void;
}

export function SlotGameCard({ 
  title, 
  provider, 
  image, 
  isNew, 
  isHot, 
  isJackpot,
  rtp,
  onPlay
}: SlotGameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on the card container, not on child buttons
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.card-click-area')) {
      if (onPlay) {
        onPlay();
      }
    }
  };

  return (
    <div 
      className="group relative rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 card-click-area"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onPlay) {
            onPlay();
          }
        }
      }}
      aria-label={`Play ${title}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.game-image-placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'game-image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600';
              const text = document.createElement('div');
              text.className = 'text-white font-bold text-sm text-center px-2';
              text.textContent = title;
              placeholder.appendChild(text);
              parent.appendChild(placeholder);
            }
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'block';
            const placeholder = target.parentElement?.querySelector('.game-image-placeholder');
            if (placeholder) {
              placeholder.remove();
            }
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex flex-wrap gap-1 pointer-events-none">
          {isHot && (
            <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-0.5 sm:gap-1 animate-pulse-glow">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden xs:inline">HOT</span>
            </div>
          )}
          {isJackpot && (
            <span className="bg-yellow-500 text-black text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-0.5 sm:gap-1">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
              <span className="hidden xs:inline">JACKPOT</span>
            </span>
          )}
        </div>

        {/* New Badge */}
        {isNew && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded animate-bounce-subtle pointer-events-none">
            NEW
          </div>
        )}

        {/* RTP Badge */}
        {rtp && !isNew && (
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded pointer-events-none">
            RTP {rtp}%
          </div>
        )}

        {/* Hover Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 gap-1.5 sm:gap-2 text-xs sm:text-sm pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onPlay) {
                  onPlay();
                }
              }}
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              OYNA
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Info - Always Visible */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
          <h3 className="font-bold text-white text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">{title}</h3>
          <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1">{provider}</p>
        </div>
      </div>
    </div>
  );
}