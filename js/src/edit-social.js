import { Fragment, createPortal } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-previews";

const Social = () => {
	return createPortal(
		<Fragment>
			<Collapsible hasPadding={ true } hasSeparator={ true } title="Facebook">
				<Slot name="YoastFacebookPreview" />
				<SocialMetadataPreviewForm
					socialMediumName="Facebook"
					replacementVariables={[]}
					recommendedReplacementVariables={[]}
					description="Facebook"
					title="The facebook title"
					onTitleChange={ () => {} }
					onDescriptionChange={ () => {} }
					selectFileClick={ () => {} }
				/>
			</Collapsible>
			<Collapsible hasPadding={ true } hasSeparator={ true } title="Twitter">
				<Slot name="YoastTwitterPreview" />
				<SocialMetadataPreviewForm
					socialMediumName="Twitter"
					replacementVariables={[]}
					recommendedReplacementVariables={[]}
					description="Twitter"
					title="The Twitter title"
					onTitleChange={ () => {} }
					onDescriptionChange={ () => {} }
					selectFileClick={ () => {} }
				/>
			</Collapsible>
		</Fragment>,
		document.getElementById( "wpseo-section-social" ) );
};

registerPlugin( "yoast-seo-social-previews", {
	render: Social,
} );
