import React, { Fragment, useEffect } from "react";
import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";

import SocialForm from "../social/SocialForm";

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
	useEffect( () => {
		props.loadTwitterPreviewData();
	}, [] );

	const richProps = {
		...props,
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
	loadTwitterPreviewData: PropTypes.func.isRequired,
};
