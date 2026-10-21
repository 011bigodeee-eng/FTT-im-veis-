'use client';
import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import {useEffect,useState,useRef,Suspense,createContext,useContext,ReactNode} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {ArrowUpRight,ArrowUp,Heart,Menu,X,MessageCircle,Scale} from 'lucide-react';
import {whatsapp} from '@/lib/properties';
import {BrandMark} from './brand-mark';
type LocalState={favorites:string[];compare:string[];toggleFavorite:(id:string)=>void;toggleCompare:(id:string)=>void};
const Context=createContext<LocalState>({favorites:[],compare:[],toggleFavorite:()=>{},toggleCompare:()=>{}});
export const useLocal=()=>useContext(Context);
export function Brand(){return <span className="brand"><BrandMark/><span>FTT IMÓVEIS<small>CRECI 290818-F</small></span></span>}
export function SiteProvider({children}:{children:ReactNode}){const[favorites,setFavorites]=useState<string[]>([]),[compare,setCompare]=useState<string[]>([]),[notice,setNotice]=useState('');useEffect(()=>{try{const f=JSON.parse(localStorage.getItem('ftt-favorites')||'[]');const c=JSON.parse(localStorage.getItem('ftt-compare')||'[]');if(Array.isArray(f))setFavorites(f.filter(x=>typeof x==='string'));if(Array.isArray(c))setCompare(c.filter(x=>typeof x==='string').slice(0,3));}catch{}},[]);useEffect(()=>{if(notice){const t=setTimeout(()=>setNotice(''),3500);return()=>clearTimeout(t)}},[notice]);function save(key:string,value:string[]){try{localStorage.setItem(key,JSON.stringify(value))}catch{setNotice('Armazenamento indisponível: preferências mantidas nesta visita.')}}const toggleFavorite=(id:string)=>setFavorites(prev=>{const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];save('ftt-favorites',next);return next});const toggleCompare=(id:string)=>setCompare(prev=>{if(!prev.includes(id)&&prev.length>=3){setNotice('Você pode comparar até 3 imóveis. Remova um para continuar.');return prev}const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];save('ftt-compare',next);return next});return <Context.Provider value={{favorites,compare,toggleFavorite,toggleCompare}}><Suspense fallback={<header className="header"><Brand/></header>}><Header/></Suspense>{children}<Footer/><a className="whatsapp-float" href={whatsapp()} target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp"><MessageCircle size={25}/></a>{compare.length>0&&<Link className="compare-float" href="/comparar"><Scale size={18}/> Comparar ({compare.length}/3)<ArrowUpRight size={16}/></Link>}{notice&&<div role="status" className="toast">{notice}</div>}</Context.Provider>}
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState('');
  const { favorites } = useLocal();
  const pathname = usePathname();
  const params = useSearchParams();
  const purpose = params.get('purpose');
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const links = [['Início','/'],['Imóveis','/imoveis'],['Comprar','/imoveis?purpose=Comprar'],['Alugar','/imoveis?purpose=Alugar'],['Avaliação','/#avaliacao'],['Sobre nós','/#sobre'],['Contato','/#contato']];
  const active = pathname === '/' ? (section ? `/#${section}` : '/') : pathname === '/imoveis' && purpose ? `/imoveis?purpose=${purpose}` : pathname;
  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 30); if (window.scrollY < 200) setSection(''); };
    fn(); window.addEventListener('scroll', fn, { passive: true });
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setSection(entry.target.id); }); }, { rootMargin: '-15% 0px -55% 0px' });
    if (pathname === '/') ['avaliacao','sobre','contato'].forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => { window.removeEventListener('scroll', fn); observer.disconnect(); };
  }, [pathname]);
  useEffect(() => {
    if (open) { dialog.current?.showModal(); document.body.style.overflow = 'hidden'; }
    else { dialog.current?.close(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  useEffect(() => { const media = window.matchMedia('(min-width: 1001px)'); const close = () => { if (media.matches) setOpen(false); }; media.addEventListener('change', close); return () => media.removeEventListener('change', close); }, []);
  function closeMenu() { setOpen(false); toggle.current?.focus(); }
  return <>
    <header className={`header ${pathname !== '/' ? 'inner-header' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" aria-label="FTT Imóveis — início"><Brand/></Link>
      <nav aria-label="Principal" className="desktop-navigation">{links.map(([label,url]) => <Link key={label} href={url} aria-current={active === url ? 'page' : undefined}>{label}{active === url && <motion.span className="nav-underline" layoutId="active-navigation" transition={{ type:'spring', stiffness:350, damping:35 }}/>}</Link>)}</nav>
      <div className="header-actions"><Link href="/favoritos" className="icon-button" aria-label={`Favoritos: ${favorites.length}`}><Heart size={19}/>{favorites.length > 0 && <sup>{favorites.length}</sup>}</Link><Link className="button button-outline announce-nav" href="/#anuncie">Anuncie seu imóvel <ArrowUpRight size={15}/></Link><button ref={toggle} className="icon-button menu-toggle" onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open} aria-controls="mobile-navigation"><Menu/></button></div>
    </header>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-drawer" aria-label="Menu de navegação" onCancel={event => { event.preventDefault(); closeMenu(); }}>
      {open && <motion.div className="mobile-drawer-content" initial={reduced ? false : { opacity:0, y:-25 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, ease:[.22,1,.36,1] }}><div className="mobile-drawer-top"><Link href="/" onClick={closeMenu}><Brand/></Link><button className="icon-button" onClick={closeMenu} aria-label="Fechar menu"><X/></button></div><span className="eyebrow">NOVOS CAMINHOS COMEÇAM AQUI</span><nav aria-label="Principal">{links.map(([label,url],index) => <motion.div key={url} initial={reduced ? false : { opacity:0, y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:.4,delay:reduced?0:.08+index*.045 }}><Link href={url} aria-current={active === url ? 'page' : undefined} onClick={closeMenu}><small aria-hidden="true">0{index+1}</small>{label}<ArrowUpRight size={20}/></Link></motion.div>)}</nav><Link className="button" href="/#anuncie" onClick={closeMenu}>Anuncie seu imóvel <ArrowUpRight size={18}/></Link><a className="mobile-drawer-contact" href={whatsapp()}>(19) 99142-0290 <span>Converse com Fernando Marra ↗</span></a></motion.div>}
    </dialog>
  </>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      data-scroll-reveal=""
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Footer(){return <footer><div className="footer-top"><Link href="/"><Brand/></Link><p>Mais do que imóveis.<br/>Novas possibilidades.</p><a href="#top" className="back-top">Voltar ao topo <ArrowUp size={17}/></a></div><div className="footer-columns"><div><span className="eyebrow">VAMOS CONVERSAR</span><a href={whatsapp()}>(19) 99142-0290 ↗</a><a href="mailto:marrafernando@creci.org.br">marrafernando@creci.org.br</a></div><div><span className="eyebrow">EXPLORE</span><Link href="/imoveis">Encontre seu imóvel</Link><Link href="/favoritos">Seus favoritos</Link><Link href="/comparar">Comparar imóveis</Link></div><div><span className="eyebrow">FTT IMÓVEIS</span><span>Luís Fernando P. Marra</span><span>CRECI 290818-F</span><Link href="/privacidade">Privacidade e demonstração</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} FTT Imóveis. Todos os direitos reservados.</span><span>Prévia demonstrativa · Imóveis e valores fictícios.</span></div></footer>}
