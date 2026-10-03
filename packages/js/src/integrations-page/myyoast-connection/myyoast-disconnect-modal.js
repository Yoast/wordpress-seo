import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import { noop } from "lodash";

/**
 * Confirm modal for disconnecting the site from MyYoast.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {function} [props.onClose] Cancel handler. Defaults to a no-op.
 * @param {function} [props.onConfirm] Confirm handler. Defaults to a no-op.
 * @returns {JSX.Element} The modal element.
 */
export const MyyoastConnectionDisconnectModal = ( {
	isOpen,
	onClose = noop,
	onConfirm = noop,
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<Modal.Panel className="yst-max-w-lg">
				<div className="yst-flex yst-flex-col yst-items-center sm:yst-flex-row sm:yst-items-start sm:yst-columns-2 yst-gap-4">
					<div className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0">
						<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" { ...svgAriaProps } />
					</div>
					<div className="yst-text-center sm:yst-text-left yst-flex-1">
						<Modal.Title className="yst-text-lg yst-leading-6 yst-font-medium yst-text-slate-900 yst-mb-3">
							{ sprintf(
								/* translators: %1$s expands to MyYoast. */
								__( "Disconnect this site from %1$s?", "wordpress-seo" ),
								"MyYoast"
							) }
						</Modal.Title>
						<Modal.Description className="yst-text-sm yst-text-slate-500">
							{ sprintf(
								/* translators: %1$s expands to MyYoast. */
								__( "All connected users will be signed out and the site stops working with %1$s until you connect it again.", "wordpress-seo" ),
								"MyYoast"
							) }
						</Modal.Description>
					</div>
				</div>
				<div className="yst-flex yst-flex-col sm:yst-flex-row-reverse yst-gap-3 yst-mt-6">
					<Button
						type="button"
						variant="error"
						onClick={ onConfirm }
						className="yst-w-full sm:yst-w-auto"
					>
						{ __( "Disconnect", "wordpress-seo" ) }
					</Button>
					<Button type="button" variant="secondary" onClick={ onClose } className="yst-w-full sm:yst-w-auto">
						{ __( "Cancel", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal>
	);
};
