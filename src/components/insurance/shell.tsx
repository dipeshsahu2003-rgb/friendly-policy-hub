import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ShieldCheck, ChevronDown, ArrowUpRight, ArrowRight, Menu, X, Bot, Send, Check, FileText, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getVaskoReply } from '@/lib/insurance-data';
import { AccessibilitySettings } from './accessibility-settings';
import { HeaderTools } from './header-tools';
import { CallbackRequestDialog } from './callback-request';
import { DemoProvider, useDemo } from './provider';
export function Brand() { const {t}=useDemo();return <Link to="/" className="brand" aria-label={t('DAS Insurance home')}><ShieldCheck className="brand-mark" strokeWidth={1.8}/><div><div className="brand-name">DAS<span className="text-primary">.</span></div><div className="brand-sub">Insurance</div></div></Link>; }
export function Shell({children}:{children:ReactNode}) {return <DemoProvider><ShellBody>{children}</ShellBody></DemoProvider>;}
function ShellBody({children}:{children:ReactNode}) {
 const [menuOpen,setMenuOpen]=useState(false);const path=useLocation({select:l=>l.pathname});const {locale,setLocale,t,feedback}=useDemo();
 useEffect(()=>setMenuOpen(false),[path]);
 function openPanel(eventName:string) {setMenuOpen(false);window.setTimeout(()=>window.dispatchEvent(new Event(eventName)),0);}
 return <>
  <div className="demo-bar">{t('An independent demo project. Not an official insurance provider. All plans and prices are illustrative.')}</div>
  <header className="border-b border-border bg-background">
	<div className="container-page site-header">
	 <Brand/>
	 <nav className="desktop-navigation" aria-label={t('Main navigation')}>
	  <Link to="/" className={`nav-link ${path==='/'?'active':''}`}>{t('Home')}</Link>
	  <Link to="/insurance" className={`nav-link ${path.startsWith('/insurance')?'active':''}`}>{t('Our Insurance')} <ChevronDown size={13}/></Link>
	  <Link to="/claims" className="nav-link">{t('Claims')}</Link>
	  <Link to="/support" className="nav-link">{t('Support')} <ChevronDown size={13}/></Link>
	  <Link to="/about" className="nav-link">{t('About Us')}</Link>
	  <Button asChild className="desktop-quote"><Link to="/insurance">{t('Get a Quote')} <ArrowUpRight/></Link></Button>
	 </nav>
	 <div className="header-tools-row">
	  <HeaderTools/>
	  <AccessibilitySettings/>
	  <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
		<DialogTrigger asChild>
		 <Button variant="ghost" size="icon" className="header-tool mobile-menu-trigger" aria-label={t(menuOpen?'Close menu':'Open menu')} aria-expanded={menuOpen} aria-controls="mobile-navigation">
		  {menuOpen?<X aria-hidden="true"/>:<Menu aria-hidden="true"/>}
		 </Button>
		</DialogTrigger>
		<DialogContent className="mobile-navigation-dialog">
		 <DialogTitle className="sr-only">{t('Mobile navigation')}</DialogTitle>
		 <DialogDescription className="sr-only">{t('Choose a page or open a header feature.')}</DialogDescription>
		 <div className="mobile-menu-heading"><Brand/><DialogClose asChild><Button type="button" variant="ghost" size="icon" aria-label={t('Close menu')}><X aria-hidden="true"/></Button></DialogClose></div>
		 <nav id="mobile-navigation" aria-label={t('Mobile navigation')} className="mobile-menu-content">
		  <section><h2>{t('Products')}</h2><div className="mobile-menu-links">
			<Link to="/insurance/$type" params={{type:'health'}}>{t('Health Insurance')}<ArrowRight/></Link>
			<Link to="/insurance/$type" params={{type:'life'}}>{t('Life Insurance')}<ArrowRight/></Link>
			<Link to="/insurance/$type" params={{type:'travel'}}>{t('Travel Insurance')}<ArrowRight/></Link>
			<a href="/resources/car-insurance">{t('Car Insurance')}<ArrowRight/></a>
			<a href="/resources/two-wheeler-insurance">{t('Two-Wheeler Insurance')}<ArrowRight/></a>
		  </div></section>
		  <section><h2>{t('Services')}</h2><div className="mobile-menu-links">
			<Link to="/dashboard">{t('Renew Policy')}<RefreshCw/></Link>
			<Link to="/claims">{t('Claims')}<FileText/></Link>
			<Link to="/support">{t('Complaints')}<MessageCircle/></Link>
			<Link to="/support">{t('Support')}<ArrowRight/></Link>
			<Link to="/faq">{t('FAQs')}<ArrowRight/></Link>
			<Link to="/support">{t('Contact Us')}<ArrowRight/></Link>
		  </div></section>
		  <section><h2>{t('DAS Insurance')}</h2><div className="mobile-menu-links">
			<Link to="/about">{t('About Us')}<ArrowRight/></Link>
			<a href="/resources/careers">{t('Careers')}<ArrowRight/></a>
			<a href="/resources/blog">{t('Blog')}<ArrowRight/></a>
			<a href="/resources/grievance-redressal">{t('Grievance Redressal')}<ArrowRight/></a>
			<a href="/resources/privacy-policy">{t('Privacy Policy')}<ArrowRight/></a>
			<a href="/resources/terms-and-conditions">{t('Terms and Conditions')}<ArrowRight/></a>
			<button type="button" onClick={()=>openPanel('das:open-accessibility')}>{t('Accessibility Settings')}<ArrowRight/></button>
		  </div></section>
		  <section className="mobile-menu-language"><h2>{t('Language')}</h2><div className="mobile-language-options">
			<button type="button" aria-pressed={locale==='en'} onClick={()=>setLocale('en')}>English</button>
			<button type="button" aria-pressed={locale==='hi'} onClick={()=>setLocale('hi')}>हिन्दी</button>
		  </div>
			<button type="button" className="mobile-menu-feature" onClick={()=>openPanel('das:open-favourites')}>{t('Favourites')}<ArrowRight/></button>
		  </section>
		 </nav>
		</DialogContent>
	  </Dialog>
	 </div>
	</div>
  </header>
  <p className="sr-only" aria-live="polite" role="status">{t(feedback)}</p>
	{children}<Footer/><CallbackRequestDialog/><VaskoChat/>
 </>;
}
function Footer() {
 const {t}=useDemo();
 return <footer className="border-t border-border bg-muted pt-12 pb-7"><div className="container-page"><div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  <div className="col-span-2 md:col-span-1"><Brand/><p className="text-sm text-muted-foreground leading-7 mt-5 max-w-64">{t('A little certainty for life’s uncertainties. Protection made personal.')}</p><span className="text-xs text-primary mt-4 inline-block">{t('Independent demonstration project')}</span></div>
  <div><h3 className="font-bold text-sm mb-5">{t('Explore insurance')}</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/insurance/$type" params={{type:'health'}}>{t('Health Insurance')}</Link><Link to="/insurance/$type" params={{type:'life'}}>{t('Life Insurance')}</Link><Link to="/insurance/$type" params={{type:'travel'}}>{t('Travel Insurance')}</Link></div></div>
  <div><h3 className="font-bold text-sm mb-5">{t('Here to help')}</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/claims">{t('Claims assistance')}</Link><Link to="/support">{t('Register a complaint')}</Link><Link to="/support">{t('Track a complaint')}</Link><Link to="/faq">{t('Frequently asked questions')}</Link></div></div>
  <div><h3 className="font-bold text-sm mb-5">{t('Your DAS')}</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground"><Link to="/dashboard">{t('Customer dashboard')}</Link><Link to="/about">{t('About DAS Insurance')}</Link><span className="flex items-center gap-2"><ShieldCheck size={16}/> {t('Your privacy matters')}</span><p className="text-xs leading-5">{t('Please use fictional details. No real insurance or financial transactions.')}</p></div></div>
 </div><div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-muted-foreground"><span>{t('© 2026 DAS Insurance. Demo project only.')}</span><span>{t('Made with care. Built for peace of mind.')}</span></div></div></footer>;
}
function VaskoChat() {
 const {t}=useDemo();
 const [open,setOpen]=useState(false);const [input,setInput]=useState('');const [messages,setMessages]=useState([{role:'assistant',text:'Hi there! I’m VASKO, your demo insurance assistant. How can I help you today?'}]);const end=useRef<HTMLDivElement>(null);
 useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[messages,open]);
 useEffect(()=>{
  const openFromSupport=(event:Event)=>{
   setOpen(true);
   const detail=(event as CustomEvent<{query?:string;displayText?:string}>).detail;
   if(detail?.query)setMessages(previous=>[...previous,{role:'user',text:detail.displayText??t(detail.query!)},{role:'assistant',text:getVaskoReply(detail.query!)}]);
  };
  window.addEventListener('das:open-vasko',openFromSupport);
  return ()=>window.removeEventListener('das:open-vasko',openFromSupport);
 },[t]);
 function send(text:string,displayText=text) {if(!text.trim())return;setMessages(prev=>[...prev,{role:'user',text:displayText},{role:'assistant',text:getVaskoReply(text)}]);setInput('');}
 return <>{open&&<section className="chat-panel" aria-label={t('VASKO assistant')}><div className="bg-primary text-primary-foreground p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-primary-foreground/30 grid place-items-center"><Bot size={23}/></div><div><h2 className="font-bold text-base">VASKO</h2><p className="text-xs opacity-80">{t('Your insurance companion · Demo')}</p></div><Button variant="ghost" size="icon" className="ml-auto text-primary-foreground" aria-label={t('Close assistant')} onClick={()=>setOpen(false)}><X/></Button></div><div className="chat-messages" aria-live="polite">{messages.map((m,i)=><div key={i} className={`chat-bubble ${m.role==='user'?'user':''}`}>{m.role==='assistant'?t(m.text):m.text}</div>)}<div ref={end}/></div>{messages.length===1&&<div className="flex flex-wrap gap-2 px-4 pb-3">{[['Health cover','Health cover'],['File a claim','File a claim'],['Track complaint','Track complaint']].map(([query,label])=><Button key={query} variant="outline" size="sm" onClick={()=>send(query,t(label))}>{t(label)}</Button>)}</div>}<form className="flex gap-2 border-t border-border p-3" onSubmit={(event:FormEvent)=>{event.preventDefault();send(input);}}><input aria-label={t('Message VASKO')} placeholder={t('Ask me anything…')} className="min-w-0 flex-1 text-sm outline-none bg-background" value={input} onChange={event=>setInput(event.target.value)}/><Button size="icon" type="submit" disabled={!input.trim()} aria-label={t('Send message')}><Send/></Button></form><p className="text-center text-[10px] text-muted-foreground pb-3">{t('Simulated replies. Not professional insurance advice.')}</p></section>}<Button className="chat-launcher h-12 rounded-full px-5" onClick={()=>setOpen(!open)} aria-label={t('Ask VASKO')} aria-expanded={open}><Bot className="size-5"/> <span>{t('Ask VASKO')}</span> <span className="h-2 w-2 rounded-full bg-success-soft ml-1"/></Button></>;
}
