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
import { isTextViewActive } from "../../lib/tinymce";

/**
 * Returns the editor mode based on the editor type.
 * @returns {string} The editor mode, either "visual" or "text".
 */
const getEditorMode = () => {
	const editorType = useSelect( ( select ) => select( "yoast-seo/editor" ).getEditorType(), [] );

	if ( editorType === "blockEditor" ) {
		return useSelect( ( select ) => select( "core/edit-post" ).getEditorMode(), [] );
	} else if ( editorType === "classicEditor" ) {
		return isTextViewActive() ? "text" : "visual";
	}
	return "";
};

/**
 * The AI Optimize button component.
 *
 * @param {string} id The assessment ID which AI Optimize should be applied to.
 * @param {boolean} [isPremium=false] Whether the Premium add-on is active.
 *
 * @returns {JSX.Element} The AI Optimize button.
 */
const AIOptimizeButton = ( { id, isPremium = false } ) => {
	// The AI Optimize button ID is the same as the assessment ID, with "AIFixes" appended to it.
	// We continue to use "AIFixes" in the ID to keep it consistent with the Premium implementation.
	const aiOptimizeId = id + "AIFixes";
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const { activeMarker, activeAIButtonId, editorType, isWooSeoUpsellPost, keyword, content } = useSelect( ( select ) => ( {
		activeMarker: select( "yoast-seo/editor" ).getActiveMarker(),
		activeAIButtonId: select( "yoast-seo/editor" ).getActiveAIFixesButton(),
		editorType: select( "yoast-seo/editor" ).getEditorType(),
		isWooSeoUpsellPost: select( "yoast-seo/editor" ).getIsWooSeoUpsell(),
		keyword: select( "yoast-seo/editor" ).getFocusKeyphrase(),
		content: select( "yoast-seo/editor" ).getEditorDataContent(),
	} ), [] );
	const editorMode = getEditorMode();

	const shouldShowUpsell = ! isPremium || isWooSeoUpsellPost;

	const { setActiveAIFixesButton, setActiveMarker, setMarkerPauseStatus, setMarkerStatus } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );
	const [ buttonClass, setButtonClass ] = useState( "" );

	const defaultLabel = __( "Optimize with AI", "wordpress-seo" );
	const htmlLabel = __( "Please switch to the visual editor to optimize with AI.", "wordpress-seo" );

	// The button is pressed when the active AI button id is the same as the current button id.
	const isButtonPressed = activeAIButtonId === aiOptimizeId;

	// Enable the button when:
	// (1) other AI buttons are not pressed.
	// (2) the AI button is not disabled.
	// (3) the editor is in visual mode.
	// (4) all blocks are in visual mode.
	// eslint-disable-next-line complexity
	const { isEnabled, ariaLabel } = useSelect( ( select ) => {
		const keyphraseAssessments = [ "introductionKeyword", "keyphraseDensity", "keyphraseDistribution" ];
		if ( keyphraseAssessments.includes( id ) ) {
			// Create a Paper object with current content to use consistent validation
			const paper = new Paper( content || "", { keyword: keyword || "" } );
			const hasValidKeyphrase = paper.hasKeyword();
			const hasValidContent = paper.hasText();

			// Check global disabled reasons first (for unsupported content)
			const disabledAIButtons = select( "yoast-seo/editor" ).getDisabledAIFixesButtons();
			if ( Object.keys( disabledAIButtons ).includes( aiOptimizeId ) ) {
				// Always show the global disabled reason when content is unsupported
				return {
					isEnabled: false,
					ariaLabel: disabledAIButtons[ aiOptimizeId ],
				};
			}

			// If not globally disabled, check keyphrase and content requirements
			if ( ! hasValidKeyphrase || ! hasValidContent ) {
				return {
					isEnabled: false,
					ariaLabel: __( "Please add both a keyphrase and text", "wordpress-seo" ),
				};
			}
		}

		// Editor mode check
		if ( editorMode !== "visual" ) {
			return {
				isEnabled: false,
				ariaLabel: htmlLabel,
			};
		}

		// Block editor visual mode check
		if ( editorType === "blockEditor" ) {
			const blocks = getAllBlocks( select( "core/block-editor" ).getBlocks() );
			const allVisual = blocks.every( block => select( "core/block-editor" ).getBlockMode( block.clientId ) === "visual" );
			return {
				isEnabled: allVisual,
				ariaLabel: allVisual ? defaultLabel : htmlLabel,
			};
		}
		// Classic editor visual mode check
		return {
			isEnabled: true,
			ariaLabel: defaultLabel,
		};
	}, [ isButtonPressed, activeAIButtonId, editorMode, id, keyword, content ] );

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
		if ( aiOptimizeId === activeAIButtonId ) {
			setActiveAIFixesButton( null );
			// Enable the highlighting button when the AI button is not pressed.
			setMarkerStatus( "enabled" );
		} else {
			setActiveAIFixesButton( aiOptimizeId );
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
		// eslint-disable-next-line no-negated-condition -- Let's handle the happy path first.
		if ( ! shouldShowUpsell ) {
			doAction( "yoast.ai.fixAssessments", aiOptimizeId );
			/* Only handle the pressed button state in Premium.
			We don't want to change the background color of the button and other styling when it's pressed in Free.
			This is because clicking on the button in Free will open an upsell modal, and the button will not be in a pressed state. */
			handlePressedButton();
		} else {
			setIsModalOpenTrue();
		}
	}, [ handlePressedButton, setIsModalOpenTrue ] );

	// Add tooltip classes on mouse enter and remove them on mouse leave.
	const handleMouseEnter = useCallback( () => {
		if ( ariaLabel ) {
			const direction = "yoast-tooltip-w";
			setButtonClass( `yoast-tooltip yoast-tooltip-multiline ${ direction }` );
		}
	}, [ ariaLabel ] );

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
			id={ aiOptimizeId }
			className={ `ai-button ${buttonClass}` }
			pressed={ isButtonPressed }
			disabled={ ! isEnabled }
		>
			{ shouldShowUpsell && <LockClosedIcon className="yst-fixes-button__lock-icon yst-text-amber-900" /> }
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

AIOptimizeButton.propTypes = {
	id: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
};

export default AIOptimizeButton;

