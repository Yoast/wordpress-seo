import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { noop } from "lodash";
import { SvgIcon, IconButtonToggle, IconCTAEditButton, BetaBadge } from "@yoast/components";
import { strings } from "@yoast/helpers";

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
 * @param {Object} props The component's props.
 * @param {String} props.marksButtonStatus The status for the mark buttons.
 * @param {boolean} props.hasMarksButton Whether a mark button exists.
 * @returns {boolean} True if mark buttons should be hidden.
 */
const areMarkButtonsHidden = function( props ) {
	return ( ! props.hasMarksButton ) || props.marksButtonStatus === "hidden";
};

/**
 * Factory method which creates a new instance of the default mark button.
 *
 * @param {string} ariaLabel 	The button aria-label.
 * @param {string} id 			The button id.
 * @param {string} className 	The button class name.
 * @param {string} status 		Status of the buttons. Supports: "enabled", "disabled", "hidden".
 * @param {function} onClick 	Onclick handler.
 * @param {boolean} isPressed 	Whether the button is in a pressed state.
 *
 * @returns {JSX.Element} A new mark button.
 */
const createMarkButton = ( {
	ariaLabel,
	id,
	className,
	status,
	onClick,
	isPressed,
} ) => {
	return <IconButtonToggle
		marksButtonStatus={ status }
		className={ className }
		onClick={ onClick }
		id={ id }
		icon="eye"
		pressed={ isPressed }
		ariaLabel={ ariaLabel }
	/>;
};

/**
 * Returns an AnalysisResult component.
 *
 * @param {object} props Component props.
 * @param {Function} [markButtonFactory] Injectable factory to create mark button.
 *
 * @returns {ReactElement} The rendered AnalysisResult component.
 */
const AnalysisResult = ( { markButtonFactory, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	markButtonFactory = markButtonFactory || createMarkButton;
	const { id, marker, hasMarksButton } = props;

	let marksButton = null;
	if ( ! areMarkButtonsHidden( props ) ) {
		marksButton = markButtonFactory(
			{
				onClick: props.shouldUpsellHighlighting ? openModal : props.onButtonClickMarks,
				status: props.marksButtonStatus,
				className: props.marksButtonClassName,
				id: props.buttonIdMarks,
				isPressed: props.pressed,
				ariaLabel: props.ariaLabelMarks,
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
		props.onResultChange( id, marker, hasMarksButton );
	}, [ id, marker, hasMarksButton ] );

	return (
		<AnalysisResultBase>
			<ScoreIcon
				icon="circle"
				color={ props.bulletColor }
				size="13px"
			/>
			<AnalysisResultText suppressedText={ props.suppressedText }>
				{ props.hasBetaBadgeLabel && <BetaBadge /> }
				<span dangerouslySetInnerHTML={ { __html: stripTagsFromHtmlString( props.text, ALLOWED_TAGS ) } } />
			</AnalysisResultText>
			<ResultButtonsContainer>
				{ marksButton }
				{ props.renderHighlightingUpsell( isOpen, closeModal ) }
				{
					props.hasEditButton && props.isPremium &&
					<IconCTAEditButton
						className={ props.editButtonClassName }
						onClick={ props.onButtonClickEdit }
						id={ props.buttonIdEdit }
						icon="edit"
						ariaLabel={ props.ariaLabelEdit }
					/>
				}
				{ props.renderAIFixesButton( props.hasAIFixes, props.id ) }
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
	hasAIButton: PropTypes.bool,
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
	renderAIFixesButton: PropTypes.func,
};

AnalysisResult.defaultProps = {
	suppressedText: false,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	hasBetaBadgeLabel: false,
	hasEditButton: false,
	hasAIFixes: false,
	buttonIdEdit: "",
	ariaLabelEdit: "",
	onButtonClickEdit: noop,
	isPremium: false,
	onResultChange: noop,
	id: "",
	marker: noop,
	shouldUpsellHighlighting: false,
	renderHighlightingUpsell: noop,
	renderAIFixesButton: noop,
};

export default AnalysisResult;
