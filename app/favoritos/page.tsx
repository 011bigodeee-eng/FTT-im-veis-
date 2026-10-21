import {Suspense} from 'react';
import {Catalog} from '@/components/catalog';
export const metadata={title:'Seus favoritos'};
export default function Favorites(){return <main id="conteudo" className="inner-page"><Suspense fallback={<div className="skeleton-page"/>}><Catalog favoritesOnly/></Suspense></main>}
