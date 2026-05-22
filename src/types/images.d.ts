/* vite-imagetools: query-parameterised image imports → resolved URL string */
/* Wildcard declarations matching the "~/*?imagetools" import pattern used in Nav */
declare module "~/assets/miia-logo.jpg?w=72&format=webp&imagetools" {
  const src: string;
  export default src;
}

declare module "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools" {
  const src: string;
  export default src;
}

declare module "~/assets/miia-logo.jpg?w=64&format=webp&imagetools" {
  const src: string;
  export default src;
}

declare module "~/assets/miia-logo.jpg?w=64&format=jpg&imagetools" {
  const src: string;
  export default src;
}
