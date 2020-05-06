import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

const socialMediumName = "Facebook";

/* Translators: %s expands to the social medium name, i.e. Faceboook. */
const descriptionPlaceholder  = sprintf(
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	__( "Modify your %s description by editing it right here...", "yoast-components" ),
	socialMediumName
);

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
		descriptionPlaceholder,
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
