import { createFileRoute, notFound } from '@tanstack/react-router';
import { ProductPage } from '@/components/insurance/pages';
import { products, type InsuranceType } from '@/lib/insurance-data';
import { pageHead } from '@/lib/page-head';
function isType(type:string):type is InsuranceType {return type==='health'||type==='life'||type==='travel';}
export const Route = createFileRoute('/insurance/$type')({loader:({params})=>{if(!isType(params.type))throw notFound();return {type:params.type};},head:({loaderData})=>loaderData?pageHead(products[loaderData.type].title,`${products[loaderData.type].description} Explore illustrative cover and request a demo quote. Not a real insurance offer.`):pageHead('Plan unavailable','This sample insurance plan could not be found.'),component:Detail});
function Detail(){const {type}=Route.useLoaderData();return <ProductPage key={type} type={type}/>;}
