import { __ } from "@wordpress/i18n";
import { Button, GradientSparklesIcon, Root } from "@yoast/ui-library";
import { XIcon } from "@heroicons/react/solid";

/**
 * The inline banner that is shown when the user has no content in a new post using the block editor.
 * This inline banner will be under the first paragraph block and will have a button to open the ContentSuggestions modal.
 *
 * @param {function} onClick The function to call when the button is clicked.
 * @param {function} onClose The function to call when the close icon is clicked.
 * @returns {JSX.Element} The inline banner with the button.
 */
export const NextPostInlineBanner = ( { onClick, onClose } ) => {
	return <Root><div className="yst-p-4 yst-ai-gradient-border yst-rounded-lg">
		<div className="yst-flex yst-items-center yst-gap-2 yst-mb-1">
			<GradientSparklesIcon className="yst-h-4 yst-w-4" />
			<p className="yst-grow yst-text-slate-800 yst-font-medium"> { __( "Stuck on what to write next?", "wordpress-seo" ) }</p>
			<button onClick={ onClose }>
				<XIcon className="yst-h-6 yst-w-6 yst-text-slate-400" />
				<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
			</button>
		</div>
		<p>
			{ __( "Let Yoast analyze your site and suggest high-impact topics that fill content gaps and strengthen your SEO strategy.", "wordpress-seo" ) }
		</p>
		<div className="yst-mt-1 yst-flex yst-justify-end">
			<Button variant="ai-primary" onClick={ onClick }>
				{ __( "Get content suggestions", "wordpress-seo" ) }
			</Button>
		</div>
	</div></Root>;
};
