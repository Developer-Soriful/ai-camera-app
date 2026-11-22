import { WithSpringConfig } from 'react-native-reanimated';

export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 20,
  stiffness: 260,
  mass: 0.9,
};

export const SPRING_SHEET: WithSpringConfig = {
  damping: 24,
  stiffness: 220,
  mass: 1.0,
};

export const SPRING_SHUTTER: WithSpringConfig = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

export const SPRING_RETICLE: WithSpringConfig = {
  damping: 18,
  stiffness: 280,
  mass: 0.7,
};
