import { Link } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getResource } from '@/lib/resources';
import { FavoriteButton } from './favorite-button';
import { PageBanner } from './pages';
import { useDemo } from './provider';

export function ResourcePage({ slug }: { slug: string }) {
  const resource = getResource(slug);
  const { t } = useDemo();
  if (!resource) return null;

  return <main>
    <PageBanner label={t('DAS Insurance demo resource')} title={t(resource.title)} description={t(resource.description)} />
    <section className="container-page page-body">
      <article className="resource-panel">
        <div className="flex items-start justify-between gap-4">
          <ShieldCheck className="text-primary" size={34} aria-hidden="true" />
          <FavoriteButton item={{ id: `resource:${resource.slug}`, type: 'resource', title: resource.title, href: `/resources/${resource.slug}`, description: resource.description }} />
        </div>
        <div className="resource-copy">{resource.paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}</div>
        {resource.link && <Button asChild className="mt-7">
          <Link to={resource.link.href as '/insurance' | '/faq' | '/dashboard' | '/support'}>{t(resource.link.label)} <ArrowRight /></Link>
        </Button>}
      </article>
    </section>
  </main>;
}
