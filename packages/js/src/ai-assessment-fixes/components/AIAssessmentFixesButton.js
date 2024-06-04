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
 * The AI Assessment Fixes button icon.
 *
 * @param {string} id The ID for which the gradient effect will be applied to the icon.
 *
 * @returns {JSX.Element} The AI Assessment Fixes button icon.
 */
const SparklesIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" style={ { width: "90%", height: "90%" } }>
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style={ { stopColor: "#A61E69", stopOpacity: 1 } } />
					<stop offset="100%" style={ { stopColor: "#3B82F6", topOpacity: 1 } } />
				</linearGradient>
			</defs>
			<path fill="url(#gradient)" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
		</svg>
	);
};

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
			>
				<SparklesIcon style={ { color: iconColor } } />
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

