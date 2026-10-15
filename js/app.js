    // Role-Based Access Control (RBAC) Configuration for Separate /admin Page
    const ADMIN_ROLES_CONFIG = {
      designer: {
        username: 'designer',
        displayName: 'المصمم والمهندس المطور',
        roleTitle: 'المصمم — كامل الصلاحية',
        icon: '🎨',
        badgeClass: 'bg-cyan-500 text-white',
        description: 'كامل الصلاحية (100%): إدارة التصميم والهوية البصرية، السلايدر، شريط الماركات، الأقسام والأصناف والتسعير، المنشورات، المستخدمين، والمزامنة البرمجية مع GitHub.',
        allowedTabs: ['products', 'categories', 'posts', 'support', 'settings', 'users', 'github'],
        canEditPrices: true,
        canDeleteItems: true,
        canExportSite: true
      },
      management: {
        username: 'management',
        displayName: 'م. عمار محمد سعيد الأسدي',
        roleTitle: 'الإدارة العامة — كامل الصلاحية',
        icon: '👨‍💼',
        badgeClass: 'bg-amber-500 text-slate-950',
        description: 'كامل الصلاحية (100%): المدير التنفيذي - تحكم شامل في الأصناف، التسعير، العملات وسعر الصرف، الأقسام والماركات، المنشورات، المستخدمين والصلاحيات، والتصدير.',
        allowedTabs: ['products', 'categories', 'posts', 'support', 'settings', 'users', 'github'],
        canEditPrices: true,
        canDeleteItems: true,
        canExportSite: true
      },
      sales: {
        username: 'sales',
        displayName: 'موظف قسم المبيعات',
        roleTitle: 'المبيعات — الأصناف والتسعير والعروض',
        icon: '💼',
        badgeClass: 'bg-emerald-500 text-white',
        description: 'صلاحيات المبيعات: إدارة الأصناف والتسعير والخصومات، تحديث حالة التوفر، وإضافة المنشورات والعروض الترويجية للعملاء.',
        allowedTabs: ['products', 'categories', 'posts'],
        canEditPrices: true,
        canDeleteItems: false,
        canExportSite: false
      },
      support: {
        username: 'support',
        displayName: 'مهندس الدعم الفني والصيانة',
        roleTitle: 'الدعم الفني — المواصفات والمشاريع والصيانة',
        icon: '🛠️',
        badgeClass: 'bg-purple-500 text-white',
        description: 'صلاحيات الدعم الفني: تحديث المواصفات الفنية للأجهزة، متابعة تذاكر الصيانة والتركيبات الهندسية، ونشر الإرشادات التقنية (بدون صلاحية تعديل الأسعار).',
        allowedTabs: ['products', 'support', 'posts'],
        canEditPrices: false,
        canDeleteItems: false,
        canExportSite: false
      }
    };

    // Runtime State
    let storeData = loadStoreData();
    let activeCurrency = storeData.settings.defaultCurrency || 'USD';
    let selectedCategory = 'ALL';
    let homeShowcaseFilter = 'ALL';
    let currentSlideIdx = 0;
    let heroSlideInterval = null;
    let cart = [];
    let compareList = [];
    let currentAdminUser = null; // null when logged out
    let revealedUserPasswords = {}; // tracks revealed passwords in admin users table

    function normalizeUsersArray(usersList) {
      const defaults = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.users));
      if (!Array.isArray(usersList) || usersList.length === 0) return defaults;
      return usersList.map((u, idx) => {
        const fallback = defaults.find(d => d.username === u.username || d.roleKey === u.roleKey) || defaults[idx] || defaults[0];
        const tabs = Array.isArray(u.allowedTabs) ? [...u.allowedTabs] : [...(fallback.allowedTabs || ['products', 'profile'])];
        if (!tabs.includes('profile')) tabs.push('profile');
        return {
          id: u.id || fallback.id || ('u_' + Date.now() + '_' + idx),
          roleKey: u.roleKey || u.username || fallback.roleKey || 'staff',
          username: (u.username || fallback.username || ('user' + idx)).trim(),
          password: (u.password !== undefined && String(u.password).trim() !== '') ? String(u.password) : 'pronet2026',
          displayName: u.displayName || fallback.displayName || 'مستخدم النظام',
          roleTitle: u.roleTitle || fallback.roleTitle || 'موظف — صلاحية مخصصة',
          phone: u.phone !== undefined ? u.phone : (fallback.phone || ''),
          icon: u.icon || fallback.icon || '👤',
          badgeClass: u.badgeClass || fallback.badgeClass || 'bg-cyan-500 text-white',
          description: u.description || fallback.description || 'صلاحيات مخصصة في لوحة التحكم.',
          allowedTabs: tabs,
          canEditPrices: u.canEditPrices !== undefined ? !!u.canEditPrices : !!fallback.canEditPrices,
          canDeleteItems: u.canDeleteItems !== undefined ? !!u.canDeleteItems : !!fallback.canDeleteItems,
          canExportSite: u.canExportSite !== undefined ? !!u.canExportSite : !!fallback.canExportSite,
          active: u.active !== undefined ? !!u.active : true
        };
      });
    }

    function loadStoreData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.products && parsed.settings) {
            if (!parsed.slides) parsed.slides = DEFAULT_STORE_DATA.slides;
            if (!parsed.businessAreas) parsed.businessAreas = DEFAULT_STORE_DATA.businessAreas;
            if (!parsed.projects) parsed.projects = DEFAULT_STORE_DATA.projects;
            if (!parsed.supportTickets) parsed.supportTickets = DEFAULT_STORE_DATA.supportTickets;
            if (parsed.settings.showQuickLoginDemo === undefined) parsed.settings.showQuickLoginDemo = true;
            parsed.users = normalizeUsersArray(parsed.users);
            return parsed;
          }
        }
      } catch (e) {}
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
      fresh.users = normalizeUsersArray(fresh.users);
      return fresh;
    }

    function getUsersList() {
      if (!storeData.users || !Array.isArray(storeData.users)) {
        storeData.users = normalizeUsersArray([]);
      }
      return storeData.users;
    }

    function findUserByIdentifier(ident) {
      if (!ident) return null;
      const clean = String(ident).trim().toLowerCase();
      return getUsersList().find(u =>
        String(u.id).toLowerCase() === clean ||
        String(u.username).toLowerCase() === clean ||
        String(u.roleKey || '').toLowerCase() === clean
      ) || null;
    }

    function saveStoreData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
      } catch (e) {}
      applySiteSettingsToDOM();
      renderAllViews();
    }

    // Custom Brand Logo SVGs for the Brands Bar below Hero Slider
    function getBrandLogoBadgeSvg(brand) {
      const b = (brand || '').toLowerCase();
      let color = '#00A8FF';
      let sub = 'OFFICIAL PARTNER';
      if (b.includes('hp')) { color = '#0096D6'; sub = 'BUSINESS & LASERJET'; }
      else if (b.includes('dell')) { color = '#007DB8'; sub = 'LATITUDE & OPTIPLEX'; }
      else if (b.includes('lenovo')) { color = '#E2231A'; sub = 'THINKPAD & IDEAPAD'; }
      else if (b.includes('asus')) { color = '#00539B'; sub = 'EXPERTBOOK & ROG'; }
      else if (b.includes('mikrotik')) { color = '#29B6F6'; sub = 'ROUTEROS & SWITCHING'; }
      else if (b.includes('ubiquiti')) { color = '#0559C9'; sub = 'UNIFI & AIRMAX'; }
      else if (b.includes('starlink')) { color = '#38BDF8'; sub = 'SATELLITE INTERNET'; }
      else if (b.includes('hikvision')) { color = '#EF4444'; sub = 'COLORVU & IP SECURITY'; }
      else if (b.includes('dahua')) { color = '#DC2626'; sub = 'CCTV & ACCESS CONTROL'; }
      else if (b.includes('tp-link')) { color = '#06B6D4'; sub = 'WIFI & 4G ROUTERS'; }
      else if (b.includes('moon')) { color = '#F59E0B'; sub = 'OUTDOOR WIFI 6'; }
      else if (b.includes('speeder')) { color = '#10B981'; sub = 'GIGABIT SWITCHES'; }
      else if (b.includes('maxma')) { color = '#EAB308'; sub = 'AVR & POWER UPS'; }
      else if (b.includes('delux')) { color = '#8B5CF6'; sub = 'ACCESSORIES & NVME'; }

      return `
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm" style="background:${color}">
            ${brand.slice(0, 2).toUpperCase()}
          </div>
          <div class="text-right overflow-hidden">
            <div class="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">${brand}</div>
            <div class="text-[9px] font-mono text-slate-400 truncate">${sub}</div>
          </div>
        </div>
      `;
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
      setTxt('aboutAddressText', s.address);
      setTxt('aboutLandlineText', s.landline);
      setTxt('aboutEmailText', s.email);
      setTxt('exchangeRateInfoBadge', `سعر الصرف: 1$ = ${s.rateYER} ر.ي | ${s.rateSAR} ر.س`);

      // Sync first slide text with settings
      if (storeData.slides && storeData.slides.length > 0) {
        storeData.slides[0].badge = s.heroBadge || storeData.slides[0].badge;
        storeData.slides[0].title = s.heroTitle || storeData.slides[0].title;
        storeData.slides[0].subtitle = s.heroSubtitle || storeData.slides[0].subtitle;
      }
      renderHeroSlider();
    }

    // ==================== HERO SLIDER / CAROUSEL ====================
    function renderHeroSlider() {
      const slides = storeData.slides || DEFAULT_STORE_DATA.slides;
      if (!slides.length) return;
      if (currentSlideIdx >= slides.length) currentSlideIdx = 0;
      const slide = slides[currentSlideIdx];

      const imgEl = document.getElementById('heroSlideImg');
      const badgeEl = document.getElementById('heroSlideBadge');
      const titleEl = document.getElementById('heroSlideTitle');
      const subEl = document.getElementById('heroSlideSubtitle');
      const dotsEl = document.getElementById('heroSliderDots');

      if (imgEl && slide.image) imgEl.src = slide.image;
      if (badgeEl) badgeEl.textContent = slide.badge;
      if (titleEl) titleEl.textContent = slide.title;
      if (subEl) subEl.textContent = slide.subtitle;

      if (dotsEl) {
        dotsEl.innerHTML = slides.map((s, idx) => `
          <button type="button" onclick="goToHeroSlide(${idx})" class="h-2.5 rounded-full transition-all ${idx === currentSlideIdx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-slate-600 hover:bg-slate-400'}" title="شريحة ${idx + 1}"></button>
        `).join('');
      }
    }

    function nextHeroSlide() {
      const slides = storeData.slides || DEFAULT_STORE_DATA.slides;
      currentSlideIdx = (currentSlideIdx + 1) % slides.length;
      renderHeroSlider();
      restartHeroSliderTimer();
    }

    function prevHeroSlide() {
      const slides = storeData.slides || DEFAULT_STORE_DATA.slides;
      currentSlideIdx = (currentSlideIdx - 1 + slides.length) % slides.length;
      renderHeroSlider();
      restartHeroSliderTimer();
    }

    function goToHeroSlide(idx) {
      currentSlideIdx = idx;
      renderHeroSlider();
      restartHeroSliderTimer();
    }

    function restartHeroSliderTimer() {
      if (heroSlideInterval) clearInterval(heroSlideInterval);
      heroSlideInterval = setInterval(() => {
        const slides = storeData.slides || DEFAULT_STORE_DATA.slides;
        currentSlideIdx = (currentSlideIdx + 1) % slides.length;
        renderHeroSlider();
      }, 6500);
    }

    // ==================== BRANDS LOGO STRIP BELOW HERO ====================
    function renderBrandsLogoStrip() {
      const container = document.getElementById('brandsLogoStripContainer');
      if (!container) return;
      container.innerHTML = storeData.brands.map(brand => `
        <button type="button" onclick="filterByBrandFromHome('${brand}')" class="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-md transition group text-right">
          ${getBrandLogoBadgeSvg(brand)}
        </button>
      `).join('');
    }

    function filterByBrandFromHome(brand) {
      switchMainTab('store');
      selectedCategory = 'ALL';
      renderCategoriesAndBrands();
      const brandSel = document.getElementById('brandFilterSelect');
      if (brandSel) brandSel.value = brand;
      applyStoreFilters();
      if (brand !== 'ALL') {
        showToast(`تم عرض منتجات الماركة العالمية: ${brand}`);
      }
    }

    // ==================== BUSINESS AREAS & SERVICES ====================
    function renderBusinessAreasAndServices() {
      const areas = storeData.businessAreas || DEFAULT_STORE_DATA.businessAreas;
      const homeGrid = document.getElementById('homeBusinessAreasGrid');
      if (homeGrid) {
        homeGrid.innerHTML = areas.map(a => `
          <div class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700 hover:border-cyan-400 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg transition group">
            <div class="space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition">${a.icon}</div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">${a.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">${a.desc}</p>
            </div>
            <button type="button" onclick="openBusinessAreaCategory('${a.categoryFilter}')" class="text-xs font-extrabold text-cyan-500 hover:text-cyan-400 flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>معرفة تفاصيل الخدمة وتصفح الأصناف</span>
              <span>←</span>
            </button>
          </div>
        `).join('');
      }

      const fullGrid = document.getElementById('fullServicesGrid');
      if (fullGrid) {
        fullGrid.innerHTML = areas.map(a => `
          <div class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-md">
            <div class="space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-3xl">${a.icon}</div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">${a.title}</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${a.desc}</p>
            </div>
            <div class="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onclick="openBusinessAreaCategory('${a.categoryFilter}')" class="flex-1 py-2.5 px-3 rounded-xl brand-gradient text-white font-bold text-xs">🛍️ تصفح منتجات القسم</button>
              <button type="button" onclick="switchMainTab('projects')" class="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-[#0D1B2A] border border-slate-300 dark:border-slate-700 font-bold text-xs">📋 طلب عرض سعر</button>
            </div>
          </div>
        `).join('');
      }
    }

    function openBusinessAreaCategory(cat) {
      switchMainTab('store');
      selectedCategory = cat || 'ALL';
      renderCategoriesAndBrands();
      applyStoreFilters();
    }

    // ==================== HOME STOREFRONT SHOWCASE ====================
    function setHomeShowcaseFilter(filterType) {
      homeShowcaseFilter = filterType;
      const mapIds = {
        'ALL': 'home-showcase-all',
        'عرض خاص': 'home-showcase-offers',
        'FEATURED': 'home-showcase-featured',
        'وصل حديثاً': 'home-showcase-new'
      };
      Object.entries(mapIds).forEach(([k, id]) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.className = k === filterType
            ? 'home-showcase-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold brand-gradient text-white shadow-sm'
            : 'home-showcase-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700';
        }
      });
      renderHomeProductsShowcase();
    }

    function renderHomeProductsShowcase() {
      const grid = document.getElementById('homeProductsShowcaseGrid');
      if (!grid) return;
      let list = storeData.products.filter(p => {
        if (homeShowcaseFilter === 'ALL') return true;
        if (homeShowcaseFilter === 'FEATURED') return !!p.featured;
        return p.badge === homeShowcaseFilter;
      });
      if (list.length === 0) list = storeData.products.slice(0, 8);
      else list = list.slice(0, 8);

      grid.innerHTML = list.map(p => buildProductCardHtml(p)).join('');
    }

    // ==================== PROJECTS SHOWCASE ====================
    function renderProjectsShowcase() {
      const grid = document.getElementById('projectsShowcaseGrid');
      if (!grid) return;
      const projs = storeData.projects || DEFAULT_STORE_DATA.projects;
      grid.innerHTML = projs.map(pr => `
        <div class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">${pr.category}</span>
              <span class="text-amber-400 font-semibold">📍 ${pr.location}</span>
            </div>
            <h3 class="text-base sm:text-lg font-black leading-snug">${pr.title}</h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">${pr.desc}</p>
          </div>
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-emerald-400 font-bold">✔️ تم التنفيذ والتسليم بنجاح</span>
            <button type="button" onclick="document.getElementById('rfqOrgName')?.focus()" class="text-cyan-400 font-bold hover:underline">اطلب مشروعاً مماثلاً ←</button>
          </div>
        </div>
      `).join('');
    }

    // ==================== PUBLIC NAVIGATION TABS ====================
    function switchMainTab(tab) {
      const views = ['home', 'about', 'services', 'store', 'projects', 'posts', 'contact'];
      views.forEach(v => {
        const sec = document.getElementById('view-' + v);
        if (sec) sec.classList.toggle('hidden', v !== tab);
        const btn = document.getElementById('nav-' + v);
        if (btn) {
          btn.className = v === tab
            ? 'nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-cyan-500 text-white shadow-sm'
            : 'nav-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-slate-700 dark:text-slate-200 hover:text-cyan-500';
        }
        const mobBtn = document.getElementById('mob-nav-' + v);
        if (mobBtn) {
          mobBtn.className = v === tab
            ? 'mobile-nav-btn px-3 py-1.5 rounded-lg bg-cyan-500 text-white whitespace-nowrap shadow-sm'
            : 'mobile-nav-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 whitespace-nowrap';
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==================== SEPARATE ADMIN PAGE ROUTING & RBAC ====================
    function navigateToAdminPage() {
      const pub = document.getElementById('publicSiteWrapper');
      const adm = document.getElementById('adminPageWrapper');
      if (pub) pub.classList.add('hidden');
      if (adm) adm.classList.remove('hidden');
      try { history.replaceState(null, '', '#/admin'); } catch (e) {}
      renderLoginUsersOptions();
      renderAdminAuthView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function exitAdminPageToStore() {
      const pub = document.getElementById('publicSiteWrapper');
      const adm = document.getElementById('adminPageWrapper');
      if (adm) adm.classList.add('hidden');
      if (pub) pub.classList.remove('hidden');
      try { history.replaceState(null, '', '#/'); } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderLoginUsersOptions() {
      const users = getUsersList().filter(u => u.active !== false);
      const sel = document.getElementById('loginUsernameSelect');
      if (sel && users.length > 0) {
        const curVal = sel.value;
        sel.innerHTML = users.map(u => `<option value="${u.username}">${u.icon} ${u.displayName} (${u.username}) — ${u.roleTitle}</option>`).join('');
        if (users.some(u => u.username === curVal)) sel.value = curVal;
        else {
          const mgmt = users.find(u => u.username === 'management') || users[0];
          sel.value = mgmt.username;
        }
      }
      const demoBox = document.getElementById('quickLoginDemoBox');
      if (demoBox) {
        demoBox.classList.toggle('hidden', storeData.settings.showQuickLoginDemo === false);
      }
      const grid = document.getElementById('quickLoginButtonsGrid');
      if (grid) {
        grid.innerHTML = users.map(u => `
          <button type="button" onclick="quickLoginAsRole('${u.username}')" class="py-2 px-2.5 rounded-xl bg-[#0D1B2A] hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-slate-200 font-bold transition text-right truncate">
            <span>${u.icon}</span> <span>${u.displayName}</span> <span class="text-[10px] font-mono text-cyan-400">(${u.username})</span>
          </button>
        `).join('');
      }
    }

    function fillLoginRoleHint() {
      const username = document.getElementById('loginUsernameSelect')?.value || 'management';
      const userInp = document.getElementById('loginUsernameInput');
      if (userInp) userInp.value = username;
      const u = findUserByIdentifier(username) || getUsersList()[0];
      const hintEl = document.getElementById('loginRolePermissionsHint');
      if (hintEl && u) {
        hintEl.textContent = `${u.icon} ${u.displayName} (${u.roleTitle}): ${u.description}`;
      }
      const errEl = document.getElementById('loginErrorAlert');
      if (errEl) errEl.classList.add('hidden');
    }

    function syncSelectFromLoginUsername() {
      const typed = (document.getElementById('loginUsernameInput')?.value || '').trim();
      const u = findUserByIdentifier(typed);
      const sel = document.getElementById('loginUsernameSelect');
      const hintEl = document.getElementById('loginRolePermissionsHint');
      if (u) {
        if (sel) sel.value = u.username;
        if (hintEl) hintEl.textContent = `${u.icon} ${u.displayName} (${u.roleTitle}): ${u.description}`;
      }
      const errEl = document.getElementById('loginErrorAlert');
      if (errEl) errEl.classList.add('hidden');
    }

    function togglePasswordVisibility(inputId, btnEl) {
      const inp = document.getElementById(inputId);
      if (!inp) return;
      if (inp.type === 'password') {
        inp.type = 'text';
        if (btnEl) btnEl.textContent = '🙈';
      } else {
        inp.type = 'password';
        if (btnEl) btnEl.textContent = '👁️';
      }
    }

    function handleAdminLogin() {
      const typedUser = (document.getElementById('loginUsernameInput')?.value || document.getElementById('loginUsernameSelect')?.value || '').trim();
      const pass = (document.getElementById('loginPasswordInput')?.value || '').trim();
      const errEl = document.getElementById('loginErrorAlert');

      if (!typedUser) {
        if (errEl) {
          errEl.textContent = '⚠️ يرجى إدخال أو اختيار اسم المستخدم أولاً.';
          errEl.classList.remove('hidden');
        }
        showToast('يرجى إدخال اسم المستخدم');
        return;
      }

      const user = findUserByIdentifier(typedUser);
      if (!user) {
        if (errEl) {
          errEl.textContent = `❌ لا يوجد حساب مسجل باسم المستخدم "${typedUser}".`;
          errEl.classList.remove('hidden');
        }
        showToast('اسم المستخدم غير موجود');
        return;
      }

      if (user.active === false) {
        if (errEl) {
          errEl.textContent = '⛔ هذا الحساب موقوف حالياً من قبل الإدارة العامة.';
          errEl.classList.remove('hidden');
        }
        showToast('هذا الحساب موقوف حالياً');
        return;
      }

      if (!pass) {
        if (errEl) {
          errEl.textContent = '⚠️ يرجى إدخال كلمة المرور الخاصة بالحساب للدخول.';
          errEl.classList.remove('hidden');
        }
        showToast('يرجى إدخال كلمة المرور للدخول إلى لوحة التحكم');
        return;
      }

      if (pass !== String(user.password)) {
        if (errEl) {
          errEl.textContent = '❌ كلمة المرور غير صحيحة لهذا الحساب! يرجى التأكد من كلمة المرور والمحاولة مجدداً.';
          errEl.classList.remove('hidden');
        }
        showToast('كلمة المرور غير صحيحة ❌');
        return;
      }

      if (errEl) errEl.classList.add('hidden');
      const passInp = document.getElementById('loginPasswordInput');
      if (passInp) passInp.value = '';
      loginWithUserObject(user);
    }

    function quickLoginAsRole(roleKeyOrUsername) {
      const user = findUserByIdentifier(roleKeyOrUsername) || getUsersList()[0];
      if (!user) return;
      if (user.active === false) {
        showToast('هذا الحساب موقوف حالياً — قم بتفعيله من إدارة المستخدمين');
        return;
      }
      const sel = document.getElementById('loginUsernameSelect');
      if (sel) sel.value = user.username;
      const userInp = document.getElementById('loginUsernameInput');
      if (userInp) userInp.value = user.username;
      loginWithUserObject(user);
    }

    function loginWithUserObject(user) {
      currentAdminUser = user;
      try { sessionStorage.setItem('pronet_active_admin_id', user.id); } catch (e) {}
      renderAdminAuthView();
      showToast(`مرحباً بك: ${user.displayName} (${user.roleTitle}) ✅`);
    }

    function logoutAdminUser() {
      currentAdminUser = null;
      try { sessionStorage.removeItem('pronet_active_admin_id'); } catch (e) {}
      renderAdminAuthView();
      showToast('تم تسجيل الخروج من لوحة التحكم بنجاح');
    }

    function renderAdminAuthView() {
      const loginBox = document.getElementById('adminLoginScreen');
      const dashBox = document.getElementById('adminDashboardContent');
      const userBadge = document.getElementById('adminActiveUserBadge');
      const myAccBtn = document.getElementById('adminMyAccountBtn');
      const logoutBtn = document.getElementById('adminLogoutBtn');

      renderLoginUsersOptions();

      if (currentAdminUser) {
        // Refresh currentAdminUser reference from storeData.users
        const freshUser = findUserByIdentifier(currentAdminUser.id) || findUserByIdentifier(currentAdminUser.username);
        if (freshUser && freshUser.active !== false) {
          currentAdminUser = freshUser;
        } else {
          currentAdminUser = null;
        }
      }

      if (!currentAdminUser) {
        if (loginBox) loginBox.classList.remove('hidden');
        if (dashBox) dashBox.classList.add('hidden');
        if (userBadge) userBadge.classList.add('hidden');
        if (myAccBtn) myAccBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        fillLoginRoleHint();
        return;
      }

      if (loginBox) loginBox.classList.add('hidden');
      if (dashBox) dashBox.classList.remove('hidden');
      if (userBadge) {
        userBadge.classList.remove('hidden');
        userBadge.classList.add('flex');
      }
      if (myAccBtn) myAccBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');

      document.getElementById('adminUserRoleIcon').textContent = currentAdminUser.icon;
      document.getElementById('adminUserDisplayName').textContent = currentAdminUser.displayName;
      document.getElementById('adminUserRoleBadge').textContent = currentAdminUser.roleTitle;

      const roleTag = document.getElementById('admHeaderRoleTag');
      if (roleTag) {
        roleTag.textContent = currentAdminUser.roleTitle;
        roleTag.className = `px-3 py-0.5 rounded-full text-xs font-black ${currentAdminUser.badgeClass}`;
      }
      document.getElementById('admHeaderPermissionsDesc').textContent = currentAdminUser.description;

      // Ensure 'profile' is always accessible to every logged-in user
      if (!currentAdminUser.allowedTabs.includes('profile')) {
        currentAdminUser.allowedTabs.push('profile');
      }

      // Show/Hide Admin Sub-Tabs based on Role Permissions
      const allTabs = ['products', 'categories', 'posts', 'support', 'settings', 'users', 'github', 'profile'];
      allTabs.forEach(t => {
        const btn = document.getElementById('adm-tab-' + t);
        if (btn) {
          const allowed = t === 'profile' || currentAdminUser.allowedTabs.includes(t);
          btn.classList.toggle('hidden', !allowed);
        }
      });

      const btnExport = document.getElementById('btnQuickExportSite');
      if (btnExport) btnExport.classList.toggle('hidden', !currentAdminUser.canExportSite);
      const btnAddProd = document.getElementById('btnQuickAddProduct');
      if (btnAddProd) btnAddProd.classList.toggle('hidden', !currentAdminUser.allowedTabs.includes('products'));
      const btnAddPost = document.getElementById('btnQuickAddPost');
      if (btnAddPost) btnAddPost.classList.toggle('hidden', !currentAdminUser.allowedTabs.includes('posts'));

      const noteEl = document.getElementById('adminProductsRoleNote');
      if (noteEl) {
        noteEl.textContent = currentAdminUser.canEditPrices
          ? 'لديك صلاحية كاملة لتعديل الأسعار، المواصفات، وحالة التوفر.'
          : 'صلاحية مخصصة: يمكنك تحديث المواصفات الفنية وحالة التوفر (تعديل الأسعار مقفل لحسابك).';
      }

      populateAdminInputs();
      const defaultTab = currentAdminUser.allowedTabs.find(t => t !== 'profile') || 'profile';
      switchAdminSubTab(defaultTab);
    }

    function switchAdminSubTab(sub) {
      const subs = ['products', 'categories', 'posts', 'support', 'settings', 'users', 'github', 'profile'];
      subs.forEach(s => {
        const box = document.getElementById('admin-subview-' + s);
        if (box) box.classList.toggle('hidden', s !== sub);
        const btn = document.getElementById('adm-tab-' + s);
        if (btn && !btn.classList.contains('hidden')) {
          btn.className = s === sub
            ? 'adm-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 text-white whitespace-nowrap shadow-sm'
            : (s === 'profile'
                ? 'adm-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#1B263B] text-cyan-300 border border-cyan-500/30 whitespace-nowrap'
                : 'adm-subtab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#1B263B] text-slate-200 whitespace-nowrap');
        }
      });
    }

    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      const icon = document.getElementById('themeIcon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    }

    function copyBankAccount(accNum, bankLabel) {
      copyTextToClipboard(accNum);
      showToast(`تم نسخ رقم الحساب (${accNum}) — ${bankLabel} ✅`);
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

    // Build Single Product Card HTML (Used in Home Showcase & Store Catalog)
    function buildProductCardHtml(p) {
      const badgeColor = p.badge === 'عرض خاص' ? 'bg-amber-500 text-slate-950' :
                         p.badge === 'وصل حديثاً' ? 'bg-cyan-500 text-white' :
                         p.badge === 'كمية محدودة' ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      const inCompare = compareList.includes(p.id);
      return `
        <div class="bg-white dark:bg-[#1B263B] border border-slate-200 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group">
          <div>
            <div class="relative bg-slate-100 dark:bg-[#0A1522] p-4 h-44 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
              <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${badgeColor}">${p.badge || 'متوفر'}</span>
              <span class="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-cyan-300 text-[11px] font-mono font-bold">${p.brand}</span>
              ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="max-h-36 max-w-full object-contain group-hover:scale-105 transition" />` : `<div class="group-hover:scale-105 transition">${getProductSvgIllustration(p.iconType, p.brand)}</div>`}
            </div>
            <div class="p-4 space-y-2.5">
              <div class="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">${p.category}</div>
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-2">${p.name}</h3>
              <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                ${(p.specs || []).slice(0, 3).map(s => `<li class="truncate">• ${s}</li>`).join('')}
              </ul>
            </div>
          </div>
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
              <button type="button" onclick="orderSingleProductWhatsapp('${p.id}')" title="طلب مباشر عبر واتساب المبيعات" class="col-span-3 py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 font-bold text-xs transition flex items-center justify-center">
                💬 واتس
              </button>
              <button type="button" onclick="openProductDetailModal('${p.id}')" title="عرض المواصفات الكاملة" class="col-span-2 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1B2A] hover:border-cyan-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center">
                👁️
              </button>
            </div>
          </div>
        </div>
      `;
    }

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

      grid.innerHTML = list.map(p => buildProductCardHtml(p)).join('');
    }

    function resetFilters() {
      selectedCategory = 'ALL';
      const s = document.getElementById('searchInput'); if (s) s.value = '';
      const b = document.getElementById('brandFilterSelect'); if (b) b.value = 'ALL';
      const st = document.getElementById('stockFilterSelect'); if (st) st.value = 'ALL';
      renderCategoriesAndBrands();
      applyStoreFilters();
    }

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
          <button type="button" onclick="orderSingleProductWhatsapp('${p.id}')" class="px-5 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm">💬 طلب عبر واتساب المبيعات</button>
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
      const msg = `مرحباً مبيعات برونت كمبيوتر (ProNet Computer)،\nأود الاستفسار / طلب الصنف التالي:\n• الصنف: ${p.name}\n• القسم: ${p.category}\n• السعر المعروض: ${formatPrice(p.price, p.hidePrice)}`;
      const url = `https://wa.me/${storeData.settings.whatsappNumber || '967778163178'}?text=${encodeURIComponent(msg)}`;
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

      const url = `https://wa.me/${storeData.settings.whatsappNumber || '967778163178'}?text=${encodeURIComponent(msg)}`;
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
      renderHomeProductsShowcase();
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
      renderHomeProductsShowcase();
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

    function submitRfqWhatsapp(targetDept) {
      const msg = getFormattedRfqMessage();
      const targetPhone = targetDept === 'mgmt' ? '967775043020' : (storeData.settings.whatsappNumber || '967778163178');
      window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
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
            <a href="https://wa.me/${storeData.settings.whatsappNumber || '967778163178'}?text=${encodeURIComponent('استفسار حول عرض: ' + post.title)}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 font-bold hover:underline">💬 اطلب العرض الآن</a>
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
      setVal('admWhatsappNumber', s.whatsappNumber || '967778163178');
      setVal('admSloganInput', s.slogan);
      const chk = document.getElementById('admShowPricesGlobal');
      if (chk) chk.checked = !!s.showPricesGlobal;

      const chkDemo = document.getElementById('admShowQuickLoginDemo');
      if (chkDemo) chkDemo.checked = s.showQuickLoginDemo !== false;

      // KPIs
      document.getElementById('kpiTotalProducts').textContent = storeData.products.length;
      document.getElementById('kpiTotalCategories').textContent = `${storeData.categories.length} أقسام / ${storeData.brands.length} ماركة`;
      document.getElementById('kpiTotalPosts').textContent = `${storeData.posts.length} منشور / ${(storeData.projects || []).length} مشروع`;
      document.getElementById('kpiExchangeRate').textContent = `${s.rateYER} ر.ي`;

      renderAdminProductsTable();
      renderAdminCategoriesAndBrands();
      renderAdminPostsList();
      renderAdminProjectsList();
      renderAdminSupportTickets();
      renderUsersPermissionsMatrix();
      populateSelfProfileInputs();
    }

    function renderAdminProductsTable() {
      const tbody = document.getElementById('adminProductsTableBody');
      if (!tbody) return;
      const q = (document.getElementById('adminProductSearch')?.value || '').trim().toLowerCase();
      const filtered = storeData.products.filter(p => !q || `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(q));
      const canPrice = !currentAdminUser || currentAdminUser.canEditPrices;
      const canDel = !currentAdminUser || currentAdminUser.canDeleteItems;

      tbody.innerHTML = filtered.map(p => `
        <tr class="hover:bg-slate-800/40">
          <td class="py-3 px-2 font-bold text-white">${p.name}</td>
          <td class="py-3 px-2 text-slate-300">${p.category}</td>
          <td class="py-3 px-2 font-mono text-cyan-400">${p.brand}</td>
          <td class="py-3 px-2">
            ${canPrice
              ? `<input type="number" value="${p.price}" onchange="quickUpdateProductPrice('${p.id}', this.value)" class="w-20 rounded-lg bg-[#0D1B2A] border border-slate-700 px-2 py-1 font-bold text-cyan-400" />`
              : `<span class="font-mono font-bold text-slate-400">$${p.price} (مقفل)</span>`
            }
          </td>
          <td class="py-3 px-2">
            <input type="checkbox" ${!p.hidePrice ? 'checked' : ''} ${!canPrice ? 'disabled' : ''} onchange="quickToggleProductPriceVisibility('${p.id}', this.checked)" class="w-4 h-4 accent-cyan-500" />
          </td>
          <td class="py-3 px-2">
            <span class="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-bold">${p.badge}</span>
          </td>
          <td class="py-3 px-2 flex items-center gap-1.5">
            <button type="button" onclick="openProductEditorModal('${p.id}')" class="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">✏️ تعديل</button>
            ${canDel ? `<button type="button" onclick="deleteProduct('${p.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs">🗑️ حذف</button>` : ''}
          </td>
        </tr>
      `).join('');
    }

    function quickUpdateProductPrice(prodId, newPrice) {
      if (currentAdminUser && !currentAdminUser.canEditPrices) {
        showToast('عذراً، تعديل الأسعار غير متاح لصلاحية الدعم الفني');
        return;
      }
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
      const featChk = document.getElementById('editProdFeatured');
      if (featChk) featChk.checked = p ? !!p.featured : true;
      document.getElementById('editProdSpecs').value = p ? (p.specs || []).join('\n') : '';
      document.getElementById('editProdDesc').value = p ? (p.desc || '') : '';
      document.getElementById('editProdImageUrl').value = p ? (p.imageUrl || '') : '';

      const canPrice = !currentAdminUser || currentAdminUser.canEditPrices;
      document.getElementById('editProdPrice').disabled = !canPrice;
      document.getElementById('editProdOldPrice').disabled = !canPrice;
      document.getElementById('editProdHidePrice').disabled = !canPrice;

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

      const existingProd = storeData.products.find(x => x.id === id);
      const canPrice = !currentAdminUser || currentAdminUser.canEditPrices;
      const featChk = document.getElementById('editProdFeatured');

      const prodObj = {
        id,
        name,
        category: document.getElementById('editProdCategory').value,
        brand: document.getElementById('editProdBrand').value,
        price: canPrice ? (Number(document.getElementById('editProdPrice').value) || 0) : (existingProd ? existingProd.price : 0),
        oldPrice: canPrice ? (Number(document.getElementById('editProdOldPrice').value) || 0) : (existingProd ? existingProd.oldPrice : 0),
        badge: document.getElementById('editProdBadge').value,
        iconType: document.getElementById('editProdIconType').value,
        hidePrice: canPrice ? document.getElementById('editProdHidePrice').checked : (existingProd ? !!existingProd.hidePrice : false),
        specs: specs.length ? specs : ['ضمان وجودة برونت كمبيوتر'],
        desc: document.getElementById('editProdDesc').value.trim(),
        imageUrl: document.getElementById('editProdImageUrl').value.trim(),
        featured: featChk ? featChk.checked : true
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

    function renderAdminCategoriesAndBrands() {
      const catList = document.getElementById('adminCategoriesList');
      if (catList) {
        catList.innerHTML = storeData.categories.map((c, idx) => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1B2A] border border-slate-800 text-xs sm:text-sm">
            <span class="font-bold text-white">${c}</span>
            <button type="button" onclick="removeCategory(${idx})" class="text-rose-400 hover:underline text-xs font-bold">حذف</button>
          </div>
        `).join('');
      }
      const brandList = document.getElementById('adminBrandsList');
      if (brandList) {
        brandList.innerHTML = storeData.brands.map((b, idx) => `
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1B2A] border border-slate-800 text-xs font-bold text-white">
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
      showToast('تمت إضافة الماركة إلى شريط الماركات بنجاح');
    }

    function removeBrand(idx) {
      storeData.brands.splice(idx, 1);
      saveStoreData();
      populateAdminInputs();
    }

    function saveHeroSettings() {
      storeData.settings.announcement = document.getElementById('admAnnouncementInput').value.trim();
      storeData.settings.heroTitle = document.getElementById('admHeroTitleInput').value.trim();
      storeData.settings.heroBadge = document.getElementById('admHeroBadgeInput').value.trim();
      storeData.settings.heroSubtitle = document.getElementById('admHeroSubtitleInput').value.trim();
      saveStoreData();
      showToast('تم تحديث نصوص السلايدر الرئيسي وشريط الإعلانات!');
    }

    function renderAdminPostsList() {
      const container = document.getElementById('adminPostsList');
      if (!container) return;
      container.innerHTML = storeData.posts.map(p => `
        <div class="p-4 rounded-xl bg-[#0D1B2A] border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span>${p.tag}</span><span>${p.date}</span>
          </div>
          <div class="font-extrabold text-sm text-white">${p.title}</div>
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

    // Projects Management in Admin
    function renderAdminProjectsList() {
      const box = document.getElementById('adminProjectsList');
      if (!box) return;
      if (!storeData.projects) storeData.projects = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.projects));
      const canDel = !currentAdminUser || currentAdminUser.canDeleteItems;
      box.innerHTML = storeData.projects.map(pr => `
        <div class="p-4 rounded-xl bg-[#0D1B2A] border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold">${pr.category}</span>
            <span class="text-amber-400 font-semibold">📍 ${pr.location}</span>
          </div>
          <div class="font-extrabold text-sm text-white">${pr.title}</div>
          <p class="text-xs text-slate-400 line-clamp-2">${pr.desc}</p>
          <div class="flex gap-2 pt-2">
            <button type="button" onclick="openProjectEditorModal('${pr.id}')" class="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold">✏️ تعديل</button>
            ${canDel ? `<button type="button" onclick="deleteProject('${pr.id}')" class="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold">🗑️ حذف</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    function openProjectEditorModal(projId) {
      if (!storeData.projects) storeData.projects = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.projects));
      const pr = projId ? storeData.projects.find(x => x.id === projId) : null;
      document.getElementById('projectEditorModalTitle').textContent = pr ? '✏️ تعديل بيانات المشروع المنفذ' : '➕ إضافة مشروع منفذ جديد';
      document.getElementById('editProjId').value = pr ? pr.id : '';
      document.getElementById('editProjTitle').value = pr ? pr.title : '';
      document.getElementById('editProjCategory').value = pr ? pr.category : 'شبكات وأنظمة مراقبة';
      document.getElementById('editProjLocation').value = pr ? pr.location : 'عدن';
      document.getElementById('editProjDesc').value = pr ? pr.desc : '';
      document.getElementById('projectEditorModal').classList.remove('hidden');
    }

    function closeProjectEditorModal() {
      document.getElementById('projectEditorModal').classList.add('hidden');
    }

    function saveProjectFromModal() {
      const title = document.getElementById('editProjTitle').value.trim();
      const desc = document.getElementById('editProjDesc').value.trim();
      if (!title || !desc) {
        showToast('يرجى إدخال عنوان وتفاصيل المشروع المنفذ');
        return;
      }
      if (!storeData.projects) storeData.projects = [];
      const id = document.getElementById('editProjId').value || ('proj' + Date.now());
      const obj = {
        id,
        title,
        category: document.getElementById('editProjCategory').value.trim() || 'مشاريع برونت',
        location: document.getElementById('editProjLocation').value.trim() || 'عدن',
        desc
      };
      const idx = storeData.projects.findIndex(x => x.id === id);
      if (idx > -1) storeData.projects[idx] = obj;
      else storeData.projects.unshift(obj);

      saveStoreData();
      populateAdminInputs();
      closeProjectEditorModal();
      showToast('تم حفظ بيانات المشروع المنفذ بنجاح!');
    }

    function deleteProject(projId) {
      storeData.projects = (storeData.projects || []).filter(x => x.id !== projId);
      saveStoreData();
      populateAdminInputs();
      showToast('تم حذف المشروع');
    }

    // Technical Support Tickets in Admin
    function renderAdminSupportTickets() {
      const box = document.getElementById('adminSupportTicketsList');
      if (!box) return;
      if (!storeData.supportTickets) storeData.supportTickets = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.supportTickets));
      const tickets = storeData.supportTickets;
      const canDel = !currentAdminUser || currentAdminUser.canDeleteItems;
      box.innerHTML = tickets.map((t, idx) => `
        <div class="p-4 rounded-xl bg-[#0D1B2A] border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-cyan-400">👨‍🔧 ${t.engineer}</span>
            <span class="px-2.5 py-0.5 rounded-full ${t.status.includes('مكتمل') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} font-bold">${t.status}</span>
          </div>
          <div class="font-extrabold text-sm text-white">${t.title}</div>
          <div class="text-xs text-slate-400">العميل / الجهة: <strong class="text-slate-200">${t.client}</strong></div>
          <div class="pt-2 flex flex-wrap gap-2">
            <button type="button" onclick="toggleTicketStatus(${idx})" class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">🔄 تبديل الإنجاز</button>
            <button type="button" onclick="openSupportTicketModal('${t.id}')" class="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold">✏️ تعديل</button>
            ${canDel ? `<button type="button" onclick="deleteSupportTicket('${t.id}')" class="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold">🗑️ حذف</button>` : ''}
          </div>
        </div>
      `).join('');
    }

    function toggleTicketStatus(idx) {
      if (!storeData.supportTickets) storeData.supportTickets = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.supportTickets));
      const cur = storeData.supportTickets[idx];
      if (!cur) return;
      cur.status = cur.status.includes('مكتمل') ? 'قيد التنفيذ ⏳' : 'مكتمل ✅';
      saveStoreData();
      populateAdminInputs();
      showToast('تم تحديث حالة تذكرة الدعم الفني');
    }

    function openSupportTicketModal(ticketId) {
      if (!storeData.supportTickets) storeData.supportTickets = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA.supportTickets));
      const t = ticketId ? storeData.supportTickets.find(x => x.id === ticketId) : null;
      document.getElementById('supportTicketModalTitle').textContent = t ? '✏️ تعديل تذكرة الدعم الفني والصيانة' : '➕ تسجيل تذكرة صيانة / دعم فني جديدة';
      document.getElementById('editTicketId').value = t ? t.id : '';
      document.getElementById('editTicketTitle').value = t ? t.title : '';
      document.getElementById('editTicketClient').value = t ? t.client : '';
      document.getElementById('editTicketEngineer').value = t ? t.engineer : 'فريق الدعم الفني والشبكات';
      document.getElementById('editTicketStatus').value = t ? t.status : 'قيد التنفيذ ⏳';
      document.getElementById('supportTicketModal').classList.remove('hidden');
    }

    function closeSupportTicketModal() {
      document.getElementById('supportTicketModal').classList.add('hidden');
    }

    function saveSupportTicketFromModal() {
      const title = document.getElementById('editTicketTitle').value.trim();
      const client = document.getElementById('editTicketClient').value.trim();
      if (!title || !client) {
        showToast('يرجى إدخال عنوان المهمة واسم العميل');
        return;
      }
      if (!storeData.supportTickets) storeData.supportTickets = [];
      const id = document.getElementById('editTicketId').value || ('t' + Date.now());
      const obj = {
        id,
        title,
        client,
        engineer: document.getElementById('editTicketEngineer').value.trim() || 'فريق الدعم الفني والشبكات',
        status: document.getElementById('editTicketStatus').value || 'قيد التنفيذ ⏳'
      };
      const idx = storeData.supportTickets.findIndex(x => x.id === id);
      if (idx > -1) storeData.supportTickets[idx] = obj;
      else storeData.supportTickets.unshift(obj);

      saveStoreData();
      populateAdminInputs();
      closeSupportTicketModal();
      showToast('تم حفظ تذكرة الدعم الفني والصيانة بنجاح!');
    }

    function deleteSupportTicket(ticketId) {
      storeData.supportTickets = (storeData.supportTickets || []).filter(x => x.id !== ticketId);
      saveStoreData();
      populateAdminInputs();
      showToast('تم حذف تذكرة الصيانة');
    }

    // ==================== USERS, PASSWORDS & RBAC MANAGEMENT (ADMIN) ====================
    const TAB_LABELS_MAP = {
      products: '📦 الأصناف',
      categories: '🗂️ الأقسام',
      posts: '🖼️ المنشورات',
      support: '🛠️ الدعم الفني',
      settings: '🎨 الإعدادات',
      users: '👥 المستخدمين',
      github: '🚀 GitHub',
      profile: '🔐 حسابي'
    };

    function renderUsersPermissionsMatrix() {
      const box = document.getElementById('adminUsersPermissionsTable');
      if (!box) return;
      const users = getUsersList();
      box.innerHTML = `
        <table class="w-full text-right text-xs sm:text-sm border-collapse">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400">
              <th class="py-3 px-3">الموظف / الدور الوظيفي</th>
              <th class="py-3 px-3">اسم المستخدم (Username)</th>
              <th class="py-3 px-3">كلمة المرور (Password)</th>
              <th class="py-3 px-3">الأقسام والصلاحيات الممنوحة</th>
              <th class="py-3 px-3">الحالة</th>
              <th class="py-3 px-3">إجراءات التحكم والتعديل</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${users.map(u => {
              const isCurrent = currentAdminUser && currentAdminUser.id === u.id;
              const isRevealed = !!revealedUserPasswords[u.id];
              const tabBadges = (u.allowedTabs || []).map(t => `<span class="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700">${TAB_LABELS_MAP[t] || t}</span>`).join(' ');
              return `
              <tr class="hover:bg-slate-800/40 ${u.active === false ? 'opacity-60' : ''}">
                <td class="py-3.5 px-3">
                  <div class="flex items-center gap-2.5">
                    <span class="text-2xl">${u.icon || '👤'}</span>
                    <div>
                      <div class="font-black text-white flex items-center gap-1.5">
                        <span>${u.displayName}</span>
                        ${isCurrent ? '<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">حسابك الحالي</span>' : ''}
                      </div>
                      <div class="text-xs font-bold text-amber-400">${u.roleTitle}</div>
                      ${u.phone ? `<div class="text-[11px] text-slate-400 font-mono" dir="ltr">${u.phone}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-3">
                  <code class="px-2.5 py-1 rounded-lg bg-[#0D1B2A] border border-slate-700 font-mono font-bold text-cyan-400">${u.username}</code>
                </td>
                <td class="py-3.5 px-3">
                  <div class="flex items-center gap-1.5">
                    <code class="px-2.5 py-1 rounded-lg bg-[#0D1B2A] border border-slate-700 font-mono font-bold ${isRevealed ? 'text-emerald-400' : 'text-slate-400'}" dir="ltr">${isRevealed ? u.password : '••••••••'}</code>
                    <button type="button" onclick="toggleTablePasswordReveal('${u.id}')" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs" title="إظهار / إخفاء كلمة المرور">${isRevealed ? '🙈' : '👁️'}</button>
                    <button type="button" onclick="openQuickPasswordModal('${u.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs transition" title="تغيير سريع لكلمة المرور">🔑 تغيير</button>
                  </div>
                </td>
                <td class="py-3.5 px-3 space-y-1.5 max-w-xs">
                  <div class="flex flex-wrap gap-1">${tabBadges}</div>
                  <div class="flex flex-wrap gap-1 text-[10px]">
                    <span class="px-2 py-0.5 rounded ${u.canEditPrices ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-500'}">${u.canEditPrices ? '✔️ تعديل الأسعار' : '🔒 الأسعار مقفلة'}</span>
                    <span class="px-2 py-0.5 rounded ${u.canDeleteItems ? 'bg-rose-500/15 text-rose-300' : 'bg-slate-800 text-slate-500'}">${u.canDeleteItems ? '✔️ صلاحية الحذف' : '🔒 بدون حذف'}</span>
                    <span class="px-2 py-0.5 rounded ${u.canExportSite ? 'bg-cyan-500/15 text-cyan-300' : 'bg-slate-800 text-slate-500'}">${u.canExportSite ? '✔️ التصدير الكامل' : '🔒 بدون تصدير'}</span>
                  </div>
                </td>
                <td class="py-3.5 px-3">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${u.active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}">${u.active !== false ? 'نشط ✅' : 'موقوف ⛔'}</span>
                </td>
                <td class="py-3.5 px-3">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <button type="button" onclick="openAdminUserEditorModal('${u.id}')" class="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-white font-bold text-xs transition">✏️ تعديل البيانات</button>
                    <button type="button" onclick="openQuickPasswordModal('${u.id}')" class="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs transition">🔑 كلمة المرور</button>
                    <button type="button" onclick="quickLoginAsRole('${u.username}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition" title="التبديل لهذا الحساب لمعاينة صلاحياته">🔄 معاينة</button>
                    ${!isCurrent ? `<button type="button" onclick="deleteAdminUser('${u.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition" title="حذف الحساب">🗑️</button>` : ''}
                  </div>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    function toggleTablePasswordReveal(userId) {
      revealedUserPasswords[userId] = !revealedUserPasswords[userId];
      renderUsersPermissionsMatrix();
    }

    function toggleQuickLoginDemoSetting(checked) {
      storeData.settings.showQuickLoginDemo = !!checked;
      saveStoreData();
      renderLoginUsersOptions();
      showToast(checked ? 'تم تفعيل أزرار المعاينة السريعة في شاشة الدخول' : 'تم إخفاء أزرار المعاينة السريعة لتعزيز الأمان');
    }

    function generateStrongPasswordForField(inputId) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
      let rand = '';
      for (let i = 0; i < 5; i++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const generated = `ProNet@${rand}`;
      const inp = document.getElementById(inputId);
      if (inp) {
        inp.type = 'text';
        inp.value = generated;
      }
      showToast(`تم توليد كلمة مرور جديدة: ${generated}`);
    }

    function openAdminUserEditorModal(userId) {
      const u = userId ? findUserByIdentifier(userId) : null;
      document.getElementById('adminUserEditorTitle').textContent = u ? `✏️ تعديل بيانات وصلاحيات: ${u.displayName}` : '➕ إضافة مستخدم / موظف جديد للوحة التحكم';
      document.getElementById('editUserId').value = u ? u.id : '';
      document.getElementById('editUserDisplayName').value = u ? u.displayName : '';
      document.getElementById('editUserRoleTitle').value = u ? u.roleTitle : '';
      document.getElementById('editUserUsername').value = u ? u.username : '';
      const passInp = document.getElementById('editUserPassword');
      if (passInp) {
        passInp.type = 'text';
        passInp.value = u ? u.password : 'pronet2026';
      }
      document.getElementById('editUserPhone').value = u ? (u.phone || '') : '';
      document.getElementById('editUserIcon').value = u ? (u.icon || '👤') : '👤';
      document.getElementById('editUserBadgeClass').value = u ? (u.badgeClass || 'bg-cyan-500 text-white') : 'bg-cyan-500 text-white';
      document.getElementById('editUserDescription').value = u ? (u.description || '') : '';

      const allowed = u ? (u.allowedTabs || ['products', 'profile']) : ['products', 'posts', 'profile'];
      document.querySelectorAll('.adm-user-tab-chk').forEach(chk => {
        chk.checked = allowed.includes(chk.value);
      });

      document.getElementById('editUserCanEditPrices').checked = u ? !!u.canEditPrices : true;
      document.getElementById('editUserCanDeleteItems').checked = u ? !!u.canDeleteItems : false;
      document.getElementById('editUserCanExportSite').checked = u ? !!u.canExportSite : false;
      document.getElementById('editUserActive').checked = u ? (u.active !== false) : true;

      document.getElementById('adminUserEditorModal').classList.remove('hidden');
    }

    function closeAdminUserEditorModal() {
      document.getElementById('adminUserEditorModal').classList.add('hidden');
    }

    function saveAdminUserFromModal() {
      const id = document.getElementById('editUserId').value || ('u_' + Date.now());
      const displayName = document.getElementById('editUserDisplayName').value.trim();
      const roleTitle = document.getElementById('editUserRoleTitle').value.trim();
      const username = document.getElementById('editUserUsername').value.trim();
      const password = document.getElementById('editUserPassword').value.trim();
      const phone = document.getElementById('editUserPhone').value.trim();
      const icon = document.getElementById('editUserIcon').value;
      const badgeClass = document.getElementById('editUserBadgeClass').value;
      const description = document.getElementById('editUserDescription').value.trim();

      if (!displayName || !username || !password) {
        showToast('⚠️ يرجى إدخال اسم الموظف، اسم المستخدم، وكلمة المرور');
        return;
      }
      if (password.length < 4) {
        showToast('⚠️ كلمة المرور يجب أن تكون 4 خانات على الأقل');
        return;
      }

      const users = getUsersList();
      const duplicate = users.find(x => x.id !== id && x.username.toLowerCase() === username.toLowerCase());
      if (duplicate) {
        showToast(`⚠️ اسم المستخدم "${username}" مستخدم بالفعل لحساب آخر!`);
        return;
      }

      const selectedTabs = [];
      document.querySelectorAll('.adm-user-tab-chk').forEach(chk => {
        if (chk.checked) selectedTabs.push(chk.value);
      });
      if (!selectedTabs.includes('profile')) selectedTabs.push('profile');

      const active = document.getElementById('editUserActive').checked;

      // Prevent locking out the last active user with 'users' management permission
      const otherAdmins = users.filter(x => x.id !== id && x.active !== false && (x.allowedTabs || []).includes('users'));
      if (otherAdmins.length === 0 && (!active || !selectedTabs.includes('users'))) {
        showToast('⚠️ لا يمكن إلغاء صلاحية إدارة المستخدمين أو إيقاف آخر حساب مدير في النظام!');
        return;
      }

      const existingIdx = users.findIndex(x => x.id === id);
      const userObj = {
        id,
        roleKey: existingIdx > -1 ? (users[existingIdx].roleKey || username) : username,
        username,
        password,
        displayName,
        roleTitle: roleTitle || 'موظف — صلاحية مخصصة',
        phone,
        icon,
        badgeClass,
        description: description || `صلاحيات الحساب (${roleTitle || displayName}) في لوحة التحكم.`,
        allowedTabs: selectedTabs,
        canEditPrices: document.getElementById('editUserCanEditPrices').checked,
        canDeleteItems: document.getElementById('editUserCanDeleteItems').checked,
        canExportSite: document.getElementById('editUserCanExportSite').checked,
        active
      };

      if (existingIdx > -1) users[existingIdx] = userObj;
      else users.push(userObj);

      if (currentAdminUser && currentAdminUser.id === id) {
        currentAdminUser = userObj;
      }

      saveStoreData();
      closeAdminUserEditorModal();
      renderAdminAuthView();
      switchAdminSubTab('users');
      showToast(`تم حفظ بيانات وصلاحيات وكلمة مرور "${displayName}" بنجاح ✅`);
    }

    function openQuickPasswordModal(userId) {
      const u = findUserByIdentifier(userId);
      if (!u) return;
      document.getElementById('quickPassUserId').value = u.id;
      document.getElementById('quickPassUserDisplay').textContent = `${u.icon} ${u.displayName} (${u.roleTitle})`;
      document.getElementById('quickPassUsername').textContent = u.username;
      const inp = document.getElementById('quickPassNewInput');
      if (inp) {
        inp.type = 'text';
        inp.value = u.password;
      }
      document.getElementById('quickPasswordModal').classList.remove('hidden');
    }

    function closeQuickPasswordModal() {
      document.getElementById('quickPasswordModal').classList.add('hidden');
    }

    function saveQuickPasswordFromModal() {
      const id = document.getElementById('quickPassUserId').value;
      const newPass = (document.getElementById('quickPassNewInput').value || '').trim();
      if (!newPass || newPass.length < 4) {
        showToast('⚠️ يرجى إدخال كلمة مرور لا تقل عن 4 خانات');
        return;
      }
      const u = findUserByIdentifier(id);
      if (!u) return;
      u.password = newPass;
      if (currentAdminUser && currentAdminUser.id === u.id) {
        currentAdminUser.password = newPass;
      }
      saveStoreData();
      populateAdminInputs();
      closeQuickPasswordModal();
      showToast(`تم تحديث كلمة مرور الحساب (${u.displayName}) بنجاح 🔑`);
    }

    function deleteAdminUser(userId) {
      const u = findUserByIdentifier(userId);
      if (!u) return;
      if (currentAdminUser && currentAdminUser.id === u.id) {
        showToast('⚠️ لا يمكنك حذف الحساب الذي تسجل الدخول به حالياً');
        return;
      }
      const users = getUsersList();
      const remainingAdmins = users.filter(x => x.id !== u.id && x.active !== false && (x.allowedTabs || []).includes('users'));
      if (remainingAdmins.length === 0) {
        showToast('⚠️ لا يمكن حذف آخر حساب يمتلك صلاحية إدارة المستخدمين');
        return;
      }
      storeData.users = users.filter(x => x.id !== u.id);
      saveStoreData();
      populateAdminInputs();
      renderLoginUsersOptions();
      showToast(`تم حذف حساب "${u.displayName}" من النظام`);
    }

    // ==================== SELF-SERVICE ACCOUNT & PASSWORD CHANGE (EVERY USER) ====================
    function populateSelfProfileInputs() {
      if (!currentAdminUser) return;
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v || ''; };

      setTxt('profileTabIcon', currentAdminUser.icon || '👤');
      setTxt('profileTabDisplayName', currentAdminUser.displayName);
      setTxt('profileTabRoleTitle', currentAdminUser.roleTitle);
      setTxt('profileTabPermissionsDesc', currentAdminUser.description);
      setVal('profileSelfDisplayName', currentAdminUser.displayName);
      setVal('profileSelfUsername', currentAdminUser.username);
      setVal('profileSelfPhone', currentAdminUser.phone || '');

      setTxt('modalMyAccIcon', currentAdminUser.icon || '🔑');
      setTxt('modalMyAccRoleBadge', `${currentAdminUser.displayName} — ${currentAdminUser.roleTitle}`);
      setVal('modalSelfDisplayName', currentAdminUser.displayName);
      setVal('modalSelfUsername', currentAdminUser.username);
      setVal('modalSelfPhone', currentAdminUser.phone || '');
    }

    function openMyAccountModal() {
      if (!currentAdminUser) return;
      populateSelfProfileInputs();
      ['modalSelfCurrentPassword', 'modalSelfNewPassword', 'modalSelfConfirmPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const fb = document.getElementById('modalSelfPasswordFeedback');
      if (fb) fb.classList.add('hidden');
      document.getElementById('myAccountModal').classList.remove('hidden');
    }

    function closeMyAccountModal() {
      document.getElementById('myAccountModal').classList.add('hidden');
    }

    function saveSelfProfileData(source) {
      if (!currentAdminUser) return;
      const prefix = source === 'modal' ? 'modalSelf' : 'profileSelf';
      const displayName = (document.getElementById(prefix + 'DisplayName')?.value || '').trim();
      const username = (document.getElementById(prefix + 'Username')?.value || '').trim();
      const phone = (document.getElementById(prefix + 'Phone')?.value || '').trim();

      if (!displayName || !username) {
        showToast('⚠️ يرجى إدخال الاسم المعروض واسم المستخدم');
        return;
      }

      const users = getUsersList();
      const dup = users.find(x => x.id !== currentAdminUser.id && x.username.toLowerCase() === username.toLowerCase());
      if (dup) {
        showToast(`⚠️ اسم المستخدم "${username}" محجوز لحساب آخر`);
        return;
      }

      const target = users.find(x => x.id === currentAdminUser.id);
      if (target) {
        target.displayName = displayName;
        target.username = username;
        target.phone = phone;
        currentAdminUser = target;
      }

      saveStoreData();
      populateAdminInputs();
      document.getElementById('adminUserDisplayName').textContent = currentAdminUser.displayName;
      showToast('تم تحديث بيانات حسابك الشخصي بنجاح ✅');
    }

    function showPasswordFeedback(elId, msg, isSuccess) {
      const fb = document.getElementById(elId);
      if (!fb) return;
      fb.textContent = msg;
      fb.className = isSuccess
        ? 'p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold'
        : 'p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold';
      fb.classList.remove('hidden');
    }

    function changeOwnPassword(source) {
      if (!currentAdminUser) return;
      const prefix = source === 'modal' ? 'modalSelf' : 'tabSelf';
      const fbId = prefix + 'PasswordFeedback';
      const curPass = (document.getElementById(prefix + 'CurrentPassword')?.value || '').trim();
      const newPass = (document.getElementById(prefix + 'NewPassword')?.value || '').trim();
      const confPass = (document.getElementById(prefix + 'ConfirmPassword')?.value || '').trim();

      if (!curPass) {
        showPasswordFeedback(fbId, '⚠️ يرجى إدخال كلمة المرور الحالية للتحقق من هويتك.', false);
        showToast('أدخل كلمة المرور الحالية أولاً');
        return;
      }
      if (curPass !== String(currentAdminUser.password)) {
        showPasswordFeedback(fbId, '❌ كلمة المرور الحالية غير صحيحة! يرجى التأكد والمحاولة مرة أخرى.', false);
        showToast('كلمة المرور الحالية غير صحيحة ❌');
        return;
      }
      if (!newPass || newPass.length < 4) {
        showPasswordFeedback(fbId, '⚠️ كلمة المرور الجديدة يجب أن تتكون من 4 خانات أو أحرف على الأقل.', false);
        showToast('كلمة المرور الجديدة قصيرة جداً');
        return;
      }
      if (newPass !== confPass) {
        showPasswordFeedback(fbId, '⚠️ كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين!', false);
        showToast('تأكيد كلمة المرور غير متطابق');
        return;
      }

      const target = getUsersList().find(x => x.id === currentAdminUser.id);
      if (target) {
        target.password = newPass;
        currentAdminUser = target;
      }

      saveStoreData();
      populateAdminInputs();
      ['CurrentPassword', 'NewPassword', 'ConfirmPassword'].forEach(suffix => {
        const el = document.getElementById(prefix + suffix);
        if (el) el.value = '';
      });
      showPasswordFeedback(fbId, '✅ تم تغيير كلمة مرور حسابك وحفظها بنجاح!', true);
      showToast('تم تغيير كلمة مرور حسابك بنجاح! 🔐✅');
    }

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
      storeData.settings.whatsappNumber = document.getElementById('admWhatsappNumber').value.trim() || '967778163178';
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
        if (statusBox) statusBox.textContent = '⚠️ يرجى إدخال رمز الوصول الشخصي (GitHub Personal Access Token) للدفع المباشر، أو اضغط على زر "تنزيل الموقع الكامل المحدث (index.html)" لرفعه يدوياً.';
        showToast('أدخل GitHub Token أو قم بتنزيل ملف index.html المحدث');
        return;
      }

      try {
        if (statusBox) statusBox.textContent = '⏳ جاري الاتصال بـ GitHub API وتحديث ملف data/store_data.json...';
        const apiUrl = `https://api.github.com/repos/${repo}/contents/data/store_data.json`;
        let sha = undefined;
        const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/data/store_data.json?ref=${branch}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' }
        });
        if (getRes.ok) {
          const existing = await getRes.json();
          sha = existing.sha;
        }
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(storeData, null, 2))));
        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/data/store_data.json`, {
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
      showToast('تم تنزيل ملف index.html المحدث والجاهز للرفع المباشر!');
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
      renderHeroSlider();
      renderHeroFeatured();
      renderBrandsLogoStrip();
      renderBusinessAreasAndServices();
      renderHomeProductsShowcase();
      renderCategoriesAndBrands();
      applyStoreFilters();
      renderProjectsShowcase();
      renderPostsSection();
      updateCartBadge();
    }

    function checkHashForAdminRoute() {
      const h = window.location.hash || '';
      const s = window.location.search || '';
      if (h === '#/admin' || h === '#admin' || s.includes('page=admin') || window.PRONET_FORCE_ADMIN_PAGE) {
        navigateToAdminPage();
      }
    }

    window.addEventListener('hashchange', checkHashForAdminRoute);

    window.addEventListener('DOMContentLoaded', () => {
      try {
        const savedUserId = sessionStorage.getItem('pronet_active_admin_id');
        if (savedUserId) {
          const found = findUserByIdentifier(savedUserId);
          if (found && found.active !== false) currentAdminUser = found;
        }
      } catch (e) {}
      applySiteSettingsToDOM();
      const sel = document.getElementById('currencySelect');
      if (sel) sel.value = activeCurrency;
      renderAllViews();
      renderLoginUsersOptions();
      restartHeroSliderTimer();
      checkHashForAdminRoute();
    });
