import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import MetaboxCollapsible from "../../../components/MetaboxCollapsible";
import FacebookContainer from "@yoast/seo-integration";
import TwitterContainer from "@yoast/seo-integration";
import FacebookWrapper from "../../../components/social/FacebookWrapper";
import TwitterWrapper from "../../../components/social/TwitterWrapper";
import { getImageFallback } from "../../../redux/selectors";

const SocialMetadata = () => {
	const displayFacebook = window.wpseoScriptData.metabox.showSocial.facebook;
	const displayTwitter = window.wpseoScriptData.metabox.showSocial.twitter;
	const isPremium = window.wpseoScriptData.metabox.isPremium === "1" ? true : false;
	const imageFallbackUrlFB = useSelect( select => select( "yoast-seo/editor" ).getImageFallback() );
	const siteUrl = useSelect( select => select( "yoast-seo/editor" ).getSiteUrl() );
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
					descriptionPreviewFallback={}
					titlePreviewFallback={}
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
					imageFallbackUrl={}
					descriptionPreviewFallback={}
					titlePreviewFallback={}
					siteUrl={}
					onRemoveImageClick={}
					onLoad={}
				/>
			</MetaboxCollapsible> }
		</Fragment>
	);
}

export default SocialMetadata;

