import { Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import styled from "styled-components";
import Modal, { defaultModalClassName } from "./Modal";

const StyledButton = styled.button`
	// Increase specificity to override WP rules.

	&& {
		display: flex;
		align-items: center;
	}

	.yoast-svg-icon {
		margin: 1px 7px 0 0;
		fill: currentColor;
	}
`;

const defaultLabels = {
	open: __( "Open", "wordpress-seo" ),
	heading: "",
	closeIconButton: __( "Close", "wordpress-seo" ),
	closeButton: "",
};

/**
 * The SeoAnalysisModal.
 *
 * @param {Object} props Component props.
 * @param {string} [props.openButtonIcon=""] The icon name for the open button.
 * @param {Object} props.labels The labels for the modal and buttons.
 * @param {string} [props.labels.open] The open button text.
 * @param {string} props.labels.modalAriaLabel The aria-label of the modal.
 * @param {string} [props.labels.heading] The modal heading.
 * @param {string} [props.labels.closeIconButton] The label of the close icon button.
 * @param {string} [props.labels.closeButton] The close button text.
 * @param {Object} [props.classes={}] The classes for the modal and buttons.
 * @param {string} [props.classes.openButton] The class name of the open button.
 * @param {string} [props.classes.closeIconButton] The class name of the close icon button.
 * @param {string} [props.classes.closeButton] The class name of the close button.
 * @param {string} [props.className=defaultModalClassName] The className for the modal.
 * @param {React.ReactNode} props.children The modal content.
 *
 * @returns {JSX.Element} The element.
 */
const SeoAnalysisModal = ( {
	openButtonIcon = "",
	labels,
	classes = {},
	className = defaultModalClassName,
	children,
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const modalLabels = Object.assign( {}, defaultLabels, labels );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	return (
		<Fragment>
			<StyledButton
				type="button"
				onClick={ openModal }
				className={ `${ classes.openButton } yoast-modal__button-open` }
			>
				{ openButtonIcon && <SvgIcon icon={ openButtonIcon } size="13px" /> }
				{ modalLabels.open }
			</StyledButton>
			{ isOpen &&
				<Modal
					onRequestClose={ closeModal }
					className={ className }
					title={ modalLabels.heading }
				>
					{ children }
				</Modal>
			}
		</Fragment>
	);
};

export default SeoAnalysisModal;
