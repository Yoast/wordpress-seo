/* External dependencies */
import { ChartBarIcon } from "@heroicons/react/solid";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library/src";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";
import { Collapsible } from "@yoast/components";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import { isCloseEvent } from "./modals/editorModals/EditorModal.js";
import SidebarButton from "./SidebarButton";
import WincherSEOPerformance from "../containers/WincherSEOPerformance";


const StyledHeroIcon = styled( ChartBarIcon )`
	width: 18px;
	height: 18px;
	margin: 3px;
`;

const MetaboxModalButton = styled( Collapsible )`
	h2 > button {
		padding-left: 24px;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}
`;

/**
 * Handles the click event on the "Track SEO performance" button.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void}
 */
export function openModal( props ) {
	const { keyphrases, onNoKeyphraseSet, onOpen, location } = props;

	if ( ! keyphrases.length ) {
		// This is fragile, should replace with a real React ref.
		let input = document.querySelector( "#focus-keyword-input-metabox" );

		// In elementor we use input-sidebar
		if ( ! input ) {
			input = document.querySelector( "#focus-keyword-input-sidebar" );
		}
		input.focus();
		onNoKeyphraseSet();

		return;
	}

	onOpen( location );
}

/**
 * Handles the close event for the modal.
 *
 * @param {Object} props The props to use.
 * @param {Event} event The event passed to the closeModal.
 *
 * @returns {void}
 */
export function closeModal( props, event ) {
	if ( ! isCloseEvent( event ) ) {
		return;
	}

	props.onClose();
}

/**
 * The WincherSEOPerformanceModal modal.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The WincherSEOPerformanceModal.
 */
export default function WincherSEOPerformanceModal( props ) {
	const { location, whichModalOpen, shouldCloseOnClickOutside } = props;

	const onModalOpen = useCallback( () => {
		openModal( props );
	}, [ openModal, props ] );

	const onModalClose = useCallback( ( event ) => {
		closeModal( props, event );
	}, [ closeModal, props ] );

	const title = __( "Track SEO performance", "wordpress-seo" );

	const svgAriaProps = useSvgAria();

	return (
		<Fragment>
			{ whichModalOpen === location &&
			<Modal
				title={ title }
				onRequestClose={ onModalClose }
				icon={ <YoastIcon /> }
				additionalClassName="yoast-wincher-seo-performance-modal"
				shouldCloseOnClickOutside={ shouldCloseOnClickOutside }
			>
				<ModalContainer
					className="yoast-gutenberg-modal__content yoast-wincher-seo-performance-modal__content"
				>
					<WincherSEOPerformance />
				</ModalContainer>
			</Modal>
			}

			{ location === "sidebar" &&
			<SidebarButton
				id={ `wincher-open-button-${location}` }
				title={ title }
				SuffixHeroIcon={ <StyledHeroIcon className="yst-text-slate-500" { ...svgAriaProps } /> }
				onClick={ onModalOpen }
			/>
			}

			{ location === "metabox" && <MetaboxModalButton
				hasPadding={ false }
				hasSeparator={ true }
				suffixIconCollapsed={ {
					icon: "pencil-square",
					color: colors.$black,
					size: "20px",
				} }
				id={ `wincher-open-button-${location}` }
				title={ title }
				onToggle={ onModalOpen }
			/> }
		</Fragment>
	);
}

WincherSEOPerformanceModal.propTypes = {
	location: PropTypes.string,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
		"postpublish",
	] ),
	shouldCloseOnClickOutside: PropTypes.bool,
};

WincherSEOPerformanceModal.defaultProps = {
	location: "",
	whichModalOpen: "none",
	shouldCloseOnClickOutside: true,
};
