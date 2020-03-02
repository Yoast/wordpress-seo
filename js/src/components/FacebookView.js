import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";

const YoastShortLink = makeOutboundLink();

/**
 *
 * @param {*} props A.
 *
 * @returns {Component} A
 */
const FacebookView = ( props ) => {
	console.log( "facebook props", props );
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
				<YoastShortLink
					href="https://yoast.com/reasons-to-upgrade/"
				>
					Do you want to preview what it will look like if people share this post on Facebook? You can, with Yoast SEO Premium.
				</YoastShortLink>
			</Alert>
			<SocialMetadataPreviewForm
				socialMediumName="Facebook"
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
FacebookView.propTypes = {
	recommendedReplacementVariables: PropTypes.array.isRequired,
	replacementVariables: PropTypes.array.isRequired,
	description: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	imageSelected: PropTypes.bool.isRequired,
};

FacebookView.defaultProps = {
	imageWarnings: [],
};

export default FacebookView;
