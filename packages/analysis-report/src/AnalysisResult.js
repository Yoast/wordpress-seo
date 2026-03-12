import { BetaBadge, SvgIcon } from "@yoast/components";
import { strings } from "@yoast/helpers";
import { Button, Root, TooltipContainer, TooltipWithContext, useTooltipContext } from "@yoast/ui-library";
import classNames from "classnames";
import { EyeIcon, PencilIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const { stripTagsFromHtmlString } = strings;

const ALLOWED_TAGS = [ "a", "b", "strong", "em", "i" ];

const ResultButtonsContainer = styled.div`
	display: grid;
	grid-template-rows: 1fr;
	max-width: 32px;
	// This gap value is half the gap value between assessment result list items, which is 12px.
	gap: 6px;
`;

const AnalysisResultBase = styled.li`
	// This is the height of the IconButtonToggle.
	min-height: 24px;
	margin-bottom: 12px;
	padding: 0;
	display: flex;
	align-items: flex-start;
	position: relative;
	gap: 12px;
`;

const ScoreIcon = styled( SvgIcon )`
	margin: 3px 0 0 0;
`;

const AnalysisResultText = styled.p`
	margin: 0;
	flex: 1 1 auto;
	color: ${ props => props.suppressedText ? "rgba(30,30,30,0.5)" : "inherit" };
`;

/**
 * Determines whether the mark buttons should be hidden.
 *
 * @param {boolean} hasMarksButton Whether a mark button exists.
 * @param {string} marksButtonStatus The status for the mark buttons.
 * @returns {boolean} True if mark buttons should be hidden.
 */
const areMarkButtonsHidden = function( hasMarksButton, marksButtonStatus ) {
	return ! hasMarksButton || marksButtonStatus === "hidden";
};

/**
 * Inner mark button that accesses the TooltipContainer context.
 *
 * @param {string} ariaLabel 	The button aria-label.
 * @param {string} id 			The button id.
 * @param {string} className 	The button class name.
 * @param {string} status 		Status of the buttons. Supports: "enabled", "disabled", "hidden".
 * @param {function} onClick 	Onclick handler.
 * @param {boolean} isPressed 	Whether the button is in a pressed state.
 *
 * @returns {JSX.Element} The inner mark button with tooltip context.
 */
const MarkButtonInner = ( { ariaLabel, id, className = "", status = "enabled", onClick, isPressed } ) => {
	const { show, hide } = useTooltipContext();
	const tooltipId = `${ id }-tooltip`;

	const handleShow = useCallback( () => {
		if ( ! isPressed ) {
			show();
		}
	}, [ isPressed, show ] );

	return <>
		<Button
			variant={ isPressed ? "primary" : "secondary" }
			size="small"
			className={ classNames( className, "yst-px-2 yst-rounded-md yst-shadow-none yst-border-0 focus:yst-z-10" ) }
			onClick={ onClick }
			id={ id }
			disabled={ status === "disabled" }
			aria-pressed={ isPressed }
			aria-label={ ariaLabel }
			aria-describedby={ isPressed ? null : tooltipId }
			onPointerEnter={ handleShow }
			onPointerLeave={ hide }
			onFocus={ handleShow }
			onBlur={ hide }
		>
			<EyeIcon className="yst-w-4 yst-h-4" />
		</Button>
		<TooltipWithContext id={ tooltipId } position="left">
			{ ariaLabel }
		</TooltipWithContext>
	</>;
};

MarkButtonInner.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	status: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	isPressed: PropTypes.bool.isRequired,
};

/**
 * The default mark button component.
 *
 * @param {Object} props The mark button props.
 *
 * @returns {JSX.Element} A new mark button.
 */
const MarkButton = ( { className = "", status = "enabled", ...props } ) => {
	return <Root>
		<TooltipContainer as="div" className="yst-relative yst-inline-flex">
			<MarkButtonInner className={ className } status={ status } { ...props } />
		</TooltipContainer>
	</Root>;
};

MarkButton.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	status: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	isPressed: PropTypes.bool.isRequired,
};

/**
 * Inner edit button that accesses the TooltipContainer context.
 *
 * @param {string} ariaLabel 	The button aria-label.
 * @param {string} id 			The button id.
 * @param {string} className 	The button class name.
 * @param {function} onClick 	Onclick handler.
 *
 * @returns {JSX.Element} The inner edit button with tooltip context.
 */
const EditButtonInner = ( { ariaLabel, id, className = "", onClick } ) => {
	const { show, hide } = useTooltipContext();
	const tooltipId = `${ id }-tooltip`;

	return <>
		<Button
			variant="secondary"
			size="small"
			className={ classNames( className, "yst-px-2 yst-rounded-md yst-shadow-none yst-border-0" ) }
			onClick={ onClick }
			id={ id }
			aria-label={ ariaLabel }
			aria-describedby={ tooltipId }
			onPointerEnter={ show }
			onPointerLeave={ hide }
			onFocus={ show }
			onBlur={ hide }
		>
			<PencilIcon className="yst-w-4 yst-h-4" />
		</Button>
		<TooltipWithContext id={ tooltipId } position="left">
			{ ariaLabel }
		</TooltipWithContext>
	</>;
};

EditButtonInner.propTypes = {
	ariaLabel: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func.isRequired,
};

/**
 * The default mark button factory wrapping the MarkButton component.
 *
 * @param {Object} props The mark button props.
 *
 * @returns {JSX.Element} A new mark button.
 */
const createMarkButton = ( props ) => {
	return <MarkButton { ...props } />;
};

/**
 * Returns an AnalysisResult component.
 *
 * @param {string} text The text to be displayed in the result.
 * @param {boolean} [suppressedText=false] Whether the text should be suppressed.
 * @param {string} bulletColor The color of the bullet icon.
 * @param {boolean} hasMarksButton Whether the result has a marks button.
 * @param {boolean} [hasEditButton=false] Whether the result has an edit button.
 * @param {boolean} [hasAIFixes=false] Whether the result has AI fixes.
 * @param {string} buttonIdMarks The id of the marks button.
 * @param {string} [buttonIdEdit=""] The id of the edit button.
 * @param {boolean} pressed Whether the marks button is pressed.
 * @param {string} ariaLabelMarks The aria-label for the marks button.
 * @param {string} [ariaLabelEdit=""] The aria-label for the edit button.
 * @param {Function} onButtonClickMarks The function to call when the marks button is clicked.
 * @param {Function} [onButtonClickEdit=noop] The function to call when the edit button is clicked.
 * @param {string} [marksButtonStatus="enabled"] The status of the marks button.
 * @param {string} [marksButtonClassName=""] The class name for the marks button.
 * @param {Function} [markButtonFactory=null] Injectable factory to create mark button.
 * @param {string} [editButtonClassName=""] The class name for the edit button.
 * @param {boolean} [hasBetaBadgeLabel=false] Whether the result has a beta badge label.
 * @param {boolean} [isPremium=false] Whether the user has a premium subscription.
 * @param {Function} [onResultChange=noop] The function to call when the result changes.
 * @param {string} [id=""] The id of the result.
 * @param {Function|array} [marker=noop] The function or array to mark the result.
 * @param {boolean} [shouldUpsellHighlighting=false] Whether to show the upsell for highlighting.
 * @param {Function} [renderHighlightingUpsell=noop] The function to render the highlighting upsell.
 * @param {Function} [renderAIOptimizeButton=noop] The function to render the AI optimize button.
 *
 * @returns {ReactElement} The rendered AnalysisResult component.
 */
const AnalysisResult = ( {
	ariaLabelMarks,
	ariaLabelEdit = "",
	bulletColor,
	buttonIdMarks,
	buttonIdEdit = "",
	editButtonClassName = "",
	hasAIFixes = false,
	hasBetaBadgeLabel = false,
	hasEditButton = false,
	hasMarksButton,
	id = "",
	isPremium = false,
	marker = noop,
	markButtonFactory = null,
	marksButtonStatus = "enabled",
	marksButtonClassName = "",
	onButtonClickMarks,
	onButtonClickEdit = noop,
	onResultChange = noop,
	pressed,
	renderHighlightingUpsell = noop,
	renderAIOptimizeButton = noop,
	shouldUpsellHighlighting = false,
	suppressedText = false,
	text,
} ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	markButtonFactory = markButtonFactory || createMarkButton;

	let marksButton = null;
	if ( ! areMarkButtonsHidden( hasMarksButton, marksButtonStatus ) ) {
		marksButton = markButtonFactory(
			{
				onClick: shouldUpsellHighlighting ? openModal : onButtonClickMarks,
				status: marksButtonStatus,
				className: marksButtonClassName,
				id: buttonIdMarks,
				isPressed: pressed,
				ariaLabel: ariaLabelMarks,
			}
		);
	}

	/*
	 * Update the marker status when there is a change in the following:
	 * a) the result's id, or
	 * b) the objects that need to be marked for the current result, or
	 * c) the information whether there is an object to be marked for the current result.
	 */
	useEffect( () => {
		onResultChange( id, marker, hasMarksButton );
	}, [ id, marker, hasMarksButton ] );

	return (
		<AnalysisResultBase>
			<ScoreIcon
				icon="circle"
				color={ bulletColor }
				size="13px"
			/>
			<AnalysisResultText suppressedText={ suppressedText }>
				{ hasBetaBadgeLabel && <BetaBadge /> }
				<span dangerouslySetInnerHTML={ { __html: stripTagsFromHtmlString( text, ALLOWED_TAGS ) } } />
			</AnalysisResultText>
			<ResultButtonsContainer>
				{ marksButton }
				{ renderHighlightingUpsell( isOpen, closeModal ) }
				{
					hasEditButton && isPremium &&
					<Root>
						<TooltipContainer as="div" className="yst-relative yst-inline-flex">
							<EditButtonInner
								ariaLabel={ ariaLabelEdit }
								id={ buttonIdEdit }
								className={ editButtonClassName }
								onClick={ onButtonClickEdit }
							/>
						</TooltipContainer>
					</Root>
				}
				{ renderAIOptimizeButton( hasAIFixes, id ) }
			</ResultButtonsContainer>
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	text: PropTypes.string.isRequired,
	suppressedText: PropTypes.bool,
	bulletColor: PropTypes.string.isRequired,
	hasMarksButton: PropTypes.bool.isRequired,
	hasEditButton: PropTypes.bool,
	hasAIFixes: PropTypes.bool,
	buttonIdMarks: PropTypes.string.isRequired,
	buttonIdEdit: PropTypes.string,
	pressed: PropTypes.bool.isRequired,
	ariaLabelMarks: PropTypes.string.isRequired,
	ariaLabelEdit: PropTypes.string,
	onButtonClickMarks: PropTypes.func.isRequired,
	onButtonClickEdit: PropTypes.func,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	markButtonFactory: PropTypes.func,
	editButtonClassName: PropTypes.string,
	hasBetaBadgeLabel: PropTypes.bool,
	isPremium: PropTypes.bool,
	onResultChange: PropTypes.func,
	id: PropTypes.string,
	marker: PropTypes.oneOfType( [
		PropTypes.func,
		PropTypes.array,
	] ),
	shouldUpsellHighlighting: PropTypes.bool,
	renderHighlightingUpsell: PropTypes.func,
	renderAIOptimizeButton: PropTypes.func,
};

export default AnalysisResult;
