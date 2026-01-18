import { ImageWithFallback } from './figma/ImageWithFallback';
import { Gift, Percent, Star, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function PromoBanners() {
  const { t } = useLanguage();

  const promos = [
    {
      title: t('promo.welcome'),
      description: t('promo.welcomeDesc'),
      amount: '10,000 TRY',
      icon: Gift,
      gradient: 'from-purple-600 to-pink-600',
      image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=600'
    },
    {
      title: t('promo.cashback'),
      description: t('promo.cashbackDesc'),
      amount: '5,000 TRY',
      icon: Percent,
      gradient: 'from-blue-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=600'
    },
    {
      title: t('promo.vip'),
      description: t('promo.vipDesc'),
      amount: '50,000 TRY',
      icon: Star,
      gradient: 'from-yellow-600 to-orange-600',
      image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=600'
    },
    {
      title: t('promo.daily'),
      description: t('promo.dailyDesc'),
      amount: '100,000 TRY',
      icon: Zap,
      gradient: 'from-green-600 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=600'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('promo.title')}</h2>
          <span className="text-sm sm:text-base text-purple-600 font-medium cursor-pointer hover:underline">
            {t('promo.viewAll')} →
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {promos.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div 
                key={index}
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Navigate to promotion details
                  }
                }}
                aria-label={`View ${promo.title} promotion details`}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.image-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder absolute inset-0';
                        placeholder.style.background = `linear-gradient(135deg, ${promo.gradient.includes('purple') ? '#9333ea' : promo.gradient.includes('blue') ? '#2563eb' : promo.gradient.includes('yellow') ? '#eab308' : '#059669'} 0%, ${promo.gradient.includes('purple') ? '#ec4899' : promo.gradient.includes('blue') ? '#06b6d4' : promo.gradient.includes('yellow') ? '#f97316' : '#10b981'} 100%)`;
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient} mix-blend-multiply opacity-80`}></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between text-white pointer-events-none">
                    {/* Icon */}
                    <div className="flex justify-end">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="font-bold text-sm sm:text-xl line-clamp-1">{promo.title}</h3>
                      <p className="text-xs sm:text-sm text-white/90 line-clamp-2">{promo.description}</p>
                      <div className="text-xl sm:text-3xl font-bold">{promo.amount}</div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-black/10 rounded-full blur-2xl"></div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-white font-bold text-sm sm:text-lg">{t('promo.seeDetails')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}