// types/global.d.ts - Definisi tipe global
declare global {
  interface Window {
    gsap: any;
  }
}

// Definisi tipe untuk module JSON
declare module "*.json" {
  const value: any;
  export default value;
}

export {};
