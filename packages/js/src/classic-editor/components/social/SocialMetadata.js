import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { dispatch, useDispatch, useSelect } from "@wordpress/data";
import MetaboxCollapsible from "../../../components/MetaboxCollapsible";
import { FacebookContainer, TwitterContainer, SEO_STORE_NAME } from "@yoast/seo-integration";
import FacebookWrapper from "../../../components/social/FacebookWrapper";
import TwitterWrapper from "../../../components/social/TwitterWrapper";
import { openMedia, prepareFacebookPreviewImage, prepareTwitterPreviewImage } from "../../../helpers/selectMedia";
import { getSiteUrl } from "../../../redux/selectors";


/**
 * Lazy function to open the Twitter media instance.
 *
 * @returns {void}
 */
const selectTwitterMedia = function() {
	openMedia( ( image ) => dispatch( SEO_STORE_NAME ).updateTwitterImage( prepareTwitterPreviewImage( image ) ) );
};

/**
 * Lazy function to open the Facebook media instance.
 *
 * @returns {void}
 */
const selectFacebookMedia = function() {
	openMedia( ( image ) => dispatch( SEO_STORE_NAME ).updateFacebookImage( prepareFacebookPreviewImage( image ) ) );
};

/**
 * The Social Metadata component.
 *
 * @returns {JSX.Element} The Social Metadata component.
 */
const SocialMetadata = () => {
	const displayFacebook = window.wpseoScriptData.metabox.showSocial.facebook;
	const displayTwitter = window.wpseoScriptData.metabox.showSocial.twitter;
	const isPremium = window.wpseoScriptData.metabox.isPremium === "1";
	// Taking it from the old store, because we still haven't implemented the data for settings > social preview in the new store.
	const imageFallbackUrlFB = useSelect( select => select( "yoast-seo/editor" ).getImageFallback() );
	const imageUrlFB = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImage() ).url;
	const siteUrl = getSiteUrl();

	const { updateFacebookData,
		clearFacebookPreviewImage,
		updateTwitterData,
		clearTwitterPreviewImage,
	} = useDispatch( SEO_STORE_NAME );

	return (
		<Fragment>
			{ displayFacebook && <MetaboxCollapsible
				hasSeparator={ false }
				/* Translators: %s expands to Facebook. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Facebook" ) }
				initialIsOpen={ true }
			>
				<FacebookContainer
					as={ FacebookWrapper }
					isPremium={ isPremium }
					imageFallbackUrl={ imageFallbackUrlFB }
					siteUrl={ siteUrl }
					onRemoveImageClick={ clearFacebookPreviewImage }
					onLoad={ updateFacebookData }
					onSelectImageClick={ selectFacebookMedia }
					location={ "" }
				/>
			</MetaboxCollapsible> }
			{ displayTwitter && <MetaboxCollapsible
				/* Translators: %s expands to Twitter. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Twitter" ) }
				// If facebook is NOT enabled, Twitter collapsible should NOT have a separator.
				hasSeparator={ displayFacebook }
				initialIsOpen={ true }
			>
				<TwitterContainer
					as={ TwitterWrapper }
					isPremium={ isPremium }
					imageFallbackUrl={ imageUrlFB || imageFallbackUrlFB }
					siteUrl={ siteUrl }
					onRemoveImageClick={ clearTwitterPreviewImage }
					onLoad={ updateTwitterData }
					onSelectImageClick={ selectTwitterMedia }
					location={ "" }
				/>
			</MetaboxCollapsible> }
		</Fragment>
	);
};

export default SocialMetadata;

