import { SnippetEditor } from "@yoast/search-metadata-previews";
import { GooglePreviewContainer } from "@yoast/seo-integration";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";

import { EDITOR_STORE_NAME } from "../editor-store";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import firstImageUrlInContent from "../../helpers/firstImageUrlInContent";

/**
 * The Google preview component.
 *
 * @returns {JSX.Element} The Google preview component.
 */
const GooglePreview = () => {
	const shoppingData = useSelect( select => select( EDITOR_STORE_NAME ).getShoppingData() );
	const siteIconUrl = useSelect( select => select( EDITOR_STORE_NAME ).getSiteIconUrlFromSettings() );
	const analysisType = useSelect( select => select( SEO_STORE_NAME ).selectAnalysisType() );
	const featuredImage = useSelect( select => select( SEO_STORE_NAME ).selectFeaturedImage() );
	const content = useSelect( select => select( SEO_STORE_NAME ).selectContent() );

	const featuredImageUrl = featuredImage.url || firstImageUrlInContent( content );

	return (
		<MetaboxCollapsible
			id={ "yoast-snippet-editor-metabox" }
			title={ __( "Google preview", "wordpress-seo" ) }
			initialIsOpen={ true }
		>
			<GooglePreviewContainer
				as={ SnippetEditor }
				shoppingData={ shoppingData }
				faviconSrc={ siteIconUrl }
				mobileImageSrc={ featuredImageUrl }
				isTaxonomy={ analysisType === "term" }
				showCloseButton={ false }
				hasPaperStyle={ false }
			/>
		</MetaboxCollapsible>
	);
};

export default GooglePreview;
