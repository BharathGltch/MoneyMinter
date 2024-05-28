declare module "gtts" {
  interface GTTSOptions {
    lang?: string;
    tld?: string;
  }

  class gTTS {
    constructor(text: string, options?: GTTSOptions);
    save(
      path: string,
      callback: (err: Error | null, result?: any) => void
    ): void;
  }

  export = gTTS;
}
