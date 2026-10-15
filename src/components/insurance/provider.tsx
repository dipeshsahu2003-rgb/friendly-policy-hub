import { createContext, useContext, useState, type ReactNode } from 'react';
import { sampleTickets, sampleClaims, type Ticket, type Claim } from '@/lib/insurance-data';
type DemoState = { tickets:Ticket[]; claims:Claim[]; addTicket:(ticket:Omit<Ticket,'id'|'status'|'date'>)=>string; addClaim:(claim:Omit<Claim,'id'|'status'>)=>string };
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({children}:{children:ReactNode}) {
 const [tickets,setTickets] = useState(sampleTickets);
 const [claims,setClaims] = useState(sampleClaims);
 function addTicket(ticket:Omit<Ticket,'id'|'status'|'date'>) { const id=`DAS-CMP-${1001+tickets.length}`; setTickets(prev=>[...prev,{...ticket,id,status:'Registered',date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}]);return id; }
 function addClaim(claim:Omit<Claim,'id'|'status'>) { const id=`DAS-CLM-${2001+claims.length}`;setClaims(prev=>[...prev,{...claim,id,status:'Submitted'}]);return id; }
 return <DemoContext.Provider value={{tickets,claims,addTicket,addClaim}}>{children}</DemoContext.Provider>;
}
export function useDemo() { const value=useContext(DemoContext);if(!value) throw new Error('Demo provider missing');return value; }
