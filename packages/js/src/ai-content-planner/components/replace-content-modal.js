import { ExclamationIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";

/**
 * Confirmation modal shown before replacing post content with the generated outline.
 *
 * @param {boolean}  isOpen     Whether the modal is open.
 * @param {Function} onClose    The function to call when the modal is closed or cancelled.
 * @param {Function} onConfirm  The function to call when the user confirms replacing content.
 *
 * @returns {JSX.Element} The ReplaceContentModal component.
 */
export const ReplaceContentModal = ( { isOpen, onClose, onConfirm } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<Modal.Panel closeButtonScreenReaderText={ __( "Close", "wordpress-seo" ) }>
				<div className="sm:yst-flex sm:yst-items-start">
					<div className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10">
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ms-4 sm:yst-text-start">
						<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
							{ __( "Replace existing content with this outline?", "wordpress-seo" ) }
						</Modal.Title>
						<Modal.Description className="yst-text-sm yst-text-slate-500">
							{ __( "This will replace everything in your post with the generated outline and content notes. You can revert this action by clicking the 'undo' button in the Gutenberg editor.", "wordpress-seo" ) }
						</Modal.Description>
					</div>
				</div>
				<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
					<Button type="button" variant="error" onClick={ onConfirm }>
						{ __( "Replace content", "wordpress-seo" ) }
					</Button>
					<Button type="button" variant="secondary" onClick={ onClose }>
						{ __( "Cancel", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
