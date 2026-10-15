import { createFileRoute } from '@tanstack/react-router';
import { ClaimsPage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/claims')({head:()=>pageHead('Claims Assistance','Register and track sample insurance claims with DAS Insurance. Demonstration only.'),component:ClaimsPage});
