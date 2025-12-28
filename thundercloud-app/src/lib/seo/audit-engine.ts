import * as cheerio from 'cheerio';

interface SEOCheck {
  id: string;
  category: 'technical' | 'onpage' | 'content' | 'mobile' | 'performance';
  severity: 'error' | 'warning' | 'info';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fixable: boolean;
  autoFixAvailable: boolean;
  points: number;
}

interface SEOAuditResult {
  totalScore: number;
  categoryScores: {
    technical: number;
    onpage: number;
    content: number;
    mobile: number;
    performance: number;
  };
  issues: SEOCheck[];
  recommendations: string[];
  checksPassed: number;
  checksFailed: number;
  checksWarned: number;
}

export async function runSEOAudit(html: string, url?: string): Promise<SEOAuditResult> {
  const $ = cheerio.load(html);
  const issues: SEOCheck[] = [];
  
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
  
  const maxPoints = { technical: 30, onpage: 25, content: 20, mobile: 15, performance: 10 };
  const lostPoints = { technical: 0, onpage: 0, content: 0, mobile: 0, performance: 0 };
  issues.forEach(issue => { lostPoints[issue.category] += issue.points; });
  const categoryScores = {
    technical: Math.max(0, maxPoints.technical - lostPoints.technical),
    onpage: Math.max(0, maxPoints.onpage - lostPoints.onpage),
    content: Math.max(0, maxPoints.content - lostPoints.content),
    mobile: Math.max(0, maxPoints.mobile - lostPoints.mobile),
    performance: Math.max(0, maxPoints.performance - lostPoints.performance),
  };
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  const checksPassed = Object.values(maxPoints).reduce((sum, max) => sum + max, 0) - issues.length;
  const checksFailed = issues.filter(i => i.severity === 'error').length;
  const checksWarned = issues.filter(i => i.severity === 'warning').length;
  
  return {
    totalScore,
    categoryScores,
    issues,
    recommendations: [],
    checksPassed,
    checksFailed,
    checksWarned,
  };
}