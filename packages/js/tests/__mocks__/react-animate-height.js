import { useEffect } from "@wordpress/element";

// Test stub: renders children immediately and fires onAnimationEnd, so reveal effects run without animations.
const AnimateHeight = ( { children, onAnimationEnd } ) => {
	useEffect( () => onAnimationEnd?.() );
	return children;
};

export default AnimateHeight;
