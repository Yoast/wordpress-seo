import { ExclamationIcon } from "@heroicons/react/outline";
import { Button, Modal } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/* eslint-disable react/prop-types */
export const DeleteModal = ( {
	isOpen,
	onClose,
	onConfirm,
	isLoading,
	redirectOrigin,
	focusRef,
} ) => (
	<Modal onClose={ onClose } position="center" isOpen={ isOpen } initialFocus={ focusRef }>
		<Modal.Panel hasCloseButton={ true } ref={ focusRef }>
			<div className="yst-flex yst-items-start yst-gap-4 yst-pb-8">
				<div className="yst-py-2 yst-px-2 yst-bg-red-100 yst-rounded-full">
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" />
				</div>
				<div className="yst-flex yst-flex-col">
					<Modal.Title as="h2" className="yst-text-lg">
						{ __( "Delete", "wordpress-seo" ) }
					</Modal.Title>
					<Modal.Description className="yst-mt-2 yst-text-sm yst-text-slate-600">
						{ __( "Are you sure you want to delete redirect", "wordpress-seo" ) } { ` ${redirectOrigin} ?` }
					</Modal.Description>
				</div>
			</div>
			<div className="yst-flex yst-justify-end yst-gap-3 yst-w-full yst-mt-8">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Cancel", "wordpress-seo" ) }
				</Button>
				<Button variant="error" onClick={ onConfirm } isLoading={ isLoading }>
					{ __( "Delete", "wordpress-seo" ) }
				</Button>
			</div>
		</Modal.Panel>
	</Modal>
);
