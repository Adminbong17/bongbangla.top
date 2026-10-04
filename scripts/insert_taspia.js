const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://sfnyuzemaqplpdeedsgg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw'
);

async function insertTaspia() {
  const videoUrl = 'https://sfnyuzemaqplpdeedsgg.supabase.co/storage/v1/object/public/reels/taspia_reel_1791116816832.mp4';
  const imageUrl = 'https://sfnyuzemaqplpdeedsgg.supabase.co/storage/v1/object/public/models/model_M-1791102354967_1791115523914.jpg';

  const taspia = {
    id: 'M-1791102354967',
    name: 'Taspia',
    category: 'Fashion',
    height: "৫'৭\"",
    shoots: '২৫+',
    image_url: imageUrl,
    available: true,
    age: '২৩',
    measurements: '৩৬-২৮-৩৪',
    skin_tone: 'উজ্জ্বল ফর্সা',
    eye_color: 'বাদামী',
    hair_color: 'কালো',
    location: 'ঢাকা, বাংলাদেশ',
    experience: '৩+ বছর',
    instagram: '@taspia.official',
    specialties: 'ব্রাইডাল, ফ্যাশন র‍্যাম্প ও ভিডিও শুট',
    bio: 'আন্তর্জাতিক মানের ফ্যাশন ও গ্ল্যামার মডেল। বিভিন্ন শীর্ষস্থানীয় ব্র্যান্ড ও ফ্যাশন হাউসের সাথে সফল ক্যাম্পেইন সম্পন্ন করেছেন।',
    gallery: [
      {
        type: 'video',
        url: videoUrl,
        thumbnail: imageUrl
      }
    ],
    created_at: new Date().toISOString()
  };

  const { data, error } = await client.from('models').upsert([taspia]);
  if (error) {
    console.error('Error inserting Taspia:', error);
  } else {
    console.log('✅ Taspia successfully inserted into Supabase DB with real 4K video!');
  }
}

insertTaspia();
