import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, ArrowRight, Bot, CheckCircle2, Clock3, FileText, HeartHandshake, LifeBuoy, MessageCircle, PhoneCall, RefreshCw, Send, ShieldCheck, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { openCallbackRequest } from './callback-request';
import { useDemo } from './provider';

const feedbackCategories = ['Website Experience', 'Insurance Products', 'Claims Experience', 'Customer Support', 'Other'];
function openVasko(query?: string, displayText?: string) {
  window.dispatchEvent(new CustomEvent('das:open-vasko', { detail: query ? { query, displayText } : undefined }));
}

export function HomeSupport() {
  const { t, addFeedback } = useDemo();
  const [rating, setRating] = useState(0);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    if (!rating) {
      setFeedbackError(t('Please choose a star rating.'));
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const comments = String(form.get('comments') ?? '').trim();
    if (comments.length < 10) {
      setFeedbackError(t('Please add at least 10 characters of feedback.'));
      return;
    }

    setFeedbackSaving(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 100));
      const stored = addFeedback({
        rating,
        category: String(form.get('category')),
        comments,
        name: String(form.get('name') ?? '').trim(),
      });
      setFeedbackSuccess(t(stored ? 'Thank you. Your feedback was saved in this browser.' : 'Thank you. Your feedback is available for this session, but browser storage is unavailable.'));
      setRating(0);
      formElement.reset();
    } catch {
      setFeedbackError(t('We could not save your feedback. Please try again.'));
    } finally {
      setFeedbackSaving(false);
    }
  }

  return <>
    <section className="home-support-section" aria-labelledby="assistance-title">
      <div className="container-page">
        <div className="home-support-heading">
          <span className="support-section-icon"><LifeBuoy aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">{t('Here for you')}</p>
            <h2 id="assistance-title">{t('24/7 Assistance')}</h2>
            <p>{t('Automated help is available through VASKO whenever you visit this demo. No human agents or live support service are connected.')}</p>
          </div>
        </div>
        <div className="assistance-primary-action"><span><Bot aria-hidden="true" /> {t('Automated demo help')}</span><Button type="button" onClick={() => openVasko()}><MessageCircle aria-hidden="true" /> {t('Get Help Now')}</Button></div>

        <div className="assistance-links" aria-label={t('Quick support links')}>
          <Link to="/dashboard" className="assistance-link"><FileText aria-hidden="true" /><span>{t('Policy Information')}</span><ArrowRight aria-hidden="true" /></Link>
          <Link to="/claims" className="assistance-link"><ShieldCheck aria-hidden="true" /><span>{t('Claims Support')}</span><ArrowRight aria-hidden="true" /></Link>
          <Link to="/dashboard" className="assistance-link"><RefreshCw aria-hidden="true" /><span>{t('Policy Renewal')}</span><ArrowRight aria-hidden="true" /></Link>
          <Link to="/support" className="assistance-link"><MessageCircle aria-hidden="true" /><span>{t('Complaints')}</span><ArrowRight aria-hidden="true" /></Link>
          <Link to="/faq" className="assistance-link"><HeartHandshake aria-hidden="true" /><span>{t('FAQs')}</span><ArrowRight aria-hidden="true" /></Link>
        </div>

        <div className="engagement-grid">
          <article className="engagement-panel live-chat-panel">
            <div className="engagement-panel-heading"><span className="engagement-icon"><Bot aria-hidden="true" /></span><div><h3>{t('Live Chat Support')}</h3><p>{t('Automated demo chat with VASKO')}</p></div></div>
            <p className="engagement-description">{t('VASKO uses prepared responses to help you find sample policy, claim and complaint information. No human agent is connected.')}</p>
            <div className="chat-quick-replies" aria-label={t('Quick chat topics')}>
              {[
                ['Policy Information', 'policy'],
                ['Claims', 'claim'],
                ['Renewal', 'renew policy'],
                ['Complaints', 'complaint'],
                ['Talk to Support', 'human support'],
              ].map(([label, query]) => <Button key={label} type="button" variant="outline" size="sm" onClick={() => openVasko(query, t(label))}>{t(label)}</Button>)}
            </div>
            <div className="engagement-actions">
              <Button type="button" onClick={() => openVasko()}><MessageCircle aria-hidden="true" /> {t('Open VASKO chat')}</Button>
              <Button type="button" variant="link" onClick={openCallbackRequest}>{t('Raise a Call')} <ArrowRight aria-hidden="true" /></Button>
            </div>
            <p className="support-availability"><Clock3 aria-hidden="true" /> {t('Automated demo only · Human support is not configured')}</p>
          </article>

          <article className="engagement-panel callback-promo-panel">
            <div className="engagement-panel-heading"><span className="engagement-icon callback-icon"><PhoneCall aria-hidden="true" /></span><div><h3>{t('Raise a Call')}</h3><p>{t('Submit a callback request')}</p></div></div>
            <p className="engagement-description">{t('Share your question and preferred time. This demo form does not contact an agent or schedule a real callback.')}</p>
            <ul className="callback-promo-list"><li>{t('13 support categories')}</li><li>{t('Choose a preferred time')}</li><li>{t('Demo reference shown after submission')}</li></ul>
            <Button type="button" variant="outline" className="callback-open-button" onClick={openCallbackRequest}><PhoneCall aria-hidden="true" /> {t('Open callback request')}</Button>
          </article>
        </div>
      </div>
    </section>

    <section className="feedback-section" aria-labelledby="feedback-title">
      <div className="container-page feedback-layout">
        <div className="feedback-intro">
          <p className="eyebrow">{t('Help us improve')}</p>
          <h2 id="feedback-title">{t('Your Feedback Matters')}</h2>
          <p>{t('Tell us about your experience with this demonstration. Feedback is stored only in this browser and is not sent to an insurance provider.')}</p>
          <span className="demo-mode-label"><ShieldCheck aria-hidden="true" /> {t('Demo mode · Browser-local feedback')}</span>
        </div>
        <form className="feedback-form" onSubmit={submitFeedback}>
          <fieldset className="rating-fieldset">
            <legend>{t('Your rating')} <span aria-hidden="true">*</span></legend>
            <div className="rating-stars" role="group" aria-label={t('Rate your experience from 1 to 5 stars')}>
              {[1, 2, 3, 4, 5].map((value) => <button
                key={value}
                type="button"
                className="rating-star"
                aria-label={t(`${value} stars`)}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
              ><Star aria-hidden="true" fill={rating >= value ? 'currentColor' : 'none'} /></button>)}
            </div>
          </fieldset>
          <label className="support-form-field">{t('Feedback category')} <span aria-hidden="true">*</span>
            <select name="category" required defaultValue="">
              <option value="" disabled>{t('Choose a category')}</option>
              {feedbackCategories.map((category) => <option key={category} value={category}>{t(category)}</option>)}
            </select>
          </label>
          <label className="support-form-field">{t('Comments')} <span aria-hidden="true">*</span>
            <textarea name="comments" required minLength={10} maxLength={1200} rows={4} placeholder={t('Share what worked well or what we could improve.')} />
          </label>
          <label className="support-form-field">{t('Name (optional)')}
            <input name="name" maxLength={80} autoComplete="name" />
          </label>
          <p className="form-privacy-note">{t('Please do not include personal, policy, payment or medical information.')}</p>
          {feedbackError && <p className="form-error" role="alert"><AlertCircle aria-hidden="true" /> {feedbackError}</p>}
          {feedbackSuccess && <p className="form-success" role="status"><CheckCircle2 aria-hidden="true" /> {feedbackSuccess}</p>}
          <Button type="submit" disabled={feedbackSaving}>{feedbackSaving ? t('Saving feedback…') : <><Send aria-hidden="true" /> {t('Submit Feedback')}</>}</Button>
        </form>
      </div>
    </section>

  </>;
}
