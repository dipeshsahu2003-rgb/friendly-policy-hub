import { useEffect, useRef, useState } from 'react';
import { Accessibility, BookOpen, Contrast, Minus, Pause, Play, Plus, RotateCcw, Type, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDemo } from './provider';

const STORAGE_KEY = 'das-insurance-accessibility';
const DEFAULT_SETTINGS = {
  seniorMode: false,
  textSize: 0,
  slowSpeech: false,
  contrast: false,
  smartContrast: false,
  highlightLinks: false,
  textSpacing: false,
  pauseAnimations: false,
  hideImages: false,
  dyslexiaFont: false,
};

type AccessibilitySettingsState = typeof DEFAULT_SETTINGS;
type TogglePreference = Exclude<keyof AccessibilitySettingsState, 'textSize'>;

function readStoredSettings(): AccessibilitySettingsState {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS;

    const value = parsed as Partial<AccessibilitySettingsState>;
    return {
      seniorMode: typeof value.seniorMode === 'boolean' ? value.seniorMode : false,
      textSize: typeof value.textSize === 'number' && Number.isInteger(value.textSize)
        ? Math.max(0, Math.min(4, value.textSize))
        : 0,
      slowSpeech: typeof value.slowSpeech === 'boolean' ? value.slowSpeech : false,
      contrast: typeof value.contrast === 'boolean' ? value.contrast : false,
      smartContrast: typeof value.smartContrast === 'boolean' ? value.smartContrast : false,
      highlightLinks: typeof value.highlightLinks === 'boolean' ? value.highlightLinks : false,
      textSpacing: typeof value.textSpacing === 'boolean' ? value.textSpacing : false,
      pauseAnimations: typeof value.pauseAnimations === 'boolean' ? value.pauseAnimations : false,
      hideImages: typeof value.hideImages === 'boolean' ? value.hideImages : false,
      dyslexiaFont: typeof value.dyslexiaFont === 'boolean' ? value.dyslexiaFont : false,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function PreferenceToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="a11y-option">
      <div className="a11y-option-copy">
        <Label htmlFor={id}>{label}</Label>
        <p id={`${id}-description`}>{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${id}-description`}
      />
    </div>
  );
}

export function AccessibilitySettings() {
  const { t } = useDemo();
  const [settings, setSettings] = useState<AccessibilitySettingsState>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [speechMessage, setSpeechMessage] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSupported = typeof window !== 'undefined'
    && typeof window.speechSynthesis?.speak === 'function'
    && typeof SpeechSynthesisUtterance !== 'undefined';

  useEffect(() => {
    setSettings(readStoredSettings());
    setReady(true);
  }, []);

  useEffect(() => {
    const openSettings = () => setOpen(true);
    window.addEventListener('das:open-accessibility', openSettings);
    return () => window.removeEventListener('das:open-accessibility', openSettings);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;
    root.dataset.seniorMode = String(settings.seniorMode);
    root.dataset.textSize = String(settings.textSize);
    root.dataset.contrast = settings.contrast ? 'high' : 'normal';
    root.dataset.smartContrast = String(settings.smartContrast);
    root.dataset.highlightLinks = String(settings.highlightLinks);
    root.dataset.textSpacing = String(settings.textSpacing);
    root.dataset.pauseAnimations = String(settings.pauseAnimations);
    root.dataset.hideImages = String(settings.hideImages);
    root.dataset.dyslexiaFont = String(settings.dyslexiaFont);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // The settings remain active for this session when storage is unavailable.
    }
  }, [ready, settings]);

  useEffect(() => () => {
    if (typeof window !== 'undefined' && typeof window.speechSynthesis?.cancel === 'function') {
      window.speechSynthesis.cancel();
    }
  }, []);

  function stopReading() {
    utteranceRef.current = null;
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeechStatus('idle');
  }

  function startReading(slowSpeech = settings.slowSpeech) {
    if (!speechSupported) {
      setSpeechMessage('Read Aloud is unavailable in this browser.');
      return;
    }

    const main = document.querySelector('main');
    const text = (main?.innerText || main?.textContent || '').trim();
    if (!text) {
      setSpeechMessage('There is no page content available to read.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = slowSpeech ? 0.75 : 1;
      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setSpeechStatus('idle');
          setSpeechMessage('Finished reading the page.');
        }
      };
      utterance.onerror = (event) => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setSpeechStatus('idle');
          setSpeechMessage(event.error === 'canceled' ? '' : 'Speech playback could not be started.');
        }
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeechStatus('speaking');
      setSpeechMessage('Reading page content aloud.');
    } catch {
      utteranceRef.current = null;
      setSpeechStatus('idle');
      setSpeechMessage('Speech playback could not be started.');
    }
  }

  function updateToggle(key: TogglePreference, checked: boolean) {
    setSettings((current) => ({ ...current, [key]: checked }));
  }

  function updateSpeechRate(checked: boolean) {
    updateToggle('slowSpeech', checked);
    if (speechStatus !== 'idle') startReading(checked);
  }

  function resetSettings() {
    stopReading();
    setSpeechMessage('Accessibility settings have been reset.');
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) stopReading();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="accessibility-trigger"
          aria-label={t('Open accessibility settings')}
          title={t('Accessibility settings')}
        >
          <Accessibility aria-hidden="true" />
          <span className="accessibility-trigger-label">{t('Accessibility')}</span>
          {settings.seniorMode && <span className="senior-mode-chip">{t('Senior mode on')}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="a11y-dialog">
        <DialogHeader className="a11y-dialog-header">
          <span className="a11y-dialog-icon"><Accessibility aria-hidden="true" /></span>
          <DialogTitle>{t('Accessibility Settings')}</DialogTitle>
          <DialogDescription>
            {t('Adjust how DAS Insurance looks and reads on this device. Your choices are saved in this browser.')}
          </DialogDescription>
        </DialogHeader>

        <div className="a11y-content">
          <section className="a11y-senior-option" aria-labelledby="senior-mode-heading">
            <div>
              <h3 id="senior-mode-heading">{t('Senior Citizen Mode')}</h3>
              <p>{t('Larger text and controls with more breathing room across the whole website.')}</p>
              {settings.seniorMode && <p className="a11y-enabled-status" role="status">{t('Senior Citizen Mode is on.')}</p>}
            </div>
            <Switch
              id="senior-mode"
              checked={settings.seniorMode}
              onCheckedChange={(checked) => updateToggle('seniorMode', checked)}
              aria-label={t('Senior Citizen Mode')}
              aria-describedby="senior-mode-description"
            />
            <span id="senior-mode-description" className="sr-only">
              Enlarges text and controls throughout the website.
            </span>
          </section>

          <section className="a11y-section" aria-labelledby="reading-comfort-heading">
            <h3 id="reading-comfort-heading"><Type aria-hidden="true" /> {t('Reading comfort')}</h3>
            <div className="a11y-option a11y-text-size">
              <div className="a11y-option-copy">
                <span className="a11y-option-label">{t('Bigger text')}</span>
                <p id="text-size-description">{t('Increase text in four steps. Current size:')} {settings.textSize === 0 ? t('Default') : t(`Step ${settings.textSize} of 4`)}.</p>
              </div>
              <div className="a11y-stepper" aria-describedby="text-size-description">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t('Decrease text size')}
                  title={t('Decrease text size')}
                  disabled={settings.textSize === 0}
                  onClick={() => setSettings((current) => ({ ...current, textSize: Math.max(0, current.textSize - 1) }))}
                ><Minus aria-hidden="true" /></Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={t('Increase text size')}
                  title={t('Increase text size')}
                  disabled={settings.textSize === 4}
                  onClick={() => setSettings((current) => ({ ...current, textSize: Math.min(4, current.textSize + 1) }))}
                ><Plus aria-hidden="true" /></Button>
              </div>
            </div>
            <PreferenceToggle id="text-spacing" label={t('Text spacing')} description={t('Increase line, letter and word spacing for easier reading.')} checked={settings.textSpacing} onCheckedChange={(checked) => updateToggle('textSpacing', checked)} />
            <PreferenceToggle id="dyslexia-font" label={t('Dyslexia-friendly font')} description={t('Use a clear, rounded font with a common readable fallback.')} checked={settings.dyslexiaFont} onCheckedChange={(checked) => updateToggle('dyslexiaFont', checked)} />
          </section>

          <section className="a11y-section" aria-labelledby="display-heading">
            <h3 id="display-heading"><Contrast aria-hidden="true" /> {t('Display and movement')}</h3>
            <PreferenceToggle id="contrast-plus" label={t('Contrast+')} description={t('Use a high-contrast black and yellow theme.')} checked={settings.contrast} onCheckedChange={(checked) => updateToggle('contrast', checked)} />
            <PreferenceToggle id="smart-contrast" label={t('Smart Contrast')} description={t('Strengthen text and border contrast while keeping control states clear.')} checked={settings.smartContrast} onCheckedChange={(checked) => updateToggle('smartContrast', checked)} />
            <PreferenceToggle id="highlight-links" label={t('Highlight links and controls')} description={t('Add a strong outline and a clear highlight to interactive items.')} checked={settings.highlightLinks} onCheckedChange={(checked) => updateToggle('highlightLinks', checked)} />
            <PreferenceToggle id="pause-animations" label={t('Pause animations')} description={t('Stop decorative motion and transitions. Your system motion preference is also respected.')} checked={settings.pauseAnimations} onCheckedChange={(checked) => updateToggle('pauseAnimations', checked)} />
            <PreferenceToggle id="hide-images" label={t('Hide images')} description={t('Hide images visually while keeping their text alternatives available to assistive technology.')} checked={settings.hideImages} onCheckedChange={(checked) => updateToggle('hideImages', checked)} />
          </section>

          <section className="a11y-section" aria-labelledby="read-aloud-heading">
            <h3 id="read-aloud-heading"><Volume2 aria-hidden="true" /> {t('Read Aloud')}</h3>
            <p className="a11y-section-description">{t('Read the main content of this page using your browser’s speech voice.')}</p>
            <PreferenceToggle id="slow-speech" label={t('Slow speech')} description={t('Use a slower speaking rate during Read Aloud.')} checked={settings.slowSpeech} onCheckedChange={updateSpeechRate} />
            <div className="a11y-speech-controls" role="group" aria-label={t('Read Aloud controls')}>
              <Button type="button" onClick={startReading} disabled={!speechSupported} title={t('Start or restart reading the page')}><Play aria-hidden="true" /> {t('Start')}</Button>
              <Button type="button" variant="outline" onClick={() => { window.speechSynthesis.pause(); setSpeechStatus('paused'); setSpeechMessage('Reading paused.'); }} disabled={!speechSupported || speechStatus !== 'speaking'} title={t('Pause reading')}><Pause aria-hidden="true" /> {t('Pause')}</Button>
              <Button type="button" variant="outline" onClick={() => { window.speechSynthesis.resume(); setSpeechStatus('speaking'); setSpeechMessage('Reading resumed.'); }} disabled={!speechSupported || speechStatus !== 'paused'} title={t('Resume reading')}><Play aria-hidden="true" /> {t('Resume')}</Button>
              <Button type="button" variant="outline" onClick={stopReading} disabled={!speechSupported || speechStatus === 'idle'} title={t('Stop reading')}><span aria-hidden="true">■</span> {t('Stop')}</Button>
            </div>
            <p className="a11y-speech-message" role="status" aria-live="polite">
              {t(speechMessage) || (!speechSupported ? t('Read Aloud is unavailable in this browser.') : t('Speech is ready when you are.'))}
            </p>
          </section>

          <section className="a11y-section a11y-dictionary" aria-labelledby="dictionary-heading">
            <h3 id="dictionary-heading"><BookOpen aria-hidden="true" /> {t('Insurance dictionary')}</h3>
            <p className="a11y-section-description">{t('Plain-English meanings for common insurance words.')}</p>
            <dl>
              <div><dt>{t('Premium')}</dt><dd>{t('The amount you pay to keep an insurance policy active.')}</dd></div>
              <div><dt>{t('Policy')}</dt><dd>{t('The written agreement that explains your insurance and its rules.')}</dd></div>
              <div><dt>{t('Claim')}</dt><dd>{t('A request to your insurer to pay for something covered by your policy.')}</dd></div>
              <div><dt>{t('Deductible')}</dt><dd>{t('The amount you pay yourself before the insurer pays its share.')}</dd></div>
              <div><dt>{t('Coverage')}</dt><dd>{t('The protection and costs your policy agrees to help with.')}</dd></div>
              <div><dt>{t('Exclusion')}</dt><dd>{t('A situation or cost that your policy does not cover.')}</dd></div>
              <div><dt>{t('Renewal')}</dt><dd>{t('Extending a policy for another period, usually by paying a new premium.')}</dd></div>
              <div><dt>{t('Nominee')}</dt><dd>{t('A person named to receive policy benefits if the insured person dies.')}</dd></div>
            </dl>
          </section>

          <div className="a11y-reset-row">
            <p>{t('Reset every accessibility setting to its default.')}</p>
            <Button type="button" variant="outline" onClick={resetSettings} title={t('Restore default accessibility settings')}>
              <RotateCcw aria-hidden="true" /> {t('Reset settings')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}