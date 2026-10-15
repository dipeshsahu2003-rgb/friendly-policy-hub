import { createFileRoute } from '@tanstack/react-router';
import { FaqPage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/faq')({head:()=>pageHead('Frequently Asked Questions','Clear answers about sample insurance plans, claims, complaints and the independent DAS Insurance demo.'),component:FaqPage});
