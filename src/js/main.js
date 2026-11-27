// Entry point for every page. Styles are imported here so Vite bundles one CSS file;
// each section module no-ops when its markup isn't on the current page.
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../sections/header/header.css';
import '../sections/hero/hero.css';
import '../sections/about/about.css';
import '../sections/office/office.css';
import '../sections/treatments/treatments.css';
import '../sections/reviews/reviews.css';
import '../sections/technology/technology.css';
import '../sections/doctor/doctor.css';
import '../sections/tour/tour.css';
import '../sections/contact/contact.css';
import '../sections/appointment/appointment.css';
import '../sections/cta/cta.css';
import '../sections/footer/footer.css';
import '../sections/sticky-cta/sticky-cta.css';
import '../styles/pages.css';

import { initSmoothScroll, reducedMotion, ScrollTrigger } from './motion.js';
import { initMagnetic } from './magnetic.js';
import { initReviewMode } from './review-mode.js';
import { initReveals } from './reveal.js';
import { initHeader } from '../sections/header/header.js';
import { initHero } from '../sections/hero/hero.js';
import { initTreatments } from '../sections/treatments/treatments.js';
import { initTechnology } from '../sections/technology/technology.js';
import { initDoctor } from '../sections/doctor/doctor.js';
import { initTour } from '../sections/tour/tour.js';
import { initContact } from '../sections/contact/contact.js';
import { initAppointmentForms } from '../sections/appointment/appointment.js';
import { initStickyCta } from '../sections/sticky-cta/sticky-cta.js';
import { initPageWidgets } from './pages.js';

// Motion module booted → cancel the inline failsafe that would un-hide content.
clearTimeout(window.__revealFailsafe);
document.documentElement.classList.toggle('reduced-motion', reducedMotion.matches);

initSmoothScroll();
initReviewMode();
initHeader();
initHero();
initTreatments();
initTechnology();
initDoctor();
initTour();
initContact();
initAppointmentForms();
initPageWidgets();
initReveals();
initStickyCta();
initMagnetic();

// Recalculate every pin/trigger once images and fonts have settled (pins stack: Featured
// Treatments' pin spacer shifts Advanced Technology and everything after it).
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
