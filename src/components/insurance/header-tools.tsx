import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { Bell, Check, ChevronRight, Globe2, Heart, LogOut, Search, UserRound, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { faqs, products } from '@/lib/insurance-data';
import type { InsuranceType } from '@/lib/insurance-data';
import type { Locale } from './provider';
import { useDemo } from './provider';

type AppLinkProps = { href:string; children:React.ReactNode; className?:string; onClick?:React.MouseEventHandler<HTMLAnchorElement>; ref?:React.Ref<HTMLAnchorElement> };

function AppLink({href,...props}:AppLinkProps) {
  if (href === '/claims') return <Link to="/claims" {...props} />;
  if (href === '/support') return <Link to="/support" {...props} />;
  if (href === '/faq') return <Link to="/faq" {...props} />;
  if (href === '/dashboard') return <Link to="/dashboard" {...props} />;
  if (href === '/about') return <Link to="/about" {...props} />;
  if (href === '/insurance') return <Link to="/insurance" {...props} />;
  const productType = href.match(/^\/insurance\/(health|life|travel)$/)?.[1] as InsuranceType | undefined;
  if (productType) return <Link to="/insurance/$type" params={{type:productType}} {...props} />;
  return <a href={href} {...props} />;
}

const searchPages = [
  { title: 'Claims assistance', description: 'Register and track a demo claim.', href: '/claims', category: 'Help' },
  { title: 'Customer support', description: 'Register and track a demo complaint.', href: '/support', category: 'Help' },
  { title: 'Frequently asked questions', description: 'Answers about sample insurance and services.', href: '/faq', category: 'Help' },
  { title: 'Customer dashboard', description: 'Sample policies, claims, complaints and renewal actions.', href: '/dashboard', category: 'Account' },
  { title: 'Renew Policy', description: 'Review sample renewal actions on the dashboard.', href: '/dashboard', category: 'Account' },
  { title: 'My Invoices', description: 'This demo does not issue invoices or collect payments.', href: '/resources/invoices', category: 'Account' },
];

export function HeaderTools() {
  const {
    notifications,
    favorites,
    locale,
    setLocale,
    demoProfileActive,
    setDemoProfileActive,
    markNotificationRead,
    markAllNotificationsRead,
    toggleFavorite,
    announce,
    t,
  } = useDemo();
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const resultRefs = useRef<HTMLAnchorElement[]>([]);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const searchItems = [
    ...Object.entries(products).map(([type, product]) => ({
      title: product.title,
      description: product.description,
      href: `/insurance/${type}`,
      category: 'Insurance',
    })),
    ...faqs.map(([title, description]) => ({ title, description, href: '/faq', category: 'FAQ' })),
    ...searchPages,
  ];
  const normalizedQuery = query.trim().toLocaleLowerCase(locale === 'hi' ? 'hi-IN' : 'en-IN');
  const results = normalizedQuery
    ? searchItems.filter((item) => `${t(item.title)} ${t(item.description)} ${t(item.category)}`
      .toLocaleLowerCase(locale === 'hi' ? 'hi-IN' : 'en-IN').includes(normalizedQuery)).slice(0, 8)
    : [];

  useEffect(() => {
    const openNotifications = () => setNotificationsOpen(true);
    const openFavorites = () => setFavoritesOpen(true);
    window.addEventListener('das:open-notifications', openNotifications);
    window.addEventListener('das:open-favourites', openFavorites);
    return () => {
      window.removeEventListener('das:open-notifications', openNotifications);
      window.removeEventListener('das:open-favourites', openFavorites);
    };
  }, []);

  function focusResult(index: number) {
    const target = Math.max(0, Math.min(results.length - 1, index));
    resultRefs.current[target]?.focus();
  }

  function handleSearchKeys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      focusResult(0);
    }
  }

  function handleResultKeys(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusResult((index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) document.getElementById('header-site-search')?.focus();
      else focusResult(index - 1);
    }
  }

  return <>
    <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DialogTrigger asChild>
        <Button className="header-tool" variant="ghost" size="icon" aria-label={t('Open notifications')} title={t('Notifications')}>
          <Bell aria-hidden="true" />
          {unreadCount > 0 && <span className="header-count" aria-label={`${unreadCount} unread`}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="header-tool-dialog">
        <DialogHeader>
          <DialogTitle>{t('Notifications')}</DialogTitle>
          <DialogDescription>{t('Browser-local demo notifications. They are not server-driven or real-time insurer updates.')}</DialogDescription>
        </DialogHeader>
        {notifications.length > 0 ? <>
          <div className="header-dialog-actions">
            <span>{unreadCount ? t('Unread') + ` · ${unreadCount}` : t('Read')}</span>
            <Button type="button" variant="outline" size="sm" onClick={markAllNotificationsRead} disabled={!unreadCount}>
              <Check aria-hidden="true" /> {t('Mark all as read')}
            </Button>
          </div>
          <div className="notification-list">
            {notifications.map((notification) => <article className={`notification-item ${notification.read ? 'is-read' : 'is-unread'}`} key={notification.id}>
              <span className="notification-dot" aria-hidden="true" />
              <div className="notification-copy">
                <h3>{t(notification.title)}</h3>
                <p>{t(notification.message)}</p>
                <time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                <DialogClose asChild>
                  <AppLink href={notification.href} onClick={() => markNotificationRead(notification.id)}>
                    {t('View details')} <ChevronRight aria-hidden="true" size={15} />
                  </AppLink>
                </DialogClose>
              </div>
              {!notification.read && <Button type="button" variant="ghost" size="sm" onClick={() => markNotificationRead(notification.id)}>{t('Mark as read')}</Button>}
            </article>)}
          </div>
        </> : <div className="header-tool-empty"><Bell aria-hidden="true" /><h3>{t('No notifications yet')}</h3><p>{t('Demo claims and complaint submissions will appear here.')}</p></div>}
      </DialogContent>
    </Dialog>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="header-tool optional-header-tool language-trigger" variant="ghost" size="icon" aria-label={t('Open language menu')} title={t('Language')}>
          <Globe2 aria-hidden="true" /><span aria-hidden="true">{locale === 'en' ? 'EN' : 'हि'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="header-language-menu">
        <DropdownMenuLabel>{t('Language')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="hi">हिन्दी</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={favoritesOpen} onOpenChange={setFavoritesOpen}>
      <DialogTrigger asChild>
        <Button className="header-tool optional-header-tool" variant="ghost" size="icon" aria-label={t('Open favourites')} title={t('Favourites')}>
          <Heart aria-hidden="true" />
          {favorites.length > 0 && <span className="header-count" aria-label={`${favorites.length} saved`}>{favorites.length > 9 ? '9+' : favorites.length}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="header-tool-dialog">
        <DialogHeader>
          <DialogTitle>{t('Favourites')}</DialogTitle>
          <DialogDescription>{t('Saved products, FAQs and help resources on this device.')}</DialogDescription>
        </DialogHeader>
        {favorites.length ? <div className="favorite-list">{favorites.map((favorite) => <article className="favorite-item" key={favorite.id}>
          <div><span>{t(favorite.type === 'product' ? 'Product' : favorite.type === 'faq' ? 'FAQ' : 'Help resource')}</span><h3>{t(favorite.title)}</h3><p>{t(favorite.description)}</p></div>
          <div className="favorite-actions">
            <DialogClose asChild><AppLink href={favorite.href}>{t('Open')} <ChevronRight aria-hidden="true" size={15} /></AppLink></DialogClose>
            <Button type="button" variant="ghost" size="icon" aria-label={`${t('Remove')} ${t(favorite.title)}`} title={t('Remove from favourites')} onClick={() => toggleFavorite(favorite)}>
              <Heart aria-hidden="true" fill="currentColor" />
            </Button>
          </div>
        </article>)}</div> : <div className="header-tool-empty"><Heart aria-hidden="true" /><h3>{t('No favourites saved yet')}</h3><p>{t('Save an insurance product, FAQ or help resource with its heart button.')}</p></div>}
      </DialogContent>
    </Dialog>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="header-tool" variant="ghost" size="icon" aria-label={t('Open profile menu')} title={t('Customer profile')}>
          <UserRound aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="profile-menu">
        <DropdownMenuLabel>{t(demoProfileActive ? 'Demo profile · Demo session active' : 'Demo profile · Signed out')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/dashboard">{t('My Dashboard')}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/dashboard">{t('My Policies')}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/claims">{t('My Claims')}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/support">{t('My Complaints')}</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><a href="/resources/invoices">{t('My Invoices')}</a></DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setNotificationsOpen(true)}>{t('My Notifications')}</DropdownMenuItem>
        <DropdownMenuItem asChild><a href="/resources/profile-settings">{t('Profile Settings')}</a></DropdownMenuItem>
        <DropdownMenuSeparator />
        {demoProfileActive
          ? <DropdownMenuItem onSelect={() => { setDemoProfileActive(false); announce(t('Signed out of the demo profile.')); }}><LogOut aria-hidden="true" />{t('Log out')}</DropdownMenuItem>
          : <DropdownMenuItem onSelect={() => { setDemoProfileActive(true); announce(t('Signed in to demo profile.')); }}>{t('Start demo profile')}</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog onOpenChange={(open) => { if (!open) setQuery(''); }}>
      <DialogTrigger asChild>
        <Button className="header-tool" variant="ghost" size="icon" aria-label={t('Search website')} title={t('Search')}>
          <Search aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="header-search-dialog">
        <DialogHeader>
          <DialogTitle>{t('Search DAS Insurance')}</DialogTitle>
          <DialogDescription>{t('Search insurance, FAQs, help, claims and account pages.')}</DialogDescription>
        </DialogHeader>
        <form className="header-search-form" onSubmit={(event) => { event.preventDefault(); resultRefs.current[0]?.click(); }}>
          <Search aria-hidden="true" />
          <Input id="header-site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleSearchKeys} placeholder={t('Search products, FAQs and support')} aria-label={t('Search website')} />
          {query && <Button type="button" variant="ghost" size="icon" aria-label={t('Clear search')} title={t('Clear search')} onClick={() => setQuery('')}><X aria-hidden="true" /></Button>}
        </form>
        <div className="header-search-results" aria-live="polite">
          {results.map((result, index) => <DialogClose asChild key={`${result.href}-${result.title}`}><AppLink
            href={result.href}
            ref={(element) => { if (element) resultRefs.current[index] = element; }}
            onKeyDown={(event) => handleResultKeys(event, index)}
            className="header-search-result"
          >
            <span><small>{t(result.category)}</small><strong>{t(result.title)}</strong><span>{t(result.description)}</span></span>
            <ChevronRight aria-hidden="true" />
          </AppLink></DialogClose>)}
          {normalizedQuery && results.length === 0 && <p className="header-search-empty">{t('No results found')}<span>{t('Try another word or browse insurance, claims and support.')}</span></p>}
          {!normalizedQuery && <p className="header-search-empty">{t('Search insurance, FAQs, help, claims and account pages.')}</p>}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
