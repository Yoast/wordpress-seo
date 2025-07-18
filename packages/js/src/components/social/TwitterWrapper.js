import { Slot } from "@wordpress/components";
import { useEffect } from "@wordpress/element";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";
import { useFallbackWarning } from "./useFallbackWarning";

/**
 * This wrapper is connected to the twitter container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' twitter Component.
 *
 * @param {boolean} isPremium Whether premium is available.
 * @param {Function} onLoad Function to call when loading.
 * @param {string} location The location identifier.
 * @param {string} [imageFallbackUrl=""] The fallback image URL.
 * @param {string} [imageUrl=""] The image URL.
 * @param {Array} [imageWarnings=[]] The image warnings.
 * @param {...Object} [props] Additional properties to pass to the component.
 *
 * @returns {JSX.Element} The TwitterWrapper.
 */
const TwitterWrapper = ( {
	isPremium,
	onLoad,
	location,
	imageFallbackUrl = "",
	imageUrl = "",
	imageWarnings = [],
	...props
} ) => {
	const warnings = useFallbackWarning( imageFallbackUrl, imageUrl, imageWarnings );

	useEffect( () => {
		// Load on the next cycle because the editor inits asynchronously, and we need to load the data after the component is fully loaded.
		setTimeout( onLoad );
	}, [] );

	const allProps = {
		isPremium,
		onLoad,
		location,
		imageFallbackUrl,
		imageUrl,
		imageWarnings: warnings,
		...props,
	};

	return isPremium
		? <Slot name={ `YoastTwitterPremium${ location.charAt( 0 ).toUpperCase() + location.slice( 1 ) }` } fillProps={ allProps } />
		: <SocialForm { ...allProps } />;
};

TwitterWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	onLoad: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
	imageFallbackUrl: PropTypes.string,
	imageUrl: PropTypes.string,
	imageWarnings: PropTypes.array,
};

export default TwitterWrapper;
