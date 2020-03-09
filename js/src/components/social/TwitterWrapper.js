import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";

import TwitterView from "../social/TwitterView";

const isPremium = !! window.wpseoPostScraperL10n.isPremium;

/**
 * This wrapper is connected to the twitter container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' twitter Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the TwitterWrapper React Component.
 */
const TwitterWrapper = ( props ) => {
	return (
		<Fragment>
			{
				! isPremium && <TwitterView isPremium={ isPremium } { ...props } />
			}
			<Slot name="YoastTwitterPremium" fillProps={ { isPremium, ...props } } />
		</Fragment>
	);
};

export default TwitterWrapper;
