import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { SvgIcon, IconButtonToggle } from "@yoast/components";

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
	color: ${ props => props.suppressedText ? "rgba(30,30,30,0.5)" : "black" }
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
 * Returns an AnalysisResult component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The rendered AnalysisResult component.
 */
export const AnalysisResult = ( props ) => {
	return (
		<AnalysisResultBase>
			<ScoreIcon
				icon="circle"
				color={ props.bulletColor }
				size="13px"
			/>
			<AnalysisResultText
				dangerouslySetInnerHTML={ { __html: props.text } }
				suppressedText={ props.suppressedText }
			/>
			{
				props.hasMarksButton && ! areButtonsHidden( props ) &&
					<IconButtonToggle
						marksButtonStatus={ props.marksButtonStatus }
						className={ props.marksButtonClassName }
						onClick={ props.onButtonClick }
						id={ props.buttonId }
						icon="eye"
						pressed={ props.pressed }
						ariaLabel={ props.ariaLabel }
					/>
			}
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	text: PropTypes.string.isRequired,
	suppressedText: PropTypes.bool,
	bulletColor: PropTypes.string.isRequired,
	hasMarksButton: PropTypes.bool.isRequired,
	buttonId: PropTypes.string.isRequired,
	pressed: PropTypes.bool.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
};

AnalysisResult.defaultProps = {
	suppressedText: false,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
};

export default AnalysisResult;
