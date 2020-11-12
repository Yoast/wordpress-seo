import Modal, { defaultModalClassName } from "./Modal";
import { useState, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";

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
 * The SeoAnalyssModal.
 *
 * @param {object} props Functional Component props.
 *
 * @returns {*} The SeoAnalysisModal.
 */
const SeoAnalysisModal = ( props ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const modalLabels = Object.assign( {}, defaultLabels, props.labels );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	return (
		<Fragment>
			<StyledButton
				type="button"
				onClick={ openModal }
				className={ `${ props.classes.openButton } yoast-modal__button-open` }
			>
				{ props.openButtonIcon && <SvgIcon icon={ props.openButtonIcon } size="13px" /> }
				{ modalLabels.open }
			</StyledButton>
			{ isOpen &&
				<Modal
					onRequestClose={ closeModal }
					className={ props.className }
					title={ modalLabels.heading }
				>
					{ props.children }
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

SeoAnalysisModal.defaultProps = {
	className: defaultModalClassName,
	openButtonIcon: "",
	classes: {},
};

export default SeoAnalysisModal;
