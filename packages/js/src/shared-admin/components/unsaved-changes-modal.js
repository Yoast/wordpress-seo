import { ExclamationIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";

/**
 * The unsaved changes modal.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} [onClose] The function to call when the modal is closed.
 * @param {function} [onDiscard] The function to call when the changes are discarded.
 * @param {string} title The title of the modal.
 * @param {string} description The description of the modal.
 * @param {string} dismissLabel The label for the dismiss button.
 * @param {string} discardLabel The label for the discard button.
 *
 * @returns {JSX.Element} The unsaved changes modal.
 */
export const UnsavedChangesModal = ( { isOpen, onClose = noop, onDiscard = noop, title, description, dismissLabel, discardLabel } ) => {
	const svgAriaProps = useSvgAria();

	return <Modal isOpen={ isOpen } onClose={ onClose }>
		<Modal.Panel closeButtonScreenReaderText={ __( "Close", "wordpress-seo" ) }>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ms-4 sm:yst-text-start">
					<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
						{ title }
					</Modal.Title>
					<Modal.Description className="yst-text-sm yst-text-slate-500">
						{ description }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
				<Button type="button" variant="error" onClick={ onDiscard } className="yst-block">
					{ discardLabel }
				</Button>
				<Button type="button" variant="secondary" onClick={ onClose } className="yst-block">
					{ dismissLabel }
				</Button>
			</div>
		</Modal.Panel>
	</Modal>;
};

UnsavedChangesModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	onDiscard: PropTypes.func,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	dismissLabel: PropTypes.string.isRequired,
	discardLabel: PropTypes.string.isRequired,
};
