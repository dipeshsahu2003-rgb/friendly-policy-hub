import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CallbackRequestDialog, openCallbackRequest } from '@/components/insurance/callback-request';
import { HeaderTools } from '@/components/insurance/header-tools';
import { HomeSupport } from '@/components/insurance/home-support';
import { DemoProvider, useDemo } from '@/components/insurance/provider';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, params, children, ...props }: { to: string; params?: { type?: string }; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) => {
    const href = to === '/insurance/$type' && params?.type ? `/insurance/${params.type}` : to;
    return <a href={href} {...props}>{children}</a>;
  },
}));

function renderWithDemo(children: ReactNode) {
  return render(<DemoProvider>{children}</DemoProvider>);
}

function ProviderActions() {
  const { addClaim, addTicket, notifications } = useDemo();
  return <div>
    <button type="button" onClick={() => addClaim({ policy: 'DAS-HLT-1000', type: 'Health', amount: '₹1,000' })}>Create claim</button>
    <button type="button" onClick={() => addTicket({ name: 'Demo', category: 'General', details: 'Demo complaint' })}>Create complaint</button>
    <output>{notifications.length}</output>
  </div>;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Homepage support flows', () => {
  it('opens VASKO from Get Help Now and chat quick replies', () => {
    renderWithDemo(<HomeSupport />);
    const events: Event[] = [];
    const listener = (event: Event) => events.push(event);
    window.addEventListener('das:open-vasko', listener);

    fireEvent.click(screen.getByRole('button', { name: /Get Help Now/ }));
    fireEvent.click(screen.getByRole('button', { name: /Claims/ }));

    expect(events).toHaveLength(2);
    expect((events[1] as CustomEvent<{ query: string }>).detail.query).toBe('claim');
    window.removeEventListener('das:open-vasko', listener);
  });

  it('validates and saves feedback locally with a clear demo confirmation', async () => {
    renderWithDemo(<HomeSupport />);
    const form = screen.getByRole('button', { name: 'Submit Feedback' }).closest('form');
    expect(form).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '5 stars' }));
    fireEvent.change(screen.getByLabelText(/Feedback category/), { target: { value: 'Website Experience' } });
    fireEvent.change(screen.getByLabelText(/Comments/), { target: { value: 'The sample pages are easy to navigate.' } });
    fireEvent.change(screen.getByLabelText(/Name \(optional\)/), { target: { value: 'Demo visitor' } });
    fireEvent.submit(form!);

    await screen.findByText('Thank you. Your feedback was saved in this browser.');
    const saved = JSON.parse(localStorage.getItem('das-insurance-feedback')!);
    expect(saved[0]).toMatchObject({ rating: 5, category: 'Website Experience', name: 'Demo visitor' });
  });

  it('validates the Indian mobile and confirms the callback is demo-only', async () => {
    renderWithDemo(<CallbackRequestDialog />);
    act(() => openCallbackRequest());

    const form = screen.getByRole('button', { name: 'Submit demo request' }).closest('form');
    expect(form).not.toBeNull();
    fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'Demo visitor' } });
    fireEvent.change(screen.getByLabelText('Mobile Number *'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Policy Number (optional)'), { target: { value: 'DAS-HLT-1024' } });
    fireEvent.change(screen.getByLabelText('Support Category *'), { target: { value: 'Health Insurance' } });
    fireEvent.change(screen.getByLabelText('Issue Description *'), { target: { value: 'I need help understanding my sample plan.' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(form!);

    expect(await screen.findByText('Enter a valid 10-digit Indian mobile number.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Mobile Number *'), { target: { value: '9876543210' } });
    fireEvent.submit(form!);

    await screen.findByText('Your demo request is recorded for this session.');
    expect(screen.getByText('This is a demo confirmation only. No callback is scheduled.')).toBeInTheDocument();
    expect(screen.getByText(/DAS-CALL-/)).toBeInTheDocument();
    expect(screen.queryByText('+919876543210')).not.toBeInTheDocument();
  });

  it('creates notifications for successful demo claim and complaint submissions', async () => {
    renderWithDemo(<ProviderActions />);
    fireEvent.click(screen.getByRole('button', { name: 'Create claim' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create complaint' }));

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
    await waitFor(() => expect(JSON.parse(localStorage.getItem('das-insurance-notifications')!)).toHaveLength(2));
    const saved = JSON.parse(localStorage.getItem('das-insurance-notifications')!);
    expect(saved.map((item: { href: string }) => item.href).sort()).toEqual(['/claims', '/support']);
  });
});

describe('Header tools', () => {
  it('opens notifications, search, language, favourites, and profile actions', async () => {
    renderWithDemo(<HeaderTools />);

    fireEvent.click(screen.getByRole('button', { name: 'Open notifications' }));
    expect(await screen.findByText('No notifications yet')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.click(screen.getByRole('button', { name: 'Search website' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'Search website' }), { target: { value: 'health' } });
    expect(await screen.findByRole('link', { name: /Health Insurance/ })).toHaveAttribute('href', '/insurance/health');
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.keyDown(screen.getByRole('button', { name: 'Open language menu' }), { key: 'Enter' });
    fireEvent.click(await screen.findByRole('menuitemradio', { name: 'हिन्दी' }));
    await waitFor(() => expect(localStorage.getItem('das-insurance-language')).toBe('hi'));
    fireEvent.click(screen.getByRole('button', { name: 'सूचनाएं खोलें' }));
    expect(await screen.findByText('अभी कोई सूचना नहीं है')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.click(screen.getByRole('button', { name: 'पसंदीदा खोलें' }));
    expect(await screen.findByText('अभी कोई पसंदीदा सहेजा नहीं गया')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.keyDown(screen.getByRole('button', { name: 'प्रोफ़ाइल मेनू खोलें' }), { key: 'Enter' });
    expect(await screen.findByText('मेरा डैशबोर्ड')).toBeInTheDocument();
  });
});
