import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";

import SocialInput from "./SocialInput";

/* eslint-disable complexity */
/**
 * A wrapper that combines all the SocialInputs. Intended for use in the configuration workout.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The SocialInputSection.
 */
export default function SocialInputSection( { socialProfiles, errorFields, dispatch, isDisabled } ) {
	const onChangeHandler = useCallback(
		( newValue, socialMedium ) => {
			dispatch( { type: "CHANGE_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } );
		},
		[]
	);

	const getFeedback = useCallback(
		( socialKey ) => {
			if ( errorFields.includes( socialKey ) ) {
				return {
					feedbackState: "error",
					feedbackMessage: socialKey === "twitter_site"
						? __( "Could not save this value. Please check the URL or username.", "wordpress-seo" )
						: __( "Could not save this value. Please check the URL.", "wordpress-seo" ),
				};
			}
			return {};
		},
		[ errorFields ]
	);

	return (
		<div id="social-input-section" className="yoast-social-profiles-input-fields">
			<SocialInput
				label={ __( "Facebook URL", "wordpress-seo" ) }
				id="social-input-facebook-url"
				value={ socialProfiles.facebookUrl }
				socialMedium="facebookUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "facebook_site" ) }
			/>
			<SocialInput
				label={ __( "Twitter URL", "wordpress-seo" ) }
				id="social-input-twitter-url"
				value={ socialProfiles.twitterUsername }
				socialMedium="twitterUsername"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "twitter_site" ) }
			/>
			<SocialInput
				label={ __( "Instagram URL", "wordpress-seo" ) }
				id="social-input-instagram-url"
				value={ socialProfiles.instagramUrl }
				socialMedium="instagramUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "instagram_url" ) }
			/>
			<SocialInput
				label={ __( "LinkedIn URL", "wordpress-seo" ) }
				id="social-input-linkedin-url"
				value={ socialProfiles.linkedinUrl }
				socialMedium="linkedinUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "linkedin_url" ) }
			/>
			<SocialInput
				label={ __( "MySpace URL", "wordpress-seo" ) }
				id="social-input-myspace-url"
				value={ socialProfiles.myspaceUrl }
				socialMedium="myspaceUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "myspace_url" ) }
			/>
			<SocialInput
				label={ __( "Pinterest URL", "wordpress-seo" ) }
				id="social-input-pinterest-url"
				value={ socialProfiles.pinterestUrl }
				socialMedium="pinterestUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "pinterest_url" ) }
			/>
			<SocialInput
				label={ __( "YouTube URL", "wordpress-seo" ) }
				id="social-input-youtube-url"
				value={ socialProfiles.youtubeUrl }
				socialMedium="youtubeUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "youtube_url" ) }
			/>
			<SocialInput
				label={ __( "Wikipedia URL", "wordpress-seo" ) }
				id="social-input-wikipedia-url"
				value={ socialProfiles.wikipediaUrl }
				socialMedium="wikipediaUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				{ ...getFeedback( "wikipedia_url" ) }
			/>
		</div>
	);
}
/* eslint-enable complexity */

SocialInputSection.propTypes = {
	socialProfiles: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	errorFields: PropTypes.array,
	isDisabled: PropTypes.bool,
};

SocialInputSection.defaultProps = {
	errorFields: [],
	isDisabled: false,
};
