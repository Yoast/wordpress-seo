import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";

import FacebookView from "../social/FacebookView";

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
	return (
		<Fragment>
			{
				! isPremium && <FacebookView isPremium={ isPremium } { ...props } />
			}
			<Slot name="YoastFacebookPremium" fillProps={ { isPremium, ...props } } />
		</Fragment>
	);
};

export default FacebookWrapper;
