import { __ } from "@wordpress/i18n";
import { Button, GradientSparklesIcon, Link, Root, useSvgAria } from "@yoast/ui-library";
import { ArrowNarrowRightIcon, XIcon } from "@heroicons/react/solid";
import { OneSparkNote } from "./one-spark-note";
import { OutboundLink } from "../../shared-admin/components";

/**
 * The inline banner that is shown when the user has no content in a new post using the block editor.
 * This inline banner will be under the first paragraph block and will have a button to open the ContentSuggestions modal.
 *
 * @param {object}    props     The block props passed by Gutenberg.
 * @param {boolean}  props.isPremium Whether the user has a premium add-on activated.
 * @param {Function} props.onDismiss The function to call when the banner is dismissed.
 * @param {Function} props.onClick   The function to call when the "Get content suggestions" button is clicked.
 * @param {string}  props.learnMoreLink The link to the learn more page about the AI Content Planner.
 * @returns {JSX.Element} The inline banner with the button.
 */
export const InlineBanner = ( { isPremium, onDismiss, onClick, learnMoreLink } ) => {
	const ariaProps = useSvgAria();
	return <Root><div role="group" aria-label={ __( "Content suggestions banner", "wordpress-seo" ) } className="yst-z-50 yst-relative yst-p-4 yst-ai-gradient-border yst-rounded-lg">
		<div className="yst-flex yst-items-center yst-gap-2 yst-mb-1">
			<GradientSparklesIcon className="yst-h-4 yst-w-4" { ...ariaProps } />
			<p className="yst-grow yst-text-slate-800 yst-font-medium"> { __( "Stuck on what to write next?", "wordpress-seo" ) }</p>
			<button type="button" onClick={ onDismiss } className="yst-modal__close-button">
				<XIcon className="yst-h-6 yst-w-6 yst-text-slate-400" { ...ariaProps } />
				<span className="yst-sr-only">{ __( "Close", "wordpress-seo" ) }</span>
			</button>
		</div>
		<p className="yst-text-sm yst-text-slate-600 yst-mb-1">
			{ __( "Let Yoast analyze your site and suggest high-impact topics that fill content gaps and strengthen your SEO strategy.", "wordpress-seo" ) }
		</p>
		<Link as={ OutboundLink } href={ learnMoreLink } variant="primary" className="yst-font-medium yst-no-underline">
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180 yst-inline yst-ms-1.5" />
		</Link>
		<div className="yst-mt-1 yst-flex yst-justify-end yst-gap-2 yst-items-center">
			{ ! isPremium && <>
				<OneSparkNote />
				<span aria-hidden="true">·</span>
			</>  }
			<Button variant="ai-primary" onClick={ onClick }>
				{ __( "Get content suggestions", "wordpress-seo" ) }
			</Button>
		</div>
	</div></Root>;
};
