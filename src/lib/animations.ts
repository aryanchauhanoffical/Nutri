import type { Variants, Transition } from 'framer-motion';

export const easeOut: Transition = { duration: 0.35, ease: [0, 0, 0.2, 1] };
export const easeIn: Transition = { duration: 0.2, ease: [0.4, 0, 1, 1] };
export const spring: Transition = { type: 'spring', stiffness: 300, damping: 24 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
