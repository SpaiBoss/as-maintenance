import type { ImageMetadata } from "astro";
import door from "../assets/handyman-door.jpg";
import drywall from "../assets/drywall-finish.jpg";
import furniture from "../assets/furniture-assembly.jpg";
import hardwood from "../assets/flooring-hardwood.jpg";
import hero from "../assets/hero-hardwood-living.jpg";
import homes from "../assets/service-area-homes.jpg";
import laminate from "../assets/flooring-laminate.jpg";
import painting from "../assets/interior-painting.jpg";
import rental from "../assets/rental-room.jpg";
import vinyl from "../assets/flooring-vinyl.jpg";

export const photos = {
  hero,
  hardwood,
  vinyl,
  laminate,
  drywall,
  painting,
  furniture,
  rental,
  door,
  homes,
} satisfies Record<string, ImageMetadata>;

export const photoAlt = {
  hero: "Living room with a hardwood floor and daylight from a front window",
  hardwood: "Oak hardwood floorboards in a home",
  vinyl: "Light wood-look vinyl plank floor in a hallway",
  laminate: "Brown laminate floor meeting a wall and baseboard",
  drywall: "Hands smoothing joint compound over a drywall seam",
  painting: "Hands rolling paint onto an interior wall",
  furniture: "Hands assembling a light wood bookshelf",
  rental: "Empty rental bedroom with white walls and a wood-look floor",
  door: "Hands repairing the latch on a wooden interior door",
  homes: "A quiet street of houses in a residential neighborhood",
} as const;

const servicePhotoMap = {
  flooring: { src: hardwood, alt: photoAlt.hardwood },
  drywall: { src: drywall, alt: photoAlt.drywall },
  furniture: { src: furniture, alt: photoAlt.furniture },
  rentals: { src: rental, alt: photoAlt.rental },
  handyman: { src: door, alt: photoAlt.door },
} as const;

export function photoForService(id: string) {
  if (id in servicePhotoMap) return servicePhotoMap[id as keyof typeof servicePhotoMap];
  return servicePhotoMap.handyman;
}
