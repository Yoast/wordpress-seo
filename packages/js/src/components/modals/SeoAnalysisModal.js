import { Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import PropTypes from "prop-types";
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
 * @param {string} [openButtonIcon=""] The icon name for the open button.
 * @param {Object} labels The labels for the modal and buttons.
 * @param {Object} [classes={}] The classes for the modal and buttons.
 * @param {string} [className=defaultModalClassName] The className for the modal.
 * @param {React.ReactNode} children The modal content.
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

SeoAnalysisModal.propTypes = {
	openButtonIcon: PropTypes.string,
	labels: PropTypes.shape( {
		open: PropTypes.string,
		modalAriaLabel: PropTypes.string.isRequired,
		heading: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ).isRequired,
	classes: PropTypes.shape( {
		openButton: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ),
	className: PropTypes.string,
	children: PropTypes.any.isRequired,
};

export default SeoAnalysisModal;
