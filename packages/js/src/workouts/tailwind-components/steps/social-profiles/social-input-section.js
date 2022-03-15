import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";

import FieldArray from "../../base/field-array";
import SocialInput from "./social-input";

/* eslint-disable complexity */
/**
 * A wrapper that combines all the SocialInputs. Intended for use in the configuration workout.
 *
 * @param {Object} props The props object.
 * @param {function} dispatch                     A dispatch function to communicate with the Stepper store.
 * @param {Object}   state                        The Stepper store.
 * @returns {WPElement} The SocialInputSection.
 */
export default function SocialInputSection( { socialProfiles, errorFields, dispatch, isDisabled } ) {
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

			<FieldArray
				fieldType={ SocialInput }
				items={ socialProfiles.otherUrls }
				onAddProfile={ onAddProfileHandler }
				onRemoveProfile={ onRemoveProfileHandler }
				onChangeProfile={ onChangeOthersHandler }
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
