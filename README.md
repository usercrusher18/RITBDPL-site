# RITBDPL Sayt

Rabitə və İnformasiya Texnologiyaları üzrə Bakı Dövlət Peşə Təhsili Mərkəzi üçün React + Vite public sayt və admin panel.

## İşə salmaq

```bash
npm install
npm run dev
```

Public sayt: `/`

Admin panel: `/admin/`

## Build

```bash
npm run build
```

Hazır build `dist/` qovluğuna yığılır. Hostinqdə səhifələrə birbaşa `/haqqimizda`, `/muellimler`, `/elaqe` kimi keçidlərin işləməsi üçün SPA rewrite lazımdır; Netlify üçün `public/_redirects` əlavə olunub.
