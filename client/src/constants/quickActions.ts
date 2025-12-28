import { QuickAction } from '../types/chat';

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'return',
    icon: '📦',
    label: 'Return Policy',
    message: 'What is your return policy?',
  },
  {
    id: 'shipping',
    icon: '🚚',
    label: 'Shipping Options',
    message: 'What are your shipping options and costs?',
  },
  {
    id: 'hours',
    icon: '🕐',
    label: 'Support Hours',
    message: 'What are your support hours?',
  },
  {
    id: 'about',
    icon: '✨',
    label: 'About Spur Store',
    message: 'Tell me about Spur Store services',
  },
];
