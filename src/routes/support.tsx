import { createFileRoute } from '@tanstack/react-router';
import { PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportPage } from '@/components/insurance/pages';
import { openCallbackRequest } from '@/components/insurance/callback-request';
import { useDemo } from '@/components/insurance/provider';
import { pageHead } from '@/lib/page-head';
function SupportRoute() {const {t}=useDemo();return <><SupportPage/><section className="container-page support-callout"><div><h2>{t('Need a call?')}</h2><p>{t('Raise a demo callback request. No agent will be contacted and no real call will be scheduled.')}</p></div><Button type="button" onClick={openCallbackRequest}><PhoneCall aria-hidden="true"/> {t('Raise a Call')}</Button></section></>;}
export const Route = createFileRoute('/support')({head:()=>pageHead('Customer Support','Register and track sample complaints, and get answers to your insurance questions.'),component:SupportRoute});
