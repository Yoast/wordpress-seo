import { Fragment, useEffect } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

/**
 * This wrapper is connected to the facebook container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' facebook Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the FacebookWrapper React Component.
 */
const FacebookWrapper = ( props ) => {
	useEffect( () => {
		if ( props.isLoading === true ) {
			// Load on the next cycle because the editor inits asynchronously and we need to load the data after the component is fully loaded.
			setTimeout( props.onLoad );
		}
	} );

	return (
		<Fragment>
			{
				props.isPremium
					? <Slot
						name="YoastFacebookPremium"
						fillProps={ props }
					/>
					: <SocialForm { ...props } />
			}
		</Fragment>
	);
};

FacebookWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	onLoad: PropTypes.func.isRequired,
};

export default FacebookWrapper;
