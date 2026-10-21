import { ArrowUpRight, BadgeCheck, Ruler, ScanLine, Files, Combine, ChartNoAxesCombined, Scale } from 'lucide-react';
import { Reveal } from './site';
import { whatsapp } from '@/lib/properties';

const services = [
  { icon: Ruler, title: 'Avaliação técnica', description: 'Avaliação do imóvel conforme as normas ABNT aplicáveis, com atenção às características de cada patrimônio.' },
  { icon: ScanLine, title: 'Análise de acabamento', description: 'Um olhar minucioso sobre os padrões de acabamento e os detalhes que influenciam o valor do imóvel.' },
  { icon: Files, title: 'Regularização de imóveis', description: 'Orientação para entender as necessidades de regularização do seu imóvel e os próximos passos.' },
  { icon: Combine, title: 'Anexação', description: 'Análise das possibilidades de anexação, considerando as particularidades e a documentação do imóvel.' },
  { icon: ChartNoAxesCombined, title: 'Estudo de viabilidade', description: 'Informações para avaliar possibilidades e tomar decisões mais claras sobre seu patrimônio.' },
  { icon: Scale, title: 'Avaliações particulares e judiciais', description: 'Atendimento para demandas de avaliação de imóveis, com escopo e condições definidos em consulta.' },
];

export function Services() {
  return (
    <section className="section valuation" id="avaliacao" aria-labelledby="valuation-title">
      <div className="valuation-heading">
        <Reveal>
          <span className="eyebrow">CONHEÇA O VALOR DO SEU PATRIMÔNIO</span>
          <h2 id="valuation-title">Veja qual é o valor real<br /><span>do seu imóvel.</span></h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="valuation-specialist"><BadgeCheck size={26} /><div><strong>Fernando Marra</strong><span>Perito Avaliador · FTT Imóveis</span></div></div>
          <p>Precisão, segurança e clareza para você decidir. Uma análise atenta para cuidar do que é importante para você.</p>
        </Reveal>
      </div>
      <div className="service-grid">
        {services.map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={(index % 3) * 0.09} className="service-reveal">
            <article className="service-card">
              <div className="service-card-top"><Icon size={26} strokeWidth={1.25} /><span>0{index + 1}</span></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="text-link" href={whatsapp(`Olá, Fernando! Conheci a FTT Imóveis pelo site e gostaria de solicitar um orçamento para ${title.toLowerCase()}.`)} target="_blank" rel="noreferrer" aria-label={`Consultar sobre ${title.toLowerCase()}`}>Conversar sobre este serviço <ArrowUpRight size={16} /></a>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal className="valuation-cta">
        <div><span className="eyebrow">NÃO ADIE OS PLANOS PARA O SEU IMÓVEL</span><h3>Seu patrimônio merece uma análise cuidadosa.</h3><p>Conte o que você precisa e solicite um orçamento com Fernando Marra.</p></div>
        <a className="button" href={whatsapp('Olá, Fernando! Gostaria de solicitar um orçamento para avaliação ou regularização do meu imóvel.')} target="_blank" rel="noreferrer">Solicitar uma avaliação <ArrowUpRight size={18} /></a>
      </Reveal>
    </section>
  );
}
