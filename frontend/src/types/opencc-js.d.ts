declare module 'opencc-js' {
  export interface ConverterOptions {
    from: 'cn' | 'tw' | 'hk' | 's' | 't';
    to: 'cn' | 'tw' | 'hk' | 's' | 't';
  }

  export function Converter(options: ConverterOptions): (text: string) => string;
} 