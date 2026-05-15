import { Button, Modal, GradientSparklesIcon, Link, useSvgAria } from "@yoast/ui-library";
import ArrowNarrowRightIcon from "@heroicons/react/solid/esm/ArrowNarrowRightIcon";
import LockOpenIcon from "@heroicons/react/outline/esm/LockOpenIcon";

import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { OutboundLink } from "../../shared-admin/components";
import { OneSparkNote } from "./one-spark-note";

/**
 * Get the content of the modal based on whether the canvas is empty or not.
 *
 * @param {boolean} isEmptyPost Whether the post has content or not.
 * @param {boolean} isUpsell Whether the usage count limit has been reached.
 * @returns {Object} The content of the modal.
 */
const getModalContent = ( isEmptyPost, isUpsell ) => {
	if ( isUpsell ) {
		return {
			title: __( "You're out of free sparks", "wordpress-seo" ),
			description: __( "Upgrade to keep finding content gaps, generating AI-powered titles and meta descriptions, and giving your content the best chance of being found.", "wordpress-seo" ),
		};
	}

	if ( isEmptyPost ) {
		return {
			title: __( "Looking for inspiration?", "wordpress-seo" ),
			description: __( "The Yoast AI Content Planner identifies content gaps in your site structure and recommends topics that strengthen your topical authority.", "wordpress-seo" ),
		};
	}

	return {
		title: __( "Get content suggestions", "wordpress-seo" ),
		description: safeCreateInterpolateElement(
			sprintf(
			/* translators: %1$s and %4$s are opening and closing paragraph HTML tags respectively.
			   %2$s and %3$s are opening and closing italic HTML tags respectively. */
				__( "The Yoast AI Content Planner will analyze your site and recommend topics.%1$s%2$sNote: Applying a content suggestion will replace your current blogpost content & metadata.%3$s%4$s", "wordpress-seo" ),
				"<p>",
				"<i>",
				"</i>",
				"</p>"
			),
			{
				i: <i />,
				p: <p className="yst-mt-4" />,
			} ),
	};
};


/**
 * The modal that is shown when the user clicks the "Get content suggestions" button.
 *
 * @param {boolean} isEmptyPost Whether the post has content or not.
 * @param {boolean} isPremium Whether the user has a premium subscription or not.
 * @param {boolean} isUpsell Whether the modal is shown as an upsell or not.
 * @param {Function} onClick The function to call when the user clicks the "Get content suggestions" button.
 * @param {string} upsellLink The link to the upsell page.
 * @param {string} learnMoreLink The link to the learn more page.
 * @param {boolean} isOpen Whether the modal is open or not.
 * @param {Function} onClose The function to call when the modal is closed.
 * @returns {JSX.Element} The ApproveModal content.
 */
export const ApproveModal = ( { isEmptyPost, isPremium, isUpsell, onClick, upsellLink, learnMoreLink, isOpen, onClose } ) => {
	const { title, description } = getModalContent( isEmptyPost, isUpsell );
	const svgAriaProps = useSvgAria();

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<Modal.Panel className="yst-text-center yst-w-96" closeButtonScreenReaderText={ __( "Close modal", "wordpress-seo" ) }>
				<div className="yst-w-12 yst-h-12 yst-rounded-full yst-bg-ai-100 yst-flex yst-items-center yst-justify-center yst-mx-auto yst-mb-4">
					<GradientSparklesIcon className="yst-h-6 yst-w-6" { ...svgAriaProps } />
				</div>
				<Modal.Title className="yst-text-slate-900 yst-font-medium yst-text-lg yst-mb-2">{ title }</Modal.Title>
				<Modal.Description as="div" className="yst-text-slate-600 yst-text-sm yst-mb-6 yst-mx-10">{ description }</Modal.Description>
				{ ! isPremium && ! isUpsell && <OneSparkNote className="yst-mb-2" /> }
				{ isUpsell ? <Button
					variant="upsell" as="a" href={ upsellLink } target="_blank" className="yst-w-full" rel="noopener noreferrer"
				>
					<LockOpenIcon className="yst-w-4 yst-h-4 yst-me-2 yst-shrink-0" { ...svgAriaProps } />
					{ sprintf(
					/* translators: %s is the name of the premium product, Yoast SEO Premium. */
						__( "Unlock with %s", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
					<span className="yst-sr-only">{
					/* translators: Hidden accessibility text. */
						__( "(Opens in a new browser tab)", "wordpress-seo" ) }
					</span>
				</Button>
					: <Button onClick={ onClick } variant="ai-primary" className="yst-w-full"> { __( "Get content suggestions", "wordpress-seo" ) } </Button> }
				<div className="yst-mt-2 yst-text-sm">
					<Link as={ OutboundLink } href={ learnMoreLink } variant="primary" className="yst-inline yst-no-underline yst-font-medium">
						{ __( "Learn more", "wordpress-seo" ) }
						<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180 yst-inline yst-ms-1.5" />
					</Link>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
