import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useCallback, useRef, useState } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { useSelect, useDispatch } from "@wordpress/data";

/* Yoast dependencies */
import { IconAIFixesButton, SparklesIcon } from "@yoast/components";
import { Modal, useToggleState } from "@yoast/ui-library";
import { Paper } from "yoastseo";

/* Internal dependencies */
import { ModalContent } from "./modal-content";
import { getAllBlocks } from "../../helpers/getAllBlocks";
import { ReactComponent as LockClosed } from "../../../images/lock-closed.svg";

/**
 * The AI Assessment Fixes button component.
 *
 * @param {string} id The assessment ID for which the AI fixes should be applied to.
 * @param {boolean} isPremium Whether the premium add-on is active.
 *
 * @returns {JSX.Element} The AI Assessment Fixes button.
 */
const AIAssessmentFixesButton = ( { id, isPremium } ) => {
	const aiFixesId = id + "AIFixes";
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const activeAIButtonId = useSelect( select => select( "yoast-seo/editor" ).getActiveAIFixesButton(), [] );
	const activeMarker = useSelect( select => select( "yoast-seo/editor" ).getActiveMarker(), [] );
	const { setActiveAIFixesButton, setActiveMarker, setMarkerPauseStatus } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );
	const [ tooltipClass, setTooltipClass ] = useState( "" );

	const defaultLabel = __( "Optimize with AI", "wordpress-seo" );
	const tooLongLabel = __( "Your text is too long for the AI model to process.", "wordpress-seo" );
	const htmlLabel = __( "Please switch to the visual editor to use AI.", "wordpress-seo" );

	// Enable the button when:
	// (1) the AI button is not disabled.
	// (2) the editor is in visual mode.
	// (3) all blocks are in visual mode.
	const { isEnabled, ariaLabel } = useSelect( ( select ) => {
		const disabledAIButtons = select( "yoast-seo/editor" ).getDisabledAIFixesButtons();
		if ( disabledAIButtons.includes( aiFixesId ) ) {
			return {
				isEnabled: false,
				ariaLabel: tooLongLabel,
			};
		}

		const editorMode = select( "core/edit-post" ).getEditorMode();
		if ( editorMode !== "visual" ) {
			return {
				isEnabled: false,
				ariaLabel: htmlLabel,
			};
		}

		const blocks = getAllBlocks( select( "core/block-editor" ).getBlocks() );
		const allVisual = blocks.every( block => select( "core/block-editor" ).getBlockMode( block.clientId ) === "visual" );
		return {
			isEnabled: allVisual,
			ariaLabel: allVisual ? defaultLabel : htmlLabel,
		};
	}, [] );

	/**
	 * Handles the button press state.
	 * @returns {void}
	 */
	const handlePressedButton = () => {
		// If there is an active marker when the AI fixes button is clicked, remove it.
		if ( activeMarker ) {
			setActiveMarker( null );
			setMarkerPauseStatus( false );
			// Remove highlighting from the editor.
			window.YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
		}

		/* If the current pressed button ID is the same as the active AI button id,
		we want to set the active AI button to null. Otherwise, update the active AI button ID. */
		if ( aiFixesId === activeAIButtonId ) {
			setActiveAIFixesButton( null );
		} else {
			setActiveAIFixesButton( aiFixesId );
		}

		// Dismiss the tooltip when the button is pressed.
		setTooltipClass( "" );
	};

	const handleClick = useCallback( () => {
		if ( isPremium ) {
			doAction( "yoast.ai.fixAssessments", aiFixesId );
			/* Only handle the pressed button state in Premium.
			We don't want to change the background color of the button and other styling when it's pressed in Free.
			This is because clicking on the button in Free will open the modal, and the button will not be in a pressed state. */
			handlePressedButton();
		} else {
			setIsModalOpenTrue();
		}
	}, [ handlePressedButton, setIsModalOpenTrue ] );

	// The button is pressed when the active AI button id is the same as the current button id.
	const isButtonPressed = activeAIButtonId === aiFixesId;

	// Add tooltip classes on mouse enter and remove them on mouse leave.
	const handleMouseEnter = useCallback( () => {
		const direction = isEnabled ? "yoast-tooltip-w" : "yoast-tooltip-nw";
		setTooltipClass( `yoast-tooltip ${ direction }` );
	}, [ isEnabled ] );

	const handleMouseLeave = useCallback( () => {
		setTooltipClass( "" );
	}, [] );

	return (
		<div
			aria-label={ ariaLabel }
			className={ tooltipClass }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<IconAIFixesButton
				id={ aiFixesId }
				ariaLabel={ ariaLabel }
				className={ "ai-button" }
				disabled={ ! isEnabled }
				onClick={ handleClick }
				pressed={ isButtonPressed }
			>
				{ ! isPremium &&  <LockClosed className="yst-fixes-button__lock-icon" /> }
				<SparklesIcon pressed={ isButtonPressed } />
				{
					// We put the logic for the Upsell component in place.
					// The Modal below is only a placeholder/mock. When we have the design for the real upsell, the modal should be replaced.
					isModalOpen && <Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ setIsModalOpenFalse } initialFocus={ focusElementRef }>
						<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl yst-introduction-modal-panel">
							<ModalContent onClose={ setIsModalOpenFalse } focusElementRef={ focusElementRef } />
						</Modal.Panel>
					</Modal>
				}
			</IconAIFixesButton>
		</div>
	);
};

AIAssessmentFixesButton.propTypes = {
	id: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
};

AIAssessmentFixesButton.defaultProps = {
	isPremium: false,
};

export default AIAssessmentFixesButton;

