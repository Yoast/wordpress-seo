import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

const socialMediumName = "Facebook";

/**
 * This wrapper is connected to the facebook container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' facebook Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the FacebookWrapper React Component.
 */
const FacebookWrapper = ( props ) => {
	const richProps = {
		...props,
		socialMediumName,
	};

	return (
		<Fragment>
			{
				props.isPremium
					? <Slot
						name="YoastFacebookPremium"
						fillProps={ richProps }
					/>
					: <SocialForm { ...richProps } />
			}
		</Fragment>
	);
};

FacebookWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
};

export default FacebookWrapper;
