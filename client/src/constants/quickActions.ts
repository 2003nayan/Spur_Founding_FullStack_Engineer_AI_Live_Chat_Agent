import { QuickAction } from "../types/chat";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "track",
    icon: "📦",
    label: "Track My Order",
    message: "Where is my order?",
  },
  {
    id: "return",
    icon: "↩️",
    label: "Returns & Refunds",
    message: "What is your return policy?",
  },
  {
    id: "shipping",
    icon: "🚚",
    label: "Shipping Info",
    message: "What are your shipping options and costs?",
  },
  {
    id: "sizing",
    icon: "👟",
    label: "Size Guide",
    message: "How do I find my sneaker size?",
  },
];
