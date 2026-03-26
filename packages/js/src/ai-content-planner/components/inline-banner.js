import { __ } from "@wordpress/i18n";
import { Button, GradientSparklesIcon, Root, useSvgAria } from "@yoast/ui-library";
import { XIcon } from "@heroicons/react/solid";
import { OneSparkNote } from "./one-spark-note";

/**
 * The inline banner that is shown when the user has no content in a new post using the block editor.
 * This inline banner will be under the first paragraph block and will have a button to open the ContentSuggestions modal.
 *
 * @param {object}    props     The block props passed by Gutenberg.
 * @param {boolean}  props.isPremium Whether the user has a premium add-on activated.
 * @param {Function} props.onDismiss The function to call when the banner is dismissed.
 * @returns {JSX.Element} The inline banner with the button.
 */
export const InlineBanner = ( { isPremium, onDismiss } ) => {
	const ariaProps = useSvgAria();
	return <Root><div className="yst-z-50 yst-relative yst-p-4 yst-ai-gradient-border yst-rounded-lg yst-max-w-xl">
		<div className="yst-flex yst-items-center yst-gap-2 yst-mb-1">
			<GradientSparklesIcon className="yst-h-4 yst-w-4" { ...ariaProps } />
			<p className="yst-grow yst-text-slate-800 yst-font-medium"> { __( "Stuck on what to write next?", "wordpress-seo" ) }</p>
			<button type="button" onClick={ onDismiss }>
				<XIcon className="yst-h-6 yst-w-6 yst-text-slate-400" { ...ariaProps } />
				<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
			</button>
		</div>
		<p className="yst-text-sm yst-text-slate-600">
			{ __( "Let Yoast analyze your site and suggest high-impact topics that fill content gaps and strengthen your SEO strategy.", "wordpress-seo" ) }
		</p>
		<div className="yst-mt-1 yst-flex yst-justify-end yst-gap-2 yst-items-center">
			{ ! isPremium && <>
				<OneSparkNote />
				<span aria-hidden="true">·</span>
			</>  }
			<Button variant="ai-primary">
				{ __( "Get content suggestions", "wordpress-seo" ) }
			</Button>
		</div>
	</div></Root>;
};
