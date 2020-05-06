import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

const socialMediumName = "Twitter";

/* Translators: %s expands to the social medium name, i.e. Faceboook. */
const descriptionPlaceholder  = sprintf(
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	__( "Modify your %s description by editing it right here...", "yoast-components" ),
	socialMediumName
);

/**
 * This wrapper is connected to the twitter container. So the data is connected to both components.
 * isPremium checks if premium is available and if available it doesn't render the 'free' twitter Component.
 *
 * @param {Object} props The properties object.
 *
 * @returns {Component} Renders the TwitterWrapper React Component.
 */
const TwitterWrapper = ( props ) => {
	const richProps = {
		...props,
		descriptionPlaceholder,
		socialMediumName,
	};
	return (
		<Fragment>
			{
				props.isPremium
					? <Slot
						name="YoastTwitterPremium"
						fillProps={ richProps }
					/>
					: <SocialForm { ...richProps } />
			}
		</Fragment>
	);
};

export default TwitterWrapper;

TwitterWrapper.propTypes = {
	isPremium: PropTypes.bool.isRequired,
};
