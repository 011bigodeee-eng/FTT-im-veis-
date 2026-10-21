import {Suspense} from 'react';
import {Catalog} from '@/components/catalog';
export const metadata={title:'Explore os imóveis demonstrativos'};
export default function Properties(){return <main id="conteudo" className="inner-page"><Suspense fallback={<div className="skeleton-page" aria-label="Carregando catálogo"/>}><Catalog/></Suspense></main>}
