import { createPortal } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-previews";
import { registerStore, AsyncModeProvider } from "@wordpress/data";
import { noop } from "lodash";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @returns {React.Component} The social metadata collapsibles.
 */
const Social = () => {
	return createPortal(
		<AsyncModeProvider>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Facebook"
			>
				<Slot name="YoastFacebookPreview" />
				<SocialMetadataPreviewForm
					socialMediumName="Facebook"
					replacementVariables={ [] }
					recommendedReplacementVariables={ [] }
					description="Facebook"
					title="The facebook title"
					onTitleChange={ noop }
					onDescriptionChange={ noop }
					selectFileClick={ noop }
				/>
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Twitter"
			>
				<Slot name="YoastTwitterPreview" />
				<SocialMetadataPreviewForm
					socialMediumName="Twitter"
					replacementVariables={ [] }
					recommendedReplacementVariables={ [] }
					description="Twitter"
					title="The Twitter title"
					onTitleChange={ noop }
					onDescriptionChange={ noop }
					selectFileClick={ noop }
				/>
			</Collapsible>
		</AsyncModeProvider>,
		document.getElementById( "wpseo-section-social" ) );
};

registerStore( "yoast/social-metadata", {
	reducer: state => state,
} );

registerPlugin( "yoast-seo-social-metadata", {
	render: Social,
} );
