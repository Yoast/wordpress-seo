import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";
import { useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";

/**
 * The confirmation modal shown when switching tabs while rows have unsaved inline edits. It offers to save the
 * edits, discard them, or stay on the current tab.
 *
 * @param {Object}   props             The props.
 * @param {boolean}  props.isOpen      Whether the modal is open.
 * @param {boolean}  [props.isSaving]  Whether a save is in flight; disables Save and Discard so the in-flight
 *                                     save can't be double-fired or discarded mid-flight.
 * @param {Function} [props.onSave]    Saves all edits and then switches tab (Save changes).
 * @param {Function} [props.onDiscard] Discards all edits and then switches tab (Continue without saving).
 * @param {Function} [props.onClose]   Closes the modal and stays on the current tab (Cancel / dismiss).
 *
 * @returns {JSX.Element} The modal.
 */
export const UnsavedChangesModal = ( { isOpen, isSaving = false, onSave = noop, onDiscard = noop, onClose = noop } ) => {
	const svgAriaProps = useSvgAria();
	const saveRef = useRef( null );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose } initialFocus={ saveRef }>
			<Modal.Panel className="yst-max-w-md" hasCloseButton={ false }>
				<div className="yst-flex yst-items-start yst-gap-4">
					<div className="yst-flex yst-flex-shrink-0 yst-items-center yst-justify-center yst-h-10 yst-w-10 yst-rounded-full yst-bg-red-100">
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-flex yst-flex-col yst-gap-2 yst-max-w-xs">
						<Modal.Title className="yst-text-lg yst-font-medium yst-text-slate-900">
							{ __( "Unsaved changes", "wordpress-seo" ) }
						</Modal.Title>
						<Modal.Description className="yst-text-sm yst-text-slate-600">
							{ __( "If you leave now, any changes you made will be lost. Would you like to save before continuing?", "wordpress-seo" ) }
						</Modal.Description>
					</div>
				</div>
				<div className="yst-flex yst-flex-col yst-gap-2 yst-mt-6">
					<Button ref={ saveRef } type="button" variant="primary" onClick={ onSave } disabled={ isSaving }>
						{ __( "Save changes", "wordpress-seo" ) }
					</Button>
					<Button type="button" variant="secondary" onClick={ onDiscard } disabled={ isSaving }>
						{ __( "Continue without saving", "wordpress-seo" ) }
					</Button>
					<Button type="button" variant="tertiary" onClick={ onClose }>
						{ __( "Cancel", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
