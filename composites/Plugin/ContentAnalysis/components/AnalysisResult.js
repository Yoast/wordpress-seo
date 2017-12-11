import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { circle } from "../../../../style-guide/svg/index";
import { eye } from "../../../../style-guide/svg/index";
import { Icon } from "../../Shared/components/Icon.js";
import IconButtonToggle from "../../Shared/components/IconButtonToggle.js";

const AnalysisResultBase = styled.li`
	// This is the height of the IconButtonToggle.
	min-height: 24px;
	padding: 0 4px 0 0;
	display: flex;
	align-items: flex-start;
`;

const ScoreIcon = styled( Icon )`
	margin-top: 3px;
	position: relative;
	left: -1px;
`;

const AnalysisResultText = styled.p`
	margin: 0 8px 0 11px; // icon 13 + 11 = 24 for the 8px grid.
	flex: 1 1 auto;
`;

/**
 * Returns an AnalysisResult component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The rendered AnalysisResult component.
 */
export const AnalysisResult = ( props ) => {
	return (
		<AnalysisResultBase { ...props }>
			<ScoreIcon
				icon={ circle }
				color={ props.bulletColor }
				size="13px"
			/>
			<AnalysisResultText dangerouslySetInnerHTML={ { __html: props.text } } />
			{
				props.hasMarksButton &&
					<IconButtonToggle
						buttonsDisabled={ props.buttonsDisabled }
						className={ props.markButtonClassName }
						onClick={ props.onButtonClick }
						id={ props.buttonId }
						icon={ eye }
						pressed={ props.pressed }
						ariaLabel={ props.ariaLabel }
					/>
			}
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	text: PropTypes.string.isRequired,
	bulletColor: PropTypes.string.isRequired,
	hasMarksButton: PropTypes.bool.isRequired,
	buttonId: PropTypes.string.isRequired,
	pressed: PropTypes.bool.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	buttonsDisabled: PropTypes.bool,
	markButtonClassName: PropTypes.string,
};

AnalysisResult.defaultProps = {
	buttonsDisabled: false,
};

export default AnalysisResult;
