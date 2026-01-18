import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  const paymentMethods = [
    'Visa', 'Mastercard', 'PayPal', 'Skrill', 'Neteller', 
    'Bitcoin', 'Ethereum', 'Papara', 'Paysafe', 'CMT'
  ];

  const footerLinks = {
    [t('footer.aboutUs')]: [
      t('footer.whoWeAre'),
      t('footer.contact'),
      t('footer.career'),
      t('footer.press'),
      t('footer.partnership')
    ],
    [t('footer.help')]: [
      t('footer.faq'),
      t('footer.paymentMethods'),
      t('footer.withdrawal'),
      t('footer.responsibility'),
      t('footer.security')
    ],
    [t('footer.legal')]: [
      t('footer.termsOfUse'),
      t('footer.privacyPolicy'),
      t('footer.cookiePolicy'),
      t('footer.bonusTerms'),
      t('footer.license')
    ],
    [t('footer.games')]: [
      t('footer.slotGames'),
      t('footer.liveCasino'),
      t('footer.sportsBetting'),
      t('footer.virtualSports'),
      t('footer.eSports')
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Payment Methods */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">{t('footer.paymentMethodsTitle')}</h3>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            {paymentMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-400 mb-3 sm:mb-4">Garbet</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-purple-600 transition-colors">
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{title}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 text-xs sm:text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
              <div>
                <div className="text-gray-400">Email</div>
                <a href="mailto:info@besin.com" className="text-white hover:text-purple-400 break-all">
                  info@besin.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
              <div>
                <div className="text-gray-400">{t('footer.phone')}</div>
                <a href="tel:+908501234567" className="text-white hover:text-purple-400">
                  +90 850 123 45 67
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
              <div>
                <div className="text-gray-400">{t('footer.liveSupport')}</div>
                <span className="text-white">{t('footer.alwaysHere')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <p className="text-center sm:text-left">{t('footer.copyright')}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 text-xs">
              <span>{t('footer.responsibleGaming')}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t('footer.licenseNo')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}