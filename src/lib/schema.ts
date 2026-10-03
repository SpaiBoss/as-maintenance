import { servicePages, site } from "../config/site";

export function pageJsonLd(pageUrl: string, pageTitle: string, pageDescription: string) {
  const businessId = `${site.url}/#business`;
  const business: Record<string, unknown> = {
    "@type": "HomeAndConstructionBusiness",
    "@id": businessId,
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    telephone: site.phoneE164,
    email: site.email,
    slogan: site.tagline,
    areaServed: site.cities.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: {
        "@type": "State",
        name: "Minnesota",
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Handyman services",
      itemListElement: servicePages.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: new URL(service.href, site.url).href,
        },
      })),
    },
  };

  if (site.hours) business.openingHours = site.hours;

  if (site.reviews.length > 0) {
    business.review = site.reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewBody: review.text,
      ...(review.city ? { name: `Review from ${review.city}` } : {}),
    }));
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "WebPage",
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        about: { "@id": businessId },
        isPartOf: {
          "@type": "WebSite",
          name: site.name,
          url: `${site.url}/`,
        },
      },
    ],
  };
}
