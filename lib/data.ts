export type Service = {
  id: string;
  title: string;
  category: 'weddings' | 'cars' | 'bouquets' | 'venues' | 'occasions';
  short: string;
  description: string;
  price: string;
  startingNumericPrice: number;
  image: string;
  tag: string;
  features: string[];
};

export const services: Service[] = [
  {
    id: 'car',
    title: 'Luxury Car Decoration',
    category: 'cars',
    short: 'Regal fresh-flower styling for wedding cars & special arrivals',
    description: 'Transform luxury sedans, vintage cars, and wedding vehicles with fresh exotic roses, baby’s breath, orchids, and satin ribbons designed to stay fresh and secure on the road.',
    price: 'From ₹1,499',
    startingNumericPrice: 1499,
    image: '/images/services/car-decoration.jpg',
    tag: 'Customer Favourite',
    features: ['Doorstep car decor service', 'High-speed wind-resistant mounting', 'Exotic orchid, rose & lily combinations', 'Custom bonnet & handle ribbon motifs']
  },
  {
    id: 'bouquets',
    title: 'Artisanal Bouquets & Gift Baskets',
    category: 'bouquets',
    short: 'Hand-tied Korean wrap bouquets and luxury flower boxes',
    description: 'Handcrafted Dutch rose bouquets, exotic carnations, liliums, and imported foliage wrapped in minimalist waterproof matte papers, perfect for birthdays, anniversaries, and romantic surprises.',
    price: 'From ₹499',
    startingNumericPrice: 499,
    image: '/images/services/red-rose-bouquet.jpg',
    tag: 'Same Day Delivery',
    features: ['Farm-fresh morning-picked roses', 'Korean waterproof paper styling', 'Complimentary handwritten message card', 'Special midnight delivery available']
  },
  {
    id: 'stage',
    title: 'Stage & Reception Décor',
    category: 'venues',
    short: 'Statement photobooths, pastel floral walls & lighting',
    description: 'Elevate your reception and banquet hall with 3D floral backdrops, geometric arches, cascading wisteria suspensions, and warm fairy lighting tailored to your theme.',
    price: 'Packages from ₹12,000',
    startingNumericPrice: 12000,
    image: '/images/services/wedding-stage.jpg',
    tag: 'Photo Ready',
    features: ['3D floral wall backdrops', 'LED neon signs & ambient spotlighting', 'Coordinated banquet table centerpieces', 'Quick same-day teardown service']
  },
  {
    id: 'bedroom',
    title: 'Bridal Suite & Room Décor',
    category: 'occasions',
    short: 'Romantic canopy, cascading jasmine & rose petal bed styling',
    description: 'Intimate first-night and bridal suite flower decorations with fresh rose canopies, cascading jasmine, heart-shaped petal bedding, and warm ambient fairy lighting.',
    price: 'From ₹3,499',
    startingNumericPrice: 3499,
    image: '/images/services/bridal-room-canopy.jpg',
    tag: 'Romantic Special',
    features: ['Handcrafted fresh rose canopy arch', 'Fragrant jasmine & tuberose strings', 'Bed petal lettering & heart motif', 'Warm fairy light installation']
  },
  {
    id: 'engagement',
    title: 'Haldi, Mehendi & Ring Ceremony',
    category: 'occasions',
    short: 'Joyous marigold, genda phool & yellow-theme floral magic',
    description: 'Vibrant marigold hangings, floral jewelry for brides, yellow rose backdrops, swing (jhoola) decorations, and lively floral photo-booths for Indian pre-wedding festivities.',
    price: 'From ₹5,500',
    startingNumericPrice: 5500,
    image: '/images/services/haldi-ceremony.jpg',
    tag: 'Traditional & Modern',
    features: ['Fresh floral jewelry set for bride', 'Traditional Marigold (Genda) canopy', 'Decorated floral swing / photobooth', 'Organic flower petal shower basket']
  },
  {
    id: 'custom',
    title: 'Bespoke Pinterest / Instagram Recreation',
    category: 'occasions',
    short: 'Bring your saved dream design to life within your budget',
    description: 'Saw a dream decor concept on Instagram or Pinterest? Share the screenshot with us. Our senior floral artisans source exact flowers and craft a tailored version to fit your venue.',
    price: 'Based on your budget',
    startingNumericPrice: 3000,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
    tag: 'Tailored for You',
    features: ['Free 1-on-1 WhatsApp consultation', 'Exact flower & color palette matching', 'Scale & venue layout feasibility check', 'Transparent itemized budget breakdown']
  }
];

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'weddings' | 'cars' | 'bouquets' | 'venues';
  categoryLabel: string;
  image: string;
  aspect: 'tall' | 'wide' | 'square';
  highlight: string;
}

export const gallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Grand Palace Stage & 3D Floral Wall',
    category: 'venues',
    categoryLabel: 'Reception Stage',
    image: '/images/services/wedding-stage.jpg',
    aspect: 'wide',
    highlight: 'Full-bloom red & blush rose floral wall with crystal chandeliers'
  },
  {
    id: 'g2',
    title: 'Land Rover Defender Wedding Car Décor',
    category: 'cars',
    categoryLabel: 'Luxury Car Decoration',
    image: '/images/services/car-decoration.jpg',
    aspect: 'tall',
    highlight: 'Fresh yellow and red roses with pink organza ribbon styling'
  },
  {
    id: 'g3',
    title: 'Artisanal Black Wrapped Red Rose Bouquet',
    category: 'bouquets',
    categoryLabel: 'Luxury Bouquets',
    image: '/images/services/red-rose-bouquet.jpg',
    aspect: 'tall',
    highlight: 'Korean matte paper with satin burgundy ribbon'
  },
  {
    id: 'g4',
    title: 'Romantic Bridal Canopy Bed Décor',
    category: 'weddings',
    categoryLabel: 'First Night & Suite Décor',
    image: '/images/services/bridal-room-canopy.jpg',
    aspect: 'tall',
    highlight: 'Handcrafted fresh rose canopy with jasmine strings & fairy lights'
  },
  {
    id: 'g5',
    title: 'Spring Garden Pastel Palette',
    category: 'venues',
    categoryLabel: 'Floral Styling',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85',
    aspect: 'square',
    highlight: 'Peonies, ranunculus & eucalyptus'
  },
  {
    id: 'g6',
    title: 'Yellow Marigold & Jasmine Haldi Décor',
    category: 'weddings',
    categoryLabel: 'Haldi & Mehendi',
    image: '/images/services/haldi-ceremony.jpg',
    aspect: 'wide',
    highlight: 'Traditional floral jhoola with yellow genda phool and Rajasthani umbrellas'
  },
  {
    id: 'g7',
    title: 'Velvet Red Rose Anniversary Basket',
    category: 'bouquets',
    categoryLabel: 'Luxury Bouquets',
    image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=1000&q=85',
    aspect: 'square',
    highlight: 'Premium 50-stem long-stemmed roses'
  },
  {
    id: 'g8',
    title: 'Minimalist Monochromatic Bridal Bouquet',
    category: 'bouquets',
    categoryLabel: 'Bridal Florals',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=85',
    aspect: 'tall',
    highlight: 'Baby’s breath & white calla lilies'
  },
  {
    id: 'g9',
    title: 'Intimate Ceremony Floral Arches',
    category: 'weddings',
    categoryLabel: 'Weddings',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1000&q=85',
    aspect: 'wide',
    highlight: 'Asymmetric romantic arch for vows'
  }
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  occasion: string;
  rating: number;
  text: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Siddharth & Priya Sharma',
    role: 'Newlyweds',
    occasion: 'Grand Wedding at Taj Heritage',
    rating: 5,
    text: 'Laxman Phool Bhandar completely brought our dream wedding to life. The Mandap looked straight out of a luxury magazine! Every rose was fresh and lasted the entire 2 days. The varmalas were so fragrant and lightweight. Truly 10/10 service!',
    date: 'February 2026'
  },
  {
    id: 't2',
    name: 'Vikramaditya Verma',
    role: 'Groom',
    occasion: 'Wedding Car Decoration',
    rating: 5,
    text: 'Booked their luxury car decoration for my Mercedes on wedding morning. They arrived at my home right on time, completed the setup in 40 minutes, and the flowers stayed intact even during the 60km highway drive. Super professional.',
    date: 'January 2026'
  },
  {
    id: 't3',
    name: 'Ananya Deshmukh',
    role: 'Bride',
    occasion: 'Haldi & Mehendi Jhoola Décor',
    rating: 5,
    text: 'We sent them a Pinterest photo of a yellow marigold jhoola setup. They executed it even better than the photo! The floral jewelry was fresh and didn’t stain my outfit. All our relatives kept complimenting the decor.',
    date: 'November 2025'
  },
  {
    id: 't4',
    name: 'Rohan Mehta',
    role: 'Verified Customer',
    occasion: '50 Red Roses Anniversary Gift',
    rating: 5,
    text: 'Ordered midnight bouquet delivery for my wife’s birthday. The Korean wrapping was exquisite and the roses were huge and velvety. Ordering on WhatsApp took literally 2 minutes.',
    date: 'March 2026'
  }
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'How early should we book our wedding or event floral decor?',
    answer: 'For weddings, mandaps, and grand events, we recommend booking 2 to 4 weeks in advance, especially during the auspicious wedding season (Sawa). For bouquets, car decoration, and smaller celebrations, same-day and 24-hour advance bookings are readily accommodated.'
  },
  {
    question: 'Can you recreate a design I saw on Pinterest or Instagram?',
    answer: 'Yes, absolutely! Over 60% of our clients bring saved photos. Simply send us your reference photo on WhatsApp. Our master florist will evaluate the flowers, provide realistic recommendations for seasonality, and give you an exact transparent quote.'
  },
  {
    question: 'Do you provide doorstep car decoration?',
    answer: 'Yes! Our mobile decoration team comes equipped to your home, hotel, or venue at your chosen time. We use gentle, non-abrasive mounting techniques that protect your car paint while ensuring the flowers withstand highway speeds.'
  },
  {
    question: 'How do you ensure the flowers stay fresh throughout the event?',
    answer: 'We source farm-fresh blooms directly every single morning and use specialized floral foam hydration bases, hydration mists, and temperature-controlled storage so your arrangements look radiant from the first photo to the last dance.'
  },
  {
    question: 'What is your payment and booking process?',
    answer: 'We require a small advance token to lock your event date on our calendar. The remainder can be settled on event day after setup inspection. For daily bouquets, payment can be done conveniently via UPI upon delivery.'
  }
];

export const businessInfo = {
  name: 'Laxman Phool Bhandar',
  tagline: 'Artisanal Floral Couture & Celebration Decor',
  phone: '+91 99053 16880',
  rawPhone: '919905316880',
  email: 'hello@laxmanphoolbhandar.com',
  address: 'Main Market Road, Near City Plaza, Floral Hub',
  city: 'Patna, Bihar',
  hours: 'Open 7 Days · 6:30 AM – 10:30 PM',
  experienceYears: 12,
  eventsCount: '2,500+',
  rating: '4.9★',
  reviewsCount: '380+ reviews',
};
