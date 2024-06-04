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

const SparklesIcon = ( { pressed } ) => {
	return (
		<>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M3.33284 2V4.66667M1.99951 3.33333H4.66618M3.99951 11.3333V14M2.66618 12.6667H5.33284M8.66618 2L10.19 6.57143L13.9995 8L10.19 9.42857L8.66618 14L7.14237 9.42857L3.33284 8L7.14237 6.57143L8.66618 2Z"
					stroke={ pressed ? "white" : "url(#paint0_linear_1208_188)" } strokeWidth="1.33333" strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_1208_188" x1="0" y1="0" x2="16" y2="16"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#A61E69" />
						<stop offset="1" stopColor="#3B82F6" />
					</linearGradient>
				</defs>
			</svg>
		</>
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

