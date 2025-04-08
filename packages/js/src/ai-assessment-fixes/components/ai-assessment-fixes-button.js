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
import { LockClosedIcon } from "@heroicons/react/solid";

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
	const { activeMarker, editorMode, activeAIButtonId } = useSelect( ( select ) => ( {
		activeMarker: select( "yoast-seo/editor" ).getActiveMarker(),
		editorMode: select( "core/edit-post" ).getEditorMode(),
		activeAIButtonId: select( "yoast-seo/editor" ).getActiveAIFixesButton(),
	} ), [] );
	const { setActiveAIFixesButton, setActiveMarker, setMarkerPauseStatus, setMarkerStatus } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );
	const [ buttonClass, setButtonClass ] = useState( "" );

	const defaultLabel = __( "Optimize with AI", "wordpress-seo" );
	const htmlLabel = __( "Please switch to the visual editor to optimize with AI.", "wordpress-seo" );

	// The button is pressed when the active AI button id is the same as the current button id.
	const isButtonPressed = activeAIButtonId === aiFixesId;

	// Enable the button when:
	// (1) other AI buttons are not pressed.
	// (2) the AI button is not disabled.
	// (3) the editor is in visual mode.
	// (4) all blocks are in visual mode.
	const { isEnabled, ariaLabel } = useSelect( ( select ) => {
		if ( activeAIButtonId !== null && ! isButtonPressed ) {
			return {
				isEnabled: false,
				ariaLabel: null,
			};
		}

		const disabledAIButtons = select( "yoast-seo/editor" ).getDisabledAIFixesButtons();
		if ( Object.keys( disabledAIButtons ).includes( aiFixesId ) ) {
			return {
				isEnabled: false,
				ariaLabel: disabledAIButtons[ aiFixesId ],
			};
		}

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
	}, [ isButtonPressed, activeAIButtonId, editorMode ] );

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
		we want to set the active AI button to null and enable back the highlighting button that was disabled
		when the AI button was pressed the first time. Otherwise, update the active AI button ID. */
		if ( aiFixesId === activeAIButtonId ) {
			setActiveAIFixesButton( null );
			// Enable the highlighting button when the AI button is not pressed.
			setMarkerStatus( "enabled" );
		} else {
			setActiveAIFixesButton( aiFixesId );
			/*
			Disable the highlighting button when the AI button is pressed.
			This is because clicking on the highlighting button will remove the AI suggestion from the editor.
			 */
			setMarkerStatus( "disabled" );
		}
		// Dismiss the tooltip when the button is pressed.
		setButtonClass( "" );
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

	// Add tooltip classes on mouse enter and remove them on mouse leave.
	const handleMouseEnter = useCallback( () => {
		if ( ariaLabel ) {
			const direction = isEnabled ? "yoast-tooltip-w" : "yoast-tooltip-nw";
			setButtonClass( `yoast-tooltip yoast-tooltip-multiline ${ direction }` );
		}
	}, [ isEnabled, ariaLabel ] );

	const handleMouseLeave = useCallback( () => {
		// Remove tooltip classes on mouse leave
		setButtonClass( "" );
	}, [] );

	return (
		<IconAIFixesButton
			onClick={ handleClick }
			ariaLabel={ ariaLabel }
			onPointerEnter={ handleMouseEnter }
			onPointerLeave={ handleMouseLeave }
			id={ aiFixesId }
			className={ `ai-button ${buttonClass}` }
			pressed={ isButtonPressed }
			disabled={ ! isEnabled }
		>
			{ ! isPremium && <LockClosedIcon className="yst-fixes-button__lock-icon yst-text-amber-900" /> }
			<SparklesIcon pressed={ isButtonPressed } />
			{
				isModalOpen && <Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ setIsModalOpenFalse } initialFocus={ focusElementRef }>
					<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl yst-introduction-modal-panel">
						<ModalContent onClose={ setIsModalOpenFalse } focusElementRef={ focusElementRef } />
					</Modal.Panel>
				</Modal>
			}
		</IconAIFixesButton>
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

