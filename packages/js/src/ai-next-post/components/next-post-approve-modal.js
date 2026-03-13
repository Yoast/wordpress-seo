import { Button, Modal, GradientSparklesIcon, Root } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * Get the content of the modal based on the props.
 *
 * @param {boolean} isEmptyCanvas Whether the post has content or not.
 * @param {boolean} isUpsell Whether the modal is shown as an upsell or not.
 * @returns {object} The content of the modal.
 */
const getModalContent = ( isEmptyCanvas, isUpsell ) => {
	const modalContent = {
		title: __( "Looking for inspiration?", "wordpress-seo" ),
		description: __( "Yoast identifies content gaps in your site structure and recommends topics that strengthen your topical authority.", "wordpress-seo" ),
		buttonLabel: __( "Get content suggestions", "wordpress-seo" ),
		buttonVariant: "ai-primary",
	};
	if ( ! isEmptyCanvas ) {
		modalContent.title = __( "Get content suggestions", "wordpress-seo" );
		modalContent.description = safeCreateInterpolateElement(
			sprintf(
			/* translators: %1$s and %2$s are opening and closing italic HTML tags respectively. */
				__( "Yoast will analyze your site and recommend topics. %1$sNote: Applying a content suggestion will replace your current blogpost content & metadata.%2$s", "wordpress-seo" ),
				"<i>",
				"</i>"
			),
			{
				i: <i />,
			} );
		modalContent.buttonLabel = __( "Get content suggestions", "wordpress-seo" );
	}
	if ( isUpsell ) {
		modalContent.buttonVariant = "upsell";
		/* translators: %s is the name of the premium product, Yoast SEO Premium. */
		modalContent.buttonLabel = __( "Unlock with %s", "wordpress-seo" );
	}
	return modalContent;
};


/**
 * The modal that is shown when the user clicks the "Get content suggestions" button in the NextPostTopBarButton or the NextPostInlineOptIn.
 *
 * @param {boolean} isOpen Whether the modal is open or not.
 * @param {function} onClose The function to call when the modal is closed.
 * @param {boolean} isEmptyCanvas Whether the post has content or not.
 * @param {boolean} isPremium Whether the user has a premium subscription or not.
 * @param {boolean} isUpsell Whether the modal is shown as an upsell or not.
 * @returns {JSX.Element} The Next Post Approved Modal.
 */
export const NextPostApproveModal = ( { isOpen, onClose, isEmptyCanvas, isPremium, isUpsell } ) => {
	const { title, description, buttonLabel, buttonVariant } = getModalContent( isEmptyCanvas, isUpsell );
	return <Root><Modal
		isOpen={ isOpen }
		onClose={ onClose }
	>
		<Modal.Panel className="yst-text-center yst-w-96">
			<div className="yst-w-12 yst-h-12 yst-rounded-full yst-bg-ai-100 yst-flex yst-items-center yst-justify-center yst-mx-auto yst-mb-4">
				<GradientSparklesIcon className="yst-h-6 yst-w-6" />
			</div>
			<h3 className="yst-text-slate-900 yst-font-medium yst-text-lg yst-mb-2">{ title }</h3>
			<p className="yst-text-slate-600 yst-text-sm yst-mb-6 yst-mx-6">{ description }</p>
			<Button variant={ buttonVariant } onClick={ onClose } className="yst-w-full">
				{ buttonLabel }
			</Button>
			{ ! isPremium && ! isUpsell && <span className="yst-text-sm yst-mt-2 yst-flex yst-items-center yst-gap-1 yst-justify-center yst-text-slate-500 yst-italic">
				<GradientSparklesIcon className="yst-h-3 yst-w-3" />
				{ __( "Using 1 spark.", "wordpress-seo" ) }</span> }
		</Modal.Panel>
	</Modal></Root>;
};
