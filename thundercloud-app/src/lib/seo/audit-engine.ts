import * as cheerio from 'cheerio';

export type AuditScope = 'high-level' | 'low-level';

interface SEOCheck {
  id: string;
  category: 'technical' | 'onpage' | 'content' | 'mobile' | 'performance' | 'accessibility' | 'structured-data';
  severity: 'error' | 'warning' | 'info';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fixable: boolean;
  autoFixAvailable: boolean;
  points: number;
  details?: string;
}

interface SEOAuditResult {
  scope: AuditScope;
  totalScore: number;
  categoryScores: {
    technical: number;
    onpage: number;
    content: number;
    mobile: number;
    performance: number;
    accessibility?: number;
    structuredData?: number;
  };
  issues: SEOCheck[];
  recommendations: string[];
  checksPassed: number;
  checksFailed: number;
  checksWarned: number;
}

interface ComprehensiveAuditResult extends SEOAuditResult {
  scope: 'low-level';
  technicalDetails: {
    htmlValidation: any;
    linkAnalysis: any;
    schemaMarkup: any;
  };
  contentDetails: {
    readabilityScore: number;
    keywordDensity: any;
    headingStructure: any;
  };
  accessibilityDetails: {
    ariaLabels: any;
    colorContrast: any;
    keyboardNavigation: any;
  };
}

/**
 * Run a high-level SEO audit (quick scan, essential checks only)
 */
export async function runHighLevelAudit(html: string, url?: string): Promise<SEOAuditResult> {
  return runScopedAudit(html, 'high-level', url);
}

/**
 * Run a low-level SEO audit (comprehensive scan, all checks)
 */
export async function runLowLevelAudit(html: string, url?: string): Promise<ComprehensiveAuditResult> {
  const result = await runScopedAudit(html, 'low-level', url);
  const $ = cheerio.load(html);
  
  // Additional comprehensive analysis
  const technicalDetails = {
    htmlValidation: analyzeHTMLStructure($, html),
    linkAnalysis: analyzeLinkStructure($),
    schemaMarkup: analyzeSchemaMarkup($),
  };
  
  const contentDetails = {
    readabilityScore: calculateReadabilityScore($),
    keywordDensity: analyzeKeywordDensity($),
    headingStructure: analyzeHeadingStructure($),
  };
  
  const accessibilityDetails = {
    ariaLabels: checkAriaLabels($),
    colorContrast: { checked: false, note: 'Requires visual analysis' },
    keyboardNavigation: checkKeyboardNavigation($),
  };
  
  return {
    ...result,
    scope: 'low-level',
    technicalDetails,
    contentDetails,
    accessibilityDetails,
  } as ComprehensiveAuditResult;
}

/**
 * Run SEO audit with specified scope
 * @deprecated Use runHighLevelAudit or runLowLevelAudit instead
 */
export async function runSEOAudit(html: string, url?: string): Promise<SEOAuditResult> {
  return runHighLevelAudit(html, url);
}

async function runScopedAudit(html: string, scope: AuditScope, url?: string): Promise<SEOAuditResult> {
  const $ = cheerio.load(html);
  const issues: SEOCheck[] = [];
  
  // High-level checks (always run)
  runHighLevelChecks($, html, url, issues);
  
  // Low-level checks (only for comprehensive audit)
  if (scope === 'low-level') {
    runLowLevelChecks($, html, url, issues);
  }
  
  // Calculate scores
  const maxPoints = scope === 'high-level' 
    ? { technical: 30, onpage: 25, content: 20, mobile: 15, performance: 10 }
    : { technical: 30, onpage: 25, content: 20, mobile: 15, performance: 10, accessibility: 20, structuredData: 15 };
    
  const lostPoints: Record<string, number> = {};
  Object.keys(maxPoints).forEach(cat => lostPoints[cat] = 0);
  
  issues.forEach(issue => { 
    lostPoints[issue.category] = (lostPoints[issue.category] || 0) + issue.points; 
  });
  
  const categoryScores: any = {};
  Object.entries(maxPoints).forEach(([cat, max]) => {
    categoryScores[cat] = Math.max(0, max - (lostPoints[cat] || 0));
  });
  
  const totalScore = Object.values(categoryScores).reduce((sum: number, score) => sum + (score as number), 0);
  const totalChecks = issues.length;
  const checksPassed = totalChecks - issues.filter(i => i.severity === 'error' || i.severity === 'warning').length;
  const checksFailed = issues.filter(i => i.severity === 'error').length;
  const checksWarned = issues.filter(i => i.severity === 'warning').length;
  
  return {
    scope,
    totalScore,
    categoryScores,
    issues,
    recommendations: generateRecommendations(issues, scope),
    checksPassed,
    checksFailed,
    checksWarned,
  };
}

function runHighLevelChecks($: cheerio.CheerioAPI, html: string, url: string | undefined, issues: SEOCheck[]): void {
  // TECHNICAL SEO
  if (url && !url.startsWith('https://')) {
    issues.push({ id: 'https_missing', category: 'technical', severity: 'error', message: 'Website is not using HTTPS', impact: 'high', fixable: false, autoFixAvailable: false, points: 5 });
  }
  if (!$('link[rel="sitemap"]').attr('href')) {
    issues.push({ id: 'sitemap_missing', category: 'technical', severity: 'error', message: 'Sitemap.xml is missing', impact: 'high', fixable: true, autoFixAvailable: true, points: 5 });
  }
  issues.push({ id: 'robots_missing', category: 'technical', severity: 'warning', message: 'Robots.txt is missing', impact: 'medium', fixable: true, autoFixAvailable: true, points: 3 });
  if (!html.trim().toLowerCase().startsWith('<!doctype html>')) {
    issues.push({ id: 'doctype_missing', category: 'technical', severity: 'error', message: 'HTML5 doctype is missing', impact: 'medium', fixable: true, autoFixAvailable: true, points: 5 });
  }
  const htmlSize = Buffer.byteLength(html, 'utf8');
  if (htmlSize > 200000) {
    issues.push({ id: 'html_too_large', category: 'performance', severity: 'warning', message: `HTML size is ${Math.round(htmlSize / 1000)}KB (recommend < 200KB)`,
      impact: 'medium', fixable: true, autoFixAvailable: false, points: 4 });
  }

  // ON-PAGE SEO
  const title = $('title').text();
  if (!title) {
    issues.push({ id: 'title_missing', category: 'onpage', severity: 'error', message: 'Title tag is missing', impact: 'high', fixable: true, autoFixAvailable: true, points: 8 });
  } else if (title.length < 30) {
    issues.push({ id: 'title_too_short', category: 'onpage', severity: 'warning', message: `Title is too short (${title.length} chars, recommend 50-60)`,
      impact: 'medium', fixable: true, autoFixAvailable: true, points: 3 });
  } else if (title.length > 60) {
    issues.push({ id: 'title_too_long', category: 'onpage', severity: 'warning', message: `Title is too long (${title.length} chars, recommend 50-60)`,
      impact: 'low', fixable: true, autoFixAvailable: true, points: 2 });
  }
  const metaDesc = $('meta[name="description"]').attr('content');
  if (!metaDesc) {
    issues.push({ id: 'meta_description_missing', category: 'onpage', severity: 'error', message: 'Meta description is missing', impact: 'high', fixable: true, autoFixAvailable: true, points: 8 });
  } else if (metaDesc.length < 120) {
    issues.push({ id: 'meta_description_too_short', category: 'onpage', severity: 'warning', message: `Meta description is too short (${metaDesc.length} chars, recommend 150-160)`,
      impact: 'medium', fixable: true, autoFixAvailable: true, points: 3 });
  }
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.push({ id: 'h1_missing', category: 'onpage', severity: 'error', message: 'H1 heading is missing', impact: 'high', fixable: true, autoFixAvailable: true, points: 5 });
  } else if (h1Count > 1) {
    issues.push({ id: 'multiple_h1', category: 'onpage', severity: 'warning', message: `Multiple H1 tags found (${h1Count}, recommend 1)`,
      impact: 'low', fixable: true, autoFixAvailable: true, points: 2 });
  }
  const imagesWithoutAlt = $('img').filter((_, img) => !$(img).attr('alt')).length;
  if (imagesWithoutAlt > 0) {
    issues.push({ id: 'images_missing_alt', category: 'onpage', severity: 'warning', message: `${imagesWithoutAlt} images missing alt text`, impact: 'medium', fixable: true, autoFixAvailable: true, points: 4 });
  }

  // CONTENT QUALITY
  const bodyText = $('body').text().trim();
  const wordCount = bodyText.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({ id: 'low_word_count', category: 'content', severity: 'warning', message: `Low word count (${wordCount} words, recommend 300+)`, impact: 'medium', fixable: true, autoFixAvailable: false, points: 5 });
  }

  // MOBILE SEO
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport) {
    issues.push({ id: 'viewport_missing', category: 'mobile', severity: 'error', message: 'Viewport meta tag is missing', impact: 'high', fixable: true, autoFixAvailable: true, points: 8 });
  }

  // PERFORMANCE
  const largeImages = $('img').filter((_, img) => { const src = $(img).attr('src'); return src && !src.includes('w=') && !src.includes('q='); }).length;
  if (largeImages > 0) {
    issues.push({ id: 'unoptimized_images', category: 'performance', severity: 'warning', message: `${largeImages} images may not be optimized`, impact: 'medium', fixable: true, autoFixAvailable: false, points: 3 });
  }
}

function runLowLevelChecks($: cheerio.CheerioAPI, html: string, url: string | undefined, issues: SEOCheck[]): void {
  // ACCESSIBILITY CHECKS
  // Check for ARIA landmarks
  const hasMainLandmark = $('[role="main"], main').length > 0;
  if (!hasMainLandmark) {
    issues.push({ 
      id: 'no_main_landmark', 
      category: 'accessibility', 
      severity: 'error', 
      message: 'Missing main landmark for screen readers', 
      impact: 'high', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 5,
      details: 'Add <main> or role="main" to primary content area'
    });
  }
  
  // Check for skip navigation link
  const hasSkipLink = $('a[href^="#"]').first().text().toLowerCase().includes('skip');
  if (!hasSkipLink) {
    issues.push({ 
      id: 'no_skip_link', 
      category: 'accessibility', 
      severity: 'warning', 
      message: 'Missing skip navigation link', 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 3,
      details: 'Add skip-to-content link as first focusable element'
    });
  }
  
  // Check for form labels
  const inputsWithoutLabels = $('input, textarea, select').filter((_, elem) => {
    const id = $(elem).attr('id');
    const ariaLabel = $(elem).attr('aria-label');
    const ariaLabelledby = $(elem).attr('aria-labelledby');
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    return !hasLabel && !ariaLabel && !ariaLabelledby;
  }).length;
  
  if (inputsWithoutLabels > 0) {
    issues.push({ 
      id: 'forms_missing_labels', 
      category: 'accessibility', 
      severity: 'error', 
      message: `${inputsWithoutLabels} form inputs missing labels`, 
      impact: 'high', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 8,
      details: 'All form inputs must have associated labels for screen readers'
    });
  }
  
  // Check for language declaration
  const htmlLang = $('html').attr('lang');
  if (!htmlLang) {
    issues.push({ 
      id: 'missing_lang_attribute', 
      category: 'accessibility', 
      severity: 'error', 
      message: 'HTML lang attribute is missing', 
      impact: 'high', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 5,
      details: 'Add lang="en" or appropriate language code to <html> tag'
    });
  }
  
  // STRUCTURED DATA CHECKS
  // Check for JSON-LD structured data
  const jsonLdScripts = $('script[type="application/ld+json"]');
  if (jsonLdScripts.length === 0) {
    issues.push({ 
      id: 'no_structured_data', 
      category: 'structured-data', 
      severity: 'warning', 
      message: 'No structured data (Schema.org) found', 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 5,
      details: 'Add Schema.org markup for better search engine understanding'
    });
  } else {
    // Validate JSON-LD syntax
    let hasInvalidJsonLd = false;
    jsonLdScripts.each((_, elem) => {
      try {
        JSON.parse($(elem).html() || '');
      } catch (e) {
        hasInvalidJsonLd = true;
      }
    });
    
    if (hasInvalidJsonLd) {
      issues.push({ 
        id: 'invalid_structured_data', 
        category: 'structured-data', 
        severity: 'error', 
        message: 'Invalid JSON-LD structured data syntax', 
        impact: 'high', 
        fixable: true, 
        autoFixAvailable: false, 
        points: 8,
        details: 'Fix JSON syntax errors in structured data'
      });
    }
  }
  
  // Check for Open Graph tags
  const ogTags = $('meta[property^="og:"]').length;
  if (ogTags === 0) {
    issues.push({ 
      id: 'no_open_graph', 
      category: 'structured-data', 
      severity: 'warning', 
      message: 'Missing Open Graph tags for social sharing', 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 4,
      details: 'Add og:title, og:description, og:image for better social media sharing'
    });
  }
  
  // Check for Twitter Card tags
  const twitterTags = $('meta[name^="twitter:"]').length;
  if (twitterTags === 0) {
    issues.push({ 
      id: 'no_twitter_cards', 
      category: 'structured-data', 
      severity: 'info', 
      message: 'Missing Twitter Card tags', 
      impact: 'low', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 2,
      details: 'Add twitter:card, twitter:title, twitter:description for Twitter sharing'
    });
  }
  
  // ADVANCED TECHNICAL CHECKS
  // Check for canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr('href');
  if (!canonicalUrl) {
    issues.push({ 
      id: 'no_canonical_url', 
      category: 'technical', 
      severity: 'warning', 
      message: 'Missing canonical URL', 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 4,
      details: 'Add canonical link to prevent duplicate content issues'
    });
  }
  
  // Check for hreflang tags (internationalization)
  const hreflangTags = $('link[rel="alternate"][hreflang]').length;
  if (hreflangTags === 0 && html.includes('language') || html.includes('translate')) {
    issues.push({ 
      id: 'no_hreflang', 
      category: 'technical', 
      severity: 'info', 
      message: 'Consider adding hreflang tags for international targeting', 
      impact: 'low', 
      fixable: true, 
      autoFixAvailable: false, 
      points: 2,
      details: 'If targeting multiple countries/languages, add hreflang tags'
    });
  }
  
  // Check for broken internal links
  const links = $('a[href]');
  let brokenInternalLinks = 0;
  links.each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const targetId = href.substring(1);
      if ($(`#${targetId}`).length === 0) {
        brokenInternalLinks++;
      }
    }
  });
  
  if (brokenInternalLinks > 0) {
    issues.push({ 
      id: 'broken_internal_links', 
      category: 'technical', 
      severity: 'warning', 
      message: `${brokenInternalLinks} broken internal anchor links found`, 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: false, 
      points: 3,
      details: 'Fix or remove links pointing to non-existent page sections'
    });
  }
  
  // ADVANCED CONTENT CHECKS
  // Check heading hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6');
  let hierarchyIssues = false;
  let previousLevel = 0;
  
  headings.each((_, elem) => {
    const tagName = elem.tagName.toLowerCase();
    const currentLevel = parseInt(tagName.charAt(1));
    
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      hierarchyIssues = true;
    }
    previousLevel = currentLevel;
  });
  
  if (hierarchyIssues) {
    issues.push({ 
      id: 'heading_hierarchy_broken', 
      category: 'content', 
      severity: 'warning', 
      message: 'Heading hierarchy is not sequential (e.g., H1 → H3 without H2)', 
      impact: 'medium', 
      fixable: true, 
      autoFixAvailable: false, 
      points: 3,
      details: 'Ensure headings follow proper hierarchy (H1 → H2 → H3, etc.)'
    });
  }
  
  // Check for duplicate meta descriptions across multiple pages (simplified check)
  const metaDesc = $('meta[name="description"]').attr('content');
  if (metaDesc && metaDesc.length > 160) {
    issues.push({ 
      id: 'meta_description_too_long', 
      category: 'onpage', 
      severity: 'warning', 
      message: `Meta description is too long (${metaDesc.length} chars, recommend 150-160)`, 
      impact: 'low', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 2,
      details: 'Shorten meta description to ensure it displays fully in search results'
    });
  }
  
  // Check for external links without rel attributes
  const externalLinksWithoutRel = $('a[href^="http"]').filter((_, elem) => {
    const href = $(elem).attr('href') || '';
    const rel = $(elem).attr('rel');
    const isExternal = url ? !href.includes(new URL(url).hostname) : href.startsWith('http');
    return isExternal && !rel;
  }).length;
  
  if (externalLinksWithoutRel > 0) {
    issues.push({ 
      id: 'external_links_missing_rel', 
      category: 'technical', 
      severity: 'info', 
      message: `${externalLinksWithoutRel} external links without rel attribute`, 
      impact: 'low', 
      fixable: true, 
      autoFixAvailable: true, 
      points: 2,
      details: 'Consider adding rel="noopener" or rel="nofollow" to external links'
    });
  }
}

// Helper functions for comprehensive audit
function analyzeHTMLStructure($: cheerio.CheerioAPI, html: string): any {
  return {
    hasDoctype: html.trim().toLowerCase().startsWith('<!doctype html>'),
    hasHtmlTag: $('html').length > 0,
    hasHeadTag: $('head').length > 0,
    hasBodyTag: $('body').length > 0,
    totalElements: $('*').length,
  };
}

function analyzeLinkStructure($: cheerio.CheerioAPI): any {
  const allLinks = $('a[href]');
  const internalLinks = allLinks.filter((_, elem) => {
    const href = $(elem).attr('href') || '';
    return href.startsWith('/') || href.startsWith('#');
  }).length;
  const externalLinks = allLinks.length - internalLinks;
  
  return {
    totalLinks: allLinks.length,
    internalLinks,
    externalLinks,
    linksWithoutText: allLinks.filter((_, elem) => !$(elem).text().trim()).length,
  };
}

function analyzeSchemaMarkup($: cheerio.CheerioAPI): any {
  const jsonLdScripts = $('script[type="application/ld+json"]');
  const schemas: any[] = [];
  
  jsonLdScripts.each((_, elem) => {
    try {
      const schema = JSON.parse($(elem).html() || '');
      schemas.push(schema['@type'] || 'Unknown');
    } catch (e) {
      // Invalid JSON
    }
  });
  
  return {
    count: schemas.length,
    types: schemas,
    hasOrganization: schemas.includes('Organization'),
    hasWebSite: schemas.includes('WebSite'),
    hasWebPage: schemas.includes('WebPage'),
  };
}

function calculateReadabilityScore($: cheerio.CheerioAPI): number {
  const text = $('body').text().trim();
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = words * 1.5; // Rough estimate
  
  // Flesch Reading Ease approximation
  if (sentences === 0 || words === 0) return 0;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, score));
}

function analyzeKeywordDensity($: cheerio.CheerioAPI): any {
  const text = $('body').text().toLowerCase().trim();
  const words = text.split(/\s+/);
  const wordCount: Record<string, number> = {};
  
  words.forEach(word => {
    // Remove punctuation and filter short words
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });
  
  // Get top 5 keywords
  const topKeywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count, density: (count / words.length * 100).toFixed(2) + '%' }));
  
  return {
    totalWords: words.length,
    uniqueWords: Object.keys(wordCount).length,
    topKeywords,
  };
}

function analyzeHeadingStructure($: cheerio.CheerioAPI): any {
  return {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
    h4: $('h4').length,
    h5: $('h5').length,
    h6: $('h6').length,
    total: $('h1, h2, h3, h4, h5, h6').length,
  };
}

function checkAriaLabels($: cheerio.CheerioAPI): any {
  const elementsWithAria = $('[aria-label], [aria-labelledby], [aria-describedby]').length;
  const interactiveElements = $('button, a, input, select, textarea').length;
  
  return {
    elementsWithAria,
    interactiveElements,
    coverage: interactiveElements > 0 ? (elementsWithAria / interactiveElements * 100).toFixed(1) + '%' : '0%',
  };
}

function checkKeyboardNavigation($: cheerio.CheerioAPI): any {
  const focusableElements = $('a, button, input, select, textarea, [tabindex]').length;
  const elementsWithNegativeTabindex = $('[tabindex="-1"]').length;
  
  return {
    focusableElements,
    elementsWithNegativeTabindex,
    hasTabindexZero: $('[tabindex="0"]').length > 0,
  };
}

function generateRecommendations(issues: SEOCheck[], scope: AuditScope): string[] {
  const recommendations: string[] = [];
  
  // High priority recommendations
  const criticalIssues = issues.filter(i => i.severity === 'error' && i.impact === 'high');
  if (criticalIssues.length > 0) {
    recommendations.push(`Fix ${criticalIssues.length} critical issues immediately to improve search rankings`);
  }
  
  // Category-specific recommendations
  const categories = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (categories['technical'] > 3) {
    recommendations.push('Focus on technical SEO improvements for better crawlability');
  }
  if (categories['onpage'] > 3) {
    recommendations.push('Optimize meta tags and on-page elements for better visibility');
  }
  if (categories['content'] > 2) {
    recommendations.push('Enhance content quality and structure for user engagement');
  }
  if (scope === 'low-level' && categories['accessibility'] > 2) {
    recommendations.push('Improve accessibility to reach wider audience and meet WCAG standards');
  }
  
  // Auto-fix available
  const autoFixable = issues.filter(i => i.autoFixAvailable);
  if (autoFixable.length > 0) {
    recommendations.push(`${autoFixable.length} issues can be automatically fixed - use the Auto-Fix feature`);
  }
  
  return recommendations;
}