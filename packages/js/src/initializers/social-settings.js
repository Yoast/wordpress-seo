import apiFetch from "@wordpress/api-fetch";
import { render, Fragment, useState, useCallback, useEffect } from "@wordpress/element";
import { CheckIcon } from "@heroicons/react/solid";
import ImageSelectPortal from "../components/portals/ImageSelectPortal";
import Portal from "../components/portals/Portal";
import { __, sprintf } from "@wordpress/i18n";
import { addLinkToString } from "../helpers/stringHelpers.js";
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
	const [ facebookValue, setFacebookValue ] = useState( window.wpseoScriptData.social.facebook_url );
	const [ twitterValue, setTwitterValue ] = useState( window.wpseoScriptData.social.twitter_username );
	const [ otherSocialUrls, setOtherSocialUrls ] = useState( window.wpseoScriptData.social.other_social_urls );
	const [ errorFields, setErrorFields ] = useState( [] );
	const [ isSaved, setIsSaved ] = useState( false );

	// Clear errorFields and isSaved when values are edited.
	useEffect( () => {
		setErrorFields( [] );
		setIsSaved( false );
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
			.then( () => {
				setErrorFields( [] );
				setIsSaved( true );
			} )
			.catch(
				( e ) => {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					return false;
				}
			);
	}, [ updateSocialProfiles, setErrorFields, setIsSaved, facebookValue, twitterValue, otherSocialUrls ] );

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
			className="yst-root yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-2xl yst-mt-6"
		>
			<h2 className="yst-text-lg yst-text-primary-500 yst-font-medium">{ __( "Organization's social profiles", "wordpress-seo" ) }</h2>
			<p className="yst-my-2 yst-text-gray-500">{ __( "Tell us if you have any other profiles on the web that belong to your organization. You can also add profiles from platforms like Instagram, YouTube, LinkedIn, Pinterest or Wikipedia.", "wordpress-seo" ) }</p>
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
			<div
				className="yst-flex yst-items-center yst-pt-8"
			>
				<button
					className="yst-button yst-button--primary"
					type="button"
					onClick={ onSaveHandler }
				>{ __( "Save changes", "wordpress-seo" ) }</button>
				{ isSaved && <span className="yst-inline-flex yst-items-center yst-text-lime-600 yst-relative yst-ml-6 yst-text-sm">
					<CheckIcon className={ "yst-w-5 yst-h-5 yst-text-lime-600 yst-mr-1" } aria-hidden="true" />
					{ __( "Saved!", "wordpress-seo" ) }
				</span> }
			</div>
			<p className="yst-mt-8 yst-text-gray-500">{
				addLinkToString(
					sprintf(
						/* translators: 1: link tag to the relevant WPSEO admin page; 2: link close tag. */
						__( "Your website is currently configured to represent an Organization. If you want your site to represent a Person, please select 'Person' in the 'Knowledge Graph & Schema.org' section of the %1$sSearch Appearance%2$s settings.", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					window.wpseoScriptData.search_appearance_link,
					"yoast-search-appearance-link"
				)
			}</p>
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
