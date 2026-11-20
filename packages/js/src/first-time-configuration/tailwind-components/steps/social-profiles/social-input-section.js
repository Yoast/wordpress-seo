import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SocialFieldArray from "./social-field-array";
import SocialInput from "./social-input";

/**
 * A wrapper that combines all the SocialInputs. Intended for use in the first time configuration.
 *
 * @param {Object} props Component props.
 * @param {Object} props.socialProfiles An associative array containing { socialmedium : url } pairs.
 * @param {Function} props.dispatch A dispatch function to communicate with the Stepper store.
 * @param {Array} [props.errorFields=[]] The array containing the names of the fields with an invalid value.
 *
 * @returns {JSX.Element} The SocialInputSectionContainer.
 */
export default function SocialInputSectionContainer( { socialProfiles, errorFields = [], dispatch } ) {
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

/**
 * The social input section.
 *
 * @param {Object} props Component props.
 * @param {Object} props.socialProfiles The social profiles object.
 * @param {Function} props.onChangeHandler Handler for changing a social profile.
 * @param {Function} props.onChangeOthersHandler Handler for changing other social profiles.
 * @param {Function} props.onAddProfileHandler Handler for adding a social profile.
 * @param {Function} props.onRemoveProfileHandler Handler for removing a social profile.
 * @param {Array} props.errorFields The array containing the names of the fields with an invalid value.
 *
 * @returns {JSX.Element} The Social Input Section.
 */
function SocialInputSection( {
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
				placeholder={ __( "E.g. https://facebook.com/yoast", "wordpress-seo" ) }
				feedback={ {
					message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
					isVisible: errorFields.includes( "facebook_site" ),
					type: "error",
				} }
			/>
			<SocialInput
				className="yst-mt-4"
				label={ __( "X", "wordpress-seo" ) }
				id="social-input-twitter-url"
				value={ socialProfiles.twitterUsername }
				socialMedium="twitterUsername"
				onChange={ onChangeHandler }
				placeholder={ __( "E.g. https://x.com/yoast", "wordpress-seo" ) }
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
