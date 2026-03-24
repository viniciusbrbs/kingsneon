/**
 * KINGS NEON — WhatsApp Deep-Link Builder + UTM Injector
 * Composes human-readable WhatsApp messages and opens the wa.me URL.
 */

import type { WhatsAppPayload, AnalyticsEvent } from '../types';
import { trackEvent } from './analytics';
import contactData from '../data/contact.json';

const WHATSAPP_BASE_URL = 'https://wa.me/';

/**
 * Captures UTM parameters from the current URL's search params.
 */
export function captureUTMParams(): Pick<WhatsAppPayload, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
  };
}

/**
 * Formats the WhatsApp message payload into a human-readable string.
 */
function formatMessage(payload: WhatsAppPayload): string {
  const lines: string[] = [
    `Olá! Sou *${payload.name}* e gostaria de solicitar um orçamento.`,
    '',
  ];

  if (payload.projectType) {
    lines.push(`*Tipo de projeto:* ${payload.projectType}`);
  }

  if (payload.serviceReference) {
    lines.push(`*Serviço de interesse:* ${payload.serviceReference}`);
  }

  if (payload.email) {
    lines.push(`*E-mail:* ${payload.email}`);
  }

  if (payload.whatsapp) {
    lines.push(`*WhatsApp:* ${payload.whatsapp}`);
  }

  if (payload.message) {
    lines.push('');
    lines.push(`*Mensagem:*`);
    lines.push(payload.message);
  }

  lines.push('');
  lines.push('---');

  const utmParts: string[] = [];
  if (payload.utmSource) utmParts.push(`Fonte: ${payload.utmSource}`);
  if (payload.utmMedium) utmParts.push(`Meio: ${payload.utmMedium}`);
  if (payload.utmCampaign) utmParts.push(`Campanha: ${payload.utmCampaign}`);
  if (payload.pageSource) utmParts.push(`Página: ${payload.pageSource}`);

  if (utmParts.length > 0) {
    lines.push(`_${utmParts.join(' | ')}_`);
  }

  lines.push(`_Enviado via kingsneon.com.br_`);

  return lines.join('\n');
}

/**
 * Builds the full WhatsApp deep-link URL with a pre-composed message.
 */
export function buildWhatsAppURL(payload: WhatsAppPayload): string {
  const message = formatMessage(payload);
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}${contactData.whatsapp}?text=${encodedMessage}`;
}

/**
 * Opens the WhatsApp URL in a new tab and dispatches an analytics event.
 */
export function dispatchWhatsAppCTA(payload: WhatsAppPayload): void {
  const url = buildWhatsAppURL(payload);

  const eventName: AnalyticsEvent = 'click_whatsapp';
  trackEvent(eventName, {
    project_type: payload.projectType,
    page_source: payload.pageSource,
    utm_source: payload.utmSource,
    utm_medium: payload.utmMedium,
    utm_campaign: payload.utmCampaign,
  });

  trackEvent('generate_lead', {
    method: 'whatsapp',
    project_type: payload.projectType,
  });

  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Validates form fields and returns validation errors.
 */
export function validateWhatsAppForm(payload: Partial<WhatsAppPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!payload.name?.trim()) {
    errors['name'] = 'Por favor, informe seu nome.';
  }

  if (!payload.whatsapp?.trim()) {
    errors['whatsapp'] = 'Por favor, informe seu WhatsApp.';
  } else if (payload.whatsapp.replace(/\D/g, '').length < 10) {
    errors['whatsapp'] = 'Número de WhatsApp inválido.';
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors['email'] = 'E-mail inválido.';
  }

  if (!payload.projectType?.trim()) {
    errors['projectType'] = 'Por favor, selecione o tipo de projeto.';
  }

  if (!payload.message?.trim()) {
    errors['message'] = 'Por favor, descreva brevemente seu projeto.';
  }

  return errors;
}
