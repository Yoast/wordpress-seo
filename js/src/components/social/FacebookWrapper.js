import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";

import SocialForm from "../social/SocialForm";

const isPremium = !! window.wpseoPostScraperL10n.isPremium;

/**
 * This wrapper is connected to the facebook container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' facebook Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the FacebookWrapper React Component.
 */
const FacebookWrapper = ( props ) => {
	props.socialMediumName = "Facebook";
	props.isPremium = isPremium;
	return (
		<Fragment>
			{
				isPremium
					? <Slot name="YoastFacebookPremium" fillProps={ { ...props } } />
					: <SocialForm { ...props } />
			}
		</Fragment>
	);
};

export default FacebookWrapper;
