export type InsuranceType = 'health' | 'life' | 'travel';
export const products = {
  health: { title: 'Health Insurance', tagline: 'Good health. Greater peace of mind.', description: 'Care for yourself and your family with cover that’s there when you need it most.', price: '₹499', period: '/ month', coverage: '₹10 lakh', features: ['Cashless hospitalisation', 'Pre & post-hospitalisation cover', 'Cover for the whole family'], exclusions: 'Pre-existing conditions have a 36-month waiting period. Cosmetic procedures and non-medical expenses are excluded in this sample plan.' },
  life: { title: 'Life Insurance', tagline: 'Their tomorrow, protected today.', description: 'Give your loved ones a financial safety net, through every chapter of life.', price: '₹599', period: '/ month', coverage: '₹1 crore', features: ['Financial security for your family', 'Flexible premium payment options', 'Optional critical illness cover'], exclusions: 'Sample term cover has no maturity benefit. Underwriting and exclusions apply; this is not an actual insurance offer.' },
  travel: { title: 'Travel Insurance', tagline: 'More adventure. Less worry.', description: 'From take-off to touchdown, explore the world with confidence by your side.', price: '₹199', period: '/ trip', coverage: 'US$50,000', features: ['Overseas medical emergencies', 'Lost baggage & passport assistance', 'Trip delay & cancellation cover'], exclusions: 'Adventure sports, known events before purchase and travel against medical advice are excluded in this sample plan.' },
};
export type Ticket = { id: string; name: string; category: string; details: string; status: string; date: string };
export type Claim = { id: string; policy: string; type: string; amount: string; status: string };
export const sampleTickets: Ticket[] = [{ id:'DAS-CMP-1001', name:'Aarav Sharma', category:'Policy servicing', details:'Request to correct the address on my sample policy.', status:'In review', date:'15 Oct 2026' }];
export const sampleClaims: Claim[] = [{ id:'DAS-CLM-2001', policy:'DAS-HLT-1024', type:'Health', amount:'₹24,500', status:'Documents under review' }];
export function getVaskoReply(query: string): string {
 const q = query.toLowerCase();
 if (/human|agent|live chat/.test(q)) return 'No human agent or live chat service is connected in this demo. You can submit the demo callback form or visit the Support page. No call will be scheduled.';
 if (/complaint|grievance|शिकायत/.test(q)) return 'You can register a complaint on the Support page, then track it using your DAS-CMP reference. Try DAS-CMP-1001 to view a sample. New complaints are available during this browsing session.';
 if (/claim|दावा/.test(q)) return 'Go to Claims to submit a sample claim with your policy number, incident date and amount. You can track it there or in your dashboard. For a real emergency, contact your actual insurer or emergency services.';
 if (/travel|baggage|trip|यात्रा|सामान/.test(q)) return 'Our sample Travel plan includes overseas medical emergencies, lost baggage assistance and trip delays. Illustrative cover is US$50,000, starting at ₹199 per trip. Explore Travel Insurance for exclusions.';
 if (/life|term|जीवन/.test(q)) return 'Our sample Life plan offers ₹1 crore term cover from an illustrative ₹599 per month. It supports flexible payments and optional critical illness cover. It is not an actual insurance offer.';
 if (/health|hospital|medical|स्वास्थ्य|अस्पताल|चिकित्सा/.test(q)) return 'Our sample Health plan includes cashless hospitalisation and pre/post-hospitalisation cover, with illustrative ₹10 lakh coverage from ₹499 per month. Pre-existing conditions have a sample 36-month waiting period.';
 if (/renew|policy|download|नवीनीकरण|पॉलिसी|डाउनलोड/.test(q)) return 'Your customer dashboard contains sample policies, renewal actions and downloadable demo policy summaries. No real payment or policy issuance takes place.';
 if (/\b(hi|hello|hey)\b|नमस्ते|नमस्कार|हैलो/.test(q)) return 'Hello! I’m VASKO. I can help with sample health, life and travel plans, claims, policy details and complaints. What would you like to know?';
 return 'I can help with insurance plans, claims, complaints and sample policies. Try asking “How do I file a claim?” or “What does health insurance cover?” I’m a simulated assistant, not a licensed insurance adviser.';
}
export const faqs = [
 ['What is DAS Insurance?', 'DAS Insurance is an independent demonstration project, not an official insurance provider and not affiliated with Bajaj Allianz. All policies, premiums, cover amounts and customer records are illustrative.'],
 ['How do I choose the right insurance plan?', 'Consider your family’s needs, existing cover, budget and exclusions. Explore our Health, Life and Travel sample plans to compare their features. Consult a licensed adviser before purchasing real insurance.'],
 ['How can I register and track a claim?', 'Open Claims, complete the sample claim form and keep the reference number. Use the tracking tab or your customer dashboard to check its simulated status.'],
 ['How can I raise a complaint?', 'Go to Support, select Register complaint and fill in the details. A reference number lets you track the sample complaint during your current browsing session.'],
 ['Can I buy or renew a real policy here?', 'No. Quotes, renewals and downloads are demonstrations only. No payments are collected, and no actual policy or coverage is issued.'],
 ['Is VASKO a real AI adviser?', 'VASKO is a simulated chatbot using prepared responses for this demo. It does not provide personalised financial or medical advice. Do not share sensitive personal information.'],
];
