import { inMemoryPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import config from "../data/siteConfig";
import { auth } from "../services/auth";
import { db, doc, getDoc, setDoc } from "../services/firestore";
import { clone, mergeContent, mergeImages, pick, resizeImageFile, splitLines } from "../utils/siteHelpers";
import EduIcon from "./EduIcon";

const ADMIN_FRESH_LOGIN_KEY = "ritbdplAdminFreshLogin";
const LOGO_SRC = "/images/rit-logo.png";
const STAFF_PLACEHOLDER_IMAGE = "/images/staff-placeholder.svg";
const languages = ["az", "en"];

const fieldSets = {
  stats: [
    { key: "number", label: "Rəqəm", type: "text" },
    { key: "label", label: "Etiket", type: "localized" },
  ],
  info: [
    { key: "title", label: "Başlıq", type: "localized" },
    { key: "body", label: "Mətn", type: "localizedTextarea" },
  ],
  team: [
    { key: "initials", label: "Qısa işarə", type: "text" },
    { key: "title", label: "Başlıq", type: "localized" },
    { key: "body", label: "Mətn", type: "localizedTextarea" },
    { key: "points", label: "Siyahı maddələri", type: "localizedLines" },
  ],
  partners: [
    { key: "tag", label: "Tag", type: "localized" },
    { key: "title", label: "Başlıq", type: "text" },
    { key: "body", label: "Mətn", type: "localizedTextarea" },
    { key: "image", label: "Şəkil URL/path", type: "image" },
  ],
  specialties: [{ key: "$value", label: "İxtisas adı", type: "localized" }],
  specialtyGroups: [
    { key: "icon", label: "İkon", type: "text" },
    { key: "title", label: "Başlıq", type: "localized" },
    { key: "body", label: "Mətn", type: "localizedTextarea" },
    { key: "details", label: "Siyahı maddələri", type: "localizedLines" },
  ],
  staffMember: [
    { key: "name", label: "Ad Soyad", type: "text" },
    { key: "role", label: "Vəzifə", type: "localized" },
    { key: "specialty", label: "İxtisas / istiqamət", type: "localized" },
    { key: "details", label: "Məlumat sətirləri", type: "detailsLines" },
  ],
  news: [
    { key: "tag", label: "Tag", type: "localized" },
    { key: "title", label: "Başlıq", type: "localized" },
    { key: "body", label: "Mətn", type: "localizedTextarea" },
    { key: "image", label: "Şəkil URL/path", type: "image" },
    { key: "url", label: "Link", type: "text" },
  ],
  contactItems: [
    { key: "label", label: "Etiket", type: "localized" },
    { key: "value", label: "Dəyər", type: "localized" },
    { key: "url", label: "Link", type: "text" },
  ],
  contactMaps: [
    { key: "title", label: "Başlıq", type: "localized" },
    { key: "body", label: "Ünvan", type: "localizedTextarea" },
    { key: "url", label: "Xəritə embed linki", type: "text" },
  ],
};

const adminStaffRouteGroups = {
  "/rehberlik-heyet": "rehberlik",
  "/rehberlik": "rehberlik",
  "/muellimler": "muellimler",
  "/ustalar": "ustalar",
};

const sectionCardGroups = {
  "/": [
    { key: "stats", title: "Statistika kartları", fields: fieldSets.stats },
    { key: "homeCards", title: "Tədris modeli kartları", fields: fieldSets.info },
    { key: "news", title: "Ana səhifədəki son xəbər kartları", fields: fieldSets.news },
  ],
  "/haqqimizda": [{ key: "aboutCards", title: "Haqqımızda kartları", fields: fieldSets.info }],
  "/terefdaslar": [{ key: "partners", title: "Tərəfdaş kartları", fields: fieldSets.partners }],
  "/tedris/ixtisaslar": [{ key: "specialtyGroups", title: "İxtisas kartları", fields: fieldSets.specialtyGroups }],
  "/tedris/planlar": [{ key: "planCards", title: "Tədris planı kartları", fields: fieldSets.info.concat([{ key: "points", label: "Siyahı maddələri", type: "localizedLines" }]) }],
  "/tedris/proqramlar": [{ key: "programCards", title: "Təhsil proqramı kartları", fields: fieldSets.info }],
  "/ugurlu-telebeler": [{ key: "successfulStudents", title: "Uğurlu tələbə kartları", fields: fieldSets.news }],
  "/xeberler": [{ key: "news", title: "Xəbər kartları", fields: fieldSets.news }],
  "/elaqe": [
    { key: "contactItems", title: "Əlaqə məlumat kartı", fields: fieldSets.contactItems },
    { key: "contactMaps", title: "Xəritə kartları", fields: fieldSets.contactMaps },
  ],
};

function getInitialSectionKey() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const normalized = rawHash && rawHash !== "home" ? rawHash : "/";
  return config.adminSections.some((section) => section.key === normalized) ? normalized : "/";
}

async function fbGet(docId) {
  const snap = await getDoc(doc(db, "siteData", docId));
  return snap.exists() ? snap.data() : null;
}

async function fbSet(docId, data) {
  await setDoc(doc(db, "siteData", docId), data);
}

function normalizeManagedData(data) {
  const sourceGroups = Array.isArray(data.staffGroups) && data.staffGroups.some((group) => group?.id)
    ? data.staffGroups
    : config.siteData.staffGroups;

  return {
    ...data,
    staffGroups: config.siteData.staffGroups.map((defaultGroup) => {
      const group = sourceGroups.find((item) => item.id === defaultGroup.id) || defaultGroup;
      return {
      ...defaultGroup,
      ...group,
      members: (group.members || []).map((member) => ({
        ...member,
        image: STAFF_PLACEHOLDER_IMAGE,
        details: Array.isArray(member.details) ? member.details : [],
      })),
    };
    }),
  };
}

export default function AdminPanel() {
  const [adminUser, setAdminUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState(getInitialSectionKey);
  const [managedImages, setManagedImages] = useState(() => mergeImages(config.defaultImages, {}));
  const [managedContent, setManagedContent] = useState(() => mergeContent(config.defaultContent, {}));
  const [managedData, setManagedData] = useState(() => normalizeManagedData(clone(config.siteData)));
  const [status, setStatus] = useState("");

  const t = useCallback((key) => config.dictionary.az[key] ?? key, []);
  const getImage = useCallback((key) => managedImages[key] || config.defaultImages[key] || key, [managedImages]);
  const getContent = useCallback((key) => managedContent[key] || config.defaultContent[key], [managedContent]);
  const sectionLabel = useCallback((key) => t(config.sectionOrder.find((item) => item.key === key)?.labelKey || "home"), [t]);

  useEffect(() => {
    document.title = `Admin Panel | ${t("siteName")}`;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && sessionStorage.getItem(ADMIN_FRESH_LOGIN_KEY) !== "1") {
        await signOut(auth).catch(() => undefined);
        setAdminUser(null);
        setAuthReady(true);
        return;
      }

      setAdminUser(user);
      if (user) {
        const [content, images, data] = await Promise.all([
          fbGet("managedContent").catch(() => null),
          fbGet("managedImages").catch(() => null),
          fbGet("managedData").catch(() => null),
        ]);
        if (content) setManagedContent(mergeContent(config.defaultContent, content));
        if (images) setManagedImages(mergeImages(config.defaultImages, images));
        if (data) setManagedData(normalizeManagedData({ ...clone(config.siteData), ...data }));
      }
      setAuthReady(true);
    });

    return unsubscribe;
  }, [t]);

  useEffect(() => {
    const onHashChange = () => setActiveSectionKey(getInitialSectionKey());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  async function saveManagedContent(nextContent) {
    await fbSet("managedContent", nextContent);
    setManagedContent(mergeContent(config.defaultContent, nextContent));
  }

  async function saveManagedImages(nextImages) {
    await fbSet("managedImages", nextImages);
    setManagedImages(mergeImages(config.defaultImages, nextImages));
  }

  async function saveManagedData(nextData) {
    const normalizedData = normalizeManagedData(nextData);
    await fbSet("managedData", normalizedData);
    setManagedData(normalizeManagedData({ ...clone(config.siteData), ...normalizedData }));
  }

  async function resetAll() {
    if (!confirm("Bütün admin dəyişiklikləri silinsin?")) return;
    setStatus("Sıfırlanır...");
    try {
      await Promise.all([fbSet("managedContent", {}), fbSet("managedImages", {}), fbSet("managedData", {})]);
      setManagedContent(mergeContent(config.defaultContent, {}));
      setManagedImages(mergeImages(config.defaultImages, {}));
      setManagedData(normalizeManagedData(clone(config.siteData)));
      setStatus("Bütün dəyişikliklər sıfırlandı.");
    } catch (error) {
      setStatus(`Xəta: ${error.message}`);
    }
  }

  async function resetSection(sectionKey) {
    if (!confirm(`${sectionLabel(sectionKey)} bölməsi standart vəziyyətə qaytarılsın?`)) return;
    const nextContent = clone(managedContent);
    const nextImages = { ...managedImages };
    const nextData = clone(managedData);
    const imageKey = config.defaultContent[sectionKey]?.imageKey;
    const staffGroupId = adminStaffRouteGroups[sectionKey];

    delete nextContent[sectionKey];
    if (imageKey) delete nextImages[imageKey];
    if (staffGroupId) {
      const defaultGroup = config.siteData.staffGroups.find((group) => group.id === staffGroupId);
      nextData.staffGroups = (nextData.staffGroups || []).map((group) => (
        group.id === staffGroupId ? clone(defaultGroup) : group
      ));
    }
    (sectionCardGroups[sectionKey] || []).forEach((group) => {
      nextData[group.key] = clone(config.siteData[group.key]);
    });

    setStatus("Sıfırlanır...");
    try {
      await Promise.all([saveManagedContent(nextContent), saveManagedImages(nextImages), saveManagedData(nextData)]);
      setStatus("Bölmə sıfırlandı.");
    } catch (error) {
      setStatus(`Xəta: ${error.message}`);
    }
  }

  function selectSection(sectionKey) {
    const next = config.adminSections.some((section) => section.key === sectionKey) ? sectionKey : "/";
    setActiveSectionKey(next);
    window.history.replaceState(null, "", `#${next}`);
  }

  async function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_FRESH_LOGIN_KEY);
    await signOut(auth);
  }

  const editorContext = {
    activeSectionKey,
    getContent,
    getImage,
    managedContent,
    managedData,
    managedImages,
    saveManagedContent,
    saveManagedData,
    saveManagedImages,
    sectionLabel,
    setManagedContent,
    setManagedData,
    setManagedImages,
    setStatus,
    status,
  };

  if (!authReady) {
    return <main className="admin-login"><article className="admin-login-card"><p className="muted">Yüklənir...</p></article></main>;
  }

  if (!adminUser) {
    return <LoginPanel setStatus={setStatus} status={status} />;
  }

  const publicHref = activeSectionKey === "/" ? "/" : `/#${activeSectionKey}`;
  const isStaffAdminSection = Boolean(adminStaffRouteGroups[activeSectionKey]);

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img className="admin-logo" src={LOGO_SRC} alt={t("siteName")} />
          <p>Sayt idarəetməsi</p>
        </div>
        <nav aria-label="Admin bölmələri">
          <p className="admin-nav-title">Sayt bölmələri</p>
          <ul className="admin-nav">
            {config.adminSections.map((section) => (
              <li key={section.key}>
                <button className={section.key === activeSectionKey ? "is-active" : ""} type="button" onClick={() => selectSection(section.key)}>
                  <EduIcon name="edit" /> {t(section.labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="admin-nav admin-nav-bottom">
          <li><a href={publicHref} target="_blank" rel="noopener"><EduIcon name="portal" /> Public sayta bax</a></li>
          <li><button type="button" onClick={resetAll}><EduIcon name="reset" /> Bütün dəyişiklikləri sıfırla</button></li>
          <li><button type="button" onClick={logoutAdmin}><EduIcon name="logout" /> Çıxış</button></li>
        </ul>
      </aside>
      <div className="admin-main">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow">Bölmə redaktəsi</p>
            <h1>{sectionLabel(activeSectionKey)}</h1>
            <p>{isStaffAdminSection ? "Bu bölmədə başlıq paneli yoxdur; əməkdaş kartlarını əlavə et, düzəlt və ya sil." : "Başlıq, qısa giriş, geniş məlumat, bölmə fotoları və kartlar ayrıca AZ/EN mətnləri ilə yenilənir."}</p>
          </div>
          <div className="admin-actions">
            <a className="button button-dark" href={publicHref} target="_blank" rel="noopener">Saytı aç</a>
          </div>
        </div>
        <SectionEditor {...editorContext} resetSection={resetSection} />
      </div>
    </section>
  );
}

function LoginPanel({ setStatus, status }) {
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("Giriş edilir...");
    try {
      await setPersistence(auth, inMemoryPersistence);
      sessionStorage.setItem(ADMIN_FRESH_LOGIN_KEY, "1");
      await signInWithEmailAndPassword(auth, String(data.get("email") || "").trim(), String(data.get("password") || ""));
      setStatus("");
    } catch {
      sessionStorage.removeItem(ADMIN_FRESH_LOGIN_KEY);
      setStatus("Email və ya şifrə yanlışdır.");
    }
  }

  return (
    <main className="admin-login">
      <article className="admin-login-card">
        <img className="admin-logo" src={LOGO_SRC} alt={config.dictionary.az.siteName} />
        <p className="eyebrow">İdarəetmə girişi</p>
        <h1>Admin Panel</h1>
        <p className="muted">Səhifə mətnləri, fotolar və bütün bölmə kartları buradan idarə olunur.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="adminEmail">Email</label>
            <input id="adminEmail" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="adminPassword">Şifrə</label>
            <div className="password-field">
              <input id="adminPassword" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                title={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                onClick={() => setShowPassword((value) => !value)}
              >
                <EduIcon name={showPassword ? "eyeOff" : "eye"} />
              </button>
            </div>
          </div>
          <button className="button button-dark" type="submit"><EduIcon name="shield" /> Daxil ol</button>
          <p className="status-message">{status}</p>
        </form>
      </article>
    </main>
  );
}

function SectionEditor(props) {
  const {
    activeSectionKey,
    getContent,
    getImage,
    managedContent,
    managedData,
    managedImages,
    resetSection,
    saveManagedContent,
    saveManagedData,
    saveManagedImages,
    sectionLabel,
    setManagedContent,
    setManagedData,
    setManagedImages,
    setStatus,
    status,
  } = props;
  const content = getContent(activeSectionKey);
  const imageKey = content.imageKey;
  const imageValue = getImage(imageKey);
  const isStaffSection = Boolean(adminStaffRouteGroups[activeSectionKey]);
  const showMediaPanel = !isStaffSection && activeSectionKey !== "/" && Boolean(imageKey);
  const showContentPanels = !isStaffSection;

  function updateContent(language, field, value) {
    setManagedContent((current) => ({
      ...current,
      [activeSectionKey]: {
        ...(current[activeSectionKey] || config.defaultContent[activeSectionKey]),
        [field]: {
          ...((current[activeSectionKey] || config.defaultContent[activeSectionKey])[field] || {}),
          [language]: value,
        },
      },
    }));
  }

  function updateSectionImage(value) {
    setManagedImages((current) => ({ ...current, [imageKey]: value || config.defaultImages[imageKey] }));
  }

  async function handleSectionImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Şəkil hazırlanır...");
    try {
      updateSectionImage(await resizeImageFile(file));
      setStatus("Şəkil əlavə olundu. Yadda saxla düyməsini sıx.");
    } catch {
      setStatus("Şəkli oxumaq mümkün olmadı.");
    }
  }

  async function save(event) {
    event.preventDefault();
    setStatus("Saxlanır...");
    try {
      await Promise.all([
        saveManagedContent(managedContent),
        saveManagedImages(managedImages),
        saveManagedData(managedData),
      ]);
      setStatus("Dəyişikliklər Firebase-ə saxlanıldı.");
    } catch (error) {
      setStatus(`Xəta: ${error.message}`);
    }
  }

  return (
    <form className="admin-form" onSubmit={save}>
      {showContentPanels ? <div className={`admin-editor-grid ${showMediaPanel ? "" : "no-media"}`}>
        <section className="admin-panel">
          <div className="panel-head">
            <div>
              <h2>Mətnlər</h2>
              <p>Bu sahələr public saytda seçilmiş dilə görə göstərilir.</p>
            </div>
            <span className="tag">{activeSectionKey}</span>
          </div>
          <div className="language-editor-grid">
            {["az", "en"].map((language) => (
              <article className="language-panel" key={language}>
                <div className="language-panel-title">
                  <span>{language.toUpperCase()}</span>
                  <strong>{language === "az" ? "Azərbaycan dili" : "English"}</strong>
                </div>
                {["title", "lead", "body"].map((field) => (
                  <div className="field" key={field}>
                    <label htmlFor={`${field}-${language}`}>{field === "title" ? "Başlıq" : field === "lead" ? "Qısa giriş" : "Məlumat"}</label>
                    {field === "title" ? (
                      <input id={`${field}-${language}`} value={content[field]?.[language] || ""} onChange={(event) => updateContent(language, field, event.target.value)} required />
                    ) : (
                      <textarea id={`${field}-${language}`} rows={field === "body" ? 8 : 3} value={content[field]?.[language] || ""} onChange={(event) => updateContent(language, field, event.target.value)} required />
                    )}
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
        {showMediaPanel ? (
          <aside className="admin-panel media-panel">
            <div className="panel-head">
              <div>
                <h2>Foto</h2>
                <p>URL/path yaz və ya kompüterdən şəkil seç.</p>
              </div>
              <span className="tag">{imageKey}</span>
            </div>
            <img className="section-image-preview" src={imageValue} alt={sectionLabel(activeSectionKey)} />
            <div className="field">
              <label htmlFor="sectionImagePath">Şəkil yolu və ya URL</label>
              <input id="sectionImagePath" type="text" value={imageValue} onChange={(event) => updateSectionImage(event.target.value)} autoComplete="off" />
            </div>
            <div className="upload-row">
              <input className="sr-only-file" id="sectionImageFile" type="file" accept="image/*" onChange={handleSectionImageFile} />
              <label className="file-picker" htmlFor="sectionImageFile"><EduIcon name="image" /> Şəkil seç</label>
              <button className="button button-soft" type="button" onClick={() => updateSectionImage(config.defaultImages[imageKey])}><EduIcon name="reset" /> Fotonu sıfırla</button>
            </div>
            <p className="help-text">Seçilən fayl brauzerdə kiçildilərək saxlanılır.</p>
          </aside>
        ) : null}
      </div> : null}
      <CardEditors
        activeSectionKey={activeSectionKey}
        getImage={getImage}
        managedData={managedData}
        setManagedData={setManagedData}
        setStatus={setStatus}
      />
      <StaffCardEditors
        activeSectionKey={activeSectionKey}
        managedData={managedData}
        setManagedData={setManagedData}
        setStatus={setStatus}
      />
      <div className="admin-savebar">
        <div className="admin-actions">
          <button className="button button-primary" type="submit"><EduIcon name="save" /> Yadda saxla</button>
          <button className="button button-dark" type="button" onClick={() => resetSection(activeSectionKey)}><EduIcon name="reset" /> Bu bölməni sıfırla</button>
        </div>
        <p className={`status-message ${status.includes("saxlan") || status.includes("olundu") ? "success" : ""}`}>{status}</p>
      </div>
    </form>
  );
}

function StaffCardEditors({ activeSectionKey, managedData, setManagedData, setStatus }) {
  const staffGroupId = adminStaffRouteGroups[activeSectionKey];
  const [editingCard, setEditingCard] = useState(null);

  const staffGroup = (managedData.staffGroups || []).find((group) => group.id === staffGroupId);
  const members = staffGroup?.members || [];
  const editorGroup = staffGroup ? {
    key: staffGroup.id,
    title: pick(staffGroup.title, "az") || staffGroup.id,
    fields: fieldSets.staffMember,
  } : null;

  const updateMember = useCallback((groupId, index, field, value, language) => {
    setManagedData((current) => ({
      ...current,
      staffGroups: (current.staffGroups || []).map((group) => {
        if (group.id !== groupId) return group;

        const nextMembers = (group.members || []).slice();
        const member = { ...(nextMembers[index] || {}), image: STAFF_PLACEHOLDER_IMAGE };

        if (field.type === "localized" || field.type === "localizedTextarea") {
          member[field.key] = { ...(member[field.key] || {}), [language]: value };
        } else if (field.type === "detailsLines") {
          member.details = mergeDetailLines(member.details, value, language);
        } else {
          member[field.key] = value;
        }

        nextMembers[index] = member;
        return { ...group, members: nextMembers };
      }),
    }));
  }, [setManagedData]);

  const addMember = useCallback(() => {
    setManagedData((current) => ({
      ...current,
      staffGroups: (current.staffGroups || []).map((group) => {
        if (group.id !== staffGroupId) return group;

        const nextMembers = [
          ...(group.members || []),
          {
            name: "Yeni əməkdaş",
            image: STAFF_PLACEHOLDER_IMAGE,
            role: { az: "", en: "" },
            specialty: { az: "", en: "" },
            details: [],
          },
        ];
        setEditingCard({ groupKey: group.id, index: nextMembers.length - 1 });
        return { ...group, members: nextMembers };
      }),
    }));
    setStatus("Yeni əməkdaş kartı əlavə olundu. Doldurub yadda saxla.");
  }, [setManagedData, setStatus, staffGroupId]);

  const removeMember = useCallback((index) => {
    if (!confirm(`Kart ${index + 1} silinsin?`)) return;

    setManagedData((current) => ({
      ...current,
      staffGroups: (current.staffGroups || []).map((group) => (
        group.id === staffGroupId
          ? { ...group, members: (group.members || []).filter((_, itemIndex) => itemIndex !== index) }
          : group
      )),
    }));
    setEditingCard((current) => {
      if (!current) return current;
      if (current.index === index) return null;
      if (current.index > index) return { ...current, index: current.index - 1 };
      return current;
    });
    setStatus("Kart silindi. Yadda saxla.");
  }, [setManagedData, setStatus, staffGroupId]);

  useEffect(() => {
    if (!editingCard) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setEditingCard(null);
    };

    document.body.classList.add("is-locked");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editingCard]);

  if (!staffGroup || !editorGroup) return null;

  const editingItem = members[editingCard?.index];

  return (
    <section className="admin-panel card-editor-panel">
      <div className="panel-head">
        <div>
          <h2>Kartlar</h2>
        </div>
        <button className="icon-action add" type="button" aria-label="Kart əlavə et" onClick={addMember}>
          +
        </button>
      </div>
      <div className="card-editor-list">
        {members.map((member, index) => (
          <article className="managed-card-editor" key={`${staffGroup.id}-${member.name}-${index}`}>
            <div className="managed-card-title">
              <strong>Kart {index + 1}</strong>
              <div className="managed-card-actions">
                <button className="button button-soft" type="button" onClick={() => setEditingCard({ groupKey: staffGroup.id, index })}><EduIcon name="edit" /> Düzəlt</button>
                <button className="icon-action remove" type="button" aria-label={`Kart ${index + 1} sil`} onClick={() => removeMember(index)}>
                  -
                </button>
              </div>
            </div>
            <AdminCardPreview getImage={(value) => value || STAFF_PLACEHOLDER_IMAGE} group={editorGroup} item={{ ...member, image: STAFF_PLACEHOLDER_IMAGE }} />
          </article>
        ))}
      </div>
      {editingItem ? (
        <CardEditorModal
          getImage={(value) => value || STAFF_PLACEHOLDER_IMAGE}
          group={editorGroup}
          index={editingCard.index}
          item={{ ...editingItem, image: STAFF_PLACEHOLDER_IMAGE }}
          onChange={updateMember}
          onClose={() => setEditingCard(null)}
          onUpload={() => undefined}
        />
      ) : null}
    </section>
  );
}

function CardEditors({ activeSectionKey, getImage, managedData, setManagedData, setStatus }) {
  const groups = sectionCardGroups[activeSectionKey] || [];
  const [editingCard, setEditingCard] = useState(null);

  const updateCard = useCallback((groupKey, index, field, value, language) => {
    setManagedData((current) => {
      const currentGroup = current[groupKey] || [];
      const currentItem = currentGroup[index] || {};
      const item = field.key === "$value" ? { ...currentItem } : { ...currentItem };

      if (field.type === "localized" || field.type === "localizedTextarea") {
        if (field.key === "$value") {
          item[language] = value;
        } else {
          item[field.key] = { ...(item[field.key] || {}), [language]: value };
        }
      } else if (field.type === "localizedLines") {
        item[field.key] = { ...(item[field.key] || {}), [language]: splitLines(value) };
      } else {
        item[field.key] = value;
      }

      const nextGroup = currentGroup.slice();
      nextGroup[index] = item;

      return {
        ...current,
        [groupKey]: nextGroup,
      };
    });
  }, [setManagedData]);

  const addCard = useCallback((group) => {
    setManagedData((current) => {
      const currentGroup = current[group.key] || [];
      const nextGroup = [...currentGroup, buildNewCard(group, currentGroup.at(-1))];
      setEditingCard({ groupKey: group.key, index: nextGroup.length - 1 });

      return {
        ...current,
        [group.key]: nextGroup,
      };
    });
    setStatus("Yeni kart əlavə olundu. Doldurub yadda saxla.");
  }, [setEditingCard, setManagedData, setStatus]);

  const removeCard = useCallback((groupKey, index) => {
    if (!confirm(`Kart ${index + 1} silinsin?`)) return;

    setManagedData((current) => {
      const nextGroup = (current[groupKey] || []).filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        [groupKey]: nextGroup,
      };
    });
    setEditingCard((current) => {
      if (current?.groupKey !== groupKey) return current;
      if (current.index === index) return null;
      if (current.index > index) return { ...current, index: current.index - 1 };
      return current;
    });
    setStatus("Kart silindi. Yadda saxla.");
  }, [setEditingCard, setManagedData, setStatus]);

  async function uploadCardImage(groupKey, index, field, file) {
    if (!file) return;
    setStatus("Kart fotosu hazırlanır...");
    try {
      const dataUrl = await resizeImageFile(file);
      updateCard(groupKey, index, field, dataUrl);
      setStatus("Kart fotosu əlavə olundu. Yadda saxla düyməsini sıx.");
    } catch {
      setStatus("Kart fotosunu oxumaq mümkün olmadı.");
    }
  }

  useEffect(() => {
    if (!editingCard) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setEditingCard(null);
    };

    document.body.classList.add("is-locked");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [editingCard]);

  if (!groups.length) return null;

  const editingGroup = groups.find((group) => group.key === editingCard?.groupKey);
  const editingItem = editingGroup ? managedData[editingGroup.key]?.[editingCard.index] : null;

  return (
    <section className="admin-panel card-editor-panel">
      <div className="panel-head">
        <div>
          <h2>Kartlar</h2>
        </div>
      </div>
      <div className="card-editor-groups">
        {groups.map((group) => (
          <section className="card-editor-group" key={group.key}>
            <div className="card-editor-group-head">
              <h3>{group.title}</h3>
              <button className="icon-action add" type="button" aria-label={`${group.title} üçün kart əlavə et`} onClick={() => addCard(group)}>
                +
              </button>
            </div>
            <div className="card-editor-list">
              {(managedData[group.key] || []).map((item, index) => (
                <article className="managed-card-editor" key={`${group.key}-${index}`}>
                  <div className="managed-card-title">
                    <strong>Kart {index + 1}</strong>
                    <div className="managed-card-actions">
                      <button className="button button-soft" type="button" onClick={() => setEditingCard({ groupKey: group.key, index })}><EduIcon name="edit" /> Düzəlt</button>
                      <button className="icon-action remove" type="button" aria-label={`Kart ${index + 1} sil`} onClick={() => removeCard(group.key, index)}>
                        -
                      </button>
                    </div>
                  </div>
                  <AdminCardPreview getImage={getImage} group={group} item={item} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      {editingGroup && editingItem ? (
        <CardEditorModal
          getImage={getImage}
          group={editingGroup}
          index={editingCard.index}
          item={editingItem}
          onChange={updateCard}
          onClose={() => setEditingCard(null)}
          onUpload={uploadCardImage}
        />
      ) : null}
    </section>
  );
}

function buildNewCard(group, source) {
  if (group.fields.some((field) => field.key === "$value")) {
    return { az: "", en: "" };
  }

  const item = source ? clone(source) : {};

  if (!item.icon && ["homeCards", "aboutCards", "planCards", "programCards"].includes(group.key)) {
    item.icon = "school";
  }

  group.fields.forEach((field) => {
    if (field.type === "localized" || field.type === "localizedTextarea") {
      item[field.key] = { az: "", en: "" };
    } else if (field.type === "localizedLines") {
      item[field.key] = { az: [], en: [] };
    } else if (field.type === "image") {
      item[field.key] = item[field.key] || "hero";
    } else {
      item[field.key] = "";
    }
  });

  return item;
}

function CardEditorModal({ getImage, group, index, item, onChange, onClose, onUpload }) {
  return (
    <div
      className="modal-backdrop admin-card-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="admin-card-modal" role="dialog" aria-modal="true" aria-labelledby="admin-card-modal-title">
        <button className="modal-close" type="button" aria-label="Bağla" onClick={onClose}>x</button>
        <div className="admin-card-modal-head">
          <div>
            <p className="eyebrow">{group.key}</p>
            <h2 id="admin-card-modal-title">{group.title} / Kart {index + 1}</h2>
          </div>
          <button className="button button-dark" type="button" onClick={onClose}>Hazır</button>
        </div>
        <div className="admin-card-modal-grid">
          <AdminCardPreview getImage={getImage} group={group} item={item} />
          <div className="managed-card-fields modal-card-fields">
            {group.fields.map((field) => (
              <ManagedField
                field={field}
                groupKey={group.key}
                index={index}
                item={item}
                key={field.key}
                onChange={onChange}
                onUpload={onUpload}
              />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

function AdminCardPreview({ getImage, group, item }) {
  const imageValue = item?.image ? getImage(item.image) : "";
  const title = readPreviewTitle(item);
  const body = readPreviewBody(item);
  const tag = readPreviewTag(item, group);
  const points = readCardLines(item, "points", "az").length ? readCardLines(item, "points", "az") : readCardLines(item, "details", "az");

  return (
    <div className={`admin-card-preview ${imageValue ? "has-image" : ""}`}>
      {imageValue ? <img src={imageValue} alt="" /> : null}
      <div className="admin-card-preview-body">
        <div className="admin-card-preview-top">
          {item?.number ? <strong className="admin-stat-number">{item.number}</strong> : null}
          {item?.initials ? <span className="admin-avatar">{item.initials}</span> : null}
          {tag ? <span className={`tag ${item?.tagClass || ""}`}>{tag}</span> : null}
        </div>
        <h4>{title || group.title}</h4>
        {body ? <p>{body}</p> : null}
        {points.length ? <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
        {item?.url ? <span className="admin-preview-link">Daha çox</span> : null}
      </div>
    </div>
  );
}

function ManagedField({ field, groupKey, index, item, onChange, onUpload }) {
  const fieldId = `card-${groupKey}-${index}-${field.key}`.replaceAll(/[^a-zA-Z0-9_-]/g, "-");

  if (field.type === "detailsLines") {
    return (
      <div className="field card-field-wide">
        <label>{field.label}</label>
        <div className="card-language-fields">
          {languages.map((language) => (
            <div className="field" key={language}>
              <label htmlFor={`${fieldId}-${language}`}>{language.toUpperCase()}</label>
              <textarea
                id={`${fieldId}-${language}`}
                rows="5"
                value={detailsToLines(item.details, language).join("\n")}
                onChange={(event) => onChange(groupKey, index, field, event.target.value, language)}
              />
            </div>
          ))}
        </div>
        <p className="help-text">Hər sətri "Etiket: məlumat" formatında yaz.</p>
      </div>
    );
  }

  if (field.type === "localized" || field.type === "localizedTextarea" || field.type === "localizedLines") {
    return (
      <div className="field card-field-wide">
        <label>{field.label}</label>
        <div className="card-language-fields">
          {languages.map((language) => {
            const value = field.type === "localizedLines" ? readCardLines(item, field.key, language).join("\n") : readLocalizedCardField(item, field.key, language);
            return (
              <div className="field" key={language}>
                <label htmlFor={`${fieldId}-${language}`}>{language.toUpperCase()}</label>
                {field.type === "localizedTextarea" || field.type === "localizedLines" ? (
                  <textarea id={`${fieldId}-${language}`} rows={field.type === "localizedLines" ? 4 : 3} value={value} onChange={(event) => onChange(groupKey, index, field, event.target.value, language)} />
                ) : (
                  <input id={`${fieldId}-${language}`} type="text" value={value} onChange={(event) => onChange(groupKey, index, field, event.target.value, language)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <div className="field card-field-wide">
        <label htmlFor={fieldId}>{field.label}</label>
        <input id={fieldId} type="text" value={readCardField(item, field.key)} onChange={(event) => onChange(groupKey, index, field, event.target.value)} autoComplete="off" />
        <div className="upload-row card-upload-row">
          <input className="sr-only-file" id={`${fieldId}-file`} type="file" accept="image/*" onChange={(event) => onUpload(groupKey, index, field, event.target.files?.[0])} />
          <label className="file-picker" htmlFor={`${fieldId}-file`}><EduIcon name="image" /> Kart fotosu seç</label>
        </div>
      </div>
    );
  }

  return (
    <div className="field">
      <label htmlFor={fieldId}>{field.label}</label>
      <input id={fieldId} type="text" value={readCardField(item, field.key)} onChange={(event) => onChange(groupKey, index, field, event.target.value)} autoComplete="off" />
    </div>
  );
}

function detailsToLines(details = [], language) {
  return details.map((item) => {
    const label = pick(item.label, language);
    const value = pick(item.value, language);
    return label ? `${label}: ${value}` : value;
  }).filter(Boolean);
}

function mergeDetailLines(details = [], value, language) {
  return splitLines(value).map((line, index) => {
    const current = details[index] || {};
    const separatorIndex = line.indexOf(":");
    const label = separatorIndex >= 0 ? line.slice(0, separatorIndex).trim() : "";
    const detailValue = separatorIndex >= 0 ? line.slice(separatorIndex + 1).trim() : line;

    return {
      label: { ...(current.label || {}), [language]: label },
      value: { ...(current.value || {}), [language]: detailValue },
    };
  });
}

function readPreviewTitle(item) {
  if (item?.name) return item.name;
  if (item?.title && typeof item.title === "object") return item.title.az || item.title.en || "";
  if (item?.title) return item.title;
  if (item?.label && typeof item.label === "object") return item.label.az || item.label.en || "";
  if (item?.value && typeof item.value === "object") return item.value.az || item.value.en || "";
  if (item?.az || item?.en) return item.az || item.en;
  return "";
}

function readPreviewBody(item) {
  if (item?.specialty) return pick(item.specialty, "az");
  if (item?.body && typeof item.body === "object") return item.body.az || item.body.en || "";
  if (item?.body) return item.body;
  if (item?.label && item?.value) {
    const label = item.label.az || item.label.en || "";
    const value = item.value.az || item.value.en || "";
    return label && value ? `${label}: ${value}` : value;
  }
  return "";
}

function readPreviewTag(item, group) {
  if (item?.role) return pick(item.role, "az");
  if (item?.tag && typeof item.tag === "object") return item.tag.az || item.tag.en || "";
  if (item?.tag) return item.tag;
  if (group.key === "news") return "Xəbər";
  return "";
}

function readCardField(item, key) {
  return key === "$value" ? "" : (item?.[key] || "");
}

function readLocalizedCardField(item, key, language) {
  const value = key === "$value" ? item : item?.[key];
  return value?.[language] || "";
}

function readCardLines(item, key, language) {
  const value = item?.[key];
  if (Array.isArray(value)) return value.map((point) => pick(point, language));
  if (value && typeof value === "object") return value[language] || [];
  return [];
}

