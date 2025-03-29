/// <reference types="react-scripts" />

// Allow TypeScript to recognize audio file imports
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}
