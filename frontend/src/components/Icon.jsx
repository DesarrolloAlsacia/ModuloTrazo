const dibujos = {
  grid: (
    <>
      {" "}
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />{" "}
    </>
  ),
  server: (
    <>
      {" "}
      <rect x="3" y="3" width="18" height="7" rx="2" />
      <rect x="3" y="14" width="18" height="7" rx="2" />
      <path d="M7 6.5h.01M7 17.5h.01M16 6.5h2M16 17.5h2" />{" "}
    </>
  ),
  layers: (
    <>
      {" "}
      <path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" />{" "}
    </>
  ),
  activity: (
    <>
      {" "}
      <path d="M2 12h5l3-8 4 16 3-8h5" />{" "}
    </>
  ),
  bell: (
    <>
      {" "}
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />{" "}
    </>
  ),
  rocket: (
    <>
      {" "}
      <path d="M14 5c3-3 7-3 7-3s0 4-3 7l-7 7-5-5 8-6ZM6 11H2l4-6h8M11 16v6l6-5v-5M4 17l-2 5 5-2" />
      <circle cx="16" cy="7" r="1" />{" "}
    </>
  ),
  arrow: (
    <>
      {" "}
      <path d="M5 12h14m-6-6 6 6-6 6" />{" "}
    </>
  ),
  check: (
    <>
      {" "}
      <path d="m5 12 4 4L19 6" />{" "}
    </>
  ),
  settings: (
    <>
      {" "}
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />{" "}
    </>
  ),
  terminal: (
    <>
      {" "}
      <path d="m5 7 5 5-5 5m8 0h6" />
      <rect x="2" y="3" width="20" height="18" rx="3" />{" "}
    </>
  ),
  box: (
    <>
      {" "}
      <path d="m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10L2 7m10 5 10-5M12 12v10M7 4.5l10 5" />{" "}
    </>
  ),
  shield: (
    <>
      {" "}
      <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" />
      <path d="m8 12 3 3 5-6" />{" "}
    </>
  ),
  user: (
    <>
      {" "}
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22v-3a8 8 0 0 1 16 0v3" />{" "}
    </>
  ),
}

export default function Icon({ name, className = "" }) {
  return (
    <svg
      className={[
        "h-[20px] w-[20px] shrink-0 [stroke-width:1.7] [stroke-linecap:round] [stroke-linejoin:round]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {dibujos[name] || dibujos.box}
    </svg>
  )
}
