import { useEffect, useState, useCallback } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";
import { useFallbackWarning } from "./useFallbackWarning";

/**
 * This wrapper is connected to the facebook container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' facebook Component.
 *
 * @param {boolean} isPremium Whether premium is available.
 * @param {Function} onLoad Function to call when loading.
 * @param {string} location The location identifier.
 * @param {string} [imageFallbackUrl=""] The fallback image URL.
 * @param {string} [imageUrl=""] The image URL.
 * @param {Array} [imageWarnings=[]] The image warnings.
 * @param {...Object} [props] Additional props.
 *
 * @returns {JSX.Element} The FacebookWrapper.
 */
const FacebookWrapper = ( {
	isPremium,
	onLoad,
	location,
	imageFallbackUrl = "",
	imageUrl = "",
	imageWarnings = [],
	...props
} ) => {
	const [ activeMetaTabId, setActiveMetaTabId ] = useState( "" );

	const warnings = useFallbackWarning( imageFallbackUrl, imageUrl, imageWarnings );
	// Set active meta tab id on window event.
	const handleMetaTabChange = useCallback( ( event ) => {
		setActiveMetaTabId( event.detail.metaTabId );
	}, [ setActiveMetaTabId ] );

	useEffect( () => {
		// Load on the next cycle because the editor inits asynchronously, and we need to load the data after the component is fully loaded.
		setTimeout( onLoad );

		// Add event listener for meta section tab change.
		window.addEventListener( "YoastSEO:metaTabChange", handleMetaTabChange );

		return () => {
			// Remove event listener for meta section tab change.
			window.removeEventListener( "YoastSEO:metaTabChange", handleMetaTabChange );
		};
	}, [] );

	const allProps = {
		isPremium,
		onLoad,
		location,
		imageFallbackUrl,
		imageUrl,
		imageWarnings: warnings,
		activeMetaTabId,
		...props,
	};

	return (
		isPremium
			? <Slot name={ `YoastFacebookPremium${ location.charAt( 0 ).toUpperCase() + location.slice( 1 ) }` } fillProps={ allProps } />
			: <SocialForm { ...allProps } />
	);
};

FacebookWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	onLoad: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
	imageFallbackUrl: PropTypes.string,
	imageUrl: PropTypes.string,
	imageWarnings: PropTypes.array,
};

export default FacebookWrapper;
