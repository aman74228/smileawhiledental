// Entry point. Styles are imported here so Vite bundles one CSS file.
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../sections/header/header.css';
import '../sections/hero/hero.css';
import '../styles/dev-stub.css';

import { initSmoothScroll, reducedMotion } from './motion.js';
import { initMagnetic } from './magnetic.js';
import { initHeader } from '../sections/header/header.js';
import { initHero } from '../sections/hero/hero.js';

// Motion module booted → cancel the inline failsafe that would un-hide content.
clearTimeout(window.__revealFailsafe);
document.documentElement.classList.toggle('reduced-motion', reducedMotion.matches);

initSmoothScroll();
initHeader();
initHero();
initMagnetic();
