import Slider from 'react-slick';
import { useState } from 'react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618304925090-b68a8c744cbe?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1599579887642-9821ebe3c79a?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1633629544357-14223c9837d2?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1566563255308-753861417000?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1732998340351-b44984f30508?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1739133710741-1468de0acf26?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1659382151328-30c3df37a69a?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1719228159232-48608b807a58?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1626775238053-4315516eedc9?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1551993005-75c4131b6bd8?w=1920&h=720&fit=crop',
    type: 'custom',
    discount: '',
    title: '',
    subtitle: ''
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState<any>(null);
  const totalSlides = slides.length;

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    pauseOnHover: true,
    fade: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    ref: (slider: any) => setSliderRef(slider),
  };

  return (
    <div className="w-full relative pt-6 sm:pt-8 lg:pt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
      <style>{`
        .hero-slider .slick-slider {
          position: relative;
        }
        .hero-slider .slick-list {
          overflow: hidden;
          border-radius: 12px;
        }
        .hero-slider .slick-dots {
          bottom: 20px;
          z-index: 10;
        }
        .hero-slider .slick-dots li {
          margin: 0;
        }
        .hero-slider .slick-dots li.slick-active div {
          background: #06b6d4 !important;
          width: 30px;
          border-radius: 5px;
        }
        .hero-slider .slick-dots li div {
          transition: all 0.3s ease;
        }
        .hero-slider .slick-prev,
        .hero-slider .slick-next {
          z-index: 25;
          width: 48px;
          height: 48px;
        }
        .hero-slider .slick-prev {
          left: 20px;
        }
        .hero-slider .slick-next {
          right: 20px;
        }
        .hero-slider .slick-prev:before,
        .hero-slider .slick-next:before {
          display: none;
        }
      `}</style>
      <div className="hero-slider relative">
        {/* Pagination Indicator - Top Right - Matching betsilin exactly */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/30 shadow-lg">
          <button 
            onClick={() => sliderRef?.slickPrev()}
            className="text-white hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Previous slide"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white text-sm font-bold px-3 min-w-[4rem] text-center tracking-wide">
            {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
          </span>
          <button 
            onClick={() => sliderRef?.slickNext()}
            className="text-white hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Next slide"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              {slide.type === 'custom' ? (
                // Simple full-width image slide
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '42.33 / 15.8' }}>
                  <img
                    src={slide.image}
                    alt="Casino Promotion"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Promotional slides with text overlay
                <div className="relative w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700" style={{ aspectRatio: '42.33 / 15.8' }}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-20 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
                  </div>
                  
                  {/* Dot Pattern Overlay */}
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  ></div>

                  <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      {/* Left Content */}
                      <div className="flex-1 z-10">
                        <div className="flex items-baseline gap-2 mb-2">
                          <div className="text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none">
                            {slide.discount}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
                            {slide.title}
                          </h2>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">
                            {slide.subtitle}
                          </h2>
                        </div>
                        <button className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                          <span className="text-xl">▶</span>
                          DETAYLAR
                        </button>
                      </div>

                      {/* Right Image */}
                      <div className="hidden md:block flex-1 relative h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[120%] w-auto object-contain drop-shadow-2xl"
                          style={{ maxHeight: '500px' }}
                        />
                        {/* Floating Casino Elements */}
                        <div className="absolute top-10 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                          🎰
                        </div>
                        <div className="absolute top-32 right-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>
                          🎲
                        </div>
                        <div className="absolute bottom-20 right-32 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
                          💎
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
      </div>
    </div>
  );
}

function CustomPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
  );
}

function CustomNextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
      onClick={onClick}
      aria-label="Next slide"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
}