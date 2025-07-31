#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Bundle analysis script
function analyzeBundles() {
  console.log('📦 Analyzing Next.js bundles...\n');
  
  const buildDir = path.join(process.cwd(), '.next');
  const statsFile = path.join(buildDir, 'analyze', 'bundles.json');
  
  if (!fs.existsSync(statsFile)) {
    console.log('❌ Bundle stats not found. Run "npm run analyze" first.');
    return;
  }
  
  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  
  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize: 0,
    chunks: [],
    recommendations: [],
  };
  
  // Analyze chunks
  if (stats.chunks) {
    for (const chunk of stats.chunks) {
      const chunkSize = chunk.size;
      analysis.totalSize += chunkSize;
      
      analysis.chunks.push({
        name: chunk.names[0] || chunk.id,
        size: chunkSize,
        sizeFormatted: formatBytes(chunkSize),
        modules: chunk.modules?.length || 0,
      });
    }
  }
  
  // Sort chunks by size
  analysis.chunks.sort((a, b) => b.size - a.size);
  
  // Generate recommendations
  analysis.recommendations = generateBundleRecommendations(analysis.chunks);
  
  // Display results
  displayBundleAnalysis(analysis);
  
  // Save report
  fs.writeFileSync(
    path.join(process.cwd(), 'bundle-analysis.json'),
    JSON.stringify(analysis, null, 2)
  );
  
  console.log('\n📄 Bundle analysis saved to: bundle-analysis.json');
}

function generateBundleRecommendations(chunks) {
  const recommendations = [];
  const largeChunks = chunks.filter(chunk => chunk.size > 500000); // > 500KB
  
  if (largeChunks.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'Large Bundles',
      issue: `${largeChunks.length} chunks are larger than 500KB`,
      solution: 'Consider code splitting and dynamic imports',
      chunks: largeChunks.map(c => c.name),
    });
  }
  
  const mainChunk = chunks.find(chunk => chunk.name === 'main' || chunk.name.includes('main'));
  if (mainChunk && mainChunk.size > 300000) {
    recommendations.push({
      priority: 'medium',
      category: 'Main Bundle',
      issue: `Main bundle is ${formatBytes(mainChunk.size)}`,
      solution: 'Move non-critical code to separate chunks',
    });
  }
  
  const vendorChunks = chunks.filter(chunk => 
    chunk.name.includes('vendor') || 
    chunk.name.includes('node_modules')
  );
  
  if (vendorChunks.length > 5) {
    recommendations.push({
      priority: 'low',
      category: 'Vendor Chunks',
      issue: `${vendorChunks.length} vendor chunks detected`,
      solution: 'Consider consolidating smaller vendor chunks',
    });
  }
  
  return recommendations;
}

function displayBundleAnalysis(analysis) {
  console.log(`📊 Bundle Analysis Results\n`);
  console.log(`🔢 Total Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`📦 Total Chunks: ${analysis.chunks.length}\n`);
  
  console.log('🏆 Top 10 Largest Chunks:');
  console.log('─'.repeat(60));
  
  for (let i = 0; i < Math.min(10, analysis.chunks.length); i++) {
    const chunk = analysis.chunks[i];
    const percentage = ((chunk.size / analysis.totalSize) * 100).toFixed(1);
    console.log(`${i + 1}.`.padEnd(3) + 
                `${chunk.name.padEnd(25)} ${chunk.sizeFormatted.padStart(10)} (${percentage}%)`);
  }
  
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('─'.repeat(60));
    
    for (const rec of analysis.recommendations) {
      console.log(`\n${getPriorityIcon(rec.priority)} ${rec.category}`);
      console.log(`   Issue: ${rec.issue}`);
      console.log(`   Solution: ${rec.solution}`);
      
      if (rec.chunks) {
        console.log(`   Affected: ${rec.chunks.join(', ')}`);
      }
    }
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getPriorityIcon(priority) {
  switch (priority) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

// Tree shaking analysis
function analyzeTreeShaking() {
  console.log('\n🌳 Tree Shaking Analysis...\n');
  
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const heavyPackages = [
    'lodash',
    'moment',
    'antd',
    'material-ui',
    '@mui/material',
    'bootstrap',
    'jquery',
  ];
  
  const foundHeavyPackages = heavyPackages.filter(pkg => deps[pkg]);
  
  if (foundHeavyPackages.length > 0) {
    console.log('⚠️  Heavy packages detected:');
    foundHeavyPackages.forEach(pkg => {
      console.log(`   - ${pkg} (consider tree-shakable alternatives)`);
    });
  } else {
    console.log('✅ No commonly heavy packages detected');
  }
  
  // Check for proper ES modules
  const hasModules = packageJson.type === 'module' || 
                    (packageJson.exports && typeof packageJson.exports === 'object');
  
  if (!hasModules) {
    console.log('\n💡 Consider adding "type": "module" to package.json for better tree shaking');
  }
}

// Run analysis
if (require.main === module) {
  analyzeBundles();
  analyzeTreeShaking();
}

module.exports = { analyzeBundles, analyzeTreeShaking };