import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import SocialUpsell from "./SocialUpsell";

/**
 *
 * @param {object} props The properties passed to this component.
 *
 * @returns {Component} The SocialForm Component.
 */
const SocialForm = ( props ) => (
	<Fragment>
		<SocialUpsell socialMediumName={ props.socialMediumName } />
		<SocialMetadataPreviewForm
			{ ...props }
		/>
	</Fragment>
);

/**
 * Adds validation for the properties.
 */
SocialForm.propTypes = {
	recommendedReplacementVariables: PropTypes.array.isRequired,
	replacementVariables: PropTypes.array.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	isPremium: PropTypes.bool.isRequired,
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	description: PropTypes.string,
	title: PropTypes.string,
	imageWarnings: PropTypes.array,
	imageUrl: PropTypes.string.isRequired,
	imageFallbackUrl: PropTypes.string.isRequired,
};

SocialForm.defaultProps = {
	imageWarnings: [],
	title: null,
	description: null,
};

export default SocialForm;
