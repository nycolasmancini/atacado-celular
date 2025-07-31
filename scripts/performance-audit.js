#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Performance audit configuration
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'total-blocking-time',
      'cumulative-layout-shift',
      'server-response-time',
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-text-compression',
      'uses-rel-preconnect',
    ],
  },
};

// URLs to test
const urls = [
  'http://localhost:3000',
  'http://localhost:3000/catalogo',
  'http://localhost:3000/admin/login',
];

async function runPerformanceAudit() {
  console.log('🚀 Starting performance audit...\n');
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const results = [];
  
  for (const url of urls) {
    console.log(`📊 Auditing: ${url}`);
    
    try {
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        disableDeviceEmulation: false,
        emulatedFormFactor: 'mobile',
      }, config);
      
      const { lhr } = runnerResult;
      
      const metrics = {
        url,
        performance: lhr.categories.performance.score * 100,
        fcp: lhr.audits['first-contentful-paint'].numericValue,
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        fmp: lhr.audits['first-meaningful-paint'].numericValue,
        si: lhr.audits['speed-index'].numericValue,
        tbt: lhr.audits['total-blocking-time'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        ttfb: lhr.audits['server-response-time'].numericValue,
      };
      
      results.push(metrics);
      
      // Log results
      console.log(`  ✅ Performance Score: ${metrics.performance.toFixed(1)}/100`);
      console.log(`  🎨 First Contentful Paint: ${metrics.fcp.toFixed(0)}ms`);
      console.log(`  🖼️  Largest Contentful Paint: ${metrics.lcp.toFixed(0)}ms`);
      console.log(`  📏 Cumulative Layout Shift: ${metrics.cls.toFixed(3)}`);
      console.log(`  ⚡ Total Blocking Time: ${metrics.tbt.toFixed(0)}ms`);
      console.log(`  🌐 Server Response Time: ${metrics.ttfb.toFixed(0)}ms\n`);
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }
  
  await chrome.kill();
  
  // Generate report
  generateReport(results);
  
  console.log('📋 Performance audit completed!');
  console.log('📄 Report saved to: performance-report.json');
}

function generateReport(results) {
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    summary: {
      averagePerformance: results.reduce((sum, r) => sum + r.performance, 0) / results.length,
      totalUrls: results.length,
    },
    results,
    recommendations: generateRecommendations(results),
  };
  
  // Save JSON report
  fs.writeFileSync(
    path.join(process.cwd(), 'performance-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Generate markdown report
  generateMarkdownReport(report);
}

function generateRecommendations(results) {
  const recommendations = [];
  
  const avgPerformance = results.reduce((sum, r) => sum + r.performance, 0) / results.length;
  const avgLCP = results.reduce((sum, r) => sum + r.lcp, 0) / results.length;
  const avgCLS = results.reduce((sum, r) => sum + r.cls, 0) / results.length;
  const avgTBT = results.reduce((sum, r) => sum + r.tbt, 0) / results.length;
  
  if (avgPerformance < 90) {
    recommendations.push({
      priority: 'high',
      category: 'Overall Performance',
      issue: `Average performance score is ${avgPerformance.toFixed(1)}/100`,
      solution: 'Focus on Core Web Vitals optimization',
    });
  }
  
  if (avgLCP > 2500) {
    recommendations.push({
      priority: 'high',
      category: 'Largest Contentful Paint',
      issue: `Average LCP is ${avgLCP.toFixed(0)}ms (target: <2500ms)`,
      solution: 'Optimize images, preload critical resources, improve server response time',
    });
  }
  
  if (avgCLS > 0.1) {
    recommendations.push({
      priority: 'medium',
      category: 'Cumulative Layout Shift',
      issue: `Average CLS is ${avgCLS.toFixed(3)} (target: <0.1)`,
      solution: 'Add size attributes to images, reserve space for dynamic content',
    });
  }
  
  if (avgTBT > 300) {
    recommendations.push({
      priority: 'medium',
      category: 'Total Blocking Time',
      issue: `Average TBT is ${avgTBT.toFixed(0)}ms (target: <300ms)`,
      solution: 'Split code bundles, defer non-critical JavaScript',
    });
  }
  
  return recommendations;
}

function generateMarkdownReport(report) {
  let markdown = `# Performance Audit Report\n\n`;
  markdown += `**Generated:** ${report.timestamp}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Average Performance Score:** ${report.summary.averagePerformance.toFixed(1)}/100\n`;
  markdown += `- **URLs Tested:** ${report.summary.totalUrls}\n\n`;
  
  markdown += `## Results\n\n`;
  markdown += `| URL | Performance | FCP | LCP | CLS | TBT |\n`;
  markdown += `|-----|-------------|-----|-----|-----|-----|\n`;
  
  for (const result of report.results) {
    markdown += `| ${result.url} | ${result.performance.toFixed(1)} | ${result.fcp.toFixed(0)}ms | ${result.lcp.toFixed(0)}ms | ${result.cls.toFixed(3)} | ${result.tbt.toFixed(0)}ms |\n`;
  }
  
  if (report.recommendations.length > 0) {
    markdown += `\n## Recommendations\n\n`;
    
    for (const rec of report.recommendations) {
      markdown += `### ${rec.category} (${rec.priority} priority)\n\n`;
      markdown += `**Issue:** ${rec.issue}\n\n`;
      markdown += `**Solution:** ${rec.solution}\n\n`;
    }
  }
  
  fs.writeFileSync(
    path.join(process.cwd(), 'performance-report.md'),
    markdown
  );
}

// Run the audit
if (require.main === module) {
  runPerformanceAudit().catch(console.error);
}

module.exports = { runPerformanceAudit };