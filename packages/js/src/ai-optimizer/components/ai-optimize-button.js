/* eslint-disable complexity */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useCallback, useRef, useLayoutEffect } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { useSelect, useDispatch } from "@wordpress/data";

/* Yoast dependencies */
import { Modal, useToggleState, Button, Root, Tooltip } from "@yoast/ui-library";
import { Paper } from "yoastseo";
import { get } from "lodash";
import { useLocation } from "../../ai-generator/hooks/use-location";

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
	const locationContext = useLocation();
	const focusButtonRef = useRef();
	// The AI Optimize button ID is the same as the assessment ID, with "AIFixes" appended to it.
	// We continue to use "AIFixes" in the ID to keep it consistent with the Premium implementation.
	const aiOptimizeId = id + "AIFixes";
	const [ isModalOpen, , , setIsModalOpenTrue, setIsModalOpenFalse ] = useToggleState( false );
	const { activeMarker, activeAIButtonId, editorType, isWooSeoUpsellPost, keyphrase, focusAIButtonId } = useSelect( ( select ) => ( {
		activeMarker: select( "yoast-seo/editor" ).getActiveMarker(),
		activeAIButtonId: select( "yoast-seo/editor" ).getActiveAIFixesButton(),
		focusAIButtonId: select( "yoast-seo/editor" ).getFocusAIFixesButtonId(),
		editorType: select( "yoast-seo/editor" ).getEditorType(),
		isWooSeoUpsellPost: select( "yoast-seo/editor" ).getIsWooSeoUpsell(),
		keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
	} ), [] );
	const editorMode = getEditorMode();

	const shouldShowUpsell = ! isPremium || isWooSeoUpsellPost;

	const { setActiveAIFixesButton, setActiveMarker, setMarkerPauseStatus, setMarkerStatus, setFocusAIFixesButtonId } = useDispatch( "yoast-seo/editor" );
	const focusElementRef = useRef( null );
	const [ isTooltipOpen, toggleTooltipOpen, , , hideTooltip ] = useToggleState( false );

	const defaultLabel = __( "Optimize with AI", "wordpress-seo" );
	const htmlLabel = __( "Please switch to the visual editor to optimize with AI.", "wordpress-seo" );

	// The button is pressed when the active AI button id is the same as the current button id.
	const isButtonPressed = activeAIButtonId === aiOptimizeId;

	// Determines if the button is enabled and what tooltip to show.
	const { isEnabled, ariaLabel } = useSelect( ( select ) => {
		// When Premium is not active (upsell), always show the generic tooltip
		if ( shouldShowUpsell ) {
			// Gutenberg editor
			if ( editorType === "blockEditor" ) {
				const blocks = getAllBlocks( select( "core/editor" ).getEditorBlocks() );
				const allVisual = editorMode === "visual" && blocks.every( block => select( "core/block-editor" ).getBlockMode( block.clientId ) === "visual" );
				return {
					isEnabled: allVisual,
					ariaLabel: allVisual ? defaultLabel : htmlLabel,
				};
			}
			// Classic editor
			return {
				isEnabled: editorMode === "visual",
				ariaLabel: editorMode === "visual" ? defaultLabel : htmlLabel,
			};
		}
		// Editor mode
		if ( editorMode !== "visual" ) {
			return {
				isEnabled: false,
				ariaLabel: htmlLabel,
			};
		}

		// Block editor visual mode check
		if ( editorType === "blockEditor" ) {
			const blocks = getAllBlocks( select( "core/editor" ).getEditorBlocks() );
			const allVisual = blocks.every( block => select( "core/block-editor" ).getBlockMode( block.clientId ) === "visual" );
			if ( ! allVisual ) {
				return {
					isEnabled: false,
					ariaLabel: htmlLabel,
				};
			}
		}

		// Check keyphrase specific assessments requirements
		const keyphraseAssessments = [ "introductionKeyword", "keyphraseDensity", "keyphraseDistribution" ];
		if ( keyphraseAssessments.includes( id ) ) {
			const hasValidKeyphrase = !! keyphrase && keyphrase.trim().length > 0;
			const collectData = get( window, "YoastSEO.analysis.collectData", false );
			// Ensures the button uses the same analysis-ready content source, while staying safe if the analysis API hasn't initialized.
			const editorData = collectData ? collectData() : {};
			const text = editorData?._text || "";
			const hasContent = text.trim().length > 0;

			// If missing the keyphrase or missing content, ask user to add both
			if ( ! hasValidKeyphrase || ! hasContent ) {
				return {
					isEnabled: false,
					ariaLabel: __( "Please add both a keyphrase and some text to your content.", "wordpress-seo" ),
				};
			}
		}

		// Check global disabled reasons (for unsupported content).
		const disabledAIButtons = select( "yoast-seo/editor" ).getDisabledAIFixesButtons();
		if ( Object.keys( disabledAIButtons ).includes( aiOptimizeId ) ) {
			return {
				isEnabled: false,
				ariaLabel: disabledAIButtons[ aiOptimizeId ],
			};
		}

		// Disable this button if another AI button is active (in preview mode).
		const currentActiveAIButton = select( "yoast-seo/editor" ).getActiveAIFixesButton();
		if ( currentActiveAIButton && currentActiveAIButton !== aiOptimizeId ) {
			return {
				isEnabled: false,
				ariaLabel: __( "Please apply or discard the current AI suggestion.", "wordpress-seo" ),
			};
		}

		// Fallback for when all conditions above pass and the button is enabled.
		return {
			isEnabled: true,
			ariaLabel: defaultLabel,
		};
	}, [ isButtonPressed, activeAIButtonId, editorMode, id, keyphrase ] );

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
		setFocusAIFixesButtonId( `${ aiOptimizeId }-${locationContext}` );
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
		hideTooltip();
	};

	const handleClick = useCallback( () => {
		// eslint-disable-next-line no-negated-condition -- Let's handle the happy path first.
		if ( ! shouldShowUpsell ) {
			/* Only handle the pressed button state in Premium.
			We don't want to change the background color of the button and other styling when it's pressed in Free.
			This is because clicking on the button in Free will open an upsell modal, and the button will not be in a pressed state. */
			handlePressedButton();
			/*
			 * Handle the pressed button state BEFORE firing the action.
			 * This ensures the Redux state is set before Premium's App component renders,
			 * which checks activeAIOptimizeButton === assessmentName.
			 */
			doAction( "yoast.ai.fixAssessments", aiOptimizeId );
		} else {
			setIsModalOpenTrue();
		}
	}, [ shouldShowUpsell, aiOptimizeId, handlePressedButton, setIsModalOpenTrue ] );


	const resetFocusOnBlur = useCallback( () => {
		// Reset the focus AI button ID in the store when the button loses focus.
	//	setFocusAIFixesButtonId( null );
	}, [ setFocusAIFixesButtonId ] );

	useLayoutEffect( () => {
		if ( focusButtonRef.current && focusAIButtonId === `${ aiOptimizeId }-${locationContext}` && aiOptimizeId !== activeAIButtonId ) {
			focusButtonRef.current.focus();
		}
	}, [ focusAIButtonId, activeAIButtonId, aiOptimizeId, locationContext ] );

	return (
		<Root>
			<div
				className="yst-relative yst-inline-flex"
				onPointerEnter={ toggleTooltipOpen }
				onPointerLeave={ toggleTooltipOpen }
			>
				<Button
					onClick={ handleClick }
					id={ `${ aiOptimizeId }-${ locationContext }` }
					data-id={ aiOptimizeId }
					disabled={ ! isEnabled }
					ref={ focusButtonRef }
					onBlur={ resetFocusOnBlur }
					variant={ isButtonPressed ? "ai-primary" : "ai-secondary" }
					size="small"
					aria-label={ ariaLabel }
				>
					{ shouldShowUpsell && <LockClosedIcon className="yst-fixes-button__lock-icon yst-text-amber-900" /> }
				</Button>
				{ isTooltipOpen && ! isButtonPressed && (
					<Tooltip position={ isEnabled ? "left" : "top-left" } className="yst-max-w-[13.5rem] yst-text-center yst-py-1.5">
						{ ariaLabel }
					</Tooltip>
				) }
			</div>
			{ isModalOpen && (
				<Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ setIsModalOpenFalse } initialFocus={ focusElementRef }>
					<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl yst-introduction-modal-panel">
						<ModalContent onClose={ setIsModalOpenFalse } focusElementRef={ focusElementRef } />
					</Modal.Panel>
				</Modal>
			) }
		</Root>
	);
};

AIOptimizeButton.propTypes = {
	id: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
};

export default AIOptimizeButton;

