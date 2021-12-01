import { useEffect, useState, useCallback, useMemo } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

/**
 * This wrapper is connected to the facebook container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' facebook Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {JSX.Element} The FacebookWrapper.
 */
const FacebookWrapper = ( props ) => {
	const [ activeMetaTabId, setActiveMetaTabId ] = useState( "" );

	// Set active meta tab id on window event.
	const handleMetaTabChange = useCallback( ( event ) => {
		setActiveMetaTabId( event.detail.metaTabId );
	}, [] );

	useEffect( () => {
		// Load on the next cycle because the editor inits asynchronously and we need to load the data after the component is fully loaded.
		setTimeout( props.onLoad );

		// Add event listener for meta section tab change.
		window.addEventListener( "YoastSEO:metaTabChange", handleMetaTabChange );

		return () => {
			// Remove event listener for meta section tab change.
			window.removeEventListener( "YoastSEO:metaTabChange", handleMetaTabChange );
		};
	}, [] );

	const allProps = useMemo( () => ( {
		...props,
		activeMetaTabId,
	} ), [ props, activeMetaTabId ] );

	return (
		props.isPremium
			? <Slot name={ `YoastFacebookPremium${ props.location.charAt( 0 ).toUpperCase() + props.location.slice( 1 ) }` } fillProps={ allProps } />
			: <SocialForm { ...allProps } />
	);
};

FacebookWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	onLoad: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
};

export default FacebookWrapper;
