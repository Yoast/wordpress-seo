import { render, Fragment, useState, useCallback } from "@wordpress/element";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";
import Portal from "../components/portals/Portal";
import { __ } from "@wordpress/i18n";
import { SocialInputSection } from "../first-time-configuration/tailwind-components/steps/social-profiles/social-input-section";

/**
 * Wraps the SocialInputSection to provide some state.
 *
 * @returns {WPElement} The SocialProfilesWrapper
 */
function SocialProfilesWrapper() {
	const [ facebookValue, setFacebookValue ] = useState( "" );
	const [ twitterValue, setTwitterValue ] = useState( "" );
	const [ otherSocialUrls, setOtherSocialUrls ] = useState( [] );
	const [ errorFields, setErrorFields ] = useState( [] );

	const onChangeHandler = useCallback( ( value, socialMedium ) => {
		if ( socialMedium === "facebookUrl" ) {
			setFacebookValue( value );
		} else if ( socialMedium === "twitterUsername" ) {
			setTwitterValue( value );
		}
	}, [ setFacebookValue, setTwitterValue ] );

	const onChangeOthersHandler = useCallback( ( value, index ) => {
		setOtherSocialUrls( prevState => {
			const nextState = [ ...prevState ];
			nextState[ index ] = value;
			return nextState;
		} );
	}, [ setOtherSocialUrls ] );

	const onRemoveProfileHandler = useCallback( ( index ) => {
		setOtherSocialUrls( prevState => prevState.filter( ( _, prevStateIndex ) => prevStateIndex !== index ) );
	}, [ setOtherSocialUrls ] );

	const onAddProfileHandler = useCallback( () => {
		setOtherSocialUrls( prevState => [ ...prevState, "" ] );
	}, [ setOtherSocialUrls ] );
	return (
		<SocialInputSection
			className="yst-root yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-2xl yoast-social-profiles-input-fields"
			socialProfiles={ {
				facebookUrl: facebookValue,
				twitterUsername: twitterValue,
				otherSocialUrls: otherSocialUrls,
			} }
			onChangeHandler={ onChangeHandler }
			onRemoveProfileHandler={ onRemoveProfileHandler }
			onChangeOthersHandler={ onChangeOthersHandler }
			onAddProfileHandler={ onAddProfileHandler }
			errorFields={ errorFields }
		/>
	);
}

/**
 * @summary Initializes the search appearance settings script.
 * @returns {void}
 */
export default function initSocialSettings() {
	const element = document.createElement( "div" );
	document.body.appendChild( element );

	render(
		<Fragment>
			<ImageSelectPortal
				label={ __( "Image", "wordpress-seo" ) }
				hasPreview={ true }
				target="yoast-og-default-image-select"
				hiddenField="og_default_image"
				hiddenFieldImageId="og_default_image_id"
				selectImageButtonId="yoast-og-default-image-select-button"
				replaceImageButtonId="yoast-og-default-image-replace-button"
				removeImageButtonId="yoast-og-default-image-remove-button"
				hasImageValidation={ true }
			/>
			<Portal
				target="yoast-social-profiles"
			>
				<SocialProfilesWrapper />
			</Portal>
		</Fragment>,
		element
	);
}
