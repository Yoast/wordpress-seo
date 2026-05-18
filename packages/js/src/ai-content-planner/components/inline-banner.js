import { __ } from "@wordpress/i18n";
import { Button, DropdownMenu, GradientSparklesIcon, Link, Root, useSvgAria } from "@yoast/ui-library";
import { ArrowNarrowRightIcon, TrashIcon, XIcon } from "@heroicons/react/solid";
import { OneSparkNote } from "./one-spark-note";
import { OutboundLink } from "../../shared-admin/components";

/**
 * The inline banner that is shown when the user has no content in a new post using the block editor.
 * This inline banner will be under the first paragraph block and will have a button to open the ContentSuggestions modal.
 *
 * @param {object}    props     The block props passed by Gutenberg.
 * @param {boolean}  props.isPremium Whether the user has a premium add-on activated.
 * @param {Function} props.onDismiss The function to call when the banner is dismissed for the current post.
 * @param {Function} props.onDismissPermanently The function to call when the banner is permanently dismissed for the current user.
 * @param {Function} props.onClick   The function to call when the "Get content suggestions" button is clicked.
 * @param {string}  props.learnMoreLink The link to the learn more page about the AI Content Planner.
 * @returns {JSX.Element} The inline banner with the button.
 */
export const InlineBanner = ( { isPremium, onDismiss, onDismissPermanently, onClick, learnMoreLink } ) => {
	const ariaProps = useSvgAria();
	return <Root><div role="group" aria-label={ __( "Content suggestions banner", "wordpress-seo" ) } className="yst-z-50 yst-relative yst-p-4 yst-ai-gradient-border yst-rounded-lg">
		<DropdownMenu as="span" className="yst-absolute yst-top-4 yst-end-4">
			<DropdownMenu.IconTrigger
				screenReaderTriggerLabel={ __( "Open banner options", "wordpress-seo" ) }
				className="yst-float-end"
			/>
			<DropdownMenu.List className="yst-mt-8 yst-w-56">
				<DropdownMenu.ButtonItem
					className="yst-text-slate-600 yst-border-b yst-border-slate-200 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4 yst-font-normal"
					onClick={ onDismiss }
				>
					<XIcon className="yst-w-4 yst-text-slate-400 yst-shrink-0" { ...ariaProps } />
					{ __( "Remove for this post", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
				<DropdownMenu.ButtonItem
					className="yst-text-red-500 yst-flex yst-py-2 yst-justify-start yst-gap-2 yst-px-4 yst-font-normal"
					onClick={ onDismissPermanently }
				>
					<TrashIcon className="yst-w-4 yst-shrink-0" { ...ariaProps } />
					{ __( "Remove for all posts", "wordpress-seo" ) }
				</DropdownMenu.ButtonItem>
			</DropdownMenu.List>
		</DropdownMenu>
		<div className="yst-flex yst-items-center yst-gap-2 yst-mb-1 yst-pe-8">
			<GradientSparklesIcon className="yst-h-4 yst-w-4" { ...ariaProps } />
			<p className="yst-grow yst-text-slate-800 yst-font-medium"> { __( "Stuck on what to write next?", "wordpress-seo" ) }</p>
		</div>
		<p className="yst-text-sm yst-text-slate-600 yst-mb-1 yst-max-w-xl">
			{ __( "Let Yoast AI Content Planner analyze your content and suggest high-impact topics that fill content gaps and strengthen your SEO strategy.", "wordpress-seo" ) }
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
