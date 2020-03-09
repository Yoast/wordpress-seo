import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";

const PremiumInfoText = styled( Alert )`
	margin-top: 16px;
 p {
	 margin: 0;
 }
`;

const YoastShortLink = makeOutboundLink();

/* Translators: %s expands to the social medium name, Twitter.  */
const previewText = sprintf(
	__(
		"Do you want to preview what it will look like if people share this post on %s? You can, with", "yoast-components"
	), "Twitter"
);

/* Translators: %s expands to Yoast, %s expands to SEO, %s expands to Premium*/
const upgradeText = sprintf(
	__(
		"Find out why you should upgrade to %s %s %s", "yoast-components"
	), "Yoast", "SEO", "Premium"
);

/**
 *
 * @param {object} props The properties passed to this component.
 *
 * @returns {Component} The TwitterView Component.
 */
const TwitterView = ( props ) => {
	const {
		recommendedReplacementVariables,
		replacementVariables,
		description,
		title,
		onSelectImageClick,
		onRemoveImageClick,
		onDescriptionChange,
		onTitleChange,
		imageWarnings,
		image,
		isPremium,
	} = props;

	return (
		<Fragment>
			<PremiumInfoText type={ "info" }>
				<p>{ previewText } <b>Yoast SEO Premium.</b> </p>
				<br />
				<YoastShortLink
					href="https://yoast.com/reasons-to-upgrade/"
				>
					<p>{ upgradeText }</p>
				</YoastShortLink>
			</PremiumInfoText>
			<SocialMetadataPreviewForm
				socialMediumName="Twitter"
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				description={ description }
				title={ title }
				onSelectImageClick={ onSelectImageClick }
				onRemoveImageClick={ onRemoveImageClick }
				onDescriptionChange={ onDescriptionChange }
				onTitleChange={ onTitleChange }
				imageWarnings={ imageWarnings }
				imageSelected={ !! image.url }
				imageUrl={ image.url ? image.url : null }
				isPremium={ isPremium }
			/>
		</Fragment>
	);
};

/**
 * Adds validation for the properties.
 */
TwitterView.propTypes = {
	recommendedReplacementVariables: PropTypes.array.isRequired,
	replacementVariables: PropTypes.array.isRequired,
	description: PropTypes.string,
	title: PropTypes.string,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	image: PropTypes.object.isRequired,
	isPremium: PropTypes.bool.isRequired,
};

TwitterView.defaultProps = {
	imageWarnings: [],
	title: null,
	description: null,
};

export default TwitterView;
