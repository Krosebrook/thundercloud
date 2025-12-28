/**
 * Production-Grade Website Generation Prompts
 * Ported from Base44 ProductionPromptEngine.jsx
 * 
 * These prompts generate studio-quality websites with SEO, PWA, accessibility,
 * performance optimization, and conversion optimization built-in.
 */

export const PRODUCTION_PROMPTS = {
  base: `You are an elite web development studio creating a production-grade, launch-ready website.`,

  requirements: {
    seo: [
      'Comprehensive meta tags (title, description, og:*, twitter:*)',
      'Schema.org structured data (Organization, WebSite, BreadcrumbList)',
      'Semantic HTML5 (header, nav, main, article, aside, footer)',
      'Proper heading hierarchy (one h1, logical h2-h6 structure)',
      'Descriptive alt text for all images with relevant keywords',
      'Internal linking structure with descriptive anchor text',
      'Mobile-friendly viewport and responsive design',
      'Fast loading (critical CSS inline, async scripts)',
      'Clean URLs structure (human-readable, keyword-rich)',
      'XML sitemap structure in comments for reference',
    ],

    pwa: [
      'PWA-ready structure with manifest.json reference',
      'Offline-first approach with service worker comments',
      'App-like experience with fullscreen mode support',
      'Fast loading with skeleton screens',
      'Add to home screen prompts',
      'Push notification setup structure',
      'Cache-first strategy for assets',
      'Background sync capability comments',
    ],

    design: [
      'Modern, cinematic design with depth and glassmorphism',
      'Consistent 8px baseline grid system',
      'Professional color palette (primary, secondary, accent, neutrals)',
      'Typography scale with proper font loading',
      'Micro-interactions (hover states, button feedback, smooth transitions)',
      'Responsive breakpoints (mobile-first: 320px, 768px, 1024px, 1440px)',
      'Dark mode support with CSS variables',
      'Accessibility (WCAG AA minimum, focus states, keyboard navigation)',
      'Loading states and skeleton screens',
      'Empty states with illustrations',
    ],

    performance: [
      'Critical CSS inlined in <style> tag',
      'Lazy loading for images with loading="lazy"',
      'Async/defer for non-critical scripts',
      'Optimized image formats (WebP with fallbacks)',
      'Minified inline styles (no external CSS files)',
      'Preconnect to external domains',
      'Font display: swap for web fonts',
      'Reduced motion media query support',
      'Resource hints (preload, prefetch, preconnect)',
      'Efficient CSS (no unused rules, mobile-first media queries)',
    ],

    conversion: [
      'Clear value proposition above the fold',
      'Multiple strategic CTAs (primary and secondary)',
      'Social proof elements (testimonials, logos, stats)',
      'Trust signals (security badges, guarantees, certifications)',
      'Lead capture forms (email, contact, newsletter)',
      'Clear navigation with sticky header',
      'FAQ section for objection handling',
      'Urgency/scarcity elements where appropriate',
      'Exit-intent patterns',
      'Contact information easily accessible',
    ],

    modern: [
      'CSS Grid and Flexbox layouts',
      'CSS custom properties (variables) for theming',
      'Modern CSS features (clamp, min/max, aspect-ratio)',
      'Smooth scroll behavior',
      'Intersection Observer for animations',
      'CSS animations with GPU acceleration',
      'Form validation with modern patterns',
      'Progressive enhancement approach',
      'No jQuery or legacy dependencies',
      'Clean, maintainable code structure',
    ],
  },

  templates: {
    landing: {
      sections: [
        'Hero with headline, subheadline, primary CTA, hero image/video',
        'Social proof bar (client logos or testimonial count)',
        'Features section (3-6 key benefits with icons)',
        'How it works (3-step process with visuals)',
        'Testimonials (3-6 with photos, names, roles)',
        'Pricing section (3-tier table with feature comparison)',
        'FAQ (8-12 common questions)',
        'Final CTA section with conversion form',
        'Footer with links, contact, social media',
      ],
      ctas: ['Sign Up Free', 'Get Started', 'Book a Demo', 'Download Now', 'Try It Free'],
    },

    business: {
      sections: [
        'Hero with headline, description, CTA, image',
        'Services overview (4-6 services with icons)',
        'About section (company story, mission, values)',
        'Process/methodology section',
        'Case studies or portfolio (3-6 projects)',
        'Team section (key members with photos)',
        'Client testimonials',
        'Contact form section',
        'Footer with comprehensive links',
      ],
    },

    ecommerce: {
      sections: [
        'Hero with featured products and shop CTA',
        'Category navigation',
        'Featured products grid (8-12 products)',
        'Benefits/USPs (free shipping, returns, warranty)',
        'Social proof (customer reviews, ratings)',
        'Instagram feed or user-generated content',
        'Newsletter signup',
        'Trust badges and payment methods',
        'Footer with policies and support',
      ],
      productCard: [
        'Product image with hover zoom',
        'Product name and description',
        'Price (with sale price if applicable)',
        'Star rating and review count',
        'Add to cart button',
        'Quick view option',
        'Wishlist/save icon',
        'Stock status or urgency indicator',
      ],
    },

    portfolio: {
      sections: [
        'Hero with name, title, brief bio',
        'Featured work showcase (masonry grid)',
        'Skills/expertise section',
        'Work experience timeline',
        'Client testimonials',
        'Process or approach section',
        'Contact CTA',
        'Footer with social links',
      ],
    },

    saas: {
      sections: [
        'Hero with product screenshot/demo',
        'Feature highlights (visual + text)',
        'Use cases or industries served',
        'Integration showcase',
        'Pricing comparison table',
        'Customer success stories',
        'ROI calculator or interactive demo',
        'FAQ',
        'Free trial CTA',
        'Footer with resources and docs',
      ],
    },
  },
};

export interface WebsiteGenerationInput {
  title: string;
  description: string;
  category: 'landing' | 'business' | 'ecommerce' | 'portfolio' | 'saas';
  theme?: string;
  colorScheme?: string;
  language?: string;
}

export function buildGenerationPrompt(input: WebsiteGenerationInput): string {
  const {
    title,
    description,
    category = 'landing',
    theme = 'modern',
    colorScheme = 'professional blue',
    language = 'English',
  } = input;

  const template = PRODUCTION_PROMPTS.templates[category] || PRODUCTION_PROMPTS.templates.landing;

  return `${PRODUCTION_PROMPTS.base}

## PROJECT BRIEF
Title: ${title}
Description: ${description}
Category: ${category}
Theme: ${theme}
Color Scheme: ${colorScheme}
Language: ${language}

## DELIVERABLE
Create a COMPLETE, PRODUCTION-READY, SINGLE-PAGE HTML website that would pass a senior developer's code review and be ready to deploy immediately.

## ARCHITECTURE REQUIREMENTS

### HTML Structure
${PRODUCTION_PROMPTS.requirements.seo.map((r) => `- ${r}`).join('\n')}

### PWA & Modern Web
${PRODUCTION_PROMPTS.requirements.pwa.map((r) => `- ${r}`).join('\n')}

### Design System
${PRODUCTION_PROMPTS.requirements.design.map((r) => `- ${r}`).join('\n')}

### Performance
${PRODUCTION_PROMPTS.requirements.performance.map((r) => `- ${r}`).join('\n')}

### Conversion Optimization
${PRODUCTION_PROMPTS.requirements.conversion.map((r) => `- ${r}`).join('\n')}

### Modern Standards
${PRODUCTION_PROMPTS.requirements.modern.map((r) => `- ${r}`).join('\n')}

## CONTENT STRUCTURE
Include these sections in order:
${template.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## STYLING REQUIREMENTS
- Use a complete, embedded CSS system (NO external stylesheets)
- Modern utility-first approach with reusable classes
- Full responsive design (mobile 320px, tablet 768px, desktop 1024px+)
- Color palette based on ${colorScheme}: define CSS variables for primary, secondary, accent, and neutral colors
- Typography scale: 12px, 14px, 16px, 18px, 24px, 32px, 48px, 64px
- Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
- Smooth animations with proper easing (cubic-bezier)
- Glassmorphism effects with backdrop-filter
- Box shadows for depth (use multiple layers)
- Interactive states for ALL clickable elements

## CODE QUALITY STANDARDS
- Semantic HTML5 only (no divs for structural elements)
- BEM naming convention for CSS classes
- Inline all CSS in <style> tag (critical + non-critical)
- Proper HTML validation (no errors)
- Accessible (ARIA labels, roles, focus management)
- Performance-optimized (lazy loading, async scripts)
- Clean indentation and readable code
- Comprehensive comments for key sections

## CONTENT GUIDELINES
- Write compelling, professional copy in ${language}
- Use real-world examples and specific details (not "Lorem Ipsum")
- Include actual benefits, features, and value propositions
- Add realistic testimonials with names and roles
- Provide specific numbers and statistics where relevant
- Write unique meta descriptions optimized for CTR
- Include relevant keywords naturally (no keyword stuffing)

## ADVANCED FEATURES TO INCLUDE
- Smooth scroll to anchor links
- Animated counter for statistics (CSS animation)
- Parallax effects for hero section (CSS transform)
- Sticky navigation with elevation shadow on scroll
- Modal/lightbox for images (pure CSS or minimal JS)
- Accordion FAQ (details/summary or CSS-only)
- Form validation states (CSS pseudo-classes)
- Loading skeleton for images (CSS gradient animation)
- Toast notification example (CSS animation)
- Mobile menu toggle (checkbox hack or minimal JS)

## OUTPUT FORMAT
Return ONLY valid HTML with embedded CSS. The file should:
1. Start with <!DOCTYPE html>
2. Include comprehensive <head> with all meta tags
3. Have complete <body> with all sections
4. End with proper closing tags
5. Be ready to save as .html and deploy immediately

IMPORTANT: Generate REAL, PRODUCTION-QUALITY content. This should look indistinguishable from a professionally built website by a top agency. No placeholders, no "Add your content here", no generic stock phrases. Make it compelling and specific to the business described.`;
}
