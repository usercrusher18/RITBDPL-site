export function pick(value, language = "az") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] ?? value.az ?? value.en ?? "";
  }

  return value ?? "";
}

export function normalizePoints(points, language = "az") {
  if (Array.isArray(points)) {
    return points.map((point) => pick(point, language));
  }

  if (points && typeof points === "object") {
    return points[language] || points.az || points.en || [];
  }

  return [];
}

export function mergeContent(defaultContent, saved = {}) {
  return Object.entries(defaultContent).reduce((result, [key, section]) => {
    const savedSection = saved[key] || {};

    result[key] = {
      ...section,
      ...savedSection,
      title: { ...section.title, ...(savedSection.title || {}) },
      lead: { ...section.lead, ...(savedSection.lead || {}) },
      body: { ...section.body, ...(savedSection.body || {}) },
    };

    return result;
  }, {});
}

const legacyImagePaths = new Set([
  "/images/hero.jpeg",
  "/images/training.jpeg",
  "/images/automation.jpg",
  "/images/electronics.jpg",
  "/images/design.jpg",
  "/images/lab.JPG",
  "/images/meeting.jpeg",
]);

export function mergeImages(defaultImages, saved = {}) {
  return Object.entries({ ...defaultImages, ...saved }).reduce((result, [key, value]) => {
    result[key] = shouldUseDefaultImage(value) ? defaultImages[key] : value;
    return result;
  }, {});
}

function shouldUseDefaultImage(value) {
  if (typeof value !== "string" || !value.trim()) return true;
  if (legacyImagePaths.has(value)) return true;
  if (value.startsWith("/images/whatsapp/campus-")) return true;
  return !/^(\/|https?:\/\/|data:image\/|blob:)/i.test(value);
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function chunk(items, size) {
  return items.reduce((groups, item, index) => {
    const groupIndex = Math.floor(index / size);
    groups[groupIndex] = groups[groupIndex] || [];
    groups[groupIndex].push(item);
    return groups;
  }, []);
}

export function splitLines(value) {
  return String(value || "")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxWidth = 1800;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
