// Type declarations for Plasmo's special import prefixes

declare module "data-url:*" {
  const content: string;
  export default content;
}

declare module "url:*" {
  const content: string;
  export default content;
}

declare module "data-base64:*" {
  const content: string;
  export default content;
}

declare module "data-text:*" {
  const content: string;
  export default content;
}

declare module "raw:*" {
  const content: string;
  export default content;
}
