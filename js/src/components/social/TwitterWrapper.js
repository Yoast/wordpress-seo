import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";

import SocialForm from "../social/SocialForm";

const isPremium = !! window.wpseoPostScraperL10n.isPremium;
const socialMediumName = "Twitter";

/**
 * This wrapper is connected to the twitter container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' twitter Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the TwitterWrapper React Component.
 */
const TwitterWrapper = ( props ) => {
	props.socialMediumName = "Twitter";
	props.isPremium = isPremium;
	return (
		<Fragment>
			{
				isPremium
					? <Slot
						name="YoastTwitterPremium" 
						fillProps={ {
							socialMediumName,
							isPremium,
							...props,
						} }
					/>
					// : <SocialForm { ...props } />
					: <div>null</div>
			}
		</Fragment>
	);
};

export default TwitterWrapper;
