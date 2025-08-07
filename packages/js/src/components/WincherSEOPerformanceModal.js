/* eslint-disable complexity */
/* External dependencies */
import { ChartBarIcon } from "@heroicons/react/solid";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library/src";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { MetaboxButton } from "./MetaboxButton";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import SidebarButton from "./SidebarButton";
import WincherSEOPerformance from "../containers/WincherSEOPerformance";


const StyledHeroIcon = styled( ChartBarIcon )`
	width: 18px;
	height: 18px;
	margin: 3px;
`;

/**
 * Handles the click event on the "Track SEO performance" button.
 *
 * @param {Array} keyphrases The keyphrases array.
 * @param {Function} onNoKeyphraseSet Callback when no keyphrase is set.
 * @param {Function} onOpen Callback to open the modal.
 * @param {string} location The location identifier.
 *
 * @returns {void}
 */
function openModal( { keyphrases, onNoKeyphraseSet, onOpen, location } ) {
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
 * The WincherSEOPerformanceModal modal.
 *
 * @param {string} [location=""] The location identifier.
 * @param {"none"|"metabox"|"sidebar"|"postpublish"} [whichModalOpen="none"] Which modal is open.
 * @param {boolean} [shouldCloseOnClickOutside=true] Whether the modal should close when clicking outside.
 * @param {Array} keyphrases The keyphrases array.
 * @param {Function} onNoKeyphraseSet Callback when no keyphrase is set.
 * @param {Function} onOpen Callback to open the modal.
 * @param {Function} onClose Callback to close the modal.
 *
 * @returns {JSX.Element}
 */
export default function WincherSEOPerformanceModal( {
	location = "",
	whichModalOpen = "none",
	shouldCloseOnClickOutside = true,
	keyphrases,
	onNoKeyphraseSet,
	onOpen,
	onClose,
} ) {
	const onModalOpen = useCallback( () => {
		openModal( { keyphrases, onNoKeyphraseSet, onOpen, location } );
	}, [ openModal, keyphrases, onNoKeyphraseSet, onOpen, location ] );

	const title = __( "Track SEO performance", "wordpress-seo" );

	const svgAriaProps = useSvgAria();

	return (
		<Fragment>
			{ whichModalOpen === location &&
			<Modal
				title={ title }
				onRequestClose={ onClose }
				icon={ <YoastIcon /> }
				additionalClassName="yoast-wincher-seo-performance-modal yoast-gutenberg-modal__no-padding"
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

			{ location === "metabox" && (
				<div className="yst-root">
					<MetaboxButton
						id={ `wincher-open-button-${location}` }
						onClick={ onModalOpen }
					>
						<MetaboxButton.Text>{ title }</MetaboxButton.Text>
						<ChartBarIcon className="yst-h-5 yst-w-5 yst-text-slate-500" { ...svgAriaProps } />
					</MetaboxButton>
				</div>
			) }
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
	keyphrases: PropTypes.array.isRequired,
	onNoKeyphraseSet: PropTypes.func.isRequired,
	onOpen: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};
