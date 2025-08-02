export const defaultSEO = {
  title: 'Kow Tattys | Torontos premiere tatoo experience',
  description: 'Explore unique tattoo designs and book your consultation. Specializing in custom tattoos and various styles.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ktattys.netlify.app',
    site_name: 'Kow Tattys',
    images: [
      {
        src: 'public/portfolio/ktt-logo-main.png',
        width: 1200,
        height: 630,
        alt: 'Kow Tattys Logo',
      },
    ],
  },
  instagram: {
    handle: '@KowTattys',
    site: 'https://www.instagram.com/kowtattys/',
    cardType: 'summary_large_image',
  },
};

export const getSEO = (options: Partial<typeof defaultSEO> = {}) => ({
  ...defaultSEO,
  ...options,
});
