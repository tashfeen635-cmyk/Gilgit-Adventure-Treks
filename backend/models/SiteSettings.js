const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  _singleton: { type: String, default: 'site-settings', unique: true },

  branding: {
    logoUrl: { type: String, default: 'images/logo.png' },
    logoSize: { type: Number, default: 44 },
    logoBorderRadius: { type: Number, default: 50 },
    companyName: { type: String, default: 'Gilgit Adventure Treks' },
    companyShortName: { type: String, default: 'The Journey Team' },
    faviconUrl: { type: String, default: 'images/logo.png' },
    faviconBorderRadius: { type: Number, default: 50 }
  },

  hero: {
    slides: [{ imageUrl: String, alt: String }],
    subtitle: { type: String, default: "Pakistan's Premier Adventure Company" },
    title: { type: String, default: "Pakistan's Best Treks, Tours &<br>Mountain Adventures" },
    description: { type: String, default: "From the magical Fairy Meadows to the mighty K2 Base Camp — experience the world's most spectacular mountain landscapes with expert local guides." }
  },

  sectionHeaders: {
    gallery: {
      tag: { type: String, default: 'Captured Moments' },
      title: { type: String, default: 'Northern Gallery' },
      description: { type: String, default: 'Stunning shots from trekkers who explored the mountains, valleys, and lakes of Northern Pakistan with us.' }
    },
    videos: {
      tag: { type: String, default: 'Watch & Explore' },
      title: { type: String, default: 'Experience Northern Pakistan' },
      description: { type: String, default: "Watch real adventures from our trekkers and cinematic views of the world's most dramatic mountain landscapes." }
    },
    team: {
      tag: { type: String, default: 'Meet Us' },
      title: { type: String, default: 'The Journey Team' },
      description: { type: String, default: 'Local experts, seasoned mountaineers, and passionate storytellers — the people who make your Northern Pakistan adventure unforgettable.' }
    },
    topDestinations: {
      tag: { type: String, default: 'Our Top Picks' },
      title: { type: String, default: 'Top Destinations' },
      description: { type: String, default: 'Handpicked by our team — the four most breathtaking experiences Northern Pakistan has to offer.' }
    },
    destinations: {
      tag: { type: String, default: 'Northern Pakistan' },
      title: { type: String, default: 'Iconic Destinations' },
      description: { type: String, default: 'Discover Gilgit-Baltistan, Chitral, and beyond — handpicked valleys, peaks, and treks that define the roof of the world.' }
    },
    map: {
      tag: { type: String, default: 'Discover' },
      title: { type: String, default: 'Explore Northern Pakistan' },
      description: { type: String, default: 'Click on any destination hotspot to learn more and start planning your adventure.' }
    },
    tripPlanner: {
      tag: { type: String, default: 'AI-Powered' },
      title: { type: String, default: 'Smart Trek Planner' },
      description: { type: String, default: 'Tell us your preferences and our AI will craft the perfect Northern Pakistan itinerary just for you.' }
    },
    booking: {
      tag: { type: String, default: 'Easy Booking' },
      title: { type: String, default: 'Book Your Adventure' },
      description: { type: String, default: 'Simple, transparent booking in just a few steps. No hidden fees — honest pricing from a local company.' }
    },
    reviews: {
      tag: { type: String, default: 'Testimonials' },
      title: { type: String, default: 'What Trekkers Say' },
      description: { type: String, default: 'Real experiences from real adventurers. See why thousands trust The Journey Team for their mountain journeys.' }
    },
    deals: {
      tag: { type: String, default: 'Limited Time' },
      title: { type: String, default: 'Seasonal Trek Deals' },
      description: { type: String, default: "Grab these exclusive Northern Pakistan tour packages before they're fully booked for the season." }
    }
  },

  navigation: {
    links: [{
      label: String,
      href: String,
      isCta: { type: Boolean, default: false }
    }]
  },

  filterCategories: [{
    label: String,
    value: String
  }],

  footer: {
    description: { type: String, default: "Pakistan's trusted adventure company since 2018. Specializing in treks, tours, and cultural expeditions across Gilgit-Baltistan, Skardu, and the Karakoram." },
    socialLinks: [{
      platform: String,
      url: String
    }],
    trustBadges: [{
      text: String
    }],
    copyrightText: { type: String, default: '© 2026 The Journey Team. All rights reserved. Based in Gilgit, Pakistan.' },
    linkColumns: [{
      heading: String,
      links: [{ label: String, href: String }]
    }]
  },

  newsletter: {
    heading: { type: String, default: 'Get Trek Updates & Seasonal Alerts' },
    description: { type: String, default: 'Subscribe for exclusive Northern Pakistan trek deals, weather updates, and adventure guides delivered to your inbox.' },
    subscriberNote: { type: String, default: 'No spam, unsubscribe anytime. Join 12,000+ adventure seekers.' }
  },

  contact: {
    whatsappNumber: { type: String, default: '' },
    whatsappUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' }
  },

  bookingConfig: {
    serviceFee: { type: Number, default: 2000 },
    porterFeePerNight: { type: Number, default: 3000 },
    childDiscount: { type: Number, default: 0.5 }
  },

  aiTripPlanner: {
    welcomeMessage: { type: String, default: "Assalam o Alaikum! I'm your AI trek planning assistant for Northern Pakistan. Set your preferences on the left and click <strong>Generate My Trek</strong> to get a personalized itinerary through Gilgit-Baltistan!" },
    aiResponses: { type: mongoose.Schema.Types.Mixed, default: {} },
    chatResponses: { type: mongoose.Schema.Types.Mixed, default: {} }
  },

  loadingScreen: {
    title: { type: String, default: 'Gilgit Adventure Treks' },
    text: { type: String, default: 'Preparing your mountain adventure...' }
  },

  seo: {
    siteTitle: { type: String, default: 'Gilgit Adventure Treks — Pakistan\'s #1 Adventure & Trekking Company' },
    metaDescription: { type: String, default: 'Book K2 Base Camp treks, Fairy Meadows tours, Hunza Valley trips & Karakoram Highway jeep safaris with Pakistan\'s most trusted adventure company. Expert local guides, best prices guaranteed.' },
    keywords: { type: String, default: 'gilgit adventure treks, k2 base camp trek, fairy meadows tour, hunza valley trekking, pakistan adventure tours, karakoram highway, skardu tours, northern pakistan trekking, gilgit baltistan tours, nanga parbat trek' },
    ogImage: { type: String, default: 'images/k2.jpg' },
    canonicalUrl: { type: String, default: 'https://gilgitadventuretreks.com' },
    founderName: { type: String, default: 'Aisha' },
    foundingYear: { type: String, default: '2018' },
    priceRange: { type: String, default: '$$' },
    officeAddress: { type: String, default: 'Main Bazaar, Gilgit, Gilgit-Baltistan, Pakistan' },
    geoLatitude: { type: String, default: '35.9208' },
    geoLongitude: { type: String, default: '74.3144' },
    socialProfiles: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    googleVerification: { type: String, default: '' },
    bingVerification: { type: String, default: '' },
    ga4MeasurementId: { type: String, default: '' },
    gtmContainerId: { type: String, default: '' },
    fbPixelId: { type: String, default: '' },
    clarityId: { type: String, default: '' }
  }

}, { timestamps: true });

// Static method to get the singleton
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ _singleton: 'site-settings' });
  if (!settings) {
    settings = await this.create({ _singleton: 'site-settings' });
  }
  return settings;
};

// Static method to update settings
siteSettingsSchema.statics.updateSettings = async function (data) {
  const settings = await this.findOneAndUpdate(
    { _singleton: 'site-settings' },
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  );
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
