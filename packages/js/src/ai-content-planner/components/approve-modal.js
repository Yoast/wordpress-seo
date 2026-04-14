import { Button, Modal, GradientSparklesIcon, useSvgAria } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { OneSparkNote } from "./one-spark-note";
/**
 * Get the content of the modal based on whether the canvas is empty or not.
 *
 * @param {boolean} isEmptyPost Whether the post has content or not.
 * @returns {object} The content of the modal.
 */
const getModalContent = ( isEmptyPost ) => {
	if ( isEmptyPost ) {
		return {
			title: __( "Looking for inspiration?", "wordpress-seo" ),
			description: __( "Yoast identifies content gaps in your site structure and recommends topics that strengthen your topical authority.", "wordpress-seo" ),
		};
	}

	return {
		title: __( "Get content suggestions", "wordpress-seo" ),
		description: safeCreateInterpolateElement(
			sprintf(
			/* translators: %1$s and %2$s are opening and closing italic HTML tags respectively. */
				__( "Yoast will analyze your site and recommend topics. %1$sNote: Applying a content suggestion will replace your current blogpost content & metadata.%2$s", "wordpress-seo" ),
				"<i>",
				"</i>"
			),
			{
				i: <i />,
			} ),
	};
};

/**
 * The modal that is shown when the user clicks the "Get content suggestions" button.
 *
 * @param {boolean} isEmptyPost Whether the post has content or not.
 * @param {boolean} isPremium Whether the user has a premium subscription or not.
 * @param {boolean} isUpsell Whether the modal is shown as an upsell or not.
 * @param {function} onClick The function to call when the user clicks the "Get content suggestions" button.
 * @param {string} upsellLink The link to the upsell page.
 * @returns {JSX.Element} The ApproveModal content.
 */
export const ApproveModal = ( { isEmptyPost, isPremium, isUpsell, onClick, upsellLink } ) => {
	const { title, description } = getModalContent( isEmptyPost );
	const svgAriaProps = useSvgAria();

	return (
		<Modal.Panel className="yst-text-center yst-w-96" closeButtonScreenReaderText={ __( "Close modal", "wordpress-seo" ) }>
			<div className="yst-w-12 yst-h-12 yst-rounded-full yst-bg-ai-100 yst-flex yst-items-center yst-justify-center yst-mx-auto yst-mb-4">
				<GradientSparklesIcon className="yst-h-6 yst-w-6" { ...svgAriaProps } />
			</div>
			<Modal.Title className="yst-text-slate-900 yst-font-medium yst-text-lg yst-mb-2">{ title }</Modal.Title>
			<Modal.Description className="yst-text-slate-600 yst-text-sm yst-mb-6 yst-mx-6">{ description }</Modal.Description>
			{ isUpsell ? <Button
				variant="upsell" as="a" href={ upsellLink } target="_blank" className="yst-w-full" rel="noopener noreferrer"
			>
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
			{ ! isPremium && ! isUpsell && <OneSparkNote className="yst-mt-2" /> }
		</Modal.Panel>
	);
};
