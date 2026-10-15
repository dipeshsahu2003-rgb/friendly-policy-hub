import { createFileRoute } from '@tanstack/react-router';
import { SupportPage } from '@/components/insurance/pages';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/support')({head:()=>pageHead('Customer Support','Register and track sample complaints, and get answers to your insurance questions.'),component:SupportPage});
