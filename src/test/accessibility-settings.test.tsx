import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AccessibilitySettings } from '@/components/insurance/accessibility-settings';
import { DemoProvider } from '@/components/insurance/provider';

const rootAttributes = [
  'senior-mode',
  'text-size',
  'contrast',
  'smart-contrast',
  'highlight-links',
  'text-spacing',
  'pause-animations',
  'hide-images',
  'dyslexia-font',
];

let speechSynthesisDescriptor: PropertyDescriptor | undefined;

function openSettings() {
  fireEvent.click(screen.getByRole('button', { name: 'Open accessibility settings' }));
}

function renderSettings() {
  return render(<DemoProvider><AccessibilitySettings /></DemoProvider>);
}

beforeEach(() => {
  localStorage.clear();
  speechSynthesisDescriptor = Object.getOwnPropertyDescriptor(window, 'speechSynthesis');
  for (const attribute of rootAttributes) {
    delete document.documentElement.dataset[attribute.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())];
  }
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (speechSynthesisDescriptor) {
    Object.defineProperty(window, 'speechSynthesis', speechSynthesisDescriptor);
  } else {
    Reflect.deleteProperty(window, 'speechSynthesis');
  }
  document.querySelector('main')?.remove();
  for (const attribute of rootAttributes) {
    document.documentElement.removeAttribute(`data-${attribute}`);
  }
  localStorage.clear();
});

describe('Accessibility settings', () => {
  it('applies each preference to the shared document root', async () => {
    renderSettings();
    openSettings();

    const preferences = [
      ['Senior Citizen Mode', 'seniorMode', 'true'],
      ['Contrast+', 'contrast', 'high'],
      ['Smart Contrast', 'smartContrast', 'true'],
      ['Highlight links and controls', 'highlightLinks', 'true'],
      ['Text spacing', 'textSpacing', 'true'],
      ['Pause animations', 'pauseAnimations', 'true'],
      ['Hide images', 'hideImages', 'true'],
      ['Dyslexia-friendly font', 'dyslexiaFont', 'true'],
    ] as const;

    for (const [name, attribute, value] of preferences) {
      fireEvent.click(screen.getByRole('switch', { name }));
      await waitFor(() => expect(document.documentElement.dataset[attribute]).toBe(value));
    }
    fireEvent.click(screen.getByRole('switch', { name: 'Slow speech' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('das-insurance-accessibility')!).slowSpeech).toBe(true));

    expect(screen.getByText('Senior Citizen Mode is on.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open accessibility settings' })).toHaveTextContent('Senior mode on');
    expect(document.documentElement.dataset.contrast).toBe('high');
    expect(document.documentElement.dataset.smartContrast).toBe('true');
  });

  it('persists combined settings and resets all preferences', async () => {
    const view = renderSettings();
    openSettings();

    fireEvent.click(screen.getByRole('switch', { name: 'Contrast+' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Smart Contrast' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Senior Citizen Mode' }));
    fireEvent.click(screen.getByRole('button', { name: 'Increase text size' }));
    fireEvent.click(screen.getByRole('button', { name: 'Increase text size' }));

    await waitFor(() => expect(document.documentElement.dataset.textSize).toBe('2'));
    expect(JSON.parse(localStorage.getItem('das-insurance-accessibility')!).contrast).toBe(true);

    view.unmount();
    renderSettings();
    openSettings();

    await waitFor(() => expect(screen.getByRole('switch', { name: 'Senior Citizen Mode' })).toBeChecked());
    expect(screen.getByText(/Current size: Step 2 of 4/)).toBeInTheDocument();
    expect(document.documentElement.dataset.smartContrast).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Reset settings' }));

    await waitFor(() => expect(document.documentElement.dataset.textSize).toBe('0'));
    expect(screen.getByRole('switch', { name: 'Senior Citizen Mode' })).not.toBeChecked();
    expect(document.documentElement.dataset.contrast).toBe('normal');
    expect(document.documentElement.dataset.smartContrast).toBe('false');
    expect(JSON.parse(localStorage.getItem('das-insurance-accessibility')!).seniorMode).toBe(false);
  });

  it('explains when speech synthesis is unavailable', () => {
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined });
    vi.stubGlobal('SpeechSynthesisUtterance', undefined);

    renderSettings();
    openSettings();

    expect(screen.getByRole('status')).toHaveTextContent('Read Aloud is unavailable in this browser.');
    expect(screen.getByRole('button', { name: /Start/ })).toBeDisabled();
  });

  it('reads the page slowly and supports pause, resume, stop, and closing', () => {
    class MockUtterance {
      rate = 1;
      onend: (() => void) | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      constructor(readonly text: string) {}
    }

    const utterances: MockUtterance[] = [];
    const synthesis = {
      cancel: vi.fn(),
      speak: vi.fn((utterance: MockUtterance) => utterances.push(utterance)),
      pause: vi.fn(),
      resume: vi.fn(),
    };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synthesis });
    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
    const main = document.createElement('main');
    main.textContent = 'A sample insurance page.';
    document.body.appendChild(main);

    renderSettings();
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: /Start/ }));

    expect(synthesis.speak).toHaveBeenCalledOnce();
    expect(utterances[0].text).toContain('A sample insurance page.');
    expect(utterances[0].rate).toBe(1);
    fireEvent.click(screen.getByRole('switch', { name: 'Slow speech' }));
    expect(synthesis.cancel).toHaveBeenCalled();
    expect(synthesis.speak).toHaveBeenCalledTimes(2);
    expect(utterances[1].rate).toBe(0.75);

    fireEvent.click(screen.getByRole('button', { name: /Pause/ }));
    expect(synthesis.pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: /Resume/ }));
    expect(synthesis.resume).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: /Stop/ }));
    expect(synthesis.cancel).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Start/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(synthesis.cancel.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});