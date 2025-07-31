#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Performance monitoring script
class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      headless: true,
      timeout: 30000,
      iterations: 3,
      ...options,
    };
  }

  async monitor(urls) {
    console.log('🔍 Starting performance monitoring...\n');
    
    const browser = await puppeteer.launch({ 
      headless: this.options.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const results = [];
    
    for (const url of urls) {
      console.log(`📊 Monitoring: ${url}`);
      
      const urlResults = [];
      
      for (let i = 0; i < this.options.iterations; i++) {
        const page = await browser.newPage();
        
        // Enable performance monitoring
        await page.setCacheEnabled(false);
        await page.evaluateOnNewDocument(() => {
          window.performanceMetrics = {
            navigationStart: performance.timeOrigin,
            marks: [],
            measures: [],
          };
        });
        
        const metrics = await this.collectMetrics(page, url);
        urlResults.push(metrics);
        
        await page.close();
        
        // Wait between iterations
        if (i < this.options.iterations - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // Calculate averages
      const avgMetrics = this.calculateAverages(urlResults);
      avgMetrics.url = url;
      results.push(avgMetrics);
      
      this.displayMetrics(avgMetrics);
    }
    
    await browser.close();
    
    // Generate comprehensive report
    this.generateReport(results);
    
    console.log('\n📋 Performance monitoring completed!');
    console.log('📄 Report saved to: performance-monitor-report.json');
  }

  async collectMetrics(page, url) {
    const startTime = Date.now();
    
    // Navigate and wait for load
    await page.goto(url, { waitUntil: 'networkidle0', timeout: this.options.timeout });
    
    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource');
      
      // Core Web Vitals (approximation)
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = Math.max(...paint.map(p => p.startTime));
      
      // Layout stability (simplified)
      let cls = 0;
      try {
        // This is a simplified CLS calculation
        const layoutShifts = performance.getEntriesByType('layout-shift');
        cls = layoutShifts.reduce((sum, entry) => sum + entry.value, 0);
      } catch (e) {
        // CLS not available in this browser
      }
      
      return {
        // Navigation timings
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart,
        domInteractive: nav.domInteractive - nav.navigationStart,
        
        // Core Web Vitals
        fcp,
        lcp,
        cls,
        
        // Resource counts
        totalResources: resources.length,
        imageResources: resources.filter(r => r.initiatorType === 'img').length,
        scriptResources: resources.filter(r => r.initiatorType === 'script').length,
        stylesheetResources: resources.filter(r => r.initiatorType === 'link').length,
        
        // Size metrics
        transferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        decodedBodySize: resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0),
      };
    });
    
    // Memory usage
    const memoryMetrics = await page.metrics();
    
    return {
      ...metrics,
      totalTime: Date.now() - startTime,
      memory: {
        usedJSHeapSize: memoryMetrics.JSHeapUsedSize,
        totalJSHeapSize: memoryMetrics.JSHeapTotalSize,
      },
    };
  }

  calculateAverages(results) {
    const keys = Object.keys(results[0]).filter(key => 
      typeof results[0][key] === 'number' || 
      (typeof results[0][key] === 'object' && results[0][key] !== null)
    );
    
    const averages = {};
    
    for (const key of keys) {
      if (typeof results[0][key] === 'number') {
        averages[key] = results.reduce((sum, r) => sum + r[key], 0) / results.length;
      } else if (typeof results[0][key] === 'object' && results[0][key] !== null) {
        averages[key] = {};
        for (const subKey of Object.keys(results[0][key])) {
          averages[key][subKey] = results.reduce((sum, r) => sum + r[key][subKey], 0) / results.length;
        }
      }
    }
    
    return averages;
  }

  displayMetrics(metrics) {
    console.log(`  ⚡ Total Load Time: ${metrics.totalTime.toFixed(0)}ms`);
    console.log(`  🎨 First Contentful Paint: ${metrics.fcp.toFixed(0)}ms`);
    console.log(`  🖼️  Largest Contentful Paint: ${metrics.lcp.toFixed(0)}ms`);
    console.log(`  📏 Cumulative Layout Shift: ${metrics.cls.toFixed(3)}`);
    console.log(`  🔗 DOM Interactive: ${metrics.domInteractive.toFixed(0)}ms`);
    console.log(`  📦 Total Resources: ${metrics.totalResources.toFixed(0)}`);
    console.log(`  💾 Transfer Size: ${this.formatBytes(metrics.transferSize)}`);
    console.log(`  🧠 JS Heap Used: ${this.formatBytes(metrics.memory.usedJSHeapSize)}\n`);
  }

  generateReport(results) {
    const timestamp = new Date().toISOString();
    
    const report = {
      timestamp,
      configuration: this.options,
      summary: this.generateSummary(results),
      results,
      recommendations: this.generateRecommendations(results),
    };
    
    // Save JSON report
    fs.writeFileSync(
      path.join(process.cwd(), 'performance-monitor-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    // Generate CSV for analysis
    this.generateCSV(results);
  }

  generateSummary(results) {
    return {
      totalUrls: results.length,
      averageLoadTime: results.reduce((sum, r) => sum + r.totalTime, 0) / results.length,
      averageFCP: results.reduce((sum, r) => sum + r.fcp, 0) / results.length,
      averageLCP: results.reduce((sum, r) => sum + r.lcp, 0) / results.length,
      averageCLS: results.reduce((sum, r) => sum + r.cls, 0) / results.length,
      averageTransferSize: results.reduce((sum, r) => sum + r.transferSize, 0) / results.length,
    };
  }

  generateRecommendations(results) {
    const recommendations = [];
    const summary = this.generateSummary(results);
    
    if (summary.averageLoadTime > 3000) {
      recommendations.push({
        priority: 'high',
        category: 'Load Time',
        issue: `Average load time is ${summary.averageLoadTime.toFixed(0)}ms`,
        solution: 'Optimize critical render path and reduce resource sizes',
      });
    }
    
    if (summary.averageFCP > 1800) {
      recommendations.push({
        priority: 'high',
        category: 'First Contentful Paint',
        issue: `Average FCP is ${summary.averageFCP.toFixed(0)}ms`,
        solution: 'Optimize font loading and critical CSS',
      });
    }
    
    if (summary.averageTransferSize > 2000000) { // 2MB
      recommendations.push({
        priority: 'medium',
        category: 'Transfer Size',
        issue: `Average transfer size is ${this.formatBytes(summary.averageTransferSize)}`,
        solution: 'Enable compression and optimize images',
      });
    }
    
    return recommendations;
  }

  generateCSV(results) {
    const headers = ['url', 'totalTime', 'fcp', 'lcp', 'cls', 'domInteractive', 'totalResources', 'transferSize'];
    let csv = headers.join(',') + '\n';
    
    for (const result of results) {
      const row = headers.map(header => result[header] || 0).join(',');
      csv += row + '\n';
    }
    
    fs.writeFileSync(
      path.join(process.cwd(), 'performance-monitor-data.csv'),
      csv
    );
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI usage
async function main() {
  const urls = process.argv.slice(2);
  
  if (urls.length === 0) {
    console.log('Usage: node performance-monitor.js <url1> [url2] [url3]...');
    console.log('Example: node performance-monitor.js http://localhost:3000 http://localhost:3000/catalogo');
    process.exit(1);
  }
  
  const monitor = new PerformanceMonitor({
    iterations: 3,
    headless: true,
  });
  
  await monitor.monitor(urls);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceMonitor;