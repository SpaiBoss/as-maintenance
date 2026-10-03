// TODO(client): confirm services@asmaintenanceservices.com is live and monitored.
// TODO(client): registrar and DNS access for asmaintenanceservices.com.
// TODO(client): real job photos (at least 6, ideally before and after) and a logo SVG.
// TODO(client): license numbers and insurance status.
// TODO(client): owner name and short background.
// TODO(client): what satisfaction guaranteed means in practice.
// TODO(client): real customer reviews with permission to publish.
// TODO(client): working hours, if any.
// DISABLED until the client proves state licensing: plumbing and electrical.
// enabled: false. Render nothing: no pages, no copy, no schema, and no meta.

export const site = {
  name: "A&S Maintenance",
  legalName: "A&S Maintenance LLC",
  url: "https://asmaintenanceservices.com",
  phoneDisplay: "612-707-3149",
  phoneE164: "+16127073149",
  email: "services@asmaintenanceservices.com", // UNVERIFIED: confirm it is live before launch
  tagline: "Quality work. Honest pricing. Reliable service.",
  region: "Twin Cities, MN",
  cities: [
    "Saint Paul",
    "Minneapolis",
    "Maplewood",
    "Woodbury",
    "Eagan",
    "Roseville",
    "Brooklyn Park",
    "Brooklyn Center",
    "Bloomington",
    "Burnsville",
  ],
  licenseNumber: null as string | null,
  insured: false,
  hours: null as string | null,
  reviews: [] as { name: string; text: string; city?: string }[],
  features: { gallery: false, beforeAfter: false },
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? null,
};

export type ServicePage = {
  id: string;
  href: string;
  nav: string;
  title: string;
  summary: string;
  related: readonly string[];
};

export const servicePages: readonly ServicePage[] = [
  {
    id: "flooring",
    href: "/flooring/",
    nav: "Flooring",
    title: "Hardwood, vinyl and laminate flooring",
    summary: "Installation and repair, plus hardwood refinishing.",
    related: ["drywall", "rentals"],
  },
  {
    id: "drywall",
    href: "/drywall-painting/",
    nav: "Drywall and painting",
    title: "Drywall and interior painting",
    summary: "Repair, installation, and finishing. Interior painting and touch-ups.",
    related: ["flooring", "handyman"],
  },
  {
    id: "furniture",
    href: "/furniture-assembly/",
    nav: "Furniture assembly",
    title: "Furniture assembly",
    summary: "All types of furniture.",
    related: ["handyman", "drywall"],
  },
  {
    id: "rentals",
    href: "/rental-property-maintenance/",
    nav: "Rental properties",
    title: "Rental property maintenance",
    summary: "Turnovers, repairs, and ongoing maintenance.",
    related: ["handyman", "flooring"],
  },
  {
    id: "handyman",
    href: "/handyman-services/",
    nav: "Handyman",
    title: "General handyman",
    summary: "Door and lock repairs, caulking, and more.",
    related: ["furniture", "rentals"],
  },
];

export function serviceById(id: string) {
  return servicePages.find((service) => service.id === id);
}

export function relatedServices(id: string) {
  const current = serviceById(id);
  if (!current) return [];
  return current.related
    .map((relatedId) => serviceById(relatedId))
    .filter((service): service is ServicePage => Boolean(service));
}

export const headerNav = [
  { href: "/flooring/", label: "Flooring" },
  { href: "/drywall-painting/", label: "Drywall" },
  { href: "/furniture-assembly/", label: "Furniture" },
  { href: "/rental-property-maintenance/", label: "Rentals" },
  { href: "/handyman-services/", label: "Handyman" },
  { href: "/service-area/", label: "Areas" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export function footerNav() {
  const links = [
    { href: "/", label: "Home" },
    ...servicePages.map((service) => ({ href: service.href, label: service.nav })),
    { href: "/service-area/", label: "Service area" },
    { href: "/about/", label: "About" },
    { href: "/contact/", label: "Contact" },
    { href: "/privacy/", label: "Privacy" },
  ];
  if (site.features.gallery) links.push({ href: "/gallery/", label: "Job photos" });
  return links;
}
