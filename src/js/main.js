// Entry point. Styles are imported here so Vite bundles one CSS file.
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../sections/header/header.css';
import '../sections/hero/hero.css';
import '../sections/about/about.css';
import '../sections/office/office.css';
import '../sections/treatments/treatments.css';
import '../sections/review/review.css';
import '../sections/technology/technology.css';
import '../sections/doctor/doctor.css';
import '../sections/sticky-cta/sticky-cta.css';
import '../styles/dev-stub.css';

import { initSmoothScroll, reducedMotion } from './motion.js';
import { initMagnetic } from './magnetic.js';
import { initHeader } from '../sections/header/header.js';
import { initHero } from '../sections/hero/hero.js';
import { initReveals } from './reveal.js';
import { initTreatments } from '../sections/treatments/treatments.js';
import { initStickyCta } from '../sections/sticky-cta/sticky-cta.js';
import { initTechnology } from '../sections/technology/technology.js';
import { initDoctor } from '../sections/doctor/doctor.js';
import { initReviewMode } from './review-mode.js';

// Motion module booted → cancel the inline failsafe that would un-hide content.
clearTimeout(window.__revealFailsafe);
document.documentElement.classList.toggle('reduced-motion', reducedMotion.matches);

initSmoothScroll();
initHeader();
initHero();
initReviewMode();
initTreatments();
initTechnology();
initDoctor();
initReveals();
initStickyCta();
initMagnetic();
