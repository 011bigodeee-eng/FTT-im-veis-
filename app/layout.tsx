import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {SiteProvider} from '@/components/site';
import './globals.css';
const manrope=localFont({src:'../public/fonts/manrope.ttf',variable:'--font-heading',display:'swap'});
const inter=localFont({src:'../public/fonts/inter.ttf',variable:'--font-body',display:'swap'});
export const metadata:Metadata={title:{default:'FTT Imóveis | Seu próximo capítulo começa aqui',template:'%s | FTT Imóveis'},description:'Consultoria imobiliária com atendimento personalizado para compra, venda e locação. Luís Fernando P. Marra — CRECI 290818-F. Prévia demonstrativa.',robots:{index:false,follow:false},openGraph:{title:'FTT Imóveis — Novas possibilidades',description:'Seu próximo capítulo começa no lugar certo. Prévia demonstrativa.',locale:'pt_BR',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR" className={`${manrope.variable} ${inter.variable}`}><body id="top"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteProvider>{children}</SiteProvider></body></html>}
