import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/insurance/home';
import { HomeSupport } from '@/components/insurance/home-support';
import { pageHead } from '@/lib/page-head';
function HomePage() {return <><Home/><HomeSupport/></>;}
export const Route = createFileRoute('/')({head:()=>pageHead('DAS Insurance — Protection made personal','Explore sample health, life and travel insurance, claims assistance and VASKO, your demo insurance companion. Independent demonstration, not an insurance provider.'),component:HomePage});
