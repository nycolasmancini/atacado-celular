# 📊 Event Tracking Configuration Guide

## Environment Variables Required

Add these variables to your `.env.local` file:

```bash
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Heatmap Services
NEXT_PUBLIC_HOTJAR_ID=1234567
NEXT_PUBLIC_CLARITY_ID=abcdefghij
NEXT_PUBLIC_LOGROCKET_APP_ID=app-id/project-name

# Optional: Development tracking control
NEXT_PUBLIC_ENABLE_TRACKING=true
```

## 🎯 Configured Events

### Core CTA Events
- `cta_click_hero` - Hero section CTA clicks
- `cta_click_kit` - Kit card CTA clicks  
- `cta_click_whatsapp` - WhatsApp button clicks
- `cta_click_catalog` - Catalog download clicks
- `cta_click_sticky` - Mobile sticky CTA clicks

### Scroll Depth Events
- `scroll_depth_25` - 25% page scroll
- `scroll_depth_50` - 50% page scroll
- `scroll_depth_75` - 75% page scroll
- `scroll_depth_100` - 100% page scroll

### Conversion Goals

#### Primary Goal: Kit Purchase
- **Event**: `kit_purchase`
- **Value**: Variable (based on kit price)
- **Currency**: BRL
- **Category**: ecommerce

#### Secondary Goal: Catalog Download
- **Event**: `catalog_download`
- **Value**: 25 BRL
- **Currency**: BRL
- **Category**: lead_generation

#### Additional Goals
- **WhatsApp Lead**: `whatsapp_lead` (50 BRL)
- **Price Unlock**: `price_unlock` (30 BRL)

### Section Engagement
- `section_view` - Section comes into view
- `section_time_spent` - Time spent in section
- `section_bounce` - Bounce vs engagement

### Purchase Funnel Steps
1. `LANDING_VIEW` - Landing page viewed
2. `KIT_VIEW` - Kit section viewed
3. `WHATSAPP_MODAL_OPEN` - WhatsApp modal opened
4. `WHATSAPP_SUBMIT` - WhatsApp form submitted
5. `PRICES_UNLOCKED` - Prices successfully unlocked
6. `CATALOG_VIEW` - Catalog page viewed
7. `ITEM_ADD_TO_CART` - Item added to cart
8. `CHECKOUT_START` - Checkout process started
9. `PURCHASE_COMPLETE` - Purchase completed

## 🔧 GTM Container Setup

### 1. Create GTM Container
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Create new container for your domain
3. Copy the GTM ID (GTM-XXXXXXX)

### 2. Configure Variables
Create these variables in GTM:

**Built-in Variables:**
- Page URL
- Page Title
- Referrer
- Click Element
- Click Text

**Custom Variables:**
```javascript
// UTM Parameters
{{dlv - utm_source}}
{{dlv - utm_medium}}
{{dlv - utm_campaign}}

// Custom Event Data
{{dlv - event_category}}
{{dlv - event_action}}
{{dlv - event_label}}
{{dlv - value}}
```

### 3. Configure Triggers
Create these triggers:

**Page Views:**
- All Pages
- Landing Page (Page Path contains "/")

**Custom Events:**
- CTA Clicks (Event equals "cta_click_hero", "cta_click_kit", etc.)
- Scroll Depth (Event contains "scroll_depth")
- Conversions (Event equals "kit_purchase", "catalog_download", etc.)

### 4. Configure Tags

**Google Analytics 4:**
```javascript
// Configuration Tag
Measurement ID: G-XXXXXXXXXX
Configuration Settings:
  - custom_map.event_category = {{dlv - event_category}}
  - custom_map.event_action = {{dlv - event_action}}
  - custom_map.event_label = {{dlv - event_label}}

// Event Tags for each conversion goal
Event Name: purchase
Parameters:
  - currency: BRL
  - value: {{dlv - value}}
  - items: {{dlv - items}}
```

**Meta Pixel (Facebook):**
```javascript
// Base Code
Pixel ID: 1234567890123456

// Conversion Events
Event: Lead
Parameters:
  - content_name: {{dlv - event_label}}
  - value: {{dlv - value}}
  - currency: BRL
```

## 📱 Heatmap Services Setup

### Hotjar Setup
1. Create account at [Hotjar](https://www.hotjar.com)
2. Add site and get Site ID
3. Configure recording settings:
   - Record user sessions: Yes
   - Heatmaps: Yes
   - Surveys: Optional

### Microsoft Clarity Setup
1. Create account at [Microsoft Clarity](https://clarity.microsoft.com)
2. Add website and get Project ID
3. Configure settings:
   - Recording: Yes
   - Heatmaps: Yes
   - Privacy: Mask sensitive content

## 🔗 UTM Parameter Preservation

The system automatically:
- Captures UTM parameters on landing
- Stores them in sessionStorage and localStorage
- Appends them to all internal navigation
- Includes them in WhatsApp messages
- Sends them with all tracking events

### UTM Campaign Examples
```
Landing Page Traffic:
?utm_source=google&utm_medium=cpc&utm_campaign=kits_atacado

Social Media Traffic:
?utm_source=instagram&utm_medium=social&utm_campaign=stories_promo

Email Traffic:
?utm_source=email&utm_medium=newsletter&utm_campaign=kit_launch
```

## 📊 Data Layer Structure

### Standard Event Format
```javascript
{
  event: 'event_name',
  event_category: 'engagement',
  event_action: 'click',
  event_label: 'button_name',
  value: 0,
  timestamp: '2024-01-01T12:00:00.000Z',
  page_url: 'https://example.com/path',
  page_title: 'Page Title',
  utm_parameters: {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'campaign_name'
  },
  user_data: {
    whatsapp_provided: true,
    session_id: 'session_123'
  }
}
```

### Conversion Event Format
```javascript
{
  event: 'purchase',
  currency: 'BRL',
  value: 100.00,
  transaction_id: 'txn_123456',
  items: [{
    item_id: 'kit_001',
    item_name: 'Kit Premium',
    category: 'kits',
    quantity: 1,
    price: 100.00
  }],
  conversion_id: 'kit_purchase_primary',
  conversion_type: 'kit_purchase'
}
```

## 🔍 Testing & Debugging

### GTM Preview Mode
1. Enable Preview mode in GTM
2. Navigate to your site
3. Check that events fire correctly
4. Verify data layer values

### Console Debugging
```javascript
// Check if tracking is working
console.log(window.dataLayer);

// Check UTM parameters
console.log(sessionStorage.getItem('utm_parameters'));

// Test event manually
window.dataLayer.push({
  event: 'test_event',
  test_data: 'hello_world'
});
```

### Chrome Extensions
- **GTM/GA Debugger**: Verify tag firing
- **Facebook Pixel Helper**: Check Meta events
- **UTM Stripper**: Test UTM handling

## 📈 Recommended GA4 Reports

### Custom Reports to Create
1. **Conversion Funnel Report**
   - Landing View → Kit View → WhatsApp Submit → Purchase

2. **UTM Performance Report**
   - Traffic source performance by conversions

3. **Section Engagement Report**
   - Time spent and bounce rate by page section

4. **CTA Performance Report**
   - Click-through rates by CTA location

### Audiences to Create
1. **High Intent Users**: Viewed kits + spent >30s
2. **WhatsApp Leads**: Submitted WhatsApp form
3. **Price Unlockers**: Successfully unlocked prices
4. **Cart Abandoners**: Added items but didn't purchase

## 🚀 Implementation Checklist

- [ ] Add environment variables
- [ ] Set up GTM container with triggers and tags
- [ ] Configure GA4 with custom events and conversions
- [ ] Set up heatmap services (Hotjar/Clarity)
- [ ] Test all tracking in GTM Preview mode
- [ ] Verify UTM parameter preservation
- [ ] Create custom reports and audiences
- [ ] Set up conversion goals in GA4
- [ ] Configure Meta Pixel events
- [ ] Test purchase funnel tracking
- [ ] Verify scroll depth tracking
- [ ] Check heatmap recording and events

## 🛡️ Privacy & Compliance

- All WhatsApp numbers are hashed before storage
- Heatmap services can be disabled via privacy settings
- UTM parameters don't contain personal information
- LGPD/GDPR compliant data handling
- Users can opt-out of tracking via browser settings