import { ExclamationIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";

/**
 * The Schema disable confirmation modal.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} [onClose] The function to call when the modal is closed.
 * @param {function} [onConfirm] The function to call when the user confirms disabling.
 *
 * @returns {JSX.Element} The disable schema framework confirmation modal.
 */
export const SchemaDisableConfirmationModal = ( { isOpen, onClose = noop, onConfirm = noop } ) => {
	const svgAriaProps = useSvgAria();

	return <Modal isOpen={ isOpen } onClose={ onClose }>
		<Modal.Panel className="yst-max-w-lg">
			<div className="yst-flex yst-flex-col yst-items-center sm:yst-flex-row sm:yst-items-start sm:yst-columns-2 yst-gap-4">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
				</div>
				<div className="yst-text-center sm:yst-text-left">
					<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
						{ __( "Disabling Yoast Schema Framework", "wordpress-seo" ) }
					</Modal.Title>
					<Modal.Description className="yst-text-sm yst-text-slate-500">
						{ __( "Disabling the Schema Framework may cause issues with how your content appears in search results. Are you sure you want to disable the Schema graph?", "wordpress-seo" ) }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
				<Button type="button" variant="error" onClick={ onConfirm } className="yst-w-full sm:yst-w-auto">
					{ __( "Turn off Schema Framework", "wordpress-seo" ) }
				</Button>
				<Button type="button" variant="secondary" onClick={ onClose } className="yst-w-full sm:yst-w-auto">
					{ __( "Cancel", "wordpress-seo" ) }
				</Button>
			</div>
		</Modal.Panel>
	</Modal>;
};

