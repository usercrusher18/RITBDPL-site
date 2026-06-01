import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import config from "../data/siteConfig";
import { mergeContent, mergeImages, normalizePoints, pick } from "../utils/siteHelpers";
import EduIcon from "./EduIcon";

const routes = [
  "/",
  "/haqqimizda",
  "/rehberlik-heyet",
  "/rehberlik",
  "/muellimler",
  "/ustalar",
  "/terefdaslar",
  "/tedris/ixtisaslar",
  "/tedris/planlar",
  "/tedris/proqramlar",
  "/ugurlu-telebeler",
  "/xeberler",
  "/elaqe",
];

function getRoute() {
  const legacyHash = window.location.hash.replace(/^#/, "");
  const source = legacyHash.startsWith("/") ? legacyHash : window.location.pathname;
  const cleanPath = source.split(/[?#]/)[0].replace(/\/+$/, "");
  const path = cleanPath ? (cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`) : "/";
  return routes.includes(path) ? path : "/404";
}

function getRoutePath(value) {
  const cleanPath = value.split(/[?#]/)[0].replace(/\/+$/, "");
  return cleanPath ? (cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`) : "/";
}

function Paragraphs({ value, language, className = "muted" }) {
  return String(pick(value, language))
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => (
      <p className={className} key={`${part}-${index}`}>
        {part}
      </p>
    ));
}

function readStoredJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep rendering live data.
  }
}

function mergePublicContent(defaultContent, savedContent = {}) {
  const content = mergeContent(defaultContent, savedContent);
  return {
    ...content,
    "/haqqimizda": defaultContent["/haqqimizda"],
    "/rehberlik": {
      ...content["/rehberlik"],
      body: { az: "", en: "" },
    },
    "/ugurlu-telebeler": {
      ...content["/ugurlu-telebeler"],
      body: { az: "", en: "" },
    },
    "/xeberler": {
      ...content["/xeberler"],
      lead: { az: "", en: "" },
      body: { az: "", en: "" },
    },
  };
}

const pageHeroFallbacks = {
  "/haqqimizda": "aboutHero",
  "/rehberlik-heyet": "leadershipHero",
  "/rehberlik": "leadershipHero",
  "/muellimler": "leadershipHero",
  "/ustalar": "educationHero",
  "/terefdaslar": "partnersHero",
  "/tedris/ixtisaslar": "educationHero",
  "/tedris/planlar": "educationHero",
  "/tedris/proqramlar": "educationHero",
  "/ugurlu-telebeler": "successHero",
  "/xeberler": "newsHero",
  "/elaqe": "contactHero",
};

const pageHeroImageKeys = {
  "/haqqimizda": "aboutHero",
  "/rehberlik-heyet": "leadershipHero",
  "/rehberlik": "leadershipHero",
  "/muellimler": "leadershipHero",
  "/ustalar": "educationHero",
  "/terefdaslar": "partnersHero",
  "/tedris/ixtisaslar": "educationHero",
  "/tedris/planlar": "educationHero",
  "/tedris/proqramlar": "educationHero",
  "/ugurlu-telebeler": "successHero",
  "/xeberler": "newsHero",
  "/elaqe": "contactHero",
};

const staffRouteGroups = {
  "/rehberlik-heyet": "rehberlik",
  "/rehberlik": "rehberlik",
  "/muellimler": "muellimler",
  "/ustalar": "ustalar",
};

const STAFF_PLACEHOLDER_IMAGE = "/images/staff-placeholder.svg";
const INITIAL_LOADER_MS = 5000;
const FIRESTORE_BOOT_TIMEOUT_MS = 4200;

function getSafeImage(getImage, requestedKey, fallbackKey, allowPoster = false) {
  const image = getImage(requestedKey);
  if (!allowPoster && image.startsWith("/images/whatsapp/campus-")) return getImage(fallbackKey);
  return image;
}

const contactAddress = {
  az: "Mərkəz: Ələsgər Qayıbov küçəsi 13\nI korpus: Ələsgər Qayıbov küçəsi 1",
  en: "Center: Alasgar Gayibov Street 13\nCampus I: Alasgar Gayibov Street 1",
};

const contactMapUrls = [
  "https://maps.google.com/maps?ll=40.4152731,49.8799621&z=17&t=m&output=embed",
  "https://maps.google.com/maps?ll=40.4066738,49.8830882&z=17&t=m&output=embed",
];

function normalizeContactCopy(value) {
  return {
    az: pick(value, "az")
      .replace("Hər iki korpusun xəritəsi aşağıda göstərilir.", "Xəritələr aşağıda göstərilir.")
      .replace("Hər iki korpusun", "Mərkəz və korpus"),
    en: pick(value, "en")
      .replace("Maps for both campuses are shown below.", "Maps are shown below.")
      .replace("both campuses", "the center and campus"),
  };
}

function isAddressItem(item) {
  const label = `${pick(item.label, "az")} ${pick(item.label, "en")}`.toLowerCase();
  return label.includes("ünvan") || label.includes("unvan") || label.includes("address");
}

function isSocialItem(item) {
  const label = `${pick(item.label, "az")} ${pick(item.label, "en")}`.toLowerCase();
  const url = String(item.url || "").toLowerCase();
  return label.includes("sosial") || label.includes("social") || url.includes("facebook") || url.includes("instagram");
}

function normalizeContactItems(items = []) {
  let hasAddress = false;
  const nextItems = items
    .filter((item) => !isSocialItem(item))
    .map((item) => {
      if (!isAddressItem(item)) return item;
      hasAddress = true;
      return { ...item, url: "", value: contactAddress };
    });

  if (!hasAddress) {
    nextItems.unshift({
      label: { az: "Ünvan", en: "Address" },
      value: contactAddress,
    });
  }

  return nextItems;
}

function normalizeContactMaps(maps = []) {
  const first = maps[0] || {};
  const second = maps[1] || {};

  return [
    {
      ...first,
      title: { az: "Mərkəz", en: "Center" },
      body: { az: "", en: "" },
      url: contactMapUrls[0],
    },
    {
      ...second,
      title: { az: "I korpus", en: "Campus I" },
      body: { az: "", en: "" },
      url: contactMapUrls[1],
    },
    ...maps.slice(2),
  ];
}

function mergeManagedData(defaultData, storedData) {
  const nextData = storedData ? { ...defaultData, ...storedData } : { ...defaultData };
  return {
    ...nextData,
    heroVideo: nextData.heroVideo || defaultData.heroVideo,
    specialties: Array.isArray(nextData.specialties) ? nextData.specialties : defaultData.specialties,
    specialtyGroups: Array.isArray(nextData.specialtyGroups) ? nextData.specialtyGroups : defaultData.specialtyGroups,
    staffGroups: normalizeStaffGroups(nextData.staffGroups, defaultData.staffGroups),
  };
}

function normalizeStaffGroups(groups = [], defaultGroups = []) {
  const hasValidIds = Array.isArray(groups) && groups.some((group) => group?.id);
  const sourceGroups = hasValidIds ? groups : defaultGroups;
  const orderedGroups = defaultGroups.length
    ? defaultGroups.map((defaultGroup) => sourceGroups.find((group) => group.id === defaultGroup.id) || defaultGroup)
    : sourceGroups;

  return orderedGroups.map((group) => ({
    ...(defaultGroups.find((defaultGroup) => defaultGroup.id === group.id) || {}),
    ...group,
    members: (group.members || []).map((member) => ({
      ...member,
      image: STAFF_PLACEHOLDER_IMAGE,
      details: Array.isArray(member.details) ? member.details : [],
    })),
  }));
}

function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), timeoutMs);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function preloadImage(src) {
  if (!src || typeof src !== "string" || src.startsWith("data:") || src.startsWith("blob:")) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

async function preloadSiteImages(images, data) {
  const staffImages = (data.staffGroups || []).flatMap((group) => group.members || []).map((member) => member.image);
  const cardImages = [
    ...(data.news || []),
    ...(data.successfulStudents || []),
    ...(data.partners || []),
  ].map((item) => item.image);
  const imageValues = [...Object.values(images || {}), ...staffImages, ...cardImages]
    .filter(Boolean)
    .map((value) => images[value] || value);
  const uniqueImages = [...new Set(imageValues)].slice(0, 28);

  await Promise.allSettled(uniqueImages.map(preloadImage));
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.77-1.63 1.56v1.9h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" />
      <circle cx="12" cy="12" r="4" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FlagAz() {
  return (
    <svg className="flag-icon" viewBox="0 0 48 32" aria-hidden="true">
      <path fill="#00b5e2" d="M0 0h48v10.67H0z" />
      <path fill="#ef3340" d="M0 10.67h48v10.66H0z" />
      <path fill="#509e2f" d="M0 21.33h48V32H0z" />
      <circle cx="22.2" cy="16" r="6.1" fill="#fff" />
      <circle cx="24.4" cy="16" r="5.1" fill="#ef3340" />
      <path fill="#fff" d="m31.8 12.4.8 2.3h2.4l-2 1.4.8 2.3-2-1.4-2 1.4.8-2.3-2-1.4h2.4z" />
    </svg>
  );
}

function FlagEn() {
  return (
    <svg className="flag-icon" viewBox="0 0 48 32" aria-hidden="true">
      <path fill="#012169" d="M0 0h48v32H0z" />
      <path stroke="#fff" strokeWidth="7" d="m0 0 48 32M48 0 0 32" />
      <path stroke="#c8102e" strokeWidth="4" d="m0 0 48 32M48 0 0 32" />
      <path stroke="#fff" strokeWidth="11" d="M24 0v32M0 16h48" />
      <path stroke="#c8102e" strokeWidth="6" d="M24 0v32M0 16h48" />
    </svg>
  );
}

export default function PublicSite() {
  const { dictionary, storage, defaultContent, defaultImages, siteData } = config;
  const [bootState] = useState(() => {
    const cachedImages = readStoredJson(storage.cachedImages);
    const cachedContent = readStoredJson(storage.cachedContent);
    const cachedData = readStoredJson(storage.cachedData);

    return {
      images: mergeImages(defaultImages, cachedImages || {}),
      content: mergePublicContent(defaultContent, cachedContent || {}),
      data: mergeManagedData(siteData, cachedData),
    };
  });
  const [language, setLanguage] = useState(() => localStorage.getItem(storage.language) === "en" ? "en" : "az");
  const [path, setPath] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState("");
  const [siteReady, setSiteReady] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [managedImages, setManagedImages] = useState(bootState.images);
  const [managedContent, setManagedContent] = useState(bootState.content);
  const [managedData, setManagedData] = useState(bootState.data);
  const mainRef = useRef(null);
  const routeLoaderTimerRef = useRef(null);

  const t = useCallback((key) => dictionary[language]?.[key] ?? dictionary.az[key] ?? key, [dictionary, language]);
  const getImage = useCallback((key) => managedImages[key] || defaultImages[key] || key, [defaultImages, managedImages]);
  const getContent = useCallback((key) => managedContent[key] || defaultContent[key], [defaultContent, managedContent]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(storage.language, language);
  }, [language, storage.language]);

  const showRouteLoader = useCallback(() => {
    window.clearTimeout(routeLoaderTimerRef.current);
    setRouteLoading(true);
    routeLoaderTimerRef.current = window.setTimeout(() => setRouteLoading(false), 560);
  }, []);

  const navigateTo = useCallback((nextPath, replace = false) => {
    const routePath = getRoutePath(nextPath);
    const targetPath = routes.includes(routePath) ? routePath : "/404";
    if (targetPath !== path) showRouteLoader();

    if (window.location.pathname !== routePath || window.location.hash) {
      const method = replace ? "replaceState" : "pushState";
      window.history[method](null, "", routePath);
    }

    setPath(targetPath);
    setMenuOpen(false);
    setExpandedMenu("");
  }, [path, showRouteLoader]);

  useEffect(() => {
    if (window.location.hash.startsWith("#/")) {
      const legacyPath = getRoutePath(window.location.hash.replace(/^#/, ""));
      window.history.replaceState(null, "", routes.includes(legacyPath) ? legacyPath : "/404");
    }

    const onPopState = () => {
      showRouteLoader();
      setPath(getRoute());
      setMenuOpen(false);
      setExpandedMenu("");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [showRouteLoader]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin || url.hash) return;

      const routePath = getRoutePath(url.pathname);
      if (!routes.includes(routePath)) return;

      event.preventDefault();
      navigateTo(routePath);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [navigateTo]);

  useEffect(() => () => window.clearTimeout(routeLoaderTimerRef.current), []);

  useEffect(() => {
    let isMounted = true;
    let unsubscribers = [];
    const startedAt = performance.now();
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted) setSiteReady(true);
    }, INITIAL_LOADER_MS + 700);

    const revealSite = () => {
      const remaining = Math.max(0, INITIAL_LOADER_MS - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (isMounted) setSiteReady(true);
      }, remaining);
    };

    import("../services/firestore").then(async ({ db, doc, getDoc, onSnapshot }) => {
      if (!isMounted) return;

      try {
        const [imagesSnapshot, contentSnapshot, dataSnapshot] = await withTimeout(Promise.all([
          getDoc(doc(db, "siteData", "managedImages")),
          getDoc(doc(db, "siteData", "managedContent")),
          getDoc(doc(db, "siteData", "managedData")),
        ]), FIRESTORE_BOOT_TIMEOUT_MS);

        if (!isMounted) return;

        const nextImages = imagesSnapshot.exists() ? mergeImages(defaultImages, imagesSnapshot.data()) : mergeImages(defaultImages, {});
        const nextContent = contentSnapshot.exists() ? mergePublicContent(defaultContent, contentSnapshot.data()) : mergePublicContent(defaultContent, {});
        const nextData = mergeManagedData(siteData, dataSnapshot.exists() ? dataSnapshot.data() : null);

        setManagedImages(nextImages);
        setManagedContent(nextContent);
        setManagedData(nextData);
        writeStoredJson(storage.cachedImages, nextImages);
        writeStoredJson(storage.cachedContent, nextContent);
        writeStoredJson(storage.cachedData, nextData);
        await withTimeout(preloadSiteImages(nextImages, nextData), Math.max(600, INITIAL_LOADER_MS - (performance.now() - startedAt)));
      } catch {
        // Fall back to cached or default content when Firestore is unavailable.
      } finally {
        window.clearTimeout(fallbackTimer);
        revealSite();
      }

      unsubscribers = [
        onSnapshot(doc(db, "siteData", "managedImages"), (snapshot) => {
          const nextImages = snapshot.exists() ? mergeImages(defaultImages, snapshot.data()) : mergeImages(defaultImages, {});
          setManagedImages(nextImages);
          writeStoredJson(storage.cachedImages, nextImages);
        }, () => undefined),
        onSnapshot(doc(db, "siteData", "managedContent"), (snapshot) => {
          const nextContent = snapshot.exists() ? mergePublicContent(defaultContent, snapshot.data()) : mergePublicContent(defaultContent, {});
          setManagedContent(nextContent);
          writeStoredJson(storage.cachedContent, nextContent);
        }, () => undefined),
        onSnapshot(doc(db, "siteData", "managedData"), (snapshot) => {
          const nextData = mergeManagedData(siteData, snapshot.exists() ? snapshot.data() : null);
          setManagedData(nextData);
          writeStoredJson(storage.cachedData, nextData);
        }, () => undefined),
      ];
    }).catch(() => {
      window.clearTimeout(fallbackTimer);
      revealSite();
    });

    return () => {
      isMounted = false;
      window.clearTimeout(fallbackTimer);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [defaultContent, defaultImages, siteData, storage.cachedContent, storage.cachedData, storage.cachedImages]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", menuOpen);
    return () => document.body.classList.remove("is-locked");
  }, [menuOpen]);

  useEffect(() => {
    const preventImageDrag = (event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault();
    };

    document.addEventListener("dragstart", preventImageDrag);
    return () => document.removeEventListener("dragstart", preventImageDrag);
  }, []);

  useEffect(() => {
    if (!siteReady) {
      document.title = t("loadingSite");
      return;
    }

    const title = path === "/404" ? t("notFoundTitle") : `${pick(getContent(path).title, language)} | ${t("siteName")}`;
    document.title = title;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [getContent, language, path, siteReady, t]);

  useEffect(() => {
    if (!siteReady) return undefined;

    const reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    reveals.forEach((item) => {
      if (item.scrollHeight > window.innerHeight * 1.2) {
        item.classList.add("is-visible");
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

    reveals.forEach((item) => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });
    return () => observer.disconnect();
  }, [path, managedData, managedImages, managedContent, siteReady]);

  const context = useMemo(() => ({
    language,
    t,
    getImage,
    getContent,
    managedData,
  }), [getContent, getImage, language, managedData, t]);

  if (!siteReady) {
    return <SiteLoader label={t("loadingSite")} />;
  }

  return (
    <>
      <a className="skip-link" href="#app">{t("skip")}</a>
      <Topbar language={language} setLanguage={setLanguage} t={t} />
      <Header
        currentPath={path}
        expandedMenu={expandedMenu}
        language={language}
        menuOpen={menuOpen}
        setExpandedMenu={setExpandedMenu}
        setMenuOpen={setMenuOpen}
        t={t}
      />
      <main id="app" ref={mainRef} tabIndex="-1" aria-live="polite">
        <div className="route-shell" key={path}>
          {path === "/404" ? <NotFound t={t} /> : <RouteView path={path} context={context} />}
          {routeLoading ? <RouteLoaderOverlay label={t("loadingSite")} /> : null}
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}

function Topbar({ language, setLanguage, t }) {
  const languageButtons = [
    { key: "az", icon: <FlagAz />, label: t("languageAz") },
    { key: "en", icon: <FlagEn />, label: t("languageEn") },
  ];

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <p>{t("address")}</p>
        <div className="topbar-links">
          <a href="tel:+994125674902">(012) 56 749 02</a>
          <a href="mailto:rabite@vet.edu.az">rabite@vet.edu.az</a>
          <a className="social-link" href={config.facebookUrl} target="_blank" rel="noopener" aria-label={t("facebookPage")}>
            <FacebookIcon />
            <span>Facebook</span>
          </a>
          <a className="social-link" href={config.instagramUrl} target="_blank" rel="noopener" aria-label={t("instagramPage")}>
            <InstagramIcon />
            <span>{t("instagramPage")}</span>
          </a>
          <div className="language-switcher" aria-label="Language">
            {languageButtons.map((item) => (
              <button
                className={item.key === language ? "is-active" : ""}
                key={item.key}
                type="button"
                aria-label={item.label}
                title={item.label}
                aria-pressed={item.key === language}
                onClick={() => setLanguage(item.key)}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ currentPath, expandedMenu, menuOpen, setExpandedMenu, setMenuOpen, t }) {
  const [expandedSubmenu, setExpandedSubmenu] = useState("");
  const navGroups = [
    {
      label: t("about"),
      key: "about",
      items: [
        { href: "/haqqimizda", label: t("centerAbout") },
        {
          href: "/rehberlik",
          label: t("team"),
          children: [
            { href: "/rehberlik", label: t("leadership") },
            { href: "/muellimler", label: t("teachers") },
            { href: "/ustalar", label: t("masters") },
          ],
        },
        { href: "/terefdaslar", label: t("partners") },
      ],
    },
    {
      label: t("education"),
      key: "education",
      items: [
        { href: "/tedris/ixtisaslar", label: t("specialties") },
        { href: "/tedris/planlar", label: t("studyPlans") },
        { href: "/tedris/proqramlar", label: t("programs") },
      ],
    },
  ];

  return (
    <header className={`site-header ${menuOpen ? "is-open" : ""}`} id="siteHeader">
      <div className="container nav-row">
        <a className="brand" href="/" aria-label={t("home")}>
          <img src="/images/rit-logo.png" alt={t("logoAlt")} />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
          aria-expanded={menuOpen}
          onClick={() => {
            setExpandedSubmenu("");
            setExpandedMenu("");
            setMenuOpen((value) => !value);
          }}
        >
          <span />
        </button>
        <nav className="primary-nav" aria-label={t("home")}>
          <ul id="mainNav">
            <li><NavLink href="/" currentPath={currentPath}>{t("home")}</NavLink></li>
            {navGroups.map((group) => (
              <li className={`has-menu ${expandedMenu === group.key ? "is-expanded" : ""}`} key={group.key}>
                <button
                  type="button"
                  aria-expanded={expandedMenu === group.key}
                  onClick={() => {
                    setExpandedSubmenu("");
                    setExpandedMenu((value) => value === group.key ? "" : group.key);
                  }}
                >
                  <span>{group.label}</span>
                  <span className="chevron" />
                </button>
                <ul className="dropdown">
                  {group.items.map((item) => (
                    <li className={item.children ? `has-submenu ${expandedSubmenu === item.href ? "is-submenu-expanded" : ""}` : ""} key={item.href}>
                      {item.children ? (
                        <>
                          <button
                            className="submenu-trigger"
                            type="button"
                            aria-expanded={expandedSubmenu === item.href}
                            onClick={() => setExpandedSubmenu((value) => value === item.href ? "" : item.href)}
                          >
                            <span>{item.label}</span>
                          </button>
                          <ul className="submenu">
                            {item.children.map((child) => (
                              <li key={child.href}><NavLink href={child.href} currentPath={currentPath}>{child.label}</NavLink></li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavLink href={item.href} currentPath={currentPath}>{item.label}</NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li><NavLink href="/ugurlu-telebeler" currentPath={currentPath}>{t("successfulStudents")}</NavLink></li>
            <li><NavLink href="/xeberler" currentPath={currentPath}>{t("news")}</NavLink></li>
            <li><NavLink href="/elaqe" currentPath={currentPath}>{t("contact")}</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ children, currentPath, href }) {
  const routePath = href.split(/[?#]/)[0];
  return <a className={currentPath === routePath ? "is-active" : ""} href={href} data-route={routePath}>{children}</a>;
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <section className="footer-brand">
          <img src="/images/rit-logo.png" alt={t("logoAlt")} />
          <p>{t("footerAbout")}</p>
        </section>
        <FooterLinks title={t("sections")} links={[["/haqqimizda", t("about")], ["/rehberlik", t("leadership")], ["/muellimler", t("teachers")], ["/ustalar", t("masters")], ["/terefdaslar", t("partners")], ["/ugurlu-telebeler", t("successfulStudents")]]} />
        <FooterLinks title={t("footerEducation")} links={[["/tedris/ixtisaslar", t("specialties")], ["/tedris/planlar", t("studyPlans")], ["/tedris/proqramlar", t("programs")]]} />
        <section>
          <h3>{t("contact")}</h3>
          <ul>
            <li><a href="tel:+994125674902">(012) 56 749 02</a></li>
            <li><a href="mailto:rabite@vet.edu.az">rabite@vet.edu.az</a></li>
            <li><a href="/elaqe">{t("campusMaps")}</a></li>
          </ul>
        </section>
      </div>
      <div className="container footer-bottom">
        <p>&copy; <span>{new Date().getFullYear()}</span> <span>{t("logoAlt")}</span>. <span>{t("allRights")}</span></p>
        <a href={config.portalUrl} target="_blank" rel="noopener">{t("admissionPortal")}</a>
      </div>
    </footer>
  );
}

function FooterLinks({ links, title }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {links.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}
      </ul>
    </section>
  );
}

function RouteView({ context, path }) {
  const props = { ...context, path };
  const routeComponents = {
    "/": Home,
    "/haqqimizda": About,
    "/rehberlik-heyet": StaffGroupPage,
    "/rehberlik": StaffGroupPage,
    "/muellimler": StaffGroupPage,
    "/ustalar": StaffGroupPage,
    "/terefdaslar": Partners,
    "/tedris/ixtisaslar": Specialties,
    "/tedris/planlar": Plans,
    "/tedris/proqramlar": Programs,
    "/ugurlu-telebeler": SuccessfulStudentsPage,
    "/xeberler": NewsPage,
    "/elaqe": Contact,
  };
  const Component = routeComponents[path] || Home;
  return <Component {...props} />;
}

function SiteLoader({ label }) {
  return (
    <section className="page-loader" aria-live="polite" aria-busy="true">
      <div className="page-loader-mark" />
      <p>{label}</p>
    </section>
  );
}

function RouteLoaderOverlay({ label }) {
  return (
    <div className="route-loader-overlay" aria-live="polite" aria-busy="true">
      <div className="page-loader-mark" />
      <p>{label}</p>
    </div>
  );
}

function PageHero({ getContent, getImage, language, path, t }) {
  const route = getContent(path);
  const lead = path === "/elaqe" ? pick(normalizeContactCopy(route.lead), language) : pick(route.lead, language);
  const heroImageKey = pageHeroImageKeys[path] || route.imageKey;
  const imageSrc = getSafeImage(getImage, heroImageKey, pageHeroFallbacks[path] || "hero", false);
  return (
    <section className={`page-hero page-hero-${heroImageKey}`}>
      <img src={imageSrc} alt="" />
      <div className="container">
        <ol className="breadcrumb">
          <li><a href="/">{t("home")}</a></li>
          <li>{pick(route.title, language)}</li>
        </ol>
        <h1>{pick(route.title, language)}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </section>
  );
}

function Home({ getContent, getImage, language, managedData, t }) {
  const content = getContent("/");
  const heroVideo = managedData.heroVideo || "/images/whatsapp/hero-video.mp4";
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <video autoPlay muted loop playsInline preload="metadata" poster={getSafeImage(getImage, "hero", "hero")} aria-hidden="true">
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>
        <div className="container hero-content">
          <p className="eyebrow">{language === "az" ? "Bakı Dövlət Peşə Təhsili Mərkəzi" : "Baku State Vocational Education Center"}</p>
          <h1>{pick(content.title, language)}</h1>
          <p className="hero-lead">{pick(content.lead, language)}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={config.portalUrl} target="_blank" rel="noopener"><EduIcon name="portal" /> {t("admissionPortal")}</a>
            <a className="button button-outline" href="/tedris/ixtisaslar"><EduIcon name="school" /> {t("viewSpecialties")}</a>
          </div>
        </div>
      </section>
      <div className="container hero-stats">
        {managedData.stats.map((item) => (
          <article className="stat-card reveal" key={item.number}>
            <strong>{item.number}</strong>
            <span>{pick(item.label, language)}</span>
          </article>
        ))}
      </div>
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <p className="eyebrow">{t("homeAboutEyebrow")}</p>
            <h2>{t("homeAboutTitle")}</h2>
            <Paragraphs value={content.body} language={language} />
            <ul className="badge-row">
              {t("homeBadges").map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <figure className="feature-media reveal">
            <img src={getSafeImage(getImage, "lab", "lab")} alt={t("homeAboutTitle")} />
          </figure>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow={t("modelEyebrow")} title={t("modelTitle")} lead={t("modelLead")}>
            <a className="button button-dark" href="/tedris/ixtisaslar"><EduIcon name="book" /> {t("educationSection")}</a>
          </SectionHead>
          <InfoGrid items={managedData.homeCards} language={language} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow={t("socialMedia")} title={t("latestNews")} lead={t("latestNewsLead")}>
            <a className="button button-teal" href={config.facebookUrl} target="_blank" rel="noopener"><EduIcon name="people" /> {t("facebookPage")}</a>
          </SectionHead>
          <NewsGrid items={managedData.news} getImage={getImage} language={language} />
        </div>
      </section>
    </>
  );
}

function About(props) {
  const { getContent, getImage, language, managedData } = props;
  const content = getContent("/haqqimizda");
  return (
    <>
      <PageHero {...props} path="/haqqimizda" />
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <h2>{language === "az" ? "Mərkəzin missiyası" : "Center mission"}</h2>
            <Paragraphs value={content.body} language={language} />
          </div>
          <figure className="feature-media reveal">
            <img src={getSafeImage(getImage, "meeting", "meeting")} alt={pick(content.title, language)} />
          </figure>
        </div>
      </section>
      <section className="section alt"><div className="container info-grid"><InfoGrid items={managedData.aboutCards} language={language} plain /></div></section>
    </>
  );
}

function StaffGroupPage(props) {
  const { getContent, getImage, language, managedData, t } = props;
  const groupId = staffRouteGroups[props.path] || "rehberlik";
  const content = getContent(props.path);
  const [activeMember, setActiveMember] = useState(null);
  const staffGroups = useMemo(() => managedData.staffGroups || [], [managedData.staffGroups]);
  const group = staffGroups.find((item) => item.id === groupId) || staffGroups[0];
  const members = group?.members || [];
  const openMember = (member) => setActiveMember({ ...member, groupTitle: group?.title || content.title });

  useEffect(() => {
    if (!activeMember) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveMember(null);
    };

    document.body.classList.add("is-locked");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeMember]);

  return (
    <>
      <PageHero {...props} path={props.path} />
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-title">
              <h2>{pick(group?.title || content.title, language)}</h2>
              <Paragraphs value={content.body} language={language} className="" />
              {group?.lead ? <p className="muted">{pick(group.lead, language)}</p> : null}
            </div>
          </div>
          {group ? (
            <section className="staff-group reveal" id={`staff-${group.id}`}>
              <div className="staff-group-head">
                <div>
                  <h3>{pick(group.title, language)}</h3>
                  <p className="muted">{pick(group.lead, language)}</p>
                </div>
                <span className="staff-count">{members.length}</span>
              </div>
              <div className="staff-grid">
                {members.map((member) => (
                  <article
                    className="staff-card"
                    key={member.name}
                    role="button"
                    tabIndex="0"
                    aria-label={`${member.name} - ${t("more")}`}
                    onClick={() => openMember(member)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openMember(member);
                      }
                    }}
                  >
                    <img src={STAFF_PLACEHOLDER_IMAGE} alt={member.name} loading="lazy" decoding="async" />
                    <div className="staff-card-body">
                      <h4>{member.name}</h4>
                      <p className="muted">{pick(member.role, language)}</p>
                      <button
                        className="more-link staff-more"
                        type="button"
                        onClick={() => openMember(member)}
                      >
                        {t("more")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <p className="muted">{t("loadingSite")}</p>
          )}
        </div>
      </section>
      {activeMember ? (
        <StaffModal
          getImage={getImage}
          language={language}
          member={activeMember}
          onClose={() => setActiveMember(null)}
          t={t}
        />
      ) : null}
    </>
  );
}

function StaffModal({ language, member, onClose, t }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="staff-modal" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
        <button className="modal-close" type="button" aria-label={t("close")} onClick={onClose}>x</button>
        <div className="staff-modal-media">
          <img src={STAFF_PLACEHOLDER_IMAGE} alt={member.name} />
        </div>
        <div className="staff-modal-body">
          <h2 id="staff-modal-title">{member.name}</h2>
          <p className="staff-modal-role">{pick(member.role, language)}</p>
          <dl className="staff-details">
            {member.details.map((item, index) => (
              <div key={`${pick(item.label, language)}-${index}`}>
                <dt>{pick(item.label, language)}</dt>
                <dd>{pick(item.value, language)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </div>
  );
}

function Partners(props) {
  const { getContent, getImage, language, managedData, t } = props;
  const content = getContent("/terefdaslar");
  return (
    <>
      <PageHero {...props} path="/terefdaslar" />
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-title">
              <h2>{t("partnerTitle")}</h2>
              <Paragraphs value={content.body} language={language} className="" />
            </div>
          </div>
          <div className="partner-grid">
            {managedData.partners.map((partner, index) => (
              <article className="partner-card reveal" key={partner.title}>
                <img src={getSafeImage(getImage, partner.image, index % 2 ? "lab" : "meeting")} alt={partner.title} />
                <div>
                  <h3>{partner.title}</h3>
                  <p className="muted">{pick(partner.body, language)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Specialties(props) {
  const { getContent, language, managedData, t } = props;
  const content = getContent("/tedris/ixtisaslar");
  const [activeGroup, setActiveGroup] = useState(null);
  const specialtyGroups = managedData.specialtyGroups || [];

  useEffect(() => {
    if (!activeGroup) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveGroup(null);
    };

    document.body.classList.add("is-locked");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeGroup]);

  return (
    <>
      <PageHero {...props} path="/tedris/ixtisaslar" />
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-title">
              <h2>{t("specialtyTitle")}</h2>
              <Paragraphs value={content.body} language={language} className="" />
            </div>
            <a className="button button-teal" href={config.portalUrl} target="_blank" rel="noopener"><EduIcon name="portal" /> {t("admissionPortal")}</a>
          </div>
          <div className="program-grid specialty-grid">
            {specialtyGroups.map((group) => (
              <button className="program-card specialty-card reveal" key={pick(group.title, language)} type="button" onClick={() => setActiveGroup(group)}>
                <span className={`card-icon ${group.tagClass || ""}`}><EduIcon name={group.icon} /></span>
                <h3>{pick(group.title, language)}</h3>
                <p className="muted">{pick(group.body, language)}</p>
                <span className="more-link">{t("more")}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {activeGroup ? (
        <SpecialtyModal group={activeGroup} language={language} onClose={() => setActiveGroup(null)} t={t} />
      ) : null}
    </>
  );
}

function SpecialtyModal({ group, language, onClose, t }) {
  const details = normalizePoints(group.details, language);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="specialty-modal" role="dialog" aria-modal="true" aria-labelledby="specialty-modal-title">
        <button className="modal-close" type="button" aria-label={t("close")} onClick={onClose}>x</button>
        <span className={`card-icon ${group.tagClass || ""}`}><EduIcon name={group.icon} /></span>
        <h2 id="specialty-modal-title">{pick(group.title, language)}</h2>
        <p className="muted">{pick(group.body, language)}</p>
        <ul className="specialty-detail-list">
          {details.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </article>
    </div>
  );
}

function Plans(props) {
  const { getContent, language, managedData } = props;
  const content = getContent("/tedris/planlar");
  return (
    <>
      <PageHero {...props} path="/tedris/planlar" />
      <section className="section">
        <div className="container section-intro reveal"><Paragraphs value={content.body} language={language} /></div>
        <div className="container program-grid">
          {managedData.planCards.map((card) => <NoticeCard card={card} key={pick(card.title, language)} language={language} />)}
        </div>
      </section>
    </>
  );
}

function Programs(props) {
  const { getContent, getImage, language, managedData, t } = props;
  const content = getContent("/tedris/proqramlar");
  const badges = language === "az" ? ["Nəzəri bilik", "Laboratoriya işi", "İstehsalat təcrübəsi", "Karyera hazırlığı"] : ["Theory", "Lab work", "Workplace practice", "Career readiness"];
  return (
    <>
      <PageHero {...props} path="/tedris/proqramlar" />
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <h2>{t("programStructure")}</h2>
            <Paragraphs value={content.body} language={language} />
            <ul className="badge-row">{badges.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <figure className="feature-media reveal">
            <img src={getSafeImage(getImage, content.imageKey, "lab")} alt={t("programStructure")} />
          </figure>
        </div>
      </section>
      <section className="section alt"><div className="container info-grid"><InfoGrid items={managedData.programCards} language={language} plain /></div></section>
    </>
  );
}

function SuccessfulStudentsPage(props) {
  const { getContent, getImage, language, managedData, t } = props;
  const content = getContent("/ugurlu-telebeler");

  return (
    <>
      <PageHero {...props} path="/ugurlu-telebeler" />
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-title">
              <p className="eyebrow">{t("successfulStudents")}</p>
              <h2>{t("successfulStudentsTitle")}</h2>
              <p>{t("successfulStudentsLead")}</p>
              <Paragraphs value={content.body} language={language} className="muted" />
            </div>
          </div>
          <NewsGrid allowPosterImages items={managedData.successfulStudents || []} getImage={getImage} language={language} />
        </div>
      </section>
    </>
  );
}

function NewsPage(props) {
  const { getImage, language, managedData } = props;
  return (
    <>
      <PageHero {...props} path="/xeberler" />
      <section className="section">
        <div className="container">
          <NewsGrid items={managedData.news} getImage={getImage} language={language} />
        </div>
      </section>
    </>
  );
}

function Contact(props) {
  const { getContent, language, managedData, t } = props;
  const content = getContent("/elaqe");
  const contactItems = normalizeContactItems(managedData.contactItems || []);
  const contactMaps = normalizeContactMaps(managedData.contactMaps || []);
  const contactBody = normalizeContactCopy(content.body);
  const socialIcons = {
    facebook: <FacebookIcon />,
    instagram: <InstagramIcon />,
  };
  return (
    <>
      <PageHero {...props} path="/elaqe" />
      <section className="section">
        <div className="container contact-layout">
          <article className="contact-card reveal">
            <span className="card-icon"><EduIcon name="map" /></span>
            <h2>{t("contactInfo")}</h2>
            <Paragraphs value={contactBody} language={language} />
            <ul className="contact-list">
              {contactItems.map((item) => (
                <li key={pick(item.label, language)}>
                  <strong>{pick(item.label, language)}</strong>
                  {item.url ? (
                    <a href={item.url} target={item.url.startsWith("http") ? "_blank" : undefined} rel={item.url.startsWith("http") ? "noopener" : undefined}>{pick(item.value, language)}</a>
                  ) : (
                    <span className="multiline-value">{pick(item.value, language)}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="contact-socials" aria-label={t("social")}>
              {(managedData.socialLinks || []).map((item) => (
                <a href={item.url} key={item.key} target="_blank" rel="noopener" aria-label={item.label} title={item.label}>
                  {socialIcons[item.key]}
                </a>
              ))}
            </div>
          </article>
          <div className="map-grid reveal">
            {contactMaps.map((item) => <MapCard item={item} key={pick(item.title, language)} language={language} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function MapCard({ item, language }) {
  const title = pick(item.title, language);
  const body = pick(item.body, language);

  return (
    <article className="map-card">
      <div className="map-frame">
        <iframe
          title={title}
          loading="lazy"
          src={item.url}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="map-card-body">
        <h3>{title}</h3>
        {body ? <p className="muted">{body}</p> : null}
      </div>
    </article>
  );
}

function SectionHead({ children, eyebrow, lead, title }) {
  return (
    <div className="section-head reveal">
      <div className="section-title">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{lead}</p>
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ items, language, plain = false }) {
  const cards = items.map((item) => (
    <article className="info-card reveal" key={pick(item.title, language)}>
      <span className={`card-icon ${item.tagClass || ""}`}><EduIcon name={item.icon} /></span>
      <h3>{pick(item.title, language)}</h3>
      <p className="muted">{pick(item.body, language)}</p>
    </article>
  ));
  return plain ? cards : <div className="info-grid">{cards}</div>;
}

function NoticeCard({ card, language }) {
  return (
    <article className="notice-card reveal">
      <span className={`card-icon ${card.tagClass || ""}`}><EduIcon name={card.icon} /></span>
      <h3>{pick(card.title, language)}</h3>
      <p className="muted">{pick(card.body, language)}</p>
      <ul>{normalizePoints(card.points, language).map((point) => <li key={point}>{point}</li>)}</ul>
    </article>
  );
}

function NewsGrid({ allowPosterImages = false, getImage, items, language }) {
  const fallbackImages = ["meeting", "lab", "hero"];

  return (
    <div className="news-grid">
      {items.map((item, index) => {
        const requestedImage = getImage(item.image);
        const requestedPoster = requestedImage.startsWith("/images/whatsapp/");
        const imageValue = requestedPoster && !allowPosterImages ? getImage(fallbackImages[index % fallbackImages.length]) : requestedImage;
        const isPoster = allowPosterImages && imageValue.startsWith("/images/whatsapp/");

        return (
          <article className={`news-card reveal ${isPoster ? "is-poster" : ""}`} key={pick(item.title, language)}>
            <img src={imageValue} alt={pick(item.title, language)} loading="lazy" decoding="async" />
            <div>
              <h3>{pick(item.title, language)}</h3>
              <p className="muted">{pick(item.body, language)}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function NotFound({ t }) {
  return (
    <section className="route-empty">
      <div className="container">
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundText")}</p>
        <a className="button button-dark" href="/">{t("backHome")}</a>
      </div>
    </section>
  );
}

