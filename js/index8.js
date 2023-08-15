// Import the necessary function for preloading images
import { preloadImages, getGrid } from './utils.js';

// Define a variable that will store the Lenis smooth scrolling object
let lenis;

// Element with class .columns
const grid = document.querySelector('.columns');
// All the columns class .column
const columns = [...grid.querySelectorAll('.column')];
// Map each column to its array of items and keep a reference of the image, its wrapper and the column
const items = columns.map((column, pos) => {
	return [...column.querySelectorAll('.column__item')].map(item => ({
		element: item,
		column: pos,
		wrapper: item.querySelector('.column__item-imgwrap'),
		image: item.querySelector('.column__item-img')
	}));
});
// All itemms
const mergedItems = items.flat();

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
	// Instantiate the Lenis object with specified properties
	lenis = new Lenis({
		lerp: 0.15, // Lower values create a smoother scroll effect
		smoothWheel: true // Enables smooth scrolling for mouse wheel events
	});

	// Update ScrollTrigger each time the user scrolls
	lenis.on('scroll', () => ScrollTrigger.update());

	// Define a function to run at each animation frame
	const scrollFn = (time) => {
		lenis.raf(time); // Run Lenis' requestAnimationFrame method
		requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
	};
	// Start the animation frame loop
	requestAnimationFrame(scrollFn);
};

const scroll = () => {
	// Set perspective
	gsap.set([grid, mergedItems.map(item => item.element)], {
		perspective: 600
	});

	// Define GSAP timeline with ScrollTrigger
	gsap.timeline({
		defaults: { ease: 'power2' },
		scrollTrigger: {
			trigger: grid,
			start: 'clamp(top bottom)',
			end: 'clamp(bottom top)',
			scrub: true
		}
	})
	.to(columns[0], {
		startAt: {transformOrigin: '100% 50%'},
		rotationY: 8,
		z: 20
	}, 0)
	.to(columns[1], {
		startAt: {transformOrigin: '100% 50%'},
		rotationY: 4
	}, 0)
	.to(columns[2], {
		startAt: {transformOrigin: '0% 50%'},
		rotationY: -3
	}, 0)
	.to(columns[3], {
		startAt: {transformOrigin: '0% 50%'},
		rotationY: -6,
		z: 20
	}, 0)
	
	mergedItems.forEach(item => {
		gsap.fromTo(item.wrapper, {
			opacity: 0,
			rotationX: -90,
			transformOrigin: '50% 0%'
		}, {
			scrollTrigger: {
				trigger: item.element,
				start: 'top bottom',
				end: 'clamp(center center-=25%)',
				scrub: true
			},
			opacity: 1,
			rotationX: 0
		});
	});
}

// Preload images, initialize smooth scrolling, apply scroll-triggered animations, and remove loading class from body
preloadImages('.column__item-img').then(() => {
	initSmoothScrolling();
	scroll();
	document.body.classList.remove('loading');
});