export type Resource = { slug:string; title:string; description:string; paragraphs:string[]; link?:{label:string;href:string} };

export const resources:Record<string,Resource> = {
  'car-insurance':{
    slug:'car-insurance',title:'Car Insurance',description:'Car insurance is not currently included in this sample experience.',
    paragraphs:['This independent demo currently contains illustrative Health, Life and Travel plans only. It does not quote, sell or issue motor insurance.','For real vehicle cover, compare licensed insurers and review the policy wording, exclusions and local legal requirements.'],
    link:{label:'Explore sample insurance',href:'/insurance'},
  },
  'two-wheeler-insurance':{
    slug:'two-wheeler-insurance',title:'Two-Wheeler Insurance',description:'Two-wheeler insurance is not currently included in this sample experience.',
    paragraphs:['This independent demo does not quote, sell or issue two-wheeler cover. The listed plans are illustrative Health, Life and Travel examples only.','For real vehicle cover, contact a licensed insurer and check that the policy meets current legal requirements.'],
    link:{label:'Explore sample insurance',href:'/insurance'},
  },
  invoices:{
    slug:'invoices',title:'My Invoices',description:'This demo does not collect payments or issue invoices.',
    paragraphs:['No invoice or payment record exists for this fictional demo profile. Sample premiums shown on the website are not offers and cannot be paid here.','Your sample policies, claims and complaints are available on the customer dashboard.'],
    link:{label:'Open customer dashboard',href:'/dashboard'},
  },
  'profile-settings':{
    slug:'profile-settings',title:'Profile Settings',description:'This website uses a demo profile and has no production sign-in.',
    paragraphs:['The name and records shown in the dashboard are fictional sample data. There is no password, identity verification or secure customer account to edit.','Do not enter real personal, financial or medical information into this demonstration.'],
    link:{label:'Open customer dashboard',href:'/dashboard'},
  },
  careers:{
    slug:'careers',title:'Careers',description:'DAS Insurance is an independent demonstration project, not an insurance company or employer.',
    paragraphs:['There are no jobs or applications associated with this fictional website. No employment or recruitment services are provided.'],
  },
  blog:{
    slug:'blog',title:'Insurance notes',description:'A short guide to reading a sample insurance plan.',
    paragraphs:['Start with the coverage section to see what kinds of events the plan is designed to help with. Then read exclusions and waiting periods: these describe situations or times when a benefit may not apply.','Compare the premium with your budget, but do not choose a real plan on price alone. Check the official policy wording and ask a licensed adviser if any term is unclear.','This educational article is general information for a demo and is not financial or insurance advice.'],
    link:{label:'Read the insurance FAQs',href:'/faq'},
  },
  'grievance-redressal':{
    slug:'grievance-redressal',title:'Grievance Redressal',description:'This demo can record a fictional support complaint, but it is not an official grievance channel.',
    paragraphs:['DAS Insurance is not a licensed provider and cannot accept or resolve real grievances. A complaint entered here stays in browser memory for the current demo session only.','For a real policy concern, contact your insurer through the official contact details in your policy documents.'],
    link:{label:'Open demo support',href:'/support'},
  },
  'privacy-policy':{
    slug:'privacy-policy',title:'Privacy Policy',description:'This independent demo does not send your form entries to an insurance service.',
    paragraphs:['Claim and complaint demo records remain in React memory and reset when the page is refreshed. Accessibility preferences, language choice, notification history and favourites may be stored in this browser’s localStorage.','No account authentication, payment processing or insurance transaction is performed. Avoid entering real personal, financial or medical information. Clearing this browser’s site data removes locally stored preferences, notifications and favourites.'],
  },
  'terms-and-conditions':{
    slug:'terms-and-conditions',title:'Terms and Conditions',description:'DAS Insurance is a fictional, independent demonstration website.',
    paragraphs:['All policies, premiums, cover amounts, customer names and service states shown here are illustrative. This website is not an insurer, broker, adviser or official customer-support channel.','No quote, renewal, claim, complaint or document download creates actual cover or a financial transaction. Use official insurer materials and licensed advice for real insurance decisions.'],
  },
};

export function getResource(slug:string) {return resources[slug];}
