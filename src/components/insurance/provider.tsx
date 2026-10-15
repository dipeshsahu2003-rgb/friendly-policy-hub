import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { sampleTickets, sampleClaims, type Ticket, type Claim } from '@/lib/insurance-data';
import { translate } from '@/lib/localization';
export type Locale = 'en' | 'hi';
export type DemoNotification = { id:string; title:string; message:string; href:string; createdAt:string; read:boolean };
export type FavoriteItem = { id:string; type:'product'|'faq'|'resource'; title:string; href:string; description:string };
export type FeedbackEntry = { id:string; rating:number; category:string; comments:string; name:string; submittedAt:string };
export type CallbackEntry = { id:string; name:string; phone:string; policyNumber:string; category:string; preferredTime:string; description:string; submittedAt:string };
type DemoState = {
 tickets:Ticket[];
 claims:Claim[];
 notifications:DemoNotification[];
 favorites:FavoriteItem[];
 feedbackEntries:FeedbackEntry[];
 callbackEntries:CallbackEntry[];
 locale:Locale;
 t:(text:string)=>string;
 demoProfileActive:boolean;
 feedback:string;
 addTicket:(ticket:Omit<Ticket,'id'|'status'|'date'>)=>string;
 addClaim:(claim:Omit<Claim,'id'|'status'>)=>string;
 addFeedback:(entry:Omit<FeedbackEntry,'id'|'submittedAt'>)=>boolean;
 addCallback:(entry:Omit<CallbackEntry,'id'|'submittedAt'>)=>string;
 updateTicketStatus:(id:string,status:string)=>void;
 updateClaimStatus:(id:string,status:string)=>void;
 markNotificationRead:(id:string)=>void;
 markAllNotificationsRead:()=>void;
 toggleFavorite:(favorite:FavoriteItem)=>void;
 isFavorite:(id:string)=>boolean;
 setLocale:(locale:Locale)=>void;
 setDemoProfileActive:(active:boolean)=>void;
 announce:(message:string)=>void;
};
const DemoContext = createContext<DemoState | null>(null);
const NOTIFICATIONS_KEY = 'das-insurance-notifications';
const FAVORITES_KEY = 'das-insurance-favorites';
const LANGUAGE_KEY = 'das-insurance-language';
const FEEDBACK_KEY = 'das-insurance-feedback';

function readStored<T>(key:string,fallback:T,validate:(value:unknown)=>value is T):T {
 if(typeof window==='undefined') return fallback;
 try {const value:unknown=JSON.parse(window.localStorage.getItem(key)??'null');return validate(value)?value:fallback;} catch {return fallback;}
}

function isNotificationList(value:unknown):value is DemoNotification[] {
 return Array.isArray(value)&&value.every(item=>item&&typeof item.id==='string'&&typeof item.title==='string'&&typeof item.message==='string'&&typeof item.href==='string'&&item.href.startsWith('/')&&!item.href.startsWith('//')&&typeof item.createdAt==='string'&&typeof item.read==='boolean'&&!Number.isNaN(Date.parse(item.createdAt)));
}

function isFavoriteList(value:unknown):value is FavoriteItem[] {
 return Array.isArray(value)&&value.every(item=>item&&typeof item.id==='string'&&typeof item.title==='string'&&typeof item.href==='string'&&item.href.startsWith('/')&&!item.href.startsWith('//')&&typeof item.description==='string'&&['product','faq','resource'].includes(item.type));
}

function isFeedbackList(value:unknown):value is FeedbackEntry[] {
 return Array.isArray(value)&&value.every(item=>item&&typeof item.id==='string'&&Number.isInteger(item.rating)&&item.rating>=1&&item.rating<=5&&typeof item.category==='string'&&typeof item.comments==='string'&&typeof item.name==='string'&&typeof item.submittedAt==='string');
}

function createId() {
 return typeof crypto!=='undefined'&&'randomUUID' in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function DemoProvider({children}:{children:ReactNode}) {
 const [tickets,setTickets] = useState(sampleTickets);
 const [claims,setClaims] = useState(sampleClaims);
 const [notifications,setNotifications]=useState<DemoNotification[]>([]);
 const [favorites,setFavorites]=useState<FavoriteItem[]>([]);
 const [feedbackEntries,setFeedbackEntries]=useState<FeedbackEntry[]>([]);
 const [callbackEntries,setCallbackEntries]=useState<CallbackEntry[]>([]);
 const [locale,setLocaleState]=useState<Locale>('en');
 const [storageReady,setStorageReady]=useState(false);
 const [demoProfileActive,setDemoProfileActive]=useState(true);
 const [feedback,setFeedback]=useState('');

 useEffect(()=>{
  setNotifications(readStored(NOTIFICATIONS_KEY,[],isNotificationList));
  setFavorites(readStored(FAVORITES_KEY,[],isFavoriteList));
  setFeedbackEntries(readStored(FEEDBACK_KEY,[],isFeedbackList));
  setLocaleState(readStored(LANGUAGE_KEY,'en',(value):value is Locale=>value==='en'||value==='hi'));
  setStorageReady(true);
 },[]);
 useEffect(()=>{if(!storageReady)return;try{window.localStorage.setItem(NOTIFICATIONS_KEY,JSON.stringify(notifications));}catch{/* Browser storage is optional; notifications stay available in memory. */}},[notifications,storageReady]);
 useEffect(()=>{if(!storageReady)return;try{window.localStorage.setItem(FAVORITES_KEY,JSON.stringify(favorites));}catch{/* Favourites stay available in memory when storage is blocked. */}},[favorites,storageReady]);
 useEffect(()=>{if(!storageReady)return;try{window.localStorage.setItem(FEEDBACK_KEY,JSON.stringify(feedbackEntries));}catch{/* Feedback stays available in memory if browser storage is unavailable. */}},[feedbackEntries,storageReady]);
 useEffect(()=>{if(!storageReady)return;try{window.localStorage.setItem(LANGUAGE_KEY,locale);}catch{/* The selected language remains active for this session. */}document.documentElement.lang=locale;},[locale,storageReady]);

 function addNotification(title:string,message:string,href:string) {
  const notification:DemoNotification={id:createId(),title,message,href,createdAt:new Date().toISOString(),read:false};
  setNotifications(previous=>[notification,...previous]);
 }
 function addTicket(ticket:Omit<Ticket,'id'|'status'|'date'>) {
  const id=`DAS-CMP-${1001+tickets.length}`;
  setTickets(previous=>[...previous,{...ticket,id,status:'Registered',date:new Date().toLocaleDateString(locale==='hi'?'hi-IN':'en-IN',{day:'numeric',month:'short',year:'numeric'})}]);
  addNotification('Complaint registered',`Demo complaint ${id} was registered. No real complaint was submitted.`,'/support');
  return id;
 }
 function addClaim(claim:Omit<Claim,'id'|'status'>) {
  const id=`DAS-CLM-${2001+claims.length}`;
  setClaims(previous=>[...previous,{...claim,id,status:'Submitted'}]);
  addNotification('Demo claim submitted',`Sample claim ${id} is marked Submitted in this demo.`,'/claims');
  return id;
 }
 function addFeedback(entry:Omit<FeedbackEntry,'id'|'submittedAt'>) {
  const record:FeedbackEntry={...entry,id:createId(),submittedAt:new Date().toISOString()};
  const next=[record,...feedbackEntries];
  setFeedbackEntries(next);
  try {window.localStorage.setItem(FEEDBACK_KEY,JSON.stringify(next));return true;} catch {return false;}
 }
 function addCallback(entry:Omit<CallbackEntry,'id'|'submittedAt'>) {
  const record:CallbackEntry={...entry,id:`DAS-CALL-${Date.now().toString().slice(-8)}`,submittedAt:new Date().toISOString()};
  setCallbackEntries(previous=>[record,...previous]);
  return record.id;
 }
 function updateTicketStatus(id:string,status:string) {
  const ticket=tickets.find(item=>item.id===id);
  if(!ticket||ticket.status===status)return;
  setTickets(previous=>previous.map(item=>item.id===id?{...item,status}:item));
  addNotification('Complaint status updated',`Demo complaint ${id} is now ${status}.`,'/support');
 }
 function updateClaimStatus(id:string,status:string) {
  const claim=claims.find(item=>item.id===id);
  if(!claim||claim.status===status)return;
  setClaims(previous=>previous.map(item=>item.id===id?{...item,status}:item));
  addNotification('Claim status updated',`Demo claim ${id} is now ${status}.`,'/claims');
 }
 function markNotificationRead(id:string) {setNotifications(previous=>previous.map(item=>item.id===id?{...item,read:true}:item));}
 function markAllNotificationsRead() {setNotifications(previous=>previous.map(item=>({...item,read:true})));}
 function toggleFavorite(favorite:FavoriteItem) {
    const exists=favorites.some(item=>item.id===favorite.id);
    setFavorites(previous=>exists?previous.filter(item=>item.id!==favorite.id):[favorite,...previous]);
   setFeedback(`${translate(locale,exists?'Removed from favourites':'Added to favourites')}: ${translate(locale,favorite.title)}`);
 }
 function isFavorite(id:string) {return favorites.some(item=>item.id===id);}
 function setLocale(next:Locale) {setLocaleState(next);}
 function announce(message:string) {setFeedback(message);}
 function t(text:string) {return translate(locale,text);}

 return <DemoContext.Provider value={{tickets,claims,notifications,favorites,feedbackEntries,callbackEntries,locale,t,demoProfileActive,feedback,addTicket,addClaim,addFeedback,addCallback,updateTicketStatus,updateClaimStatus,markNotificationRead,markAllNotificationsRead,toggleFavorite,isFavorite,setLocale,setDemoProfileActive,announce}}>{children}</DemoContext.Provider>;
}
export function useDemo() { const value=useContext(DemoContext);if(!value) throw new Error('Demo provider missing');return value; }
