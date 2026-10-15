import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/about')({head:()=>pageHead('About DAS Insurance','Learn about DAS Insurance, an independent insurance experience demonstration, not an official provider.'),component:AboutPage});
