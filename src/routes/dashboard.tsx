import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/dashboard')({head:()=>pageHead('Your Customer Dashboard','Manage fictional policies, download demo summaries and follow sample claims and complaints.'),component:DashboardPage});
