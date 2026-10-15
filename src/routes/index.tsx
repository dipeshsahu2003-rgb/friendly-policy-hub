import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/insurance/home';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/')({head:()=>pageHead('DAS Insurance — Protection made personal','Explore sample health, life and travel insurance, claims assistance and SAD, your demo insurance companion. Independent demonstration, not an insurance provider.'),component:Home});
