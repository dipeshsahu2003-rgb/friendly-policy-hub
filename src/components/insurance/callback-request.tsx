import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, PhoneCall } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDemo } from './provider';

const callbackCategories = [
  'Health Insurance', 'Life Insurance', 'Travel Insurance', 'New Policy / Buying Assistance',
  'Policy Renewal', 'Claim Registration / Claim Status', 'Policy Documents', 'Premium Payment / Refund',
  'Policy Changes', 'Complaint / Grievance', 'Website / Technical Issue', 'Senior Citizen Assistance', 'Other Queries',
];
const callbackTimes = ['As soon as possible', 'Morning (9 AM–12 PM)', 'Afternoon (12 PM–3 PM)', 'Evening (3 PM–6 PM)'];

export function openCallbackRequest() {
  window.dispatchEvent(new Event('das:open-callback'));
}

export function CallbackRequestDialog() {
  const { t, addCallback } = useDemo();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    const showDialog = () => {
      setReference('');
      setOpen(true);
    };
    window.addEventListener('das:open-callback', showDialog);
    return () => window.removeEventListener('das:open-callback', showDialog);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMobileError('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const phone = String(form.get('mobile') ?? '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMobileError(t('Enter a valid 10-digit Indian mobile number.'));
      return;
    }

    setSaving(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 100));
      const requestReference = addCallback({
        name: String(form.get('name') ?? '').trim(),
        phone: `+91${phone}`,
        policyNumber: String(form.get('policy') ?? '').trim(),
        category: String(form.get('category') ?? ''),
        preferredTime: String(form.get('time') ?? callbackTimes[0]),
        description: String(form.get('description') ?? '').trim(),
      });
      setReference(requestReference);
      formElement.reset();
    } catch {
      setError(t('We could not create the demo request. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) { setError(''); setMobileError(''); } }}>
    <DialogContent className="callback-dialog">
      <DialogHeader>
        <DialogTitle>{reference ? t('Callback request received') : t('Raise a Call')}</DialogTitle>
        <DialogDescription>{reference ? t('This is a demo confirmation only. No callback is scheduled.') : t('Demo mode · This form will not contact an agent or schedule a real call.')}</DialogDescription>
      </DialogHeader>
      {reference ? <div className="callback-confirmation" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h3>{t('Your demo request is recorded for this session.')}</h3>
        <p>{t('Reference number')}: <strong>{reference}</strong></p>
        <p>{t('No call will be made. No contact details are sent or stored after this session.')}</p>
        <Button type="button" onClick={() => setOpen(false)}>{t('Close')}</Button>
      </div> : <form className="callback-form" onSubmit={submit}>
        <label className="support-form-field">{t('Full Name')} <span aria-hidden="true">*</span><input name="name" required maxLength={100} autoComplete="name" /></label>
        <div className="support-form-field"><label htmlFor="callback-mobile">{t('Mobile Number')} <span aria-hidden="true">*</span></label>
          <div className="mobile-number-field"><span aria-hidden="true">+91</span><input id="callback-mobile" name="mobile" required type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} pattern="[6-9][0-9]{9}" aria-invalid={!!mobileError} aria-describedby={mobileError ? 'callback-mobile-error' : 'callback-mobile-help'} onInvalid={() => setMobileError(t('Enter a valid 10-digit Indian mobile number.'))} onChange={() => setMobileError('')} /></div>
          <span id="callback-mobile-help" className="field-help">{t('Enter a 10-digit Indian mobile number.')}</span>
          {mobileError && <span id="callback-mobile-error" className="field-error" role="alert">{mobileError}</span>}
        </div>
        <label className="support-form-field">{t('Policy Number (optional)')}<input name="policy" maxLength={40} /></label>
        <label className="support-form-field">{t('Support Category')} <span aria-hidden="true">*</span>
          <select name="category" required defaultValue=""><option value="" disabled>{t('Choose a support category')}</option>{callbackCategories.map((category) => <option key={category} value={category}>{t(category)}</option>)}</select>
        </label>
        <label className="support-form-field">{t('Preferred Callback Time')}
          <select name="time" defaultValue={callbackTimes[0]}>{callbackTimes.map((time) => <option key={time} value={time}>{t(time)}</option>)}</select>
        </label>
        <label className="support-form-field">{t('Issue Description')} <span aria-hidden="true">*</span><textarea name="description" required minLength={10} maxLength={1000} rows={3} /></label>
        <label className="consent-field"><input name="consent" type="checkbox" required /> <span>{t('I understand this is a demo request and consent to the information being used for this browser session only.')}</span></label>
        {error && <p className="form-error" role="alert"><AlertCircle aria-hidden="true" /> {error}</p>}
        <Button type="submit" disabled={saving}>{saving ? t('Saving demo request…') : <><PhoneCall aria-hidden="true" /> {t('Submit demo request')}</>}</Button>
      </form>}
    </DialogContent>
  </Dialog>;
}
