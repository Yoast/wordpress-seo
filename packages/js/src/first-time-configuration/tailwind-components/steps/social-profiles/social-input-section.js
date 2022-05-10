import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";

import SocialFieldArray from "./social-field-array";
import SocialInput from "./social-input";

/* eslint-disable complexity */
/**
 * A wrapper that combines all the SocialInputs. Intended for use in the configuration workout.
 *
 * @param {Object}   props                The props object.
 * @param {Object}   props.socialProfiles An associative array containing { socialmedium : url } pairs.
 * @param {array}    props.errorFields    The array containing the names of the fields with an invalid value.
 * @param {function} props.dispatch       A dispatch function to communicate with the Stepper store.
 *
 * @returns {WPElement} The SocialInputSectionContainer.
 */
export default function SocialInputSectionContainer( { socialProfiles, errorFields, dispatch } ) {
	const onChangeHandler = useCallback(
		( newValue, socialMedium ) => {
			dispatch( { type: "CHANGE_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } );
		},
		[]
	);
	const onChangeOthersHandler = useCallback(
		( newValue, index ) => {
			dispatch( { type: "CHANGE_OTHERS_SOCIAL_PROFILE", payload: { index, value: newValue } } );
		},
		[]
	);
	const onAddProfileHandler = useCallback(
		() => {
			dispatch( { type: "ADD_OTHERS_SOCIAL_PROFILE", payload: { value: "" } } );
		},
		[]
	);

	const onRemoveProfileHandler = useCallback(
		( idx ) => {
			dispatch( { type: "REMOVE_OTHERS_SOCIAL_PROFILE", payload: { index: idx } } );
		},
		[]
	);

	return (
		<SocialInputSection
			socialProfiles={ socialProfiles }
			onChangeHandler={ onChangeHandler }
			onChangeOthersHandler={ onChangeOthersHandler }
			onAddProfileHandler={ onAddProfileHandler }
			onRemoveProfileHandler={ onRemoveProfileHandler }
			errorFields={ errorFields }
		/>
	);
}
/* eslint-enable complexity */

SocialInputSectionContainer.propTypes = {
	socialProfiles: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	errorFields: PropTypes.array,
};

SocialInputSectionContainer.defaultProps = {
	errorFields: [],
};

/**
 * The social input section.
 *
 * @param {Object} props The props.
 * @returns {WPElement} The Social Input Section.
 */
export function SocialInputSection(	{
	socialProfiles,
	onChangeHandler,
	onChangeOthersHandler,
	onAddProfileHandler,
	onRemoveProfileHandler,
	errorFields,
} ) {
	return (
		<div id="social-input-section">
			<SocialInput
				className="yst-mt-4"
				label={ __( "Facebook", "wordpress-seo" ) }
				id="social-input-facebook-url"
				value={ socialProfiles.facebookUrl }
				socialMedium="facebookUrl"
				onChange={ onChangeHandler }
				placeholder={ __( "E.g. https://www.facebook.com/yoast", "wordpress-seo" ) }
				feedback={ {
					message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
					isVisible: errorFields.includes( "facebook_site" ),
					type: "error",
				} }
			/>
			<SocialInput
				className="yst-mt-4"
				label={ __( "Twitter", "wordpress-seo" ) }
				id="social-input-twitter-url"
				value={ socialProfiles.twitterUsername }
				socialMedium="twitterUsername"
				onChange={ onChangeHandler }
				placeholder={ __( "E.g. https://www.twitter.com/yoast", "wordpress-seo" ) }
				feedback={ {
					message: [ __( "Could not save this value. Please check the URL or username.", "wordpress-seo" ) ],
					isVisible: errorFields.includes( "twitter_site" ),
					type: "error",
				} }
			/>
			<SocialFieldArray
				items={ socialProfiles.otherSocialUrls }
				onAddProfile={ onAddProfileHandler }
				onRemoveProfile={ onRemoveProfileHandler }
				onChangeProfile={ onChangeOthersHandler }
				errorFields={ errorFields }
				fieldType={ SocialInput }
			/>
		</div>
	);
}

SocialInputSection.propTypes = {
	socialProfiles: PropTypes.object.isRequired,
	onChangeHandler: PropTypes.func.isRequired,
	onChangeOthersHandler: PropTypes.func.isRequired,
	onAddProfileHandler: PropTypes.func.isRequired,
	onRemoveProfileHandler: PropTypes.func.isRequired,
	errorFields: PropTypes.array.isRequired,
};
