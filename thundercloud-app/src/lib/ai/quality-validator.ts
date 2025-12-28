/**
 * Website Quality Validation System
 * Ported from Base44 QualityValidator.jsx
 * 
 * Validates generated websites against production standards:
 * - SEO optimization
 * - Performance metrics
 * - Accessibility compliance
 * - Design quality
 * - Content quality
 */

import { JSDOM } from 'jsdom';

export interface ValidationCheck {
  score: number;
  issues: string[];
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  checks: {
    seo: ValidationCheck;
    performance: ValidationCheck;
    accessibility: ValidationCheck;
    design: ValidationCheck;
    content: ValidationCheck;
  };
  issues: string[];
  recommendations: string[];
}

export class WebsiteQualityValidator {
  private minScore = 75; // Minimum passing score (out of 100)

  validate(htmlContent: string): ValidationResult {
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const checks = {
      seo: this.validateSEO(doc, htmlContent),
      performance: this.validatePerformance(htmlContent),
      accessibility: this.validateAccessibility(doc),
      design: this.validateDesign(htmlContent),
      content: this.validateContent(doc, htmlContent),
    };

    const scores = Object.values(checks).map((c) => c.score);
    const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      passed: totalScore >= this.minScore,
      score: Math.round(totalScore),
      checks,
      issues: this.collectIssues(checks),
      recommendations: this.generateRecommendations(checks),
    };
  }

  private validateSEO(doc: Document, html: string): ValidationCheck {
    const issues: string[] = [];
    let score = 100;

    // Check title tag
    const title = doc.querySelector('title');
    if (!title || title.textContent!.length < 30) {
      issues.push('Title tag missing or too short (min 30 chars)');
      score -= 10;
    }

    // Check meta description
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (!metaDesc || metaDesc.getAttribute('content')!.length < 120) {
      issues.push('Meta description missing or too short (min 120 chars)');
      score -= 10;
    }

    // Check Open Graph tags
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    ogTags.forEach((tag) => {
      if (!doc.querySelector(`meta[property="${tag}"]`)) {
        issues.push(`Missing Open Graph tag: ${tag}`);
        score -= 5;
      }
    });

    // Check heading structure
    const h1 = doc.querySelectorAll('h1');
    if (h1.length === 0) {
      issues.push('No H1 heading found');
      score -= 15;
    } else if (h1.length > 1) {
      issues.push('Multiple H1 headings found (should have exactly one)');
      score -= 5;
    }

    // Check semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'footer'];
    semanticTags.forEach((tag) => {
      if (!doc.querySelector(tag)) {
        issues.push(`Missing semantic tag: <${tag}>`);
        score -= 5;
      }
    });

    // Check alt text on images
    const images = doc.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      score -= Math.min(imagesWithoutAlt.length * 3, 15);
    }

    // Check structured data
    if (!html.includes('application/ld+json')) {
      issues.push('No Schema.org structured data found');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  private validatePerformance(html: string): ValidationCheck {
    const issues: string[] = [];
    let score = 100;

    // Check CSS size
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (cssMatch) {
      const totalCssSize = cssMatch.join('').length;
      if (totalCssSize > 50000) {
        issues.push('CSS size excessive (>50KB). Consider optimization.');
        score -= 10;
      }
    } else {
      issues.push('No embedded CSS found');
      score -= 20;
    }

    // Check for external CSS
    if (html.includes('<link rel="stylesheet"')) {
      issues.push('External CSS detected. Prefer critical CSS inline.');
      score -= 5;
    }

    // Check for lazy loading
    if (!html.includes('loading="lazy"') && html.includes('<img')) {
      issues.push('No lazy loading detected for images');
      score -= 10;
    }

    // Check for async/defer scripts
    const scriptTags = html.match(/<script[^>]*>/gi) || [];
    const blockingScripts = scriptTags.filter(
      (tag) => !tag.includes('async') && !tag.includes('defer')
    );
    if (blockingScripts.length > 0) {
      issues.push('Blocking scripts detected. Use async/defer.');
      score -= 5;
    }

    return { score: Math.max(0, score), issues };
  }

  private validateAccessibility(doc: Document): ValidationCheck {
    const issues: string[] = [];
    let score = 100;

    // Check for ARIA labels on interactive elements
    const buttons = doc.querySelectorAll('button, a');
    const buttonsWithoutLabel = Array.from(buttons).filter(
      (btn) => !btn.textContent?.trim() && !btn.getAttribute('aria-label')
    );
    if (buttonsWithoutLabel.length > 0) {
      issues.push(
        `${buttonsWithoutLabel.length} buttons/links without text or aria-label`
      );
      score -= 10;
    }

    // Check for proper form labels
    const inputs = doc.querySelectorAll('input, textarea, select');
    let inputsWithoutLabels = 0;
    Array.from(inputs).forEach((input) => {
      const id = input.getAttribute('id');
      if (!id || !doc.querySelector(`label[for="${id}"]`)) {
        inputsWithoutLabels++;
      }
    });
    if (inputsWithoutLabels > 0) {
      issues.push(`${inputsWithoutLabels} form inputs without associated labels`);
      score -= Math.min(inputsWithoutLabels * 5, 15);
    }

    // Check for lang attribute
    if (!doc.documentElement.getAttribute('lang')) {
      issues.push('Missing lang attribute on <html>');
      score -= 10;
    }

    // Check viewport meta tag
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push('Missing viewport meta tag');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }

  private validateDesign(html: string): ValidationCheck {
    const issues: string[] = [];
    let score = 100;

    // Check for CSS variables
    if (!html.includes(':root') && !html.includes('--')) {
      issues.push('No CSS custom properties (variables) detected');
      score -= 10;
    }

    // Check for responsive design
    if (!html.includes('@media')) {
      issues.push('No media queries found. Site may not be responsive.');
      score -= 20;
    }

    // Check for modern CSS features
    const modernFeatures = ['grid', 'flex', 'transform', 'transition'];
    modernFeatures.forEach((feature) => {
      if (!html.toLowerCase().includes(feature)) {
        issues.push(`No ${feature} usage detected`);
        score -= 5;
      }
    });

    // Check for animations
    if (!html.includes('animation') && !html.includes('transition')) {
      issues.push('No animations or transitions detected');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  private validateContent(doc: Document, html: string): ValidationCheck {
    const issues: string[] = [];
    let score = 100;

    // Check content length
    const textContent = doc.body.textContent || '';
    const wordCount = textContent.split(/\s+/).length;

    if (wordCount < 300) {
      issues.push(`Content too short (${wordCount} words, min 300)`);
      score -= 20;
    }

    // Check for placeholder content
    const placeholders = ['lorem ipsum', 'placeholder', 'add your content here'];
    placeholders.forEach((placeholder) => {
      if (html.toLowerCase().includes(placeholder)) {
        issues.push(`Placeholder content detected: "${placeholder}"`);
        score -= 10;
      }
    });

    // Check for CTAs
    const ctaWords = ['sign up', 'get started', 'learn more', 'contact', 'buy now'];
    const hasCTA = ctaWords.some((cta) => html.toLowerCase().includes(cta));
    if (!hasCTA) {
      issues.push('No clear call-to-action detected');
      score -= 10;
    }

    return { score: Math.max(0, score), issues };
  }

  private collectIssues(checks: ValidationResult['checks']): string[] {
    const allIssues: string[] = [];
    Object.entries(checks).forEach(([category, check]) => {
      check.issues.forEach((issue) => {
        allIssues.push(`[${category.toUpperCase()}] ${issue}`);
      });
    });
    return allIssues;
  }

  private generateRecommendations(checks: ValidationResult['checks']): string[] {
    const recommendations: string[] = [];

    if (checks.seo.score < 80) {
      recommendations.push(
        'Improve SEO: Add comprehensive meta tags and structured data'
      );
    }
    if (checks.performance.score < 80) {
      recommendations.push(
        'Optimize performance: Reduce CSS size and enable lazy loading'
      );
    }
    if (checks.accessibility.score < 80) {
      recommendations.push(
        'Enhance accessibility: Add ARIA labels and form labels'
      );
    }
    if (checks.design.score < 80) {
      recommendations.push(
        'Modernize design: Use CSS Grid, Flexbox, and custom properties'
      );
    }
    if (checks.content.score < 80) {
      recommendations.push(
        'Improve content: Add more substantial copy and clear CTAs'
      );
    }

    return recommendations;
  }
}

export const validator = new WebsiteQualityValidator();
