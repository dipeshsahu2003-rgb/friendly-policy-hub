import { createFileRoute, notFound } from '@tanstack/react-router';

import { ResourcePage } from '@/components/insurance/resource-page';
import { getResource } from '@/lib/resources';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/resources/$slug')({
  loader: ({ params }) => {
    const resource = getResource(params.slug);
    if (!resource) throw notFound();
    return resource;
  },
  head: ({ loaderData }) => loaderData
    ? pageHead(loaderData.title, loaderData.description)
    : pageHead('Demo resource unavailable', 'This demonstration resource could not be found.'),
  component: ResourceRoute,
});

function ResourceRoute() {
  const { slug } = Route.useParams();
  return <ResourcePage slug={slug} />;
}
