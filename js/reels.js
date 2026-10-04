/**
 * BongBangla Media & Creative Lab
 * Dynamic Reels & Video Portfolio Controller
 * Supports 3x3 Grid (9 reels/page), Admin Uploads, Pagination, and Video Lightbox
 */

// Default Seed Reels Data
const DEFAULT_REELS = [
  // ================= 4K Cinema Commercials =================
  {
    id: 'reel-c1',
    category: 'cinema-ads',
    title: 'জামদানি ব্রাইডাল সিনেমাটিক টিভি কমার্শিয়াল',
    client: 'আড়ং হেরিটেজ কালেকশন',
    tag: '4K CINEMA',
    views: '2.8M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-01'
  },
  {
    id: 'reel-c2',
    category: 'cinema-ads',
    title: 'রয়্যাল ফ্যাশন রানওয়ে ও মেগা ব্র্যান্ড লঞ্চ',
    client: 'নকশী ওভেনস বিডি',
    tag: 'CINEMA 60FPS',
    views: '1.9M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-01'
  },
  {
    id: 'reel-c3',
    category: 'cinema-ads',
    title: 'লাক্সারি কসমেটিক্স ও স্কিনকেয়ার টিভি অ্যাড',
    client: 'গ্লো অ্যান্ড পিওর স্কিন',
    tag: 'TVC MASTER',
    views: '3.4M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-28'
  },
  {
    id: 'reel-c4',
    category: 'cinema-ads',
    title: 'ফেস্টিভ পাঞ্জাবি ও শেরওয়ানি হেরিটেজ কমার্শিয়াল',
    client: 'নবাব মেনসওয়্যার',
    tag: 'HERITAGE 4K',
    views: '1.5M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-25'
  },
  {
    id: 'reel-c5',
    category: 'cinema-ads',
    title: 'মডার্ন ফিউশন ড্রেস সিনেমাটিক প্রমো',
    client: 'ভেলভেট ভিস্তা',
    tag: '4K CINEMA',
    views: '2.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-22'
  },
  {
    id: 'reel-c6',
    category: 'cinema-ads',
    title: 'গোল্ড জুয়েলারি ড্রিম শট সিনেমা ফিল্ম',
    client: 'অনন্যা ডায়মন্ডস',
    tag: 'SPARKLE PRO',
    views: '4.2M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-20'
  },
  {
    id: 'reel-c7',
    category: 'cinema-ads',
    title: 'এক্সক্লুসিভ কাতান সিল্ক ফেস্টিভ্যাল শ্যুট',
    client: 'বেনারসি কুটির',
    tag: '4K CINEMA',
    views: '1.7M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-18'
  },
  {
    id: 'reel-c8',
    category: 'cinema-ads',
    title: 'ওয়েস্টার্ন ক্লাসিক কালেকশন টিভি ফিল্ম',
    client: 'আরবান অরা বিডি',
    tag: 'CINEMA EDIT',
    views: '980K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-15'
  },
  {
    id: 'reel-c9',
    category: 'cinema-ads',
    title: 'ন্যাচারাল হারবাল অয়েল সিনেমা কমার্শিয়াল',
    client: 'কেশ রাজ হারবাল',
    tag: 'TVC TOP',
    views: '2.3M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-12'
  },
  {
    id: 'reel-c10',
    category: 'cinema-ads',
    title: 'রয়্যাল লেহেঙ্গা ব্রাইডাল মাস্টার ফিল্ম',
    client: 'দিলরুবা ক্রিয়েশনস',
    tag: '4K CINEMA',
    views: '3.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-10'
  },
  {
    id: 'reel-c11',
    category: 'cinema-ads',
    title: 'প্রিমিয়াম লেদার অ্যান্ড শুজ টিভি স্পট',
    client: 'রয়্যাল হাইড বিডি',
    tag: 'CINEMA PRO',
    views: '850K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-08'
  },
  {
    id: 'reel-c12',
    category: 'cinema-ads',
    title: 'লাক্সারি পারফিউম সিনেমাটিক মোশন রিল',
    client: 'উদ আল নুর',
    tag: 'ULTRA 4K',
    views: '1.4M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-05'
  },

  // ================= Saree & Bold Model Shoot =================
  {
    id: 'reel-s1',
    category: 'saree-shoot',
    title: 'ঢাকাই জামদানি সিগনেচার শাড়ি শুট',
    client: 'শাড়ি গ্যালারি ঢাকা',
    tag: 'HERITAGE',
    views: '1.8M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-02'
  },
  {
    id: 'reel-s2',
    category: 'saree-shoot',
    title: 'বোল্ড এডিটোরিয়াল ফ্যাশন পোর্ট্রেট',
    client: 'ভোগ ঢাকা স্টুডিও',
    tag: 'BOLD LOOK',
    views: '2.4M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-30'
  },
  {
    id: 'reel-s3',
    category: 'saree-shoot',
    title: 'কাতান ও বেনারসি ব্রাইডাল লুকবুক',
    client: 'রাজমহল বেনারসি',
    tag: 'BRIDAL 4K',
    views: '3.0M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-27'
  },
  {
    id: 'reel-s4',
    category: 'saree-shoot',
    title: 'অরগ্যাঞ্জা সিল্ক প্যাস্টেল কালেকশন',
    client: 'রেশম কটন',
    tag: 'PASTEL GLOW',
    views: '1.2M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-24'
  },
  {
    id: 'reel-s5',
    category: 'saree-shoot',
    title: 'হ্যান্ডলুম কটন ও ট্র্যাডিশনাল লুক',
    client: 'তাঁতের মায়া বিডি',
    tag: 'HANDLOOM',
    views: '950K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-20'
  },
  {
    id: 'reel-s6',
    category: 'saree-shoot',
    title: 'মডার্ন ফিউশন ব্লাউজ ও সিল্ক ড্রেপ',
    client: 'কুতুর বাংলাদেশ',
    tag: 'FUSION SAREE',
    views: '1.6M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-17'
  },
  {
    id: 'reel-s7',
    category: 'saree-shoot',
    title: 'ভেলভেট উইন্টার নাইট শাড়ি শ্যুট',
    client: 'মহারাণী ক্লদিং',
    tag: 'WINTER ROYAL',
    views: '2.0M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-14'
  },
  {
    id: 'reel-s8',
    category: 'saree-shoot',
    title: 'মণিপুরী শাড়ি ও ন্যাচারাল সানসেট শুট',
    client: 'ঐতিহ্য ক্লথিং',
    tag: 'NATURAL SUN',
    views: '880K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-10'
  },
  {
    id: 'reel-s9',
    category: 'saree-shoot',
    title: 'রয়্যাল নীল জামদানি জমিদার বাড়ি শ্যুট',
    client: 'সোনার তরী',
    tag: 'HAVELI HERITAGE',
    views: '3.7M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-06'
  },
  {
    id: 'reel-s10',
    category: 'saree-shoot',
    title: 'হলুদ ও মেহেদি নাইট ব্রাইডাল শাড়ি',
    client: 'উৎসব সাজঘর',
    tag: 'MEHENDI FEST',
    views: '1.4M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-02'
  },

  // ================= Viral Product Reels =================
  {
    id: 'reel-v1',
    category: 'viral-reels',
    title: 'গ্লাস স্কিন সিরাম ৩-সেকেন্ড হুক রিল',
    client: 'ডার্মা পিওর বিডি',
    tag: 'VIRAL HOOK',
    views: '4.5M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-02'
  },
  {
    id: 'reel-v2',
    category: 'viral-reels',
    title: 'ম্যাট লিপস্টিক ওয়াটারপ্রুফ লাইভ টেস্ট',
    client: 'ভেলভেট লিপস',
    tag: 'TEXTURE MACRO',
    views: '3.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-29'
  },
  {
    id: 'reel-v3',
    category: 'viral-reels',
    title: 'স্মার্ট ব্লুটুথ ওয়াচ আনবক্সিং ও মডেল শোকেস',
    client: 'টেকনো গিয়ার বিডি',
    tag: 'TECH REELS',
    views: '1.9M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-26'
  },
  {
    id: 'reel-v4',
    category: 'viral-reels',
    title: 'ফাউন্ডেশন ব্লেন্ডিং ম্যাজিক ট্রানজিশন',
    client: 'লুমিনাস কসমেটিক্স',
    tag: 'TRANSITION',
    views: '2.7M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-23'
  },
  {
    id: 'reel-v5',
    category: 'viral-reels',
    title: 'লেডিস ডিজাইনার ক্লাচ ও হ্যান্ডব্যাগ রিল',
    client: 'লেদার লাক্সারি',
    tag: 'FASHION REEL',
    views: '1.3M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-19'
  },
  {
    id: 'reel-v6',
    category: 'viral-reels',
    title: 'সানস্ক্রিন হোয়াইট কাস্ট টেস্ট রিলস',
    client: 'সানগার্ড বাংলাদেশ',
    tag: 'TRENDING AUDIO',
    views: '2.2M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-15'
  },
  {
    id: 'reel-v7',
    category: 'viral-reels',
    title: 'হ্যান্ডমেড অর্গানিক সোপ কাটিং ও বাবল টেস্ট',
    client: 'পিওর ক্রাফট সোপ',
    tag: 'ASMR REEL',
    views: '5.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-12'
  },
  {
    id: 'reel-v8',
    category: 'viral-reels',
    title: 'স্নিকার্স ওয়াটার রেজিস্ট্যান্স ড্রপ টেস্ট',
    client: 'কিকস বাংলাদেশ',
    tag: 'HIGH ROAS',
    views: '1.6M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-09'
  },
  {
    id: 'reel-v9',
    category: 'viral-reels',
    title: 'প্রিমিয়াম সানগ্লাস ৩-লুক কুইক সুইচ',
    client: 'শেডস পয়েন্ট',
    tag: 'SPEED EDIT',
    views: '2.0M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-05'
  },
  {
    id: 'reel-v10',
    category: 'viral-reels',
    title: 'ম্যাজিক হেয়ার স্ট্রেইটনার লাইভ ট্রান্সফরমেশন',
    client: 'গ্ল্যাম প্রো গ্যাজেটস',
    tag: 'BEFORE AFTER',
    views: '3.8M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-01'
  },

  // ================= Facebook Ads Scaling =================
  {
    id: 'reel-f1',
    category: 'facebook-ads',
    title: 'ই-কমার্স ফ্যাশন ৬.২x ROAS মেটা অ্যাড ক্রিয়েটিভ',
    client: 'শপ বিডি অনলাইন',
    tag: '6.2x ROAS',
    views: '1.1M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-02'
  },
  {
    id: 'reel-f2',
    category: 'facebook-ads',
    title: 'কসমেটিক্স কম্বো সেলস কনভার্সন অ্যাড ফিল্ম',
    client: 'পিওর ব্লুম ঢাকা',
    tag: 'HIGH CONVERSION',
    views: '2.4M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-28'
  },
  {
    id: 'reel-f3',
    category: 'facebook-ads',
    title: 'মেনস ফেস্টিভ্যাল কালেকশন স্কেলিং ভিডিও',
    client: 'রয়্যাল কুর্তা হাউজ',
    tag: '5.8x ROAS',
    views: '920K ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-25'
  },
  {
    id: 'reel-f4',
    category: 'facebook-ads',
    title: 'প্রিমিয়াম হোম ডেকর ডিরেক্ট সেলস ক্যাম্পেইন',
    client: 'লাক্সারি লিভিং বিডি',
    tag: 'SCALING AD',
    views: '800K ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-21'
  },
  {
    id: 'reel-f5',
    category: 'facebook-ads',
    title: 'জেন্টস সু কালেকশন অফার বুস্ট ভিডিও',
    client: 'লেদার ক্রাফটস বিডি',
    tag: 'OFFER HOOK',
    views: '1.5M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-17'
  },
  {
    id: 'reel-f6',
    category: 'facebook-ads',
    title: 'ব্রাইডাল জুয়েলারি ডিসকাউন্ট ফানেল ক্রিয়েটিভ',
    client: 'স্বর্ণালংকার জুয়েলার্স',
    tag: '7.1x ROAS',
    views: '3.2M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-13'
  },
  {
    id: 'reel-f7',
    category: 'facebook-ads',
    title: 'হ্যান্ডমেড চকলেট গিফট বক্স বুস্টিং রিল',
    client: 'চকলেট ড্রিঙ্কস বিডি',
    tag: 'GIFTING CAMPAIGN',
    views: '650K ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-09'
  },
  {
    id: 'reel-f8',
    category: 'facebook-ads',
    title: 'ল্যাডিস স্নিকার্স বাই ওয়ান গেট ওয়ান প্রোমো',
    client: 'ফ্যাশন ফুটওয়্যার',
    tag: 'BOGO HOOK',
    views: '1.9M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-the-camera-in-a-studio-41797-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-05'
  },
  {
    id: 'reel-f9',
    category: 'facebook-ads',
    title: 'মেগা লাইভ শপ ট্র্যাফিক ড্রাইভ ক্যাম্পেইন',
    client: 'ঢাকা বাজার অনলাইন',
    tag: 'LIVE SCALING',
    views: '2.1M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-01'
  },
  {
    id: 'reel-f10',
    category: 'facebook-ads',
    title: 'অরিজিনাল প্রিমিয়াম পারফিউম রিলস অ্যাড',
    client: 'সুগন্ধি হাউজ',
    tag: 'LUXURY AD',
    views: '1.3M ইম্প্রেশন',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-08-28'
  },

  // ================= Jewellery & Luxury =================
  {
    id: 'reel-j1',
    category: 'jewellery',
    title: '২২ ক্যারেট গোল্ড ব্রাইডাল সীতাহার ম্যাক্রো শ্যুট',
    client: 'রয়েল গোল্ড জুয়েলার্স',
    tag: 'GOLD 22K',
    views: '3.6M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-10-02'
  },
  {
    id: 'reel-j2',
    category: 'jewellery',
    title: 'ডায়মন্ড সলিটায়ার রিং স্পার্কল লাইটিং',
    client: 'ডায়মন্ড ড্রিমস বিডি',
    tag: 'SPARKLE PRO',
    views: '2.9M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-29'
  },
  {
    id: 'reel-j3',
    category: 'jewellery',
    title: 'কুন্দন ও পোলকি নবরত্ন সেট শ্যুট',
    client: 'হেরিটেজ জুয়েলস',
    tag: 'KUNDAN POLKI',
    views: '1.7M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-26'
  },
  {
    id: 'reel-j4',
    category: 'jewellery',
    title: 'হ্যান্ড মডেলিং সিলভার অ্যান্টিক চুড়ি ও আংটি',
    client: 'রুপার দোকান',
    tag: 'HAND MODEL',
    views: '1.2M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-putting-on-makeup-in-front-of-a-mirror-39766-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-22'
  },
  {
    id: 'reel-j5',
    category: 'jewellery',
    title: 'লাক্সারি পার্ল নেকলেস রয়্যাল ডিসপ্লে',
    client: 'মুক্তা কালেকশন',
    tag: 'PEARL ROYAL',
    views: '890K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-catwalk-41792-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-18'
  },
  {
    id: 'reel-j6',
    category: 'jewellery',
    title: '৩৬০° রোটেটিং প্ল্যাটিনাম কাপল ব্যান্ড',
    client: 'লাভলক ডায়মন্ড',
    tag: '360 ROTATE',
    views: '2.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-14'
  },
  {
    id: 'reel-j7',
    category: 'jewellery',
    title: 'রয়্যাল ঝুমকা ও টিকলি ব্রাইডাল পোর্ট্রেট',
    client: 'স্বর্ণময়ী জুয়েলার্স',
    tag: 'JHUMKA PRO',
    views: '2.6M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-10'
  },
  {
    id: 'reel-j8',
    category: 'jewellery',
    title: 'লাক্সারি গোল্ড কয়েন ও বার প্রিমিয়াম শট',
    client: 'গোল্ড ট্রেডার্স বিডি',
    tag: 'MACRO 1:1',
    views: '740K ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-traditional-suit-41801-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-06'
  },
  {
    id: 'reel-j9',
    category: 'jewellery',
    title: 'রুবী ও এমারেল্ড স্টেটমেন্ট চোকার শুট',
    client: 'জেমস্টোন হাউজ',
    tag: 'GEMSTONE',
    views: '3.1M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-with-luxury-jewelry-41805-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-09-02'
  },
  {
    id: 'reel-j10',
    category: 'jewellery',
    title: 'মর্ডান মিনিমালিস্ট রোজ গোল্ড চেইন ও লকেট',
    client: 'অরা জুয়েলারি',
    tag: 'MINIMAL ROSE',
    views: '1.5M ভিউজ',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=720&h=1280&q=80',
    date: '2026-08-29'
  }
];

// Helper to get reels from localStorage (with auto-seeding only on initial visit)
function getReels(category = 'all') {
  let reels = null;
  try {
    const raw = localStorage.getItem('bongbangla_reels');
    if (raw !== null) {
      reels = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading reels:', e);
  }

  // Only seed DEFAULT_REELS if the key has NEVER been set in localStorage (raw === null)
  if (reels === null) {
    reels = DEFAULT_REELS;
    localStorage.setItem('bongbangla_reels', JSON.stringify(DEFAULT_REELS));
  }

  if (!Array.isArray(reels)) {
    reels = [];
  }

  if (category === 'all') return reels;
  return reels.filter(r => r.category === category);
}

function saveReels(reels) {
  localStorage.setItem('bongbangla_reels', JSON.stringify(reels));
}

function addReel(newReel) {
  const reels = getReels('all');
  reels.unshift(newReel);
  saveReels(reels);
  return reels;
}

function deleteReel(reelId) {
  let reels = getReels('all');
  reels = reels.filter(r => r.id !== reelId);
  saveReels(reels);
  return reels;
}

function resetReelsToDefault() {
  localStorage.setItem('bongbangla_reels', JSON.stringify(DEFAULT_REELS));
  return DEFAULT_REELS;
}

/**
 * Renders the 3 Row x 3 Column (9 Reels per page) grid with full dynamic pagination & Realtime Supabase Sync
 */
async function initReelsPage(options = {}) {
  const {
    category = 'all',
    containerId = 'reels-grid-container',
    paginationId = 'reels-pagination-container',
    countBadgeId = 'reels-total-count',
    perPage = 9
  } = options;

  let currentPage = 1;

  async function render() {
    const container = document.getElementById(containerId);
    const pagination = document.getElementById(paginationId);
    const countBadge = document.getElementById(countBadgeId);

    if (!container) return;

    let allCategoryReels = [];
    if (window.BongBanglaSupabase && window.BongBanglaSupabase.isConfigured()) {
      allCategoryReels = await window.BongBanglaSupabase.fetchReels(category);
    } else {
      allCategoryReels = getReels(category);
    }

    const totalItems = allCategoryReels.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    if (currentPage > totalPages) currentPage = totalPages;

    if (countBadge) {
      countBadge.textContent = `${totalItems.toLocaleString('bn-BD')} টি রিলস`;
    }

    // Slice for 9 items (3 rows x 3 columns)
    const startIndex = (currentPage - 1) * perPage;
    const currentReels = allCategoryReels.slice(startIndex, startIndex + perPage);

    if (currentReels.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-[#ED96D7]/50 p-8">
          <i class="fa-solid fa-film text-4xl text-[#ED96D7] mb-3"></i>
          <h4 class="font-bangla font-bold text-lg text-[#2b0e23]">এই ক্যাটাগরিতে এখনও কোনো রিলস যোগ করা হয়নি</h4>
          <p class="text-xs text-[#8c4f75] mt-1 font-bangla">অ্যাডমিন প্যানেল বা Supabase থেকে নতুন রিলস ভিডিও আপলোড করুন।</p>
          <a href="admin.html" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#db2777] text-white text-xs font-bold font-bangla shadow-md hover:bg-[#be185d]">
            <i class="fa-solid fa-plus mr-1.5"></i> অ্যাডমিন থেকে রিলস আপলোড করুন
          </a>
        </div>
      `;
      if (pagination) pagination.innerHTML = '';
      return;
    }

    // Build 3x3 Grid Cards
    container.innerHTML = currentReels.map(reel => {
      const tagText = reel.tag || '4K REC';
      const viewsText = reel.views || '1.5M ভিউজ';
      const clientName = reel.client || 'BongBangla Client';
      const title = reel.title || 'সিনেমাটিক কমার্শিয়াল রিল';
      const rawThumb = reel.thumbnail || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';
      const rawVideo = reel.videoUrl || '';
      
      const thumb = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawThumb, 'thumbnails') : rawThumb;
      const video = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawVideo, 'reels') : rawVideo;

      return `
        <div class="reel-card group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#ED96D7]/40 shadow-lg hover:shadow-2xl hover:border-[#db2777] transition-all duration-300 flex flex-col justify-between"
             data-reel-id="${reel.id}"
             data-video-url="${video}"
             data-title="${encodeURIComponent(title)}"
             data-client="${encodeURIComponent(clientName)}">
          
          <!-- 9:16 Aspect Ratio Poster & Video Preview Container -->
          <div class="relative w-full aspect-[9/16] overflow-hidden bg-black/90 cursor-pointer reel-preview-trigger">
            <img src="${thumb}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            
            <!-- Atmospheric Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#2b0e23]/90 via-transparent to-black/30 pointer-events-none"></div>

            <!-- Top Floating Badges -->
            <div class="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
              <span class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#ED96D7]/60 text-[10px] font-bold text-[#db2777] flex items-center gap-1.5 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-[#db2777] pulse-indicator"></span>
                <span>${tagText}</span>
              </span>
              <span class="px-2.5 py-1 rounded-full bg-[#2b0e23]/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                <i class="fa-regular fa-eye text-[#ED96D7]"></i> ${viewsText}
              </span>
            </div>

            <!-- Center Big Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-md border border-[#ED96D7] text-[#db2777] flex items-center justify-center text-xl sm:text-2xl shadow-xl group-hover:scale-115 group-hover:bg-[#db2777] group-hover:text-white transition-all duration-300">
                <i class="fa-solid fa-play ml-1"></i>
              </div>
            </div>

            <!-- Bottom Content on Thumbnail -->
            <div class="absolute bottom-3 inset-x-3 text-left pointer-events-none">
              <div class="inline-block px-2.5 py-0.5 rounded-md bg-[#db2777]/90 text-white text-[10px] font-bold mb-1 font-bangla">
                ${clientName}
              </div>
              <h3 class="text-white font-bangla font-bold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md">
                ${title}
              </h3>
            </div>
          </div>

          <!-- Bottom Card Action Footer -->
          <div class="p-3.5 bg-white border-t border-[#ED96D7]/20 flex items-center justify-between gap-2">
            <button type="button" class="reel-play-btn flex-1 py-2 rounded-xl bg-[#fdf2f8] hover:bg-[#ED96D7] hover:text-white text-[#db2777] text-xs font-bold font-bangla border border-[#ED96D7]/40 flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i class="fa-solid fa-circle-play"></i>
              <span>রিলসটি প্লে করুন</span>
            </button>
            <a href="https://wa.me/8801700000000?text=${encodeURIComponent('নমস্কার BongBangla! আমি ' + title + ' (' + clientName + ') এর মতো রিলস শুট করাতে আগ্রহী। বাজেট জানতে চাই।')}" 
               target="_blank" 
               class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold border border-emerald-300 flex items-center justify-center transition-all shadow-sm"
               title="এইরকম রিলস বুক করুন">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </a>
          </div>

        </div>
      `;
    }).join('');

    // Attach click listeners to open video lightbox modal
    container.querySelectorAll('.reel-card').forEach(card => {
      const trigger = card.querySelector('.reel-preview-trigger');
      const playBtn = card.querySelector('.reel-play-btn');
      const videoUrl = card.getAttribute('data-video-url');
      const title = decodeURIComponent(card.getAttribute('data-title') || '');
      const client = decodeURIComponent(card.getAttribute('data-client') || '');

      const openHandler = () => {
        openReelVideoModal(videoUrl, title, client);
      };

      if (trigger) trigger.addEventListener('click', openHandler);
      if (playBtn) playBtn.addEventListener('click', openHandler);
    });

    // Render Pagination
    if (pagination) {
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }

      let pagesHtml = '';

      // Previous Button
      pagesHtml += `
        <button type="button" class="reel-page-btn px-3.5 py-2 rounded-xl border text-xs font-bold font-bangla transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-white border-[#ED96D7]/30 text-[#8c4f75]' : 'bg-white border-[#ED96D7] text-[#db2777] hover:bg-[#fdf2f8] shadow-sm'}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-angle-left mr-1"></i> পূর্ববর্তী
        </button>
      `;

      // Numbered Page Buttons
      for (let p = 1; p <= totalPages; p++) {
        const isActive = p === currentPage;
        pagesHtml += `
          <button type="button" class="reel-page-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold font-bangla transition-all ${isActive ? 'bg-[#db2777] text-white shadow-md shadow-[#ED96D7]/40 scale-105' : 'bg-white border border-[#ED96D7]/40 text-[#572449] hover:border-[#db2777] hover:text-[#db2777] hover:bg-[#fdf2f8]'}" data-page="${p}">
            ${p.toLocaleString('bn-BD')}
          </button>
        `;
      }

      // Next Button
      pagesHtml += `
        <button type="button" class="reel-page-btn px-3.5 py-2 rounded-xl border text-xs font-bold font-bangla transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-white border-[#ED96D7]/30 text-[#8c4f75]' : 'bg-white border-[#ED96D7] text-[#db2777] hover:bg-[#fdf2f8] shadow-sm'}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
          পরবর্তী <i class="fa-solid fa-angle-right ml-1"></i>
        </button>
      `;

      pagination.innerHTML = pagesHtml;

      pagination.querySelectorAll('.reel-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetPage = parseInt(btn.getAttribute('data-page'), 10);
          if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
            currentPage = targetPage;
            render();
            const scrollAnchor = document.getElementById('reels-showcase-heading') || container;
            if (scrollAnchor) {
              scrollAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }
  }

  // Initial render
  await render();

  // Listen to Supabase Realtime changes on 'reels' table
  if (window.BongBanglaSupabase && window.BongBanglaSupabase.getClient()) {
    try {
      const client = window.BongBanglaSupabase.getClient();
      client
        .channel(`public:reels:${category}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reels' }, () => {
          console.log('⚡ Realtime reels update detected from Supabase!');
          render();
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }
  }
}

/**
 * 9:16 Video Player Lightbox Modal
 */
function openReelVideoModal(videoUrl, title, client) {
  let modal = document.getElementById('reel-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reel-video-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#2b0e23]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4';
    modal.innerHTML = `
      <div class="relative w-full max-w-[420px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#ED96D7]/50 flex flex-col">
        <!-- Top bar with close button -->
        <div class="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
          <div class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold font-bangla border border-white/20">
            <span id="modal-reel-client">ক্লায়েন্ট</span>
          </div>
          <button id="close-reel-modal-btn" class="w-9 h-9 rounded-full bg-black/60 hover:bg-[#db2777] text-white flex items-center justify-center transition-all border border-white/20 shadow-md">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        <!-- 9:16 Video Player Container -->
        <div class="relative w-full aspect-[9/16] bg-black flex items-center justify-center">
          <video id="modal-reel-video" class="w-full h-full object-cover" playsinline controls autoplay loop>
            <source id="modal-reel-source" src="" type="video/mp4">
            আপনার ব্রাউজার ভিডিও প্লে করতে সমর্থন করে না।
          </video>
        </div>

        <!-- Bottom Action Bar -->
        <div class="p-4 bg-[#fff8fa] border-t border-[#ED96D7]/30 text-left space-y-2.5">
          <h4 id="modal-reel-title" class="font-bangla font-bold text-sm text-[#2b0e23] line-clamp-1"></h4>
          <div class="flex items-center gap-2">
            <button class="open-booking-modal flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white font-bangla font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2">
              <i class="fa-solid fa-calendar-check"></i>
              <span>এইরকম শুটিং বুক করুন</span>
            </button>
            <a id="modal-reel-whatsapp-btn" href="#" target="_blank" class="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center transition-all shadow-md" title="WhatsApp-এ মেসেজ দিন">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-reel-modal-btn');
    closeBtn.addEventListener('click', () => {
      const vid = modal.querySelector('#modal-reel-video');
      if (vid) vid.pause();
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const vid = modal.querySelector('#modal-reel-video');
        if (vid) vid.pause();
        modal.classList.add('hidden');
      }
    });
  }

  // Populate data
  const resolvedVideoUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(videoUrl, 'reels') : videoUrl;
  const videoElem = modal.querySelector('#modal-reel-video');
  const sourceElem = modal.querySelector('#modal-reel-source');
  const titleElem = modal.querySelector('#modal-reel-title');
  const clientElem = modal.querySelector('#modal-reel-client');
  const waBtn = modal.querySelector('#modal-reel-whatsapp-btn');

  if (titleElem) titleElem.textContent = title;
  if (clientElem) clientElem.textContent = client;
  if (sourceElem) sourceElem.src = resolvedVideoUrl;
  if (videoElem) {
    videoElem.load();
    videoElem.play().catch(() => {});
  }
  if (waBtn) {
    waBtn.href = `https://wa.me/8801700000000?text=${encodeURIComponent('নমস্কার BongBangla! আমি ' + title + ' (' + client + ') ভিডিওটি দেখেছি এবং এইরকম রিল শ্যুট করাতে চাই।')}`;
  }

  modal.classList.remove('hidden');
}

// Expose functions globally
window.BongBanglaReels = {
  getReels,
  saveReels,
  addReel,
  deleteReel,
  resetReelsToDefault,
  initReelsPage,
  openReelVideoModal
};
