# 🎬 BongBangla Media & Creative Lab Website

> **Official Agency Domain:** [bongbangla.top](https://bongbangla.top)  
> Full-Service Creative & Performance Ad Agency for Brands, Model Shoots, Product Reels, Bold Shoots, Facebook Marketing, Portfolios & High-Converting Websites.

---

## 🌟 What's Included in This Website

1. **Neo-Luxury Dark Theme Design**:
   - Engineered with custom glassmorphism, crimson & purple glow accents, responsive typography (`Syne` and `Plus Jakarta Sans`), and animated highlights.
2. **Hero Section**:
   - High-impact brand proposition, live shoot metric counters (500+ Shoots, 50M+ Views, 150+ Models), simulated 4K cinema REC preview, and direct booking triggers.
3. **Core Services Breakdown**:
   - Commercial Video Ads with Models (TVC & Digital)
   - Viral Product Reels & Shorts (9:16 high-retention formats)
   - High-Fashion & Bold / Glamour Photoshoots
   - Facebook Marketing & Meta Ad Performance Scaling
   - Model Portfolios & Talent Casting Directory
   - High-Converting D2C Brand Websites & Funnels
4. **Interactive Filterable Portfolio with Lightbox**:
   - Filter by: `All`, `Ad Films`, `Model & Bold Shoots`, `Product Reels`, and `Web & Brand`.
   - Click to open interactive full-screen Lightbox view.
5. **In-House Model Roster Showcase**:
   - Previews commercial, editorial, beauty, and athletic model profiles with height and experience metrics.
6. **Interactive Project Cost & Timeline Calculator**:
   - Clients can choose their desired services, extra models, currency (`BDT`, `USD`, `INR`), and add-ons (Drone, MUA, studio rental).
    - Generates instant quote and 1-click booking inquiry directly to the **Admin Panel**.
7. **Pre-Built Transparent Pricing Packages**:
   - *Starter Pack* (Reels & Social Buzz)
   - *Brand Growth Suite* (Cinema TVC + Meta Ads) - Highlighted tier
   - *Complete 360° Brand Empire*
8. **Client Testimonials & FAQ Accordion**.
9. **Direct Contact Section & Booking Modal** with Supabase Cloud & Admin Panel lead management.

---

## 🚀 How to Run Locally

You can view this site immediately:

### Option A: Direct Open
Simply double-click [`index.html`](file:///d:/bongbeauty/index.html) to open it in your web browser (Chrome, Edge, Firefox, Safari).

### Option B: Local HTTP Server (Recommended)
In the terminal, run:
```bash
npx serve .
```
Then open `http://localhost:3000` in your browser.

---

## ⚙️ How to Customize Contact Details

### 1. Inquiries & Admin Lead Routing
All client inquiries and bookings from the website automatically sync to Supabase and appear in real-time in the [`admin.html`](file:///d:/bongbeauty/admin.html) dashboard.

### 2. Update Email & Address
In [`index.html`](file:///d:/bongbeauty/index.html):
- Update `contact@bongbangla.top` to your business email.
- Update the office/studio address in the Contact and Footer sections.

### 3. Replace Portfolio Images & Videos
- Put your actual photoshoot pictures and videos inside `assets/images/` or link to your YouTube/Vimeo embeds.
- Update the `data-media-src` and `img src` attributes on each `.portfolio-item` in `index.html`.

---

## 🌐 Deploying to `bongbangla.top`

Because this is clean, fast, static web code:

### Option 1: Vercel / Netlify (Recommended - Free & Fast)
1. Drag and drop the `bongbeauty` folder to [Netlify Drop](https://app.netlify.com/drop) or push to GitHub and import into Vercel.
2. Under Domain Management, add `bongbangla.top` and update your DNS records (A record or CNAME) as instructed by Vercel/Netlify.

### Option 2: cPanel / Shared Hosting
1. Compress all files (`index.html`, `css/`, `js/`, `assets/`) into a `.zip` archive.
2. In your cPanel File Manager, upload and extract to `public_html`.
3. Your site will instantly go live at `https://bongbangla.top`!
