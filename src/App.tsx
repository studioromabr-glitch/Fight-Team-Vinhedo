import { useState } from 'react'
import { Menu, X, MessageCircle, MapPin, Phone, Camera, Check, Users, Shield, Dumbbell } from 'lucide-react'
import './App.css'
import ReflectiveCard from './ReflectiveCard'
import PixelCard from './PixelCard'
import CountUp from './CountUp'
import CircularCarousel from './CircularCarousel'
import StarBorder from './StarBorder'

const wa = (text = 'Olá! Vim pelo site da Fight Team Vinhedo e quero agendar uma aula experimental grátis.') => `https://wa.me/5519995668274?text=${encodeURIComponent(text)}`
const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('R. Floriano Piton, 155 - Jardim São Matheus, Vinhedo - SP, 13280-000')
const instagram = 'https://www.instagram.com/fightteamvinhedo/'
const modalities = [
  { name: 'Muay Thai', tag: 'FOCO E CONDICIONAMENTO', icon: Dumbbell, text: 'Conheça a arte das oito armas. Socos, chutes, joelhadas e cotoveladas em uma modalidade que trabalha corpo e mente.' },
  { name: 'Boxe', tag: 'TÉCNICA E MOVIMENTO', icon: Shield, text: 'Jogo de pernas, esquivas e combinações. Explore os fundamentos da nobre arte e encontre seu ritmo de treino.' },
  { name: 'Jiu-Jitsu', tag: 'ESTRATÉGIA E CONTROLE', icon: Users, text: 'Uma nova maneira de pensar cada movimento. Aprenda técnicas de solo, posições e finalizações. Turmas adulto e kids.' },
  { name: 'Capoeira', tag: 'CULTURA E EXPRESSÃO', icon: Dumbbell, text: 'Luta, música e movimento se encontram. Trabalhe coordenação e mobilidade em uma prática cheia de identidade.' },
]
const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const timetable = [
  { time: '07h', cells: ['Boxe / Jiu-Jitsu', '', 'Boxe / Jiu-Jitsu', '', 'Boxe / Jiu-Jitsu', ''] },
  { time: '08h', cells: ['Muay Thai', '', 'Muay Thai', '', 'Muay Thai', ''] },
  { time: '17h30', cells: ['Muay Thai', 'Muay Thai / Jiu-Jitsu Kids', 'Muay Thai', 'Muay Thai / Jiu-Jitsu Kids', 'Muay Thai', ''] },
  { time: '18h30', cells: ['Boxe / Muay Thai', 'Muay Thai / Jiu-Jitsu Kids', 'Boxe / Muay Thai', 'Muay Thai / Jiu-Jitsu Kids', 'Boxe / Muay Thai', ''] },
  { time: '19h30', cells: ['Capoeira / Jiu-Jitsu', 'Boxe / Jiu-Jitsu', 'Capoeira / Jiu-Jitsu', 'Boxe / Jiu-Jitsu', '', ''] },
]
const nav = [{ href: '#modalidades', label: 'Modalidades' }, { href: '#professores', label: 'Professores' }, { href: '#horarios', label: 'Horários' }, { href: '#planos', label: 'Planos' }, { href: '#contato', label: 'Onde estamos' }]
const teachers = [
  { src: '/professores/professor-boxe.png', alt: 'Professor de boxe da Fight Team Vinhedo com medalha após uma luta', title: 'Professor de Boxe', subtitle: 'Boxe profissional', description: 'Boxeador profissional com 9 anos de dedicação à luta. Leva para as aulas a experiência de quem conhece o treino e a competição de perto.', position: 'center 30%' },
  { src: '/professores/professor-muay-thai.png', alt: 'Professor de Muay Thai e proprietário da Fight Team Vinhedo orientando um treino', title: 'Professor de Muay Thai', subtitle: 'À frente da Fight Team', description: 'À frente da Fight Team Vinhedo, une sua atuação como professor de Muay Thai à formação como faixa preta de Jiu-Jitsu. Uma trajetória dedicada às artes marciais.', position: 'center 35%' },
  { src: '/professores/professor-jiu-jitsu-sem-frase.png', alt: 'Professor de Jiu-Jitsu da equipe Tozi usando quimono azul', title: 'Professor de Jiu-Jitsu', subtitle: 'Equipe Tozi', description: 'Faixa preta de Jiu-Jitsu da equipe Tozi. Compartilha no tatame sua experiência na modalidade, com a técnica e a dedicação que fazem parte dessa trajetória.', position: 'center 25%' },
]
const plans = [{ title: 'Mensal', price: '150', period: '/mês', installment: 'Pagamento mensal', equivalent: 'Uma modalidade' }, { title: 'Trimestral', price: '420', period: '/trimestre', installment: 'Até 3x de R$ 140', equivalent: 'Equivalente a R$ 140/mês' }, { title: 'Semestral', price: '780', period: '/semestre', installment: 'Até 6x de R$ 130', equivalent: 'Equivalente a R$ 130/mês' }]
const questions = [
  { q: 'Como agendo a aula experimental grátis?', a: 'Entre em contato pelo WhatsApp. A equipe confirma a turma, o horário e as orientações para sua primeira aula.' },
  { q: 'Tem aulas para crianças?', a: 'Sim, há turmas de Jiu-Jitsu Kids. Consulte a faixa etária e a disponibilidade diretamente com a equipe.' },
  { q: 'Posso treinar mais de uma modalidade?', a: 'Sim. Para duas ou três modalidades, consulte o valor adicional pelo WhatsApp ou pelo Direct do Instagram.' },
  { q: 'O que preciso levar para a primeira aula?', a: 'Confirme com a equipe quais roupas e equipamentos são indicados para a modalidade escolhida antes de comparecer.' },
]

export default function App() {
  const [menu, setMenu] = useState(false)
  const [filter, setFilter] = useState('Todas')
  const [modality, setModality] = useState('Muay Thai')
  const [audience, setAudience] = useState('Adulto')
  const trialUrl = wa(`Olá! Quero agendar uma aula experimental grátis de ${modality} para ${audience.toLowerCase()}. Quais horários e turmas estão disponíveis?`)
  return <>
    <a className="skip" href="#conteudo">Pular para o conteúdo</a>
    <div className="announcement">A PRIMEIRA AULA É POR NOSSA CONTA. <a href="#experimental">VENHA EXPERIMENTAR.</a></div>
    <header><div className="container header-inner">
      <a className="brand" href="#inicio" aria-label="Fight Team Vinhedo — início"><img src="/logo.jpg" width="52" height="52" alt="" /><span>FIGHT TEAM<small>VINHEDO</small></span></a>
      <nav className="desktop-nav" aria-label="Menu principal">{nav.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <a className="button small desktop-cta" href={wa()} target="_blank" rel="noopener noreferrer">Agendar aula grátis</a>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} aria-controls="mobile-menu">{menu ? <X /> : <Menu />}</button>
    </div>{menu && <nav id="mobile-menu" className="mobile-nav" aria-label="Menu para celular">{nav.map(link => <a key={link.href} href={link.href} onClick={() => setMenu(false)}>{link.label}</a>)}<a href="#experimental" onClick={() => setMenu(false)}>Agendar aula grátis</a></nav>}</header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="container hero-grid"><div>
        <p className="eyebrow">ACADEMIA DE LUTAS · VINHEDO, SP</p>
        <h1>SEU PRÓXIMO<br />ROUND<br /><span>COMEÇA AQUI.</span></h1>
        <p className="hero-description">Encontre sua modalidade. Descubra sua força.<br />Muay Thai, Boxe, Jiu-Jitsu e Capoeira para fazer parte da sua rotina.</p>
        <div className="hero-actions"><StarBorder className="button" href="#experimental">Quero minha aula grátis</StarBorder><a className="text-link" href="#modalidades">Conhecer modalidades</a></div>
        <p className="hero-note"><Users size={18} /> Adultos e kids · Primeira aula experimental grátis</p>
      </div><div className="hero-art"><ReflectiveCard tint="#ffffff" metalness={1} roughness={0.3} blurStrength={6} shine={1} glare={0.5} /><p>DISCIPLINA. RESPEITO. EVOLUÇÃO.</p></div></div><div className="container hero-bottom"><span>MAIS DO QUE TREINO. UMA NOVA ROTINA.</span><span>R. FLORIANO PITON, 155 · VINHEDO</span></div></section>
      <div className="strip" aria-hidden="true">MUAY THAI <span>✦</span> BOXE <span>✦</span> JIU-JITSU <span>✦</span> CAPOEIRA <span>✦</span> FIGHT TEAM</div>
      <section id="modalidades" className="container section"><div className="heading"><div><p className="eyebrow">ENCONTRE O SEU ESTILO</p><h2>QUATRO CAMINHOS.<br />A SUA EVOLUÇÃO.</h2></div><p>Do primeiro contato com a luta ao próximo desafio. Escolha uma modalidade e venha conhecer o treino de perto.</p></div>
        <div className="modalities">{modalities.map(({ name, tag, text, icon: Icon }) => <article key={name}><Icon size={34} strokeWidth={1.4} /><p className="eyebrow">{tag}</p><h3>{name}</h3><p>{text}</p><a className="text-link" href={wa(`Olá! Quero conhecer as aulas de ${name} e agendar uma aula experimental.`)} target="_blank" rel="noopener noreferrer">Experimentar {name}</a></article>)}</div>
        <div className="kids-banner"><Users size={36} /><div><h3>Pequenos no tamanho. Grandes nas descobertas.</h3><p>Conheça o Jiu-Jitsu Kids. Consulte a faixa etária e a disponibilidade com a equipe.</p></div><a className="button outline" href={wa('Olá! Quero saber mais sobre as turmas de Jiu-Jitsu Kids.')} target="_blank" rel="noopener noreferrer">Conhecer o kids</a></div>
      </section>
      <section id="professores" className="teachers-section"><div className="container heading"><div><p className="eyebrow">QUEM ESTÁ NO SEU CORNER</p><h2>EXPERIÊNCIA QUE ENSINA.<br />PRESENÇA QUE INSPIRA.</h2></div><p>Conheça os professores de Boxe, Muay Thai e Jiu-Jitsu da Fight Team Vinhedo.</p></div><CircularCarousel items={teachers} preset="panorama" intro="rise" cardWidth={320} aspectRatio={0.75} speed={2.5} captions gap={18} tilt={0} perspective={1800} innerShade={0.58} /></section>
      <section id="horarios" className="section schedule"><div className="container"><div className="heading"><div><p className="eyebrow">SEU TREINO TEM HORA</p><h2>ESPAÇO NA AGENDA.<br />MOVIMENTO NA VIDA.</h2></div><p>Encontre um horário para começar. Confirme a disponibilidade da turma antes de ir à academia.</p></div>
        <div className="filters" role="group" aria-label="Filtrar horários por modalidade">{['Todas', ...modalities.map(item => item.name)].map(name => <button key={name} aria-pressed={filter === name} className={filter === name ? 'active' : ''} onClick={() => setFilter(name)}>{name}</button>)}</div>
        <p className="table-hint">No celular, deslize a tabela para ver os outros dias.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Grade semanal de aulas"><table><caption className="sr-only">Horários de aulas — {filter}</caption><thead><tr><th scope="col">Horário</th>{days.map(day => <th scope="col" key={day}>{day}</th>)}</tr></thead><tbody>{timetable.map(row => <tr key={row.time}><th scope="row">{row.time}</th>{row.cells.map((cell, i) => { const items = cell.split(' / ').filter(item => item && (filter === 'Todas' || item.includes(filter))); return <td key={days[i]}>{items.length ? items.map(item => <span className={item.includes('Kids') ? 'class-label kids' : 'class-label'} key={item}>{item}</span>) : <span className="empty" aria-label="Sem aula informada">—</span>}</td> })}</tr>)}</tbody></table></div>
        <p className="note">A academia pode alterar os horários sem aviso prévio. Confirme a grade e as turmas pelo WhatsApp.</p>
      </div></section>
      <section id="planos" className="container section"><div className="heading"><div><p className="eyebrow">ADULTO E KIDS</p><h2>INVISTA NO SEU<br />PRÓXIMO PASSO.</h2></div><p>Planos para uma modalidade. Para combinar duas ou três modalidades, consulte o valor adicional com a equipe.</p></div>
        <div className="plans">{plans.map((plan, i) => <PixelCard className={`plan ${i === 2 ? 'featured' : ''}`} key={plan.title} glowColor="#cbd5e1" shape="square" origin="center" gap={5} pixelSize={2} speed={35} revealDuration={600} spotlight={0.5} glow={0.5} opacity={0.35} fade={0.7} trigger="hover" radius={24} clickPulse intro theme="dark">{i === 2 && <span className="badge">MENOR VALOR MENSAL</span>}<p className="eyebrow">1 MODALIDADE</p><h3>{plan.title}</h3><div className="price" aria-label={`R$ ${plan.price} ${plan.period.replace('/', 'por ')}`}><span aria-hidden="true">R$</span> <CountUp from={Number(plan.price) + 100} to={Number(plan.price)} duration={2} replayOnHover /><small aria-hidden="true">{plan.period}</small></div><p className="installment">{plan.installment}</p><ul><li><Check size={17} /> Adulto ou kids</li><li><Check size={17} /> {plan.equivalent}</li></ul><a className={`button ${i === 2 ? '' : 'outline'}`} href={wa(`Olá! Quero saber mais sobre o plano ${plan.title.toLowerCase()} de R$ ${plan.price} para uma modalidade.`)} target="_blank" rel="noopener noreferrer">Escolher {plan.title.toLowerCase()}</a></PixelCard>)}</div>
        <div className="benefits"><div><strong>GYMPASS</strong><p>A partir do plano <b>BASIC+</b></p></div><div><strong>TOTALPASS</strong><p>A partir do plano <b>TP1 PLUS</b></p></div><p>Benefícios válidos<br />apenas para adultos.</p></div>
      </section>
      <section id="experimental" className="trial"><div className="container trial-grid"><div><p className="eyebrow">O PRIMEIRO PASSO É SEU</p><h2>VENHA PARA<br />O SEU PRIMEIRO<br />ROUND.</h2><p>Sua primeira aula experimental é grátis.<br />Escolha o que quer conhecer e fale com a equipe.</p></div><div className="trial-form"><h3>Vamos marcar seu treino?</h3><p>A equipe confirma os horários pelo WhatsApp.</p><label htmlFor="modality">Qual modalidade você quer conhecer?</label><select id="modality" value={modality} onChange={event => setModality(event.target.value)}>{modalities.map(item => <option key={item.name}>{item.name}</option>)}</select><label htmlFor="audience">A aula é para quem?</label><select id="audience" value={audience} onChange={event => setAudience(event.target.value)}><option>Adulto</option><option>Kids</option></select><a className="button" href={trialUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> Agendar pelo WhatsApp</a><small>Consulte as modalidades e turmas disponíveis para cada idade.</small></div></div></section>
      <section id="contato" className="container section contact-grid"><div><p className="eyebrow">NOS ENCONTRAMOS NO TREINO</p><h2>SEU NOVO PONTO<br />DE ENCONTRO.</h2><address><MapPin size={22} /><span>R. Floriano Piton, 155<br />Jardim São Matheus · Vinhedo – SP<br />CEP 13280-000</span></address><a className="contact-link" href="tel:+5519995668274"><Phone size={20} />(19) 99566-8274</a><a className="contact-link" href={instagram} target="_blank" rel="noopener noreferrer"><Camera size={20} />@fightteamvinhedo</a><a className="button outline" href={maps} target="_blank" rel="noopener noreferrer">Ver rota no Google Maps</a></div><div className="location-map"><iframe title="Localização Fight Team Vinhedo" src="https://www.google.com/maps?q=R.+Floriano+Piton,+155+-+Jardim+Sao+Matheus,+Vinhedo+-+SP,+13280-000&amp;output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></section>
      <section className="faq container"><p className="eyebrow">ANTES DO PRIMEIRO TREINO</p><h2>DÚVIDAS FREQUENTES</h2>{questions.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>
    </main>
    <footer><div className="container footer-inner"><a className="brand" href="#inicio"><img src="/logo.jpg" alt="Logo Fight Team Vinhedo" width="48" height="48" /><span>FIGHT TEAM<small>VINHEDO</small></span></a><p>© {new Date().getFullYear()} Fight Team Vinhedo.</p><a href={instagram} target="_blank" rel="noopener noreferrer">Acompanhe no Instagram</a></div></footer>
    <a className="floating-whatsapp" href={wa()} target="_blank" rel="noopener noreferrer" aria-label="Fale com a Fight Team Vinhedo pelo WhatsApp"><MessageCircle size={27} /></a>
  </>
}
