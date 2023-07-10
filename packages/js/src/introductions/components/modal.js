import { useCallback, useRef, useState } from "@wordpress/element";
import { Modal as PureModal } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * Modal containing information about new features added in the current release.
 *
 * @params {JSX.node} children The children.
 * @returns {JSX.Element} The modal.
 */
export const Modal = ( { children } ) => {
	const [ isModalOpen, setIsModalOpen ] = useState( true );
	const initialFocusRef = useRef( null );

	const handleClose = useCallback( () => setIsModalOpen( false ), [] );

	return (
		<PureModal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ handleClose } initialFocus={ initialFocusRef }>
			<PureModal.Panel className="yst-max-w-lg yst-p-0 yst-bg-gradient-to-b yst-from-[#EDD2E1] yst-rounded-3xl">
				{ children }
			</PureModal.Panel>
		</PureModal>
	);
};
Modal.propTypes = {
	children: PropTypes.node.isRequired,
};
