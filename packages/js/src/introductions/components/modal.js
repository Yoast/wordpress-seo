import { useCallback, useRef, useState } from "@wordpress/element";
import { Modal as PureModal } from "@yoast/ui-library";

/**
 * Modal containing information about new features added in the current release.
 *
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} props.children The children.
 * @param {string} [props.maxWidth="yst-max-w-lg"] The max-width class for the modal panel.
 *
 * @returns {JSX.Element} The modal.
 */
export const Modal = ( { children, maxWidth = "yst-max-w-lg" } ) => {
	const [ isModalOpen, setIsModalOpen ] = useState( true );
	const initialFocusRef = useRef( null );

	const handleClose = useCallback( () => setIsModalOpen( false ), [] );

	// To scroll the whole modal vertically there is the calculated height, it takes the modal padding into account (which has breakpoints).
	return (
		<PureModal
			className="yst-introduction-modal yst-h-[calc(100vh - 1rem)] sm:yst-h-[calc(100vh - 2rem)] md:yst-h-[calc(100vh - 5rem)]) yst-overflow-y-auto"
			isOpen={ isModalOpen }
			onClose={ handleClose }
			initialFocus={ initialFocusRef }
		>
			<PureModal.Panel className={ `${maxWidth} yst-p-0 yst-rounded-3xl` }>
				{ children }
			</PureModal.Panel>
		</PureModal>
	);
};
