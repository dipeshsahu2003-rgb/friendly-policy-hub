import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { FavoriteItem } from './provider';
import { useDemo } from './provider';

export function FavoriteButton({ item, className = '' }: { item: FavoriteItem; className?: string }) {
  const { isFavorite, toggleFavorite, t } = useDemo();
  const saved = isFavorite(item.id);
  const label = saved ? 'Remove from favourites' : 'Add to favourites';

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={`favorite-toggle ${className}`}
      aria-label={`${t(label)}: ${t(item.title)}`}
      aria-pressed={saved}
      title={t(label)}
      onClick={() => toggleFavorite(item)}
    >
      <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
    </Button>
  );
}