/* ==========================================================
   KINGS NEON — TypeScript Type Definitions
   Central type exports for all data shapes
   ========================================================== */

// ── Brand ──
export interface BrandData {
  readonly name: string;
  readonly tagline: string;
  readonly foundingYear: number;
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly description: string;
}

// ── SEO ──
export interface PageSeo {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly ogImage: string;
  readonly twitterCard: 'summary' | 'summary_large_image';
  readonly keywords?: readonly string[];
}

export interface SeoData {
  readonly defaultTitle: string;
  readonly titleTemplate: string;
  readonly pages: Record<string, PageSeo>;
}

// ── Navigation ──
export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
  readonly badge?: string;
}

export interface NavigationData {
  readonly items: readonly NavItem[];
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

// ── Hero ──
export interface CtaButton {
  readonly label: string;
  readonly href: string;
  readonly variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  readonly icon?: string;
}

export interface HeroData {
  readonly headline: string;
  readonly subheadline: string;
  readonly valueProposition: string;
  readonly ctas: readonly CtaButton[];
  readonly backgroundType: 'gradient' | 'image' | 'video';
}

// ── Services ──
export interface ServiceItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly slug: string;
  readonly features?: readonly string[];
}

export interface ServicesData {
  readonly sectionTitle: string;
  readonly sectionSubtitle: string;
  readonly items: readonly ServiceItem[];
}

// ── Portfolio ──
export interface PortfolioItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly image: string;
  readonly alt: string;
  readonly featured: boolean;
  readonly location?: string;
  readonly projectType?: string;
}

export interface PortfolioData {
  readonly sectionTitle: string;
  readonly sectionSubtitle: string;
  readonly categories: readonly string[];
  readonly items: readonly PortfolioItem[];
}

// ── Testimonials ──
export interface TestimonialItem {
  readonly name: string;
  readonly role: string;
  readonly content: string;
  readonly rating: number;
  readonly avatarUrl?: string;
}

export interface TestimonialsData {
  readonly sectionTitle: string;
  readonly sectionSubtitle: string;
  readonly items: readonly TestimonialItem[];
}

// ── About ──
export interface Milestone {
  readonly year: number;
  readonly title: string;
  readonly description: string;
}

export interface BrandValue {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface AboutData {
  readonly sectionTitle: string;
  readonly narrative: string;
  readonly shortNarrative: string;
  readonly milestones: readonly Milestone[];
  readonly values: readonly BrandValue[];
}

// ── Process ──
export interface ProcessStep {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
}

export interface ProcessData {
  readonly sectionTitle: string;
  readonly sectionSubtitle: string;
  readonly steps: readonly ProcessStep[];
}

// ── Stats ──
export interface StatItem {
  readonly value: number;
  readonly label: string;
  readonly suffix?: string;
  readonly prefix?: string;
}

export interface StatsData {
  readonly items: readonly StatItem[];
}

// ── Contact ──
export interface BusinessHours {
  readonly weekdays: string;
  readonly saturday: string;
  readonly sunday: string;
}

export interface ContactData {
  readonly phone: string;
  readonly whatsapp: string;
  readonly whatsappFormatted: string;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly region: string;
  readonly postalCode: string;
  readonly country: string;
  readonly businessHours: BusinessHours;
  readonly mapEmbedUrl?: string;
}

// ── Social ──
export interface SocialLink {
  readonly platform: string;
  readonly url: string;
  readonly handle: string;
  readonly icon: string;
}

export interface SocialData {
  readonly links: readonly SocialLink[];
}

// ── Analytics ──
export type AnalyticsEvent =
  | 'page_view'
  | 'click_whatsapp'
  | 'submit_form'
  | 'click_cta_hero'
  | 'click_cta_portfolio'
  | 'view_portfolio_item'
  | 'generate_lead'
  | 'scroll_depth_50'
  | 'scroll_depth_90';

export interface AnalyticsData {
  readonly ga4MeasurementId: string;
  readonly gtmId: string;
  readonly metaPixelId: string;
  readonly enabled: boolean;
  readonly debug: boolean;
}

// ── Footer ──
export interface FooterColumn {
  readonly title: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
}

export interface FooterData {
  readonly columns: readonly FooterColumn[];
  readonly legalLinks: readonly { readonly label: string; readonly href: string }[];
  readonly copyright: string;
}

// ── CTA ──
export interface CtaBlockData {
  readonly headline: string;
  readonly subheadline: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly variant: 'default' | 'accent' | 'minimal';
}

export interface CtaData {
  readonly blocks: Record<string, CtaBlockData>;
}

// ── WhatsApp ──
export interface WhatsAppPayload {
  name: string;
  whatsapp: string;
  email?: string | undefined;
  projectType: string;
  message: string;
  pageSource?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  serviceReference?: string | undefined;
}

// ── Differentials ──
export interface DifferentialItem {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface DifferentialsData {
  readonly sectionTitle: string;
  readonly sectionSubtitle: string;
  readonly items: readonly DifferentialItem[];
}
