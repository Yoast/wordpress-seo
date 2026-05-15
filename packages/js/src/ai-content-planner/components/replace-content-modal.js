import ExclamationIcon from "@heroicons/react/outline/esm/ExclamationIcon";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";

/**
 * Confirmation panel shown before replacing post content with the generated outline.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {Function} onConfirm  The function to call when the user confirms replacing content.
 * @param {boolean}  isOpen    Whether the modal is open or not.
 * @param {Function} onClose   The function to call when the modal is closed.
 *
 * @returns {JSX.Element} The ReplaceContentModal component.
 */
export const ReplaceContentModal = ( { onConfirm, isOpen, onClose } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal isOpen={ isOpen } onClose={ onClose } className="yst-flex yst-items-center yst-justify-center">
			<Modal.Panel
				closeButtonScreenReaderText={ __( "Close replace content confirmation", "wordpress-seo" ) }
			>
				<div className="yst-flex yst-items-start">
					<div className="yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-10 yst-w-10 yst-rounded-full yst-bg-red-100">
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-ms-4 yst-text-start">
						<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
							{ __( "Replace existing content with this outline?", "wordpress-seo" ) }
						</Modal.Title>
						<Modal.Description className="yst-text-sm yst-text-slate-500">
							{ __( "This will replace everything in your post with the generated outline and content notes. You can revert this action by clicking the 'undo' button in the Gutenberg editor.", "wordpress-seo" ) }
						</Modal.Description>
					</div>
				</div>
				<div className="yst-flex yst-flex-row yst-justify-end yst-gap-3 yst-mt-6">
					<Button type="button" variant="secondary" onClick={ onClose }>
						{ __( "Cancel", "wordpress-seo" ) }
					</Button>
					<Button type="button" variant="error" onClick={ onConfirm }>
						{ __( "Replace content", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
