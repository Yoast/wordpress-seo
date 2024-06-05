import { SparklesIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useCallback, useRef } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { useSelect, useDispatch } from "@wordpress/data";
/* Yoast dependencies */
import { colors } from "@yoast/style-guide";
import { IconAIFixesButton } from "@yoast/components";
import { Modal, useToggleState } from "@yoast/ui-library";
import { Paper } from "yoastseo";

/* Internal dependencies */
import { ModalContent } from "../../ai-generator/components/modal-content";

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
	const ariaLabel = __( "Fix with AI", "wordpress-seo" );
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const activeAIButtonId = useSelect( select => select( "yoast-seo/editor" ).getActiveAIFixesButton(), [] );
	const activeMarker = useSelect( select => select( "yoast-seo/editor" ).getActiveMarker(), [] );
	const { setActiveAIFixesButton, setActiveMarker, setMarkerPauseStatus } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );

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
	const isButtonDisabled = activeAIButtonId !== null && ! isButtonPressed;
	/* This color selection when the button is pressed/unpressed is in line with the design of the highlighting button.
	In Premium: when the button is pressed, the icon color is white. When the button is unpressed, the color is grey.
	In Free: the icon color is always grey. */
	const iconColor = isButtonPressed ? colors.$color_white : colors.$color_button_text;
	// Don't show the tooltip when the button is pressed.
	const className = isButtonPressed ? "" : "yoast-tooltip yoast-tooltip-w";

	return (
		<>
			<IconAIFixesButton
				onClick={ handleClick }
				ariaLabel={ ariaLabel }
				id={ aiFixesId }
				className={ className }
				pressed={ isButtonPressed }
				disabled={ isButtonDisabled }
			>
				<SparklesIcon style={ { width: "70%", height: "70%", color: iconColor } } />
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
		</>
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

