import { Fragment } from "@wordpress/element";
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
};

export default FacebookWrapper;
