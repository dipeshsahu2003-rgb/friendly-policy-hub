import { createFileRoute } from '@tanstack/react-router';
import { InsurancePage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/insurance/')({head:()=>pageHead('Explore Insurance','Compare illustrative health, life and travel plans at DAS Insurance. All plans are demo examples, not real insurance offers.'),component:InsurancePage});
