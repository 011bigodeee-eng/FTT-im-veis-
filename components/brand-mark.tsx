/** Shared geometry keeps the intro and the existing FTT brand exactly aligned. */
export function BrandMark({ cinematic = false }: { cinematic?: boolean }) {
  return <svg viewBox="0 0 96 57" aria-label={cinematic ? undefined : 'FTT'} aria-hidden={cinematic ? true : undefined} role={cinematic ? undefined : 'img'} className={cinematic ? 'ftt-intro-mark' : undefined}>
    <path className="ftt-mark-frame" pathLength={1} d="M2 53V20Q2 3 20 3H94V36Q94 53 77 53Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path className="ftt-mark-f" pathLength={1} d="M13 42V15H39V21H20V26H37V32H20V42Z" fill={cinematic ? 'transparent' : 'currentColor'} stroke={cinematic ? 'currentColor' : undefined} strokeWidth={cinematic ? '.55' : undefined}/>
    <path className="ftt-mark-ts" pathLength={1} d="M40 15H62V21H54V42H48V21H40ZM65 15H88V21H80V42H74V21H65Z" fill={cinematic ? 'transparent' : '#f5f5f2'} stroke={cinematic ? '#f5f5f2' : undefined} strokeWidth={cinematic ? '.55' : undefined}/>
    <path className="ftt-mark-bridge" pathLength={1} d="M20 26H81V32H20Z" fill={cinematic ? 'transparent' : 'currentColor'} stroke={cinematic ? 'currentColor' : undefined} strokeWidth={cinematic ? '.4' : undefined}/>
  </svg>;
}
