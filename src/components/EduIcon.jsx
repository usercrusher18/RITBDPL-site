const icons = {
  portal: (
    <>
      <path d="M4 5h16v12H4z" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </>
  ),
  school: (
    <>
      <path d="M3 10 12 5l9 5-9 5-9-5Z" />
      <path d="M6 12v5c2.8 2.2 9.2 2.2 12 0v-5" />
      <path d="M21 10v6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z" />
      <path d="M4 19a3 3 0 0 1 3-3h13" />
      <path d="M8 7h7" />
    </>
  ),
  certificate: (
    <>
      <path d="M7 3h10v18l-5-3-5 3V3Z" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12h5" />
    </>
  ),
  people: (
    <>
      <path d="M16 11a4 4 0 1 0-8 0" />
      <path d="M4 21a8 8 0 0 1 16 0" />
      <path d="M18 8.5a3 3 0 0 1 3 3" />
      <path d="M22 21a6 6 0 0 0-4-5.65" />
    </>
  ),
  map: (
    <>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  ),
  briefcase: (
    <>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path d="M4 7h16v12H4z" />
      <path d="M4 12h16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 20 6v6c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8" />
      <path d="M7.1 7.1C3.8 8.8 2 12 2 12s3.5 6 10 6c1.8 0 3.4-.45 4.8-1.15" />
      <path d="M19.1 14.35C21 13 22 12 22 12s-3.5-6-10-6c-.75 0-1.45.08-2.1.22" />
    </>
  ),
  image: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="m4 16 5-5 4 4 2-2 5 5" />
      <path d="M15 9h.01" />
    </>
  ),
  reset: (
    <>
      <path d="M4 4v6h6" />
      <path d="M20 12a8 8 0 0 0-13.7-5.7L4 10" />
      <path d="M20 20v-6h-6" />
      <path d="M4 12a8 8 0 0 0 13.7 5.7L20 14" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17 15 12l-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </>
  ),
};

export default function EduIcon({ name = "book", className = "edu-icon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || icons.book}
    </svg>
  );
}
