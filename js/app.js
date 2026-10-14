// ProNet Computer Store & Admin CMS - Main Application Script
const STORAGE_KEY = 'pronet_store_cms_v1';

    // Default Official Data from ProNet Computer Facebook Page & Brand Identity
    const DEFAULT_STORE_DATA = {
      settings: {
        brandName: 'برونت كمبيوتر',
        slogan: 'خدمات بإتقان • حلول تقنية متكاملة',
        announcement: 'برونت كمبيوتر - عدن المعلا: وصلت دفعة جديدة من أجهزة الشبكات واللابتوبات ومنظومات ستارلينك!',
        heroBadge: 'المركز المتخصص الأول للكمبيوتر والشبكات والأنظمة الأمنية في عدن',
        heroTitle: 'برونت كمبيوتر ProNet — حلول تقنية متكاملة وخدمات بإتقان',
        heroSubtitle: 'نوفر أحدث أجهزة اللابتوب والكمبيوتر المكتبي، معدات الشبكات الاحترافية (MikroTik & Ubiquiti & WiFi 6)، خدمات الإنترنت الفضائي Starlink، منظومات كاميرات المراقبة، والطابعات مع ضمان موثوق ودعم فني هندسي متخصص للأفراد والشركات.',
        defaultCurrency: 'USD',
        rateYER: 2050,
        rateSAR: 3.75,
        showPricesGlobal: true,
        primaryColor: '#00A8FF',
        secondaryColor: '#38B6FF',
        navyColor: '#0D1B2A',
        whatsappNumber: '967775043020',
        secondaryWhatsapp: '967778163178',
        landline: '02-241004',
        email: 'prontech.co@gmail.com',
        address: 'اليمن - عدن - المعلا - الشارع الرئيسي (شارع الشهيد مدرم) - أمام بنك الكريمي - جوار مطعم آيس بالاس'
      },
      categories: [
        'الشبكات والربط الخارجي',
        'لابتوبات وكمبيوترات',
        'الطابعات ومستلزماتها',
        'الإنترنت الفضائي Starlink',
        'كاميرات المراقبة والأمن',
        'الطاقة والحماية الكهربائية',
        'الإكسسوارات والتخزين'
      ],
      brands: [
        'HP', 'Dell', 'Lenovo', 'Asus', 'MikroTik', 'Ubiquiti', 'TP-Link', 'Moon Link', 'Speeder', 'Starlink', 'Hikvision', 'Power Maxma', 'Delux'
      ],
      products: [
        {
          id: 'p1',
          name: 'جهاز البث والاستقبال الخارجي Moon Link (ML-WA360) WiFi 6',
          category: 'الشبكات والربط الخارجي',
          brand: 'Moon Link',
          price: 95,
          oldPrice: 115,
          hidePrice: false,
          badge: 'وصل حديثاً',
          iconType: 'router',
          featured: true,
          specs: ['تقنية WiFi 6 (AX1800) ببينج منخفض ومستقر', 'أنتن داخلي مزدوج 16dBi لترددي 2.4GHz و5.8GHz', 'منفذ جيجابت يدعم PoE لمسافات طويلة', 'عازل كامل مقاوم للرطوبة والحرارة والأمطار'],
          desc: 'وحش الربط والبث الخارجي المصمم لأصحاب الشبكات والموزعين في عدن لتحمل ضغط العمل والحرارة العالية مع استقرار فائق للإشارة.',
          imageUrl: ''
        },
        {
          id: 'p2',
          name: 'طابعة ليزر ملونة متكاملة HP Color LaserJet Pro MFP M479fdw',
          category: 'الطابعات ومستلزماتها',
          brand: 'HP',
          price: 640,
          oldPrice: 690,
          hidePrice: false,
          badge: 'عرض خاص',
          iconType: 'printer',
          featured: true,
          specs: ['4 وظائف متكاملة: طباعة، مسح ضوئي، نسخ، فاكس', 'شاشة لمس ملونة ذكية وسهلة التحكم', 'طباعة تلقائية على الوجهين Duplex سريعة', 'اتصال WiFi ثنائي النطاق وEthernet للشركات'],
          desc: 'الشريك المثالي للشركات والمكاتب الذكية في عدن؛ تمنحك مخرجات ألوان احترافية وسرعة فائقة تلبي ضغط العمل اليومي.',
          imageUrl: ''
        },
        {
          id: 'p3',
          name: 'جهاز حماية وتنظيم الجهد الكهربائي Power Maxma 2500VA AVR',
          category: 'الطاقة والحماية الكهربائية',
          brand: 'Power Maxma',
          price: 110,
          oldPrice: 125,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'ups',
          featured: true,
          specs: ['قدرة 2500VA لحماية الأجهزة الحساسة والسيرفرات', 'تنظيم تلقائي للجهد الكهربائي (AVR)', 'إدارة ذكية للبطارية وحماية من التذبذب المفاجئ', 'شاشة رقمية لعرض الفولتية وحالة الحمل'],
          desc: 'حماية فائقة لأجهزة الكمبيوتر والشبكات والمكاتب من انقطاع وتذبذب التيار الكهربائي.',
          imageUrl: ''
        },
        {
          id: 'p4',
          name: 'قاعدة ستارلينك الجدارية الاحترافية (Starlink Wall Mount)',
          category: 'الإنترنت الفضائي Starlink',
          brand: 'Starlink',
          price: 28,
          oldPrice: 35,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'starlink',
          featured: false,
          specs: ['تثبيت جداري آمن للراوتر والمحول', 'تنظيم مثالي للكابلات ومنع التشابك', 'حماية من الصدمات والسقوط', 'تصميم عصري أنيق للمكاتب والمنازل'],
          desc: 'الحل المتكامل لترتيب وحماية جهاز راوتر ومحول ستارلينك بأناقة وأمان تام.',
          imageUrl: ''
        },
        {
          id: 'p5',
          name: 'راوتر متنقل TP-Link M7000 4G LTE MiFi',
          category: 'الشبكات والربط الخارجي',
          brand: 'TP-Link',
          price: 49,
          oldPrice: 58,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'router',
          featured: false,
          specs: ['سرعة 4G LTE تصل إلى 150Mbps', 'بطارية 2000mAh تدوم حتى 8 ساعات متواصلة', 'يدعم توصيل حتى 10 أجهزة في نفس الوقت', 'إدارة كاملة عبر تطبيق tpMiFi من الجوال'],
          desc: 'وفر طاقة جوالك وابقَ متصلاً بالإنترنت في كل مكان مع راوتر TP-Link M7000 المتنقل.',
          imageUrl: ''
        },
        {
          id: 'p6',
          name: 'سويتش شبكات جيجابت Speeder (A500-5G) - 5 منافذ',
          category: 'الشبكات والربط الخارجي',
          brand: 'Speeder',
          price: 22,
          oldPrice: 28,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'router',
          featured: false,
          specs: ['5 منافذ سرعة جيجابت (10/100/1000Mbps)', 'معالج قوي 500MHz وباندويث 10Gbps', 'توصيل حتى 150 متر لكابلات Cat5 وCat6', 'إطار معدني يتحمل حرارة حتى 55° مئوية وفولتية 5V-15V'],
          desc: 'سويتش معدني فائق التحمل لأصحاب الشبكات والمكاتب يعمل باستقرار عالٍ تحت ضغط التحميل المستمر.',
          imageUrl: ''
        },
        {
          id: 'p7',
          name: 'علبة هارد خارجي ذكية M.2 SSD Enclosure (NVMe & SATA 10Gbps)',
          category: 'الإكسسوارات والتخزين',
          brand: 'Delux',
          price: 19,
          oldPrice: 25,
          hidePrice: false,
          badge: 'عرض خاص',
          iconType: 'storage',
          featured: false,
          specs: ['سرعة نقل بيانات خارقة 10Gbps عبر منفذ Type-C', 'تدعم بروتوكولات NVMe وSATA ومقاسات متعددة', 'هيكل ألمنيوم أنيق لتشتيت الحرارة وحماية القرص', 'تشغيل فوري Plug & Play بدون تعريف'],
          desc: 'حوّل قرص M.2 SSD الداخلي إلى هارد خارجي فائق السرعة لنقل ملفاتك الضخمة في ثوانٍ.',
          imageUrl: ''
        },
        {
          id: 'p8',
          name: 'طقم كيبورد وماوس احترافي Delux KA150 (سلكي / لاسلكي)',
          category: 'الإكسسوارات والتخزين',
          brand: 'Delux',
          price: 16,
          oldPrice: 20,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'storage',
          featured: false,
          specs: ['تصميم مريح للاستخدام المكتبي الطويل', 'مفاتيح هادئة وعالية الاستجابة تدعم العربية والإنجليزية', 'متوفر بنسخة USB سلكية ونسخة لاسلكية', 'جودة تصنيع عالية من شركة Delux'],
          desc: 'تشكيلة مميزة من كيبوردات وماوسات شركة Delux الأصلية للمكاتب والشركات.',
          imageUrl: ''
        },
        {
          id: 'p9',
          name: 'لابتوب الأعمال HP ProBook 450 G10 - Core i7 الجيل 13',
          category: 'لابتوبات وكمبيوترات',
          brand: 'HP',
          price: 820,
          oldPrice: 880,
          hidePrice: false,
          badge: 'وصل حديثاً',
          iconType: 'laptop',
          featured: true,
          specs: ['المعالج: Intel Core i7-1355U (الجيل الثالث عشر)', 'الذاكرة العشوائية: 16GB DDR4 قابلة للترقية', 'التخزين: 512GB PCIe NVMe M.2 SSD', 'شاشة 15.6 بوصة FHD IPS وهيكل ألمنيوم متين'],
          desc: 'خيار مثالي للمهندسين، المدراء، ومشاريع المنظمات والشركات مع ضمان برونت كمبيوتر.',
          imageUrl: ''
        },
        {
          id: 'p10',
          name: 'راوتر المؤسسات والشبكات MikroTik RB5009UG+S+IN',
          category: 'الشبكات والربط الخارجي',
          brand: 'MikroTik',
          price: 235,
          oldPrice: 255,
          hidePrice: false,
          badge: 'كمية محدودة',
          iconType: 'router',
          featured: true,
          specs: ['معالج رباعي النواة Marvell Armada 1.4GHz', 'منفذ 2.5G Ethernet + منفذ 10G SFP+ Fiber', '7 منافذ جيجابت إيثرنت مع نظام RouterOS v7', 'مثالي لدمج الخطوط وإدارة الشبكات الكبرى'],
          desc: 'الراوتر الأقوى من مايكروتيك لإدارة الشبكات ومزودي الخدمة والمؤسسات بكفاءة عالية.',
          imageUrl: ''
        },
        {
          id: 'p11',
          name: 'منظومة كاميرات مراقبة شبكية Hikvision IP 4MP ColorVu (4 كاميرات + NVR)',
          category: 'كاميرات المراقبة والأمن',
          brand: 'Hikvision',
          price: 310,
          oldPrice: 345,
          hidePrice: false,
          badge: 'عرض خاص',
          iconType: 'camera',
          featured: false,
          specs: ['4 كاميرات بدقة 4 ميجابكسل وتصوير ليلي ملون ColorVu', 'جهاز تسجيل شبكي NVR بـ 4 منافذ PoE مدمجة', 'مقاومة للعوامل الجوية بمعيار IP67', 'متابعة حية عبر الجوال من أي مكان عبر تطبيق Hik-Connect'],
          desc: 'منظومة أمنية متكاملة للمحلات التجارية، الشركات، والمنازل مع إمكانية التركيب والبرمجة.',
          imageUrl: ''
        },
        {
          id: 'p12',
          name: 'منظومة الإنترنت الفضائي Starlink Standard Kit V4',
          category: 'الإنترنت الفضائي Starlink',
          brand: 'Starlink',
          price: 490,
          oldPrice: 530,
          hidePrice: false,
          badge: 'متوفر',
          iconType: 'starlink',
          featured: true,
          specs: ['الإصدار الرابع الحديث مع راوتر WiFi 6', 'سرعات تحميل عالية وبنج منخفض للأعمال والشبكات', 'مقاوم للغبار والأمطار والحرارة العالية', 'متوفر مع خدمة التفعيل والتركيب والدمج مع MikroTik'],
          desc: 'حلول الإنترنت الفضائي المتكاملة للشركات، المنظمات، وأصحاب الشبكات في عدن وعموم اليمن.',
          imageUrl: ''
        }
      ],
      posts: [
        {
          id: 'post1',
          title: 'لأصحاب الشبكات والموزعين في عدن.. وحش الربط والبث الخارجي Moon Link وصل!',
          tag: 'حلول الشبكات',
          date: 'يوليو 2026',
          content: 'تشتي ترفع كفاءة شبكتك وتريح رأسك من شكاوى المشتركين؟ وصل جهاز البث والاستقبال الجبار Moon Link (ML-WA360) الأصلي بتقنية WiFi 6 (AX1800) وأنتن مزدوج 16dBi ومنفذ جيجابت PoE مقاوم للرطوبة والحرارة.'
        },
        {
          id: 'post2',
          title: 'طوّر إنتاجية أعمالك مع الطابعة الليزرية المتكاملة HP Color LaserJet Pro MFP M479fdw',
          tag: 'طابعات وشركات',
          date: 'يونيو 2026',
          content: 'الشريك المثالي للشركات والمكاتب الذكية: طباعة، مسح ضوئي، نسخ، وفاكس في جهاز واحد مع شاشة لمس ذكية ومخرجات ألوان احترافية متوفرة الآن لدى برونت كمبيوتر.'
        },
        {
          id: 'post3',
          title: 'نظّم مساحتك واحمِ جهاز ستارلينك بأناقة مع قاعدة Starlink الجدارية',
          tag: 'ستارلينك',
          date: 'سبتمبر 2026',
          content: 'تخلص من فوضى الكابلات واحمِ الراوتر والمحول من الصدمات أو السقوط مع القاعدة الجدارية الأنيقة المتوفرة الآن في معرضنا بالمعلا.'
        },
        {
          id: 'post4',
          title: 'حماية متكاملة لأجهزتك من انقطاع الكهرباء مع Power Maxma 2500VA',
          tag: 'حماية وطاقة',
          date: 'أغسطس 2026',
          content: 'ودّع القلق من تذبذب وانقطاع التيار الكهربائي؛ يوفر جهاز Power Maxma 2500VA تنظيماً تلقائياً للجهد (AVR) وإدارة ذكية للبطارية لضمان استقرار أجهزتك.'
        }
      ]
    };

    // Runtime State
    let storeData = loadStoreData();
    let activeCurrency = storeData.settings.defaultCurrency || 'USD';
    let selectedCategory = 'ALL';
    let cart = [];
    let compareList = [];

    function loadStoreData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.products && parsed.settings) {
            return parsed;
          }
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
    }

    function saveStoreData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
      } catch (e) {}
      applySiteSettingsToDOM();
      renderAllViews();
    }

    // SVG Illustrations per Product IconType
    function getProductSvgIllustration(iconType, brand) {
      const svgs = {
        router: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="20" y="52" width="80" height="22" rx="6" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <line x1="32" y1="52" x2="26" y2="16" stroke="#38B6FF" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="60" y1="52" x2="60" y2="12" stroke="#00A8FF" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="88" y1="52" x2="94" y2="16" stroke="#38B6FF" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="34" cy="63" r="3" fill="#10B981"/><circle cx="46" cy="63" r="3" fill="#38B6FF"/><circle cx="58" cy="63" r="3" fill="#38B6FF"/>
          <path d="M45 26C53 18 67 18 75 26" stroke="#F5CD5F" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        laptop: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="24" y="16" width="72" height="46" rx="5" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <rect x="30" y="22" width="60" height="34" rx="2" fill="#1B263B"/>
          <path d="M40 44L52 32L64 40L78 28" stroke="#38B6FF" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M14 64H106L112 72H8L14 64Z" fill="#38B6FF"/>
        </svg>`,
        printer: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="34" y="12" width="52" height="20" rx="3" fill="#1B263B" stroke="#38B6FF" stroke-width="2"/>
          <rect x="20" y="30" width="80" height="36" rx="7" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <rect x="34" y="56" width="52" height="22" rx="3" fill="#F8FAFC" stroke="#38B6FF" stroke-width="2"/>
          <line x1="42" y1="64" x2="78" y2="64" stroke="#00A8FF" stroke-width="2"/><line x1="42" y1="70" x2="68" y2="70" stroke="#D4AF37" stroke-width="2"/>
          <circle cx="84" cy="42" r="4" fill="#F5CD5F"/>
        </svg>`,
        camera: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <path d="M26 36L82 22L92 48L36 62Z" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <circle cx="87" cy="35" r="8" fill="#1B263B" stroke="#F5CD5F" stroke-width="2.5"/>
          <path d="M22 68H48M35 55V68" stroke="#38B6FF" stroke-width="3" stroke-linecap="round"/>
        </svg>`,
        starlink: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="32" y="14" width="58" height="40" rx="6" transform="rotate(-12 32 14)" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <path d="M60 48V74M44 74H76" stroke="#38B6FF" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="88" cy="18" r="4" fill="#F5CD5F"/>
          <path d="M74 16C80 10 90 10 96 16" stroke="#38B6FF" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
        ups: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="34" y="12" width="52" height="66" rx="7" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <rect x="44" y="22" width="32" height="16" rx="3" fill="#1B263B" stroke="#38B6FF" stroke-width="1.5"/>
          <path d="M62 44L52 56H61L58 68L70 54H60L62 44Z" fill="#F5CD5F"/>
        </svg>`,
        storage: `<svg viewBox="0 0 120 90" class="w-28 h-24 mx-auto" fill="none">
          <rect x="22" y="28" width="76" height="34" rx="8" fill="#0D1B2A" stroke="#38B6FF" stroke-width="2.5"/>
          <rect x="14" y="38" width="8" height="14" rx="2" fill="#F5CD5F"/>
          <line x1="36" y1="45" x2="78" y2="45" stroke="#38B6FF" stroke-width="3" stroke-linecap="round"/>
        </svg>`
      };
      return svgs[iconType] || svgs.router;
    }

    // Format Price by Active Currency
    function formatPrice(usdPrice, hidePriceFlag) {
      if (!storeData.settings.showPricesGlobal || hidePriceFlag) {
        return 'تواصل لمعرفة السعر';
      }
      const val = Number(usdPrice) || 0;
      if (activeCurrency === 'YER') {
        const yer = Math.round(val * (Number(storeData.settings.rateYER) || 2050));
        return yer.toLocaleString('en-US') + ' ر.ي';
      }
      if (activeCurrency === 'SAR') {
        const sar = (val * (Number(storeData.settings.rateSAR) || 3.75)).toFixed(0);
        return Number(sar).toLocaleString('en-US') + ' ر.س';
      }
      return '$' + val.toLocaleString('en-US');
    }

    function changeCurrency(curr) {
      activeCurrency = curr;
      renderAllViews();
      showToast('تم تغيير عملة العرض إلى ' + (curr === 'USD' ? 'الدولار الأمريكي ($)' : curr === 'YER' ? 'الريال اليمني (ر.ي)' : 'الريال السعودي (ر.س)'));
    }

    // Apply CSS Variables & Text Settings
    function applySiteSettingsToDOM() {
      const s = storeData.settings;
      document.documentElement.style.setProperty('--pronet-primary', s.primaryColor || '#00A8FF');
      document.documentElement.style.setProperty('--pronet-secondary', s.secondaryColor || '#38B6FF');
      document.documentElement.style.setProperty('--pronet-navy', s.navyColor || '#0D1B2A');

      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.textContent = val;
      };
      setTxt('announcementText', s.announcement);
      setTxt('headerBrandName', s.brandName);
      setTxt('headerSlogan', s.slogan);
      setTxt('heroBadgeText', s.heroBadge);
      setTxt('heroTitleText', s.heroTitle);
      setTxt('heroSubtitleText', s.heroSubtitle);
      setTxt('aboutAddressText', s.address);
      setTxt('aboutLandlineText', s.landline);
      setTxt('aboutEmailText', s.email);
      setTxt('exchangeRateInfoBadge', `سعر الصرف: 1$ = ${s.rateYER} ر.ي | ${s.rateSAR} ر.س`);

      const waLink = document.getElementById('topWhatsappLink');
      if (waLink) waLink.href = 'https://wa.me/' + (s.whatsappNumber || '967775043020');
    }

    // Navigation Tabs
    function switchMainTab(tab) {
      const views = ['home', 'b2b', 'posts', 'about', 'admin'];
      views.forEach(v => {
        const sec = document.getElementById('view-' + v);
        if (sec) sec.classList.toggle('hidden', v !== tab);
        const btn = document.getElementById('nav-' + v);
        if (btn) {
          if (v === tab) {
            btn.className = 'nav-btn px-4 py-2 rounded-lg text-sm font-bold transition bg-cyan-500 text-white shadow-sm';
          } else {
            btn.className = 'nav-btn px-4 py-2 rounded-lg text-sm font-bold transition text-slate-700 dark:text-slate-200 hover:text-cyan-500';
          }
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (tab === 'admin') populateAdminInputs();
    }

    function switchAdminSubTab(sub) {
      const subs = ['products', 'categories', 'posts', 'settings', 'github'];
      subs.forEach(s => {
        const box = document.getElementById('admin-subview-' + s);
        if (box) box.classList.toggle('hidden', s !== sub);
        const btn = document.getElementById('adm-tab-' + s);
        if (btn) {
          btn.className = s === sub
            ? 'adm-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 text-white'
            : 'adm-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-200 dark:bg-[#1B263B] text-slate-700 dark:text-slate-200';
        }
      });
    }

    function scrollToCatalog() {
      const el = document.getElementById('storeCatalogSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      const icon = document.getElementById('themeIcon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    }

    // Render Hero Featured Product
    function renderHeroFeatured() {
      const container = document.getElementById('heroFeaturedCard');
      if (!container) return;
      const featured = storeData.products.find(p => p.featured) || storeData.products[0];
      if (!featured) return;
      container.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-24 h-20 rounded-xl bg-[#0D1B2A] border border-cyan-500/30 flex items-center justify-center shrink-0 p-1">
            ${featured.imageUrl ? `<img src="${featured.imageUrl}" alt="${featured.name}" class="max-h-full max-w-full object-contain rounded" />` : getProductSvgIllustration(featured.iconType, featured.brand)}
          </div>
          <div class="space-y-1 flex-1">
            <div class="text-xs text-cyan-300 font-bold">${featured.category} • ${featured.brand}</div>
            <h3 class="font-extrabold text-sm sm:text-base leading-snug">${featured.name}</h3>
            <div class="text-lg font-black text-[#F5CD5F]">${formatPrice(featured.price, featured.hidePrice)}</div>
          </div>
        </div>
        <ul class="text-xs text-slate-300 space-y-1 pr-2">
          ${(featured.specs || []).slice(0, 3).map(s => `<li>✔️ ${s}</li>`).join('')}
        </ul>
        <div class="flex gap-2 pt-1">
          <button type="button" onclick="addToCart('${featured.id}')" class="flex-1 py-2 rounded-xl brand-gradient text-white font-bold text-xs">🛒 أضف للسلة</button>
          <button type="button" onclick="openProductDetailModal('${featured.id}')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold">التفاصيل</button>
        </div>
      `;
    }

    // Render Category Pills & Brand Filter
    function renderCategoriesAndBrands() {
      const catContainer = document.getElementById('categoryPillsContainer');
      if (catContainer) {
        const allCats = ['ALL', ...storeData.categories];
        catContainer.innerHTML = allCats.map(cat => {
          const active = selectedCategory === cat;
          const label = cat === 'ALL' ? '🌟 جميع الأقسام' : cat;
          return `<button type="button" onclick="selectCategoryPill('${cat}')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${active ? 'brand-gradient text-white shadow-md shadow-cyan-500/20' : 'bg-white dark:bg-[#1B263B] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-cyan-400'}">${label}</button>`;
        }).join('');
      }

      const brandSel = document.getElementById('brandFilterSelect');
      if (brandSel) {
        const currentVal = brandSel.value || 'ALL';
        brandSel.innerHTML = `<option value="ALL">جميع الماركات العالمية</option>` +
          storeData.brands.map(b => `<option value="${b}">${b}</option>`).join('');
        brandSel.value = storeData.brands.includes(currentVal) ? currentVal : 'ALL';
      }
    }

    function selectCategoryPill(cat) {
      selectedCategory = cat;
      renderCategoriesAndBrands();
      applyStoreFilters();
    }

    // Filter & Render Products Grid
    function applyStoreFilters() {
      const grid = document.getElementById('productsGrid');
      if (!grid) return;

      const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
      const brand = document.getElementById('brandFilterSelect')?.value || 'ALL';
      const stock = document.getElementById('stockFilterSelect')?.value || 'ALL';
      const sort = document.getElementById('sortSelect')?.value || 'featured';

      let list = storeData.products.filter(p => {
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        if (brand !== 'ALL' && p.brand !== brand) return false;
        if (stock !== 'ALL' && p.badge !== stock) return false;
        if (q) {
          const hay = `${p.name} ${p.category} ${p.brand} ${(p.specs || []).join(' ')} ${p.desc || ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      if (sort === 'price-asc') list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      else if (sort === 'price-desc') list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      else if (sort === 'newest') list.reverse();
      else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      const countBadge = document.getElementById('totalProductsCountBadge');
      if (countBadge) countBadge.textContent = `${list.length} صنف`;

      if (list.length === 0) {
        grid.innerHTML = `<div class="col-span-full bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3">
          <div class="text-3xl">🔍</div>
          <div class="font-bold text-base">لا توجد أصناف مطابقة لبحثك الحالي</div>
          <button type="button" onclick="resetFilters()" class="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold">عرض كافة الأصناف</button>
        </div>`;
        return;
      }

      grid.innerHTML = list.map(p => {
        const badgeColor = p.badge === 'عرض خاص' ? 'bg-amber-500 text-slate-950' :
                           p.badge === 'وصل حديثاً' ? 'bg-cyan-500 text-white' :
                           p.badge === 'كمية محدودة' ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        const inCompare = compareList.includes(p.id);
        return `
          <div class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <!-- Top Visual Box -->
              <div class="relative bg-slate-100 dark:bg-[#0A1522] p-4 h-44 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${badgeColor}">${p.badge || 'متوفر'}</span>
                <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-300 text-[11px] font-mono font-bold">${p.brand}</span>
                ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="max-h-36 max-w-full object-contain group-hover:scale-105 transition" />` : `<div class="group-hover:scale-105 transition">${getProductSvgIllustration(p.iconType, p.brand)}</div>`}
              </div>

              <!-- Card Body -->
              <div class="p-4 space-y-2.5">
                <div class="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">${p.category}</div>
                <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-2">${p.name}</h3>
                <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  ${(p.specs || []).slice(0, 3).map(s => `<li class="truncate">• ${s}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Price & Actions Footer -->
            <div class="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div class="flex items-baseline justify-between">
                <div>
                  <span class="text-lg font-black text-cyan-600 dark:text-cyan-400">${formatPrice(p.price, p.hidePrice)}</span>
                  ${(!p.hidePrice && storeData.settings.showPricesGlobal && p.oldPrice && Number(p.oldPrice) > Number(p.price))
                    ? `<span class="text-xs text-slate-400 line-through mr-1.5">${formatPrice(p.oldPrice, false)}</span>` : ''}
                </div>
                <button type="button" onclick="toggleCompareItem('${p.id}')" title="إضافة للمقارنة" class="text-xs px-2 py-1 rounded-lg border ${inCompare ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'}">
                  ⚖️ ${inCompare ? 'بالمقارنة' : 'قارن'}
                </button>
              </div>

              <div class="grid grid-cols-12 gap-1.5">
                <button type="button" onclick="addToCart('${p.id}')" class="col-span-7 py-2 px-3 rounded-xl brand-gradient text-white font-bold text-xs hover:opacity-95 transition flex items-center justify-center gap-1">
                  <span>🛒</span><span>أضف للسلة</span>
                </button>
                <button type="button" onclick="orderSingleProductWhatsapp('${p.id}')" title="طلب مباشر عبر واتساب" class="col-span-3 py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 font-bold text-xs transition flex items-center justify-center">
                  💬 واتس
                </button>
                <button type="button" onclick="openProductDetailModal('${p.id}')" title="عرض المواصفات الكاملة" class="col-span-2 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1B2A] hover:border-cyan-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center">
                  👁️
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function resetFilters() {
      selectedCategory = 'ALL';
      const s = document.getElementById('searchInput'); if (s) s.value = '';
      const b = document.getElementById('brandFilterSelect'); if (b) b.value = 'ALL';
      const st = document.getElementById('stockFilterSelect'); if (st) st.value = 'ALL';
      renderCategoriesAndBrands();
      applyStoreFilters();
    }

    // Product Detail Modal
    function openProductDetailModal(prodId) {
      const p = storeData.products.find(x => x.id === prodId);
      if (!p) return;
      document.getElementById('detailModalTitle').textContent = p.name;
      document.getElementById('detailModalBody').innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          <div class="sm:col-span-5 bg-slate-100 dark:bg-[#0D1B2A] rounded-2xl p-5 flex items-center justify-center border border-slate-200 dark:border-slate-800">
            ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="max-h-44 object-contain" />` : getProductSvgIllustration(p.iconType, p.brand)}
          </div>
          <div class="sm:col-span-7 space-y-2.5">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">${p.category}</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">${p.brand}</span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">${p.badge}</span>
            </div>
            <div class="text-2xl font-black text-cyan-400">${formatPrice(p.price, p.hidePrice)}</div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${p.desc || ''}</p>
          </div>
        </div>
        <div class="bg-slate-50 dark:bg-[#0D1B2A] rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <div class="font-extrabold text-sm mb-2 text-cyan-400">🛠️ المواصفات الفنية الكاملة:</div>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            ${(p.specs || []).map(s => `<li>✅ ${s}</li>`).join('')}
          </ul>
        </div>
        <div class="flex flex-wrap gap-3 pt-2">
          <button type="button" onclick="addToCart('${p.id}'); closeProductDetailModal();" class="flex-1 py-3 rounded-xl brand-gradient text-white font-extrabold text-sm">🛒 إضافة إلى السلة</button>
          <button type="button" onclick="orderSingleProductWhatsapp('${p.id}')" class="px-5 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm">💬 استفسار / طلب عبر واتساب</button>
        </div>
      `;
      document.getElementById('productDetailModal').classList.remove('hidden');
    }

    function closeProductDetailModal() {
      document.getElementById('productDetailModal').classList.add('hidden');
    }

    // Shopping Cart Logic
    function addToCart(prodId) {
      const p = storeData.products.find(x => x.id === prodId);
      if (!p) return;
      const existing = cart.find(item => item.id === prodId);
      if (existing) existing.qty += 1;
      else cart.push({ id: prodId, qty: 1 });
      updateCartBadge();
      showToast(`تمت إضافة "${p.name}" إلى السلة بنجاح 🛒`);
    }

    function updateCartQty(prodId, delta) {
      const idx = cart.findIndex(item => item.id === prodId);
      if (idx === -1) return;
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      updateCartBadge();
      renderCartModalItems();
    }

    function clearCart() {
      cart = [];
      updateCartBadge();
      renderCartModalItems();
    }

    function updateCartBadge() {
      const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
      const badge = document.getElementById('cartCountBadge');
      if (badge) badge.textContent = totalCount;
    }

    function openCartModal() {
      renderCartModalItems();
      document.getElementById('cartModal').classList.remove('hidden');
    }

    function closeCartModal() {
      document.getElementById('cartModal').classList.add('hidden');
    }

    function renderCartModalItems() {
      const container = document.getElementById('cartItemsContainer');
      const totalPrimary = document.getElementById('cartTotalPrimary');
      const totalSecondary = document.getElementById('cartTotalSecondary');
      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-slate-400">السلة فارغة حالياً — أضف منتجات من المتجر لإتمام الطلب أو طباعة عرض سعر.</div>`;
        if (totalPrimary) totalPrimary.textContent = '$0.00';
        if (totalSecondary) totalSecondary.textContent = '';
        return;
      }

      let sumUSD = 0;
      container.innerHTML = cart.map(item => {
        const p = storeData.products.find(x => x.id === item.id);
        if (!p) return '';
        const lineUSD = (Number(p.price) || 0) * item.qty;
        sumUSD += lineUSD;
        return `
          <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800">
            <div class="flex-1">
              <div class="font-bold text-xs sm:text-sm">${p.name}</div>
              <div class="text-xs text-cyan-500 font-semibold">${formatPrice(p.price, p.hidePrice)} × ${item.qty}</div>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="updateCartQty('${p.id}', -1)" class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 font-bold">-</button>
              <span class="font-bold text-sm w-6 text-center">${item.qty}</span>
              <button type="button" onclick="updateCartQty('${p.id}', 1)" class="w-7 h-7 rounded-lg bg-cyan-500 text-white font-bold">+</button>
            </div>
          </div>
        `;
      }).join('');

      const yerTotal = Math.round(sumUSD * (Number(storeData.settings.rateYER) || 2050)).toLocaleString('en-US');
      const sarTotal = Math.round(sumUSD * (Number(storeData.settings.rateSAR) || 3.75)).toLocaleString('en-US');
      if (totalPrimary) totalPrimary.textContent = formatPrice(sumUSD, false);
      if (totalSecondary) totalSecondary.textContent = `يعادل تقريباً: $${sumUSD.toLocaleString('en-US')} | ${yerTotal} ر.ي | ${sarTotal} ر.س`;
    }

    function orderSingleProductWhatsapp(prodId) {
      const p = storeData.products.find(x => x.id === prodId);
      if (!p) return;
      const msg = `مرحباً برونت كمبيوتر (ProNet Computer)،\nأود الاستفسار / طلب الصنف التالي:\n• الصنف: ${p.name}\n• القسم: ${p.category}\n• السعر المعروض: ${formatPrice(p.price, p.hidePrice)}`;
      const url = `https://wa.me/${storeData.settings.whatsappNumber || '967775043020'}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    }

    function sendCartViaWhatsapp() {
      if (cart.length === 0) {
        showToast('السلة فارغة! أضف أصنافاً أولاً.');
        return;
      }
      const name = document.getElementById('cartCustName')?.value || 'عميل المتجر الإلكتروني';
      const phone = document.getElementById('cartCustPhone')?.value || 'غير محدد';
      const addr = document.getElementById('cartCustAddress')?.value || 'عدن';
      const pay = document.getElementById('cartPaymentMethod')?.value || 'نقداً عند الاستلام';

      let sumUSD = 0;
      const lines = cart.map((item, idx) => {
        const p = storeData.products.find(x => x.id === item.id);
        if (!p) return '';
        sumUSD += (Number(p.price) || 0) * item.qty;
        return `${idx + 1}. ${p.name} (الكمية: ${item.qty}) - ${formatPrice(p.price * item.qty, p.hidePrice)}`;
      }).join('\n');

      const msg = `*طلب جديد من متجر برونت كمبيوتر الإلكتروني*\n` +
        `👤 العميل/الجهة: ${name}\n📱 الجوال: ${phone}\n📍 العنوان: ${addr}\n💳 طريقة الدفع: ${pay}\n\n` +
        `📦 *الأصناف المطلوبة:*\n${lines}\n\n` +
        `💰 *الإجمالي التقديري:* ${formatPrice(sumUSD, false)} ($${sumUSD})`;

      const url = `https://wa.me/${storeData.settings.whatsappNumber || '967775043020'}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      showToast('تم تجهيز رسالة الطلب لواتساب المبيعات بنجاح!');
    }

    function openPrintableQuotation() {
      if (cart.length === 0) {
        showToast('أضف صنفاً واحداً على الأقل لإصدار عرض السعر');
        return;
      }
      const name = document.getElementById('cartCustName')?.value || 'السادة / عميل برونت كمبيوتر المحترمين';
      const phone = document.getElementById('cartCustPhone')?.value || '-';
      const addr = document.getElementById('cartCustAddress')?.value || 'عدن';
      let sumUSD = 0;

      const rows = cart.map((item, i) => {
        const p = storeData.products.find(x => x.id === item.id);
        if (!p) return '';
        const unit = Number(p.price) || 0;
        const sub = unit * item.qty;
        sumUSD += sub;
        return `<tr class="border-b border-slate-200">
          <td class="py-2 px-2 font-bold">${i + 1}</td>
          <td class="py-2 px-2 font-bold">${p.name}<div class="text-xs text-slate-500">${(p.specs || []).slice(0, 2).join(' | ')}</div></td>
          <td class="py-2 px-2 text-center">${item.qty}</td>
          <td class="py-2 px-2">${formatPrice(unit, false)}</td>
          <td class="py-2 px-2 font-bold">${formatPrice(sub, false)}</td>
        </tr>`;
      }).join('');

      document.getElementById('quoteNumberText').textContent = 'رقم العرض: #PN-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('quotationModalContent').innerHTML = `
        <div class="bg-slate-100 p-3 rounded-xl flex flex-wrap justify-between gap-2 text-xs">
          <div><strong>مقدم إلى:</strong> ${name}</div>
          <div><strong>رقم التواصل:</strong> ${phone}</div>
          <div><strong>العنوان:</strong> ${addr}</div>
        </div>
        <table class="w-full text-right text-xs sm:text-sm border-collapse">
          <thead>
            <tr class="bg-[#0D1B2A] text-white">
              <th class="py-2 px-2">#</th>
              <th class="py-2 px-2">البيان / المواصفات</th>
              <th class="py-2 px-2 text-center">الكمية</th>
              <th class="py-2 px-2">سعر الوحدة</th>
              <th class="py-2 px-2">الإجمالي</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="flex justify-end pt-3">
          <div class="bg-[#0D1B2A] text-white px-5 py-3 rounded-xl text-left">
            <div class="text-xs text-cyan-300">الإجمالي الكلي لعرض السعر:</div>
            <div class="text-xl font-black">${formatPrice(sumUSD, false)} (${sumUSD.toLocaleString('en-US')} USD)</div>
          </div>
        </div>
      `;
      document.getElementById('quotationModal').classList.remove('hidden');
    }

    function closeQuotationModal() {
      document.getElementById('quotationModal').classList.add('hidden');
    }

    // Compare Feature
    function toggleCompareItem(prodId) {
      const idx = compareList.indexOf(prodId);
      if (idx > -1) compareList.splice(idx, 1);
      else {
        if (compareList.length >= 4) {
          showToast('يمكنك مقارنة 4 منتجات كحد أقصى في نفس الوقت');
          return;
        }
        compareList.push(prodId);
      }
      const badge = document.getElementById('compareCountBadge');
      if (badge) {
        badge.textContent = compareList.length;
        badge.classList.toggle('hidden', compareList.length === 0);
      }
      applyStoreFilters();
    }

    function openCompareModal() {
      if (compareList.length === 0) {
        showToast('اختر زر "قارن" على أي منتجين أو أكثر لعرض جدول المقارنة');
        return;
      }
      const items = compareList.map(id => storeData.products.find(p => p.id === id)).filter(Boolean);
      document.getElementById('compareModalBody').innerHTML = `
        <table class="w-full text-right text-xs sm:text-sm border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="p-3 bg-slate-100 dark:bg-[#0D1B2A]">المعيار</th>
              ${items.map(p => `<th class="p-3 font-black text-cyan-400">${p.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td class="p-3 font-bold">السعر</td>
              ${items.map(p => `<td class="p-3 font-extrabold text-amber-400">${formatPrice(p.price, p.hidePrice)}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold">القسم والماركة</td>
              ${items.map(p => `<td class="p-3">${p.category} (${p.brand})</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold">المواصفات</td>
              ${items.map(p => `<td class="p-3"><ul class="space-y-1">${(p.specs || []).map(s => `<li>• ${s}</li>`).join('')}</ul></td>`).join('')}
            </tr>
          </tbody>
        </table>
      `;
      document.getElementById('compareModal').classList.remove('hidden');
    }

    function closeCompareModal() {
      document.getElementById('compareModal').classList.add('hidden');
    }

    function clearCompareList() {
      compareList = [];
      const badge = document.getElementById('compareCountBadge');
      if (badge) badge.classList.add('hidden');
      closeCompareModal();
      applyStoreFilters();
    }

    // B2B RFQ Actions
    function getFormattedRfqMessage() {
      const org = document.getElementById('rfqOrgName')?.value || 'جهة/شركة';
      const person = document.getElementById('rfqContactPerson')?.value || '-';
      const phone = document.getElementById('rfqPhone')?.value || '-';
      const email = document.getElementById('rfqEmail')?.value || '-';
      const type = document.getElementById('rfqProjectType')?.value || '-';
      const details = document.getElementById('rfqDetails')?.value || '-';
      return `*طلب عرض سعر رسمي (RFQ) - برونت كمبيوتر*\n` +
             `🏢 الجهة: ${org}\n👤 المسؤول: ${person}\n📱 الهاتف: ${phone}\n✉️ البريد: ${email}\n🛠️ نوع المشروع: ${type}\n📝 التفاصيل والكميات:\n${details}`;
    }

    function submitRfqWhatsapp() {
      const msg = getFormattedRfqMessage();
      window.open(`https://wa.me/${storeData.settings.whatsappNumber || '967775043020'}?text=${encodeURIComponent(msg)}`, '_blank');
      showToast('تم فتح واتساب لإرسال طلب عرض السعر الرسمي');
    }

    function copyRfqText() {
      const msg = getFormattedRfqMessage();
      copyTextToClipboard(msg);
      showToast('تم نسخ نص طلب عرض السعر للحافظة بنجاح!');
    }

    // Render Posts Section
    function renderPostsSection() {
      const grid = document.getElementById('postsGridContainer');
      if (!grid) return;
      grid.innerHTML = storeData.posts.map(post => `
        <article class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">${post.tag || 'عروض برونت'}</span>
              <span class="text-slate-400">${post.date || ''}</span>
            </div>
            <h3 class="text-base sm:text-lg font-extrabold leading-snug">${post.title}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${post.content}</p>
          </div>
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="font-bold text-amber-400">برونت كمبيوتر... خدمات بإتقان</span>
            <a href="https://wa.me/${storeData.settings.whatsappNumber || '967775043020'}?text=${encodeURIComponent('استفسار حول عرض: ' + post.title)}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 font-bold hover:underline">💬 اطلب العرض الآن</a>
          </div>
        </article>
      `).join('');
    }

    // ==================== ADMIN DASHBOARD FUNCTIONS ====================
    function populateAdminInputs() {
      const s = storeData.settings;
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
      setVal('admAnnouncementInput', s.announcement);
      setVal('admHeroTitleInput', s.heroTitle);
      setVal('admHeroBadgeInput', s.heroBadge);
      setVal('admHeroSubtitleInput', s.heroSubtitle);
      setVal('admDefaultCurrency', s.defaultCurrency);
      setVal('admRateYER', s.rateYER);
      setVal('admRateSAR', s.rateSAR);
      setVal('admPrimaryColor', s.primaryColor || '#00A8FF');
      setVal('admSecondaryColor', s.secondaryColor || '#38B6FF');
      setVal('admWhatsappNumber', s.whatsappNumber);
      setVal('admSloganInput', s.slogan);
      const chk = document.getElementById('admShowPricesGlobal');
      if (chk) chk.checked = !!s.showPricesGlobal;

      // KPIs
      document.getElementById('kpiTotalProducts').textContent = storeData.products.length;
      document.getElementById('kpiTotalCategories').textContent = storeData.categories.length;
      document.getElementById('kpiTotalPosts').textContent = storeData.posts.length;
      document.getElementById('kpiExchangeRate').textContent = `${s.rateYER} ر.ي`;

      renderAdminProductsTable();
      renderAdminCategoriesAndBrands();
      renderAdminPostsList();
    }

    function renderAdminProductsTable() {
      const tbody = document.getElementById('adminProductsTableBody');
      if (!tbody) return;
      const q = (document.getElementById('adminProductSearch')?.value || '').trim().toLowerCase();
      const filtered = storeData.products.filter(p => !q || `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(q));

      tbody.innerHTML = filtered.map(p => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td class="py-3 px-2 font-bold">${p.name}</td>
          <td class="py-3 px-2">${p.category}</td>
          <td class="py-3 px-2 font-mono text-cyan-400">${p.brand}</td>
          <td class="py-3 px-2">
            <input type="number" value="${p.price}" onchange="quickUpdateProductPrice('${p.id}', this.value)" class="w-20 rounded-lg bg-slate-100 dark:bg-[#0D1B2A] border border-slate-300 dark:border-slate-700 px-2 py-1 font-bold text-cyan-400" />
          </td>
          <td class="py-3 px-2">
            <input type="checkbox" ${!p.hidePrice ? 'checked' : ''} onchange="quickToggleProductPriceVisibility('${p.id}', this.checked)" class="w-4 h-4 accent-cyan-500" />
          </td>
          <td class="py-3 px-2">
            <span class="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold">${p.badge}</span>
          </td>
          <td class="py-3 px-2 flex items-center gap-1.5">
            <button type="button" onclick="openProductEditorModal('${p.id}')" class="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">✏️ تعديل</button>
            <button type="button" onclick="deleteProduct('${p.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs">🗑️ حذف</button>
          </td>
        </tr>
      `).join('');
    }

    function quickUpdateProductPrice(prodId, newPrice) {
      const p = storeData.products.find(x => x.id === prodId);
      if (!p) return;
      p.price = Number(newPrice) || 0;
      saveStoreData();
      showToast(`تم تحديث سعر "${p.name}" إلى $${p.price}`);
    }

    function quickToggleProductPriceVisibility(prodId, showPrice) {
      const p = storeData.products.find(x => x.id === prodId);
      if (!p) return;
      p.hidePrice = !showPrice;
      saveStoreData();
      showToast(showPrice ? 'تم تفعيل إظهار السعر للصنف' : 'تم إخفاء السعر وتفعيل زر التواصل');
    }

    function openProductEditorModal(prodId) {
      const catSel = document.getElementById('editProdCategory');
      const brandSel = document.getElementById('editProdBrand');
      if (catSel) catSel.innerHTML = storeData.categories.map(c => `<option value="${c}">${c}</option>`).join('');
      if (brandSel) brandSel.innerHTML = storeData.brands.map(b => `<option value="${b}">${b}</option>`).join('');

      const p = prodId ? storeData.products.find(x => x.id === prodId) : null;
      document.getElementById('productEditorTitle').textContent = p ? '✏️ تعديل بيانات الصنف' : '➕ إضافة صنف جديد للمتجر';
      document.getElementById('editProdId').value = p ? p.id : '';
      document.getElementById('editProdName').value = p ? p.name : '';
      if (p && catSel) catSel.value = p.category;
      if (p && brandSel) brandSel.value = p.brand;
      document.getElementById('editProdPrice').value = p ? p.price : '';
      document.getElementById('editProdOldPrice').value = p ? (p.oldPrice || '') : '';
      document.getElementById('editProdBadge').value = p ? (p.badge || 'متوفر') : 'متوفر';
      document.getElementById('editProdIconType').value = p ? (p.iconType || 'router') : 'router';
      document.getElementById('editProdHidePrice').checked = p ? !!p.hidePrice : false;
      document.getElementById('editProdSpecs').value = p ? (p.specs || []).join('\n') : '';
      document.getElementById('editProdDesc').value = p ? (p.desc || '') : '';
      document.getElementById('editProdImageUrl').value = p ? (p.imageUrl || '') : '';

      document.getElementById('productEditorModal').classList.remove('hidden');
    }

    function closeProductEditorModal() {
      document.getElementById('productEditorModal').classList.add('hidden');
    }

    function handleProductImageUpload(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('editProdImageUrl').value = e.target.result;
        showToast('تم إرفاق صورة الصنف بنجاح!');
      };
      reader.readAsDataURL(file);
    }

    function saveProductFromModal() {
      const name = document.getElementById('editProdName').value.trim();
      if (!name) {
        showToast('يرجى إدخال اسم الصنف أولاً');
        return;
      }
      const id = document.getElementById('editProdId').value || ('p' + Date.now());
      const specsRaw = document.getElementById('editProdSpecs').value;
      const specs = specsRaw.split(/\n|،|,/).map(s => s.trim()).filter(Boolean);

      const prodObj = {
        id,
        name,
        category: document.getElementById('editProdCategory').value,
        brand: document.getElementById('editProdBrand').value,
        price: Number(document.getElementById('editProdPrice').value) || 0,
        oldPrice: Number(document.getElementById('editProdOldPrice').value) || 0,
        badge: document.getElementById('editProdBadge').value,
        iconType: document.getElementById('editProdIconType').value,
        hidePrice: document.getElementById('editProdHidePrice').checked,
        specs: specs.length ? specs : ['ضمان وجودة برونت كمبيوتر'],
        desc: document.getElementById('editProdDesc').value.trim(),
        imageUrl: document.getElementById('editProdImageUrl').value.trim(),
        featured: true
      };

      const existingIdx = storeData.products.findIndex(x => x.id === id);
      if (existingIdx > -1) storeData.products[existingIdx] = prodObj;
      else storeData.products.unshift(prodObj);

      saveStoreData();
      populateAdminInputs();
      closeProductEditorModal();
      showToast('تم حفظ الصنف وتحديث المتجر فوراً!');
    }

    function deleteProduct(prodId) {
      storeData.products = storeData.products.filter(x => x.id !== prodId);
      saveStoreData();
      populateAdminInputs();
      showToast('تم حذف الصنف من المتجر');
    }

    // Categories & Brands Admin
    function renderAdminCategoriesAndBrands() {
      const catList = document.getElementById('adminCategoriesList');
      if (catList) {
        catList.innerHTML = storeData.categories.map((c, idx) => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            <span class="font-bold">${c}</span>
            <button type="button" onclick="removeCategory(${idx})" class="text-rose-400 hover:underline text-xs font-bold">حذف</button>
          </div>
        `).join('');
      }
      const brandList = document.getElementById('adminBrandsList');
      if (brandList) {
        brandList.innerHTML = storeData.brands.map((b, idx) => `
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <span>${b}</span>
            <button type="button" onclick="removeBrand(${idx})" class="text-rose-400">✕</button>
          </span>
        `).join('');
      }
    }

    function addCategory() {
      const inp = document.getElementById('newCategoryInput');
      const val = inp?.value.trim();
      if (!val) return;
      if (!storeData.categories.includes(val)) storeData.categories.push(val);
      inp.value = '';
      saveStoreData();
      populateAdminInputs();
      showToast('تمت إضافة القسم الجديد بنجاح');
    }

    function removeCategory(idx) {
      storeData.categories.splice(idx, 1);
      saveStoreData();
      populateAdminInputs();
    }

    function addBrand() {
      const inp = document.getElementById('newBrandInput');
      const val = inp?.value.trim();
      if (!val) return;
      if (!storeData.brands.includes(val)) storeData.brands.push(val);
      inp.value = '';
      saveStoreData();
      populateAdminInputs();
      showToast('تمت إضافة الماركة بنجاح');
    }

    function removeBrand(idx) {
      storeData.brands.splice(idx, 1);
      saveStoreData();
      populateAdminInputs();
    }

    // Posts & Hero Admin
    function saveHeroSettings() {
      storeData.settings.announcement = document.getElementById('admAnnouncementInput').value.trim();
      storeData.settings.heroTitle = document.getElementById('admHeroTitleInput').value.trim();
      storeData.settings.heroBadge = document.getElementById('admHeroBadgeInput').value.trim();
      storeData.settings.heroSubtitle = document.getElementById('admHeroSubtitleInput').value.trim();
      saveStoreData();
      showToast('تم تحديث نصوص البنر الرئيسي وشريط الإعلانات!');
    }

    function renderAdminPostsList() {
      const container = document.getElementById('adminPostsList');
      if (!container) return;
      container.innerHTML = storeData.posts.map(p => `
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span>${p.tag}</span><span>${p.date}</span>
          </div>
          <div class="font-extrabold text-sm">${p.title}</div>
          <p class="text-xs text-slate-400 line-clamp-2">${p.content}</p>
          <div class="flex gap-2 pt-2">
            <button type="button" onclick="openPostEditorModal('${p.id}')" class="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold">✏️ تعديل</button>
            <button type="button" onclick="deletePost('${p.id}')" class="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold">🗑️ حذف</button>
          </div>
        </div>
      `).join('');
    }

    function openPostEditorModal(postId) {
      const p = postId ? storeData.posts.find(x => x.id === postId) : null;
      document.getElementById('editPostId').value = p ? p.id : '';
      document.getElementById('editPostTitle').value = p ? p.title : '';
      document.getElementById('editPostTag').value = p ? p.tag : 'عروض برونت';
      document.getElementById('editPostDate').value = p ? p.date : 'أكتوبر 2026';
      document.getElementById('editPostContent').value = p ? p.content : '';
      document.getElementById('postEditorModal').classList.remove('hidden');
    }

    function closePostEditorModal() {
      document.getElementById('postEditorModal').classList.add('hidden');
    }

    function savePostFromModal() {
      const title = document.getElementById('editPostTitle').value.trim();
      const content = document.getElementById('editPostContent').value.trim();
      if (!title || !content) {
        showToast('يرجى إدخال عنوان ونص المنشور');
        return;
      }
      const id = document.getElementById('editPostId').value || ('post' + Date.now());
      const obj = {
        id,
        title,
        tag: document.getElementById('editPostTag').value.trim() || 'عروض برونت',
        date: document.getElementById('editPostDate').value.trim() || 'أكتوبر 2026',
        content
      };
      const idx = storeData.posts.findIndex(x => x.id === id);
      if (idx > -1) storeData.posts[idx] = obj;
      else storeData.posts.unshift(obj);

      saveStoreData();
      populateAdminInputs();
      closePostEditorModal();
      showToast('تم حفظ ونشر العرض في الموقع!');
    }

    function deletePost(postId) {
      storeData.posts = storeData.posts.filter(x => x.id !== postId);
      saveStoreData();
      populateAdminInputs();
      showToast('تم حذف المنشور');
    }

    // Theme & Currency Settings
    function applyThemePreset(primary, secondary, navy) {
      storeData.settings.primaryColor = primary;
      storeData.settings.secondaryColor = secondary;
      storeData.settings.navyColor = navy;
      saveStoreData();
      populateAdminInputs();
      showToast('تم تطبيق ثيم الألوان الجديد على المتجر!');
    }

    function updateCustomColors() {
      storeData.settings.primaryColor = document.getElementById('admPrimaryColor').value;
      storeData.settings.secondaryColor = document.getElementById('admSecondaryColor').value;
      saveStoreData();
    }

    function saveCurrencyAndContactSettings() {
      storeData.settings.defaultCurrency = document.getElementById('admDefaultCurrency').value;
      storeData.settings.rateYER = Number(document.getElementById('admRateYER').value) || 2050;
      storeData.settings.rateSAR = Number(document.getElementById('admRateSAR').value) || 3.75;
      storeData.settings.showPricesGlobal = document.getElementById('admShowPricesGlobal').checked;
      storeData.settings.whatsappNumber = document.getElementById('admWhatsappNumber').value.trim() || '967775043020';
      storeData.settings.slogan = document.getElementById('admSloganInput').value.trim() || 'خدمات بإتقان';
      activeCurrency = storeData.settings.defaultCurrency;
      const sel = document.getElementById('currencySelect');
      if (sel) sel.value = activeCurrency;
      saveStoreData();
      populateAdminInputs();
      showToast('تم حفظ إعدادات العملات وسعر الصرف وخصائص المتجر!');
    }

    // GitHub API Push & File Export/Import
    async function pushDataToGithub() {
      const repo = document.getElementById('ghRepoInput')?.value.trim() || 'ProNetComputer/ProNet_Store';
      const branch = document.getElementById('ghBranchInput')?.value.trim() || 'main';
      const token = document.getElementById('ghTokenInput')?.value.trim();
      const statusBox = document.getElementById('githubSyncStatusBox');
      if (statusBox) statusBox.classList.remove('hidden');

      if (!token) {
        if (statusBox) statusBox.textContent = '⚠️ يرجى إدخال رمز الوصول الشخصي (GitHub Personal Access Token) للدفع المباشر، أو اضغط على زر "تنزيل الموقع الكامل المحدث (index.html)" لرفعه يدوياً إلى مستودع ProNetComputer/ProNet_Store.';
        showToast('أدخل GitHub Token أو قم بتنزيل ملف index.html المحدث');
        return;
      }

      try {
        if (statusBox) statusBox.textContent = '⏳ جاري الاتصال بـ GitHub API وتحديث ملف data/store_data.json...';
        const apiUrl = `https://api.github.com/repos/${repo}/contents/data/store_data.json`;
        let sha = undefined;
        const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
        });
        if (getRes.ok) {
          const existing = await getRes.json();
          sha = existing.sha;
        }
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(storeData, null, 2))));
        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'Update ProNet Store catalog & settings via Admin Dashboard',
            content: contentBase64,
            branch,
            ...(sha ? { sha } : {})
          })
        });
        if (putRes.ok) {
          if (statusBox) statusBox.textContent = `✅ تم دفع التحديثات بنجاح إلى المستودع ${repo} على الفرع ${branch}!`;
          showToast('تمت المزامنة مع GitHub بنجاح!');
        } else {
          const err = await putRes.text();
          if (statusBox) statusBox.textContent = `❌ تعذر الدفع المباشر (${putRes.status}): تأكد من صلاحية الرمز repo scope. تفاصيل: ${err}`;
        }
      } catch (e) {
        if (statusBox) statusBox.textContent = `❌ تعذر الاتصال بـ GitHub API: ${e.message}`;
      }
    }

    function exportStoreJson() {
      const blob = new Blob([JSON.stringify(storeData, null, 2)], { type: 'application/json' });
      triggerDownload(blob, 'store_data.json');
      showToast('تم تصدير قاعدة بيانات المتجر (store_data.json)');
    }

    function exportProductsCsv() {
      const headers = ['ID', 'Name', 'Category', 'Brand', 'Price_USD', 'Badge', 'Specs'];
      const rows = storeData.products.map(p => [
        p.id,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${(p.brand || '').replace(/"/g, '""')}"`,
        p.price,
        `"${(p.badge || '').replace(/"/g, '""')}"`,
        `"${(p.specs || []).join(' | ').replace(/"/g, '""')}"`
      ].join(','));
      const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      triggerDownload(blob, 'pronet_products_catalog.csv');
      showToast('تم تصدير جدول الأصناف بصيغة CSV المتوافقة مع Excel');
    }

    function exportFullStandaloneHtml() {
      let htmlSource = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      const updatedDefaultJson = JSON.stringify(storeData, null, 2);
      htmlSource = htmlSource.replace(/const DEFAULT_STORE_DATA = \{[\s\S]*?\n    \};/, `const DEFAULT_STORE_DATA = ${updatedDefaultJson};`);
      const blob = new Blob([htmlSource], { type: 'text/html;charset=utf-8' });
      triggerDownload(blob, 'index.html');
      showToast('تم تنزيل ملف index.html المحدث والجاهز للرفع المباشر إلى GitHub!');
    }

    function importStoreJson(event) {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.products && parsed.settings) {
            storeData = parsed;
            saveStoreData();
            populateAdminInputs();
            showToast('تم استيراد قاعدة بيانات المتجر بنجاح!');
          } else {
            showToast('ملف JSON غير صالح');
          }
        } catch (err) {
          showToast('خطأ في قراءة ملف JSON');
        }
      };
      reader.readAsText(file);
    }

    function resetToDefaultStoreData() {
      storeData = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
      saveStoreData();
      populateAdminInputs();
      showToast('تمت استعادة البيانات الافتراضية لمتجر برونت كمبيوتر');
    }

    function triggerDownload(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function copyTextToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }

    let toastTimer = null;
    function showToast(msg) {
      const box = document.getElementById('toastBox');
      if (!box) return;
      box.textContent = msg;
      box.classList.remove('hidden');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => box.classList.add('hidden'), 3200);
    }

    function renderAllViews() {
      renderHeroFeatured();
      renderCategoriesAndBrands();
      applyStoreFilters();
      renderPostsSection();
      updateCartBadge();
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
      applySiteSettingsToDOM();
      const sel = document.getElementById('currencySelect');
      if (sel) sel.value = activeCurrency;
      renderAllViews();
    });
