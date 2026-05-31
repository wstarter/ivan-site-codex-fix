// Central icon mapping. WordPress-friendly: swap a glyph here and it updates everywhere.
import {
  Gem, Briefcase, Music2, Cake, Plus, Heart, Mic2, Users,
  Home, Sparkles, Workflow, Instagram, Mail, type LucideIcon,
} from "lucide-react";

// Program / service categories (free-standing icons)
export const programIcons: Record<string, LucideIcon> = {
  svadba: Gem,
  korporativna: Briefcase,
  klupska: Music2,
  rodjendan: Cake,
  dopunski: Plus,
};

// Hero metric icons (free-standing)
export const metricIcons: Record<string, LucideIcon> = {
  music: Music2,
  mic: Mic2,
  users: Users,
  heart: Heart,
};

// Mobile menu icons (small, framed in menu rail)
export const menuIcons: Record<string, LucideIcon> = {
  home: Home,
  sparkles: Sparkles,
  workflow: Workflow,
  music: Music2,
  instagram: Instagram,
  plus: Plus,
  mail: Mail,
};