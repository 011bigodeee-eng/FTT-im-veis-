export type Property = {id:string;slug:string;title:string;type:string;purpose:'Comprar'|'Alugar';city:string;district:string;price:number;area:number;total:number;beds:number;baths:number;parking:number;image:string;gallery:string[];features:string[];description:string;condo:number;tax:number};
const entries: [string,string,string,string,number,number,number,number,number,string][] = [
['Casa Horizonte','Casa','Comprar','Campinas',2450000,320,4,5,4,'Alphaville'],
['Apartamento Lumina','Apartamento','Comprar','Campinas',890000,128,3,3,2,'Cambuí'],
['Casa Jardim','Casa','Alugar','Valinhos',6800,240,3,4,2,'Jardim Paiquerê'],
['Apartamento Aurora','Apartamento','Alugar','Campinas',3200,82,2,2,1,'Taquaral'],
['Terreno Vista Verde','Terreno','Comprar','Valinhos',480000,500,0,0,0,'Joapiranga'],
['Loja Alameda','Loja','Alugar','Campinas',4500,110,0,2,2,'Cambuí'],
['Galpão Conexão','Galpão','Alugar','Sumaré',18000,1200,0,4,8,'Nova Veneza'],
['Sala Essencial','Sala comercial','Comprar','Campinas',340000,48,0,1,1,'Centro'],
['Casa Serena','Casa','Comprar','Vinhedo',1680000,280,3,4,3,'Marambaia'],
['Apartamento Átrio','Apartamento','Comprar','Valinhos',620000,96,3,2,2,'Centro'],
['Terreno Reserva','Terreno','Comprar','Vinhedo',690000,650,0,0,0,'Pinheirinho'],
['Sala Perspectiva','Sala comercial','Alugar','Campinas',1900,42,0,1,1,'Guanabara']
];
export const properties:Property[] = entries.map((p,i)=>({id:`FTT-${String(i+1).padStart(3,'0')}`,slug:p[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll(' ','-'),title:p[0],type:p[1],purpose:p[2] as Property['purpose'],city:p[3],price:p[4],area:p[5],total:Math.round(p[5]*1.3),beds:p[6],baths:p[7],parking:p[8],district:p[9],image:`/images/property-${i%6+1}.jpg`,gallery:[`/images/property-${i%6+1}.jpg`,'/images/interior.jpg','/images/detail.jpg'],features:p[1]==='Terreno'?['Área ampla','Localização demonstrativa','Potencial construtivo a verificar']:['Iluminação natural','Ambientes integrados','Acabamento contemporâneo'],description:`${p[0]} é um exemplo de apresentação de ${p[1].toLowerCase()} em ${p[9]}, ${p[3]}. Uma composição pensada para explorar espaços, conforto e novas possibilidades. Todas as características, valores e localização são fictícios e servem exclusivamente à demonstração do site. Consulte Luís Fernando para conhecer oportunidades reais.`,condo:i%3===0?0:480+i*45,tax:150+i*23}));
export const money=(n:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
export const types=['Casa','Apartamento','Terreno','Loja','Galpão','Sala comercial'];
export type Filters={text:string;purpose:string;type:string;city:string;district:string;min:string;max:string;beds:string;sort:string};
export const emptyFilters:Filters={text:'',purpose:'',type:'',city:'',district:'',min:'',max:'',beds:'',sort:'featured'};
export function filterProperties(items:Property[],f:Filters){const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return items.filter(p=>(!f.text||normalize(`${p.title} ${p.id} ${p.district} ${p.city}`).includes(normalize(f.text)))&&(!f.purpose||p.purpose===f.purpose)&&(!f.type||p.type===f.type)&&(!f.city||p.city===f.city)&&(!f.district||p.district===f.district)&&(!f.min||p.price>=Number(f.min))&&(!f.max||p.price<=Number(f.max))&&(!f.beds||p.beds>=Number(f.beds))).sort((a,b)=>f.sort==='price-asc'?a.price-b.price:f.sort==='price-desc'?b.price-a.price:f.sort==='area'?b.area-a.area:0);}
export function installment(value:number,down:number,months:number,annual:number){if(!Number.isFinite(value+down+months+annual)||value<=0||down<0||down>=value||months<1||annual<0)return null;const r=(1+annual/100)**(1/12)-1;return r===0?(value-down)/months:(value-down)*r/(1-(1+r)**(-months));}
export const whatsapp=(message='Olá, Luís Fernando! Conheci a FTT Imóveis pelo site e gostaria de receber mais informações.')=>`https://wa.me/5519991420290?text=${encodeURIComponent(message)}`;
export const interest=(p:Property)=>whatsapp(`Olá, Luís Fernando! Vi o exemplo demonstrativo ${p.id} — ${p.title} no site da FTT Imóveis. Gostaria de conversar sobre oportunidades reais semelhantes.`);
