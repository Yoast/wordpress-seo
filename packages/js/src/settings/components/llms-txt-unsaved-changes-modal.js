import { ExclamationIcon } from "@heroicons/react/outline";
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
 *
 * @returns {JSX.Element} The unsaved changes modal.
 */
export const LlmsTxtUnsavedChangesModal = ( { isOpen, onClose = noop, onDiscard = noop, title, description, dismissLabel } ) => {
	const svgAriaProps = useSvgAria();

	return <Modal isOpen={ isOpen } onClose={ onClose }>
		<Modal.Panel className="yst-max-w-sm">
			<div className="yst-flex yst-flex-col yst-items-center yst-gap-1">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
				</div>
				<div className="yst-mt-3 yst-text-center">
					<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
						{ title }
					</Modal.Title>
					<Modal.Description className="yst-text-sm yst-text-slate-500">
						{ description }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
				<Button type="button" variant="primary" onClick={ onDiscard } className="yst-grow">
					{ dismissLabel }
				</Button>
			</div>
		</Modal.Panel>
	</Modal>;
};

LlmsTxtUnsavedChangesModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	onDiscard: PropTypes.func,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	dismissLabel: PropTypes.string.isRequired,
};
