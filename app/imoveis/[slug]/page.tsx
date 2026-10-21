import {notFound} from 'next/navigation';
import {properties} from '@/lib/properties';
import {PropertyDetail} from '@/components/detail';
export const dynamicParams=false;
export const generateStaticParams=()=>properties.map(p=>({slug:p.slug}));
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=properties.find(p=>p.slug===slug);return {title:p?`${p.title} — imóvel demonstrativo`:'Imóvel não encontrado',description:p?.description,robots:{index:false,follow:false}}}
export default async function PropertyPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=properties.find(p=>p.slug===slug);if(!p)notFound();return <PropertyDetail property={p}/>}
