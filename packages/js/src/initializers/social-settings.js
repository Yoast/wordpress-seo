import apiFetch from "@wordpress/api-fetch";
import { render, Fragment, useState, useCallback, useEffect } from "@wordpress/element";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";
import Portal from "../components/portals/Portal";
import { __ } from "@wordpress/i18n";
import { SocialInputSection } from "../first-time-configuration/tailwind-components/steps/social-profiles/social-input-section";

/**
 * Updates the social profiles in the database.
 *
 * @param {String} facebookUrl     The facebook url to save.
 * @param {String} twitterUsername The twitter username/url to save.
 * @param {Array}  otherSocialUrls The other urls array to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateSocialProfiles( facebookUrl, twitterUsername, otherSocialUrls ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		facebook_site: facebookUrl,
		twitter_site: twitterUsername,
		other_social_urls: otherSocialUrls,
		/* eslint-enable camelcase */
	};

	const response = await apiFetch( {
		path: "yoast/v1/configuration/social_profiles",
		method: "POST",
		data: socialProfiles,
	} );
	return await response.json;
}

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

	// Clear errorFields when values are edited.
	useEffect( () => {
		setErrorFields( [] );
	}, [ facebookValue, twitterValue, otherSocialUrls ] );

	const onSaveHandler = useCallback( () => {
		updateSocialProfiles( facebookValue, twitterValue, otherSocialUrls )
			.then( ( response ) => {
				if ( response.success === false ) {
					setErrorFields( response.failures );
					return Promise.reject( "There were errors saving social profiles" );
				}
				return response;
			} )
			.then( () => { setErrorFields( [] ) } )
			.catch(
				( e ) => {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					return false;
				}
			)
	}, [ updateSocialProfiles, setErrorFields, facebookValue, twitterValue, otherSocialUrls ] );

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
		<div
			className="yst-root yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-2xl yoast-social-profiles-input-fields"
		>
			<SocialInputSection
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
			<button
				className="yst-button yst-button--primary yst-mt-8"
				type="button"
				onClick={ onSaveHandler }
			>{ __( "Save changes", "wordpress-seo" ) }</button>
		</div>
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
