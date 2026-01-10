export type ThemeType = 'harvest' | 'cold-sky' | 'ocean-breeze' | 'deep-space' | 'midnight-sand' | 'bright-azure' | 'corporate-prime';

export interface ThemePalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  dark: string;
  light: string;
  muted: string;
  chart: string;
}

export const THEMES: Record<ThemeType, ThemePalette> = {
  'harvest': {
    primary: '#606C38',
    primaryForeground: '#FEFAE0',
    secondary: '#BC6C25',
    secondaryForeground: '#FEFAE0',
    dark: '#283618',
    light: '#FEFAE0',
    muted: '#DDA15E',
    chart: '#BC6C25',
  },
  'cold-sky': {
    primary: '#4D6DE3',
    primaryForeground: '#F1FCFD',
    secondary: '#C7EEFF',
    secondaryForeground: '#393737',
    dark: '#393737',
    light: '#F1FCFD',
    muted: '#7E96CC',
    chart: '#4D6DE3',
  },
  'bright-azure': {
    primary: '#3674B5',
    primaryForeground: '#D1F8EF',
    secondary: '#578FCA',
    secondaryForeground: '#FFFFFF',
    dark: '#1E3A5F',
    light: '#D1F8EF',
    muted: '#A1E3F9',
    chart: '#3674B5',
  },
  'deep-space': {
    primary: '#00ADB5',
    primaryForeground: '#EEEEEE',
    secondary: '#393E46',
    secondaryForeground: '#EEEEEE',
    dark: '#222831',
    light: '#EEEEEE',
    muted: '#393E46',
    chart: '#00ADB5',
  },
  'midnight-sand': {
    primary: '#0A065D',
    primaryForeground: '#F8F1F1',
    secondary: '#A3816A',
    secondaryForeground: '#F8F1F1',
    dark: '#0A065D',
    light: '#F8F1F1',
    muted: '#D2C8C8',
    chart: '#A3816A',
  },
  'ocean-breeze': {
    primary: '#213448',
    primaryForeground: '#EAE0CF',
    secondary: '#547792',
    secondaryForeground: '#FFFFFF',
    dark: '#213448',
    light: '#EAE0CF',
    muted: '#94B4C1',
    chart: '#547792',
  },
  'corporate-prime': {
    primary: '#005DAA',
    primaryForeground: '#FFFFFF',
    secondary: '#FECB0A',
    secondaryForeground: '#0F172A',
    dark: '#0F172A',
    light: '#F8FAFC',
    muted: '#64748B',
    chart: '#FECB0A',
  },
};