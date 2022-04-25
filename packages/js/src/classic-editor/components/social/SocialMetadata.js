import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import MetaboxCollapsible from "../../../components/MetaboxCollapsible";
import FacebookContainer, { SEO_STORE_NAME } from "@yoast/seo-integration";
import TwitterContainer from "@yoast/seo-integration";
import FacebookWrapper from "../../../components/social/FacebookWrapper";
import TwitterWrapper from "../../../components/social/TwitterWrapper";
import { getSiteUrl } from "../../../redux/selectors";

const SocialMetadata = () => {
	const displayFacebook = window.wpseoScriptData.metabox.showSocial.facebook;
	const displayTwitter = window.wpseoScriptData.metabox.showSocial.twitter;
	const isPremium = window.wpseoScriptData.metabox.isPremium === "1";
	// Taking it from the old store, because we still haven't implemented the data for settings > social preview in the new store.
	const imageFallbackUrlFB = useSelect( select => select( "yoast-seo/editor" ).getImageFallback() );
	const imageUrlFB = useSelect( select => select( SEO_STORE_NAME ).selectFacebookImage() ).url;
	const siteUrl = getSiteUrl();

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
					onRemoveImageClick={}
					onLoad={}
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
					onRemoveImageClick={}
					onLoad={}
				/>
			</MetaboxCollapsible> }
		</Fragment>
	);
}

export default SocialMetadata;

