import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";

const YoastShortLink = makeOutboundLink();

/**
 *
 * @param {Object} props A.
 *
 * @returns {Component} A
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
		imageSelected,

	} = props;

	return (
		<Fragment>
			<Alert type={ "info" }>
				Do you want to preview what it will look like if people share this post on Twitter?
				You can, with <b>Yoast SEO Premium.</b>
				<br />
				<YoastShortLink
					href="https://yoast.com/reasons-to-upgrade/"
				>
					Find out why you should upgrade to Yoast SEO Premium
				</YoastShortLink>
			</Alert>
			<SocialMetadataPreviewForm
				socialMediumName="twitter"
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				description={ description }
				title={ title }
				onSelectImageClick={ onSelectImageClick }
				onRemoveImageClick={ onRemoveImageClick }
				onDescriptionChange={ onDescriptionChange }
				onTitleChange={ onTitleChange }
				imageWarnings={ imageWarnings }
				imageSelected={ imageSelected }
			/>
		</Fragment>
	);
};

/**
 * Adds validation for the properties.
 */
TwitterView.propTypes = {
	recommendedReplacementVariables: PropTypes.array,
	replacementVariables: PropTypes.array,
	description: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	imageSelected: PropTypes.bool.isRequired,
};

TwitterView.defaultProps = {
	recommendedReplacementVariables: [],
	replacementVariables: [],
	imageWarnings: [],
};

export default TwitterView;
