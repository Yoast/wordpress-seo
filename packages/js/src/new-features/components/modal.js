import { useCallback, useRef, useState } from "@wordpress/element";
import { Modal as PureModal } from "@yoast/ui-library";
import { Content } from ".";

/**
 * Modal containing information about new features added in the current release.
 *
 * @returns {JSX.Element} The modal.
 */
export const Modal = () => {
	const [ isModalOpen, setIsModalOpen ] = useState( true );
	const focusElementRef = useRef( null );

	const handleClose = useCallback( () => setIsModalOpen( false ), [] );

	return (
		<PureModal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ handleClose } initialFocus={ focusElementRef }>
			<PureModal.Panel className="yst-max-w-lg yst-p-0 yst-bg-gradient-to-b yst-from-[#EDD2E1] yst-rounded-3xl">
				<Content focusElementRef={ focusElementRef } />
			</PureModal.Panel>
		</PureModal>
	);
};
