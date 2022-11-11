import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { noop } from "lodash";

import { SvgIcon, IconButtonToggle, IconCTAEditButton, BetaBadge } from "@yoast/components";

const AnalysisResultBase = styled.li`
	// This is the height of the IconButtonToggle.
	min-height: 24px;
	padding: 0;
	display: flex;
	align-items: flex-start;
`;

const ScoreIcon = styled( SvgIcon )`
	margin: 3px 11px 0 0; // icon 13 + 11 right margin = 24 for the 8px grid.
`;

const AnalysisResultText = styled.p`
	margin: 0 16px 0 0;
	flex: 1 1 auto;
	color: ${ props => props.suppressedText ? "rgba(30,30,30,0.5)" : "inherit" };
`;

/**
 * Determines whether the buttons should be hidden.
 *
 * @param {Object} props The component's props.
 * @returns {boolean} True if buttons should be hidden.
 */
const areButtonsHidden = function( props ) {
	return props.marksButtonStatus === "hidden";
};

/**
 * Factory method which creates a new instance of the default mark button.
 *
 * @param {String} ariaLabel The button aria-label.
 * @param {String} id The button id.
 * @param {String} className The button class name.
 * @param {String} status Status of the buttons. Supports: "enabled", "disabled".
 * @param {Function} onClick Onclick handler.
 * @param {Boolean} isPressed Whether the button is in a pressed state.
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
export const AnalysisResult = ( { markButtonFactory = null, ...props } ) => {
	markButtonFactory = markButtonFactory || createMarkButton;
	let marksButton = null;
	if ( props.hasMarksButton && ! areButtonsHidden( props ) ) {
		marksButton = markButtonFactory(
			{
				onClick: props.onButtonClickMarks,
				status: props.marksButtonStatus,
				className: props.marksButtonClassName,
				id: props.buttonIdMarks,
				isPressed: props.pressed,
				ariaLabel: props.ariaLabelMarks,
			}
		);
	}

	return (
		<AnalysisResultBase>
			<ScoreIcon
				icon={ props.icon }
				color={ props.bulletColor }
				size="13px"
			/>
			<AnalysisResultText suppressedText={ props.suppressedText }>
				{ props.hasBetaBadgeLabel && <BetaBadge /> }
				<span dangerouslySetInnerHTML={ { __html: props.text } } />
			</AnalysisResultText>
			{ marksButton }
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
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	icon: PropTypes.string,
	text: PropTypes.string.isRequired,
	suppressedText: PropTypes.bool,
	bulletColor: PropTypes.string.isRequired,
	hasMarksButton: PropTypes.bool.isRequired,
	hasEditButton: PropTypes.bool,
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
};

AnalysisResult.defaultProps = {
	icon: "circle",
	suppressedText: false,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	hasBetaBadgeLabel: false,
	hasEditButton: false,
	buttonIdEdit: "",
	ariaLabelEdit: "",
	onButtonClickEdit: noop,
	isPremium: false,
};

export default AnalysisResult;
