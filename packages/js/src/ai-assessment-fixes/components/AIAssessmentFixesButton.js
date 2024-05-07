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

/* Internal dependencies */
import { ModalContent } from "../../ai-generator/components/modal-content";

/**
 * The AI Assessment Fixes button component.
 *
 * @param {string} id The assessment ID for which the AI fixes should be applied to.
 * @param {boolean} isPremium Whether the premium add-on is active or not.
 * @returns {JSX.Element} The AI Assessment Fixes button.
 */
const AIAssessmentFixesButton = ( { id, isPremium } ) => {
	const aiFixesId = id + "AIFixes";
	const ariaLabel = __( "Fix with AI", "wordpress-seo" );
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const [ isButtonPressed, , , setIsButtonPressedTrue, setIsButtonPressedFalse ] = useToggleState( false );
	const activeAIButtonId = useSelect( select => select( "yoast-seo/editor" ).getActiveAIFixesButton(), [] );
	const { setActiveAIFixesButton } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );

	/**
	 * Handles the button press state.
	 * @returns {void}
	 */
	const handlePressedButton = () => {
		// If the current pressed button id is the same as the active AI button id,
		// we want to a). set the active AI button to null and b). set the button to not pressed.
		if ( aiFixesId === activeAIButtonId ) {
			setIsButtonPressedFalse();
			setActiveAIFixesButton( null );
		} else {
			setIsButtonPressedTrue();
			setActiveAIFixesButton( aiFixesId );
		}
	};

	const handleClick = useCallback( () => {
		if ( isPremium ) {
			doAction( "yoast.ai.fixAssessments", aiFixesId );
			// Only handle the pressed button state in Premium.
			handlePressedButton();
		} else {
			setIsModalOpenTrue();
		}
		// handlePressedButton();
	}, [ handlePressedButton, setIsModalOpenTrue ] );

	// This color selection when the button is pressed/unpressed is in line with the design of the highlighting button.
	// In Premium: when the button is pressed, the icon color is white. When the button is unpressed, the color is grey.
	// In Free: the icon color is always grey.
	const iconColor = isButtonPressed ? colors.$color_white : colors.$color_button_text;

	return (
		<>
			<IconAIFixesButton
				onClick={ handleClick }
				ariaLabel={ ariaLabel }
				id={ aiFixesId }
				className={ "yoast-tooltip yoast-tooltip-w" }
				// We don't want to change the background color of the button when it's pressed in Free.
				// This is because clicking on the button will open the modal, and the button will not be in a pressed state.
				pressed={ isButtonPressed }
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

