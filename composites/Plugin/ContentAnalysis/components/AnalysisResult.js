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
	padding: 4px;
	display: flex;
	align-items: flex-start;
`;

const ScoreIcon = styled( Icon )`
	margin-top: 4px;
`;

const AnalysisResultText = styled.p`
	margin: 0 8px;
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
			<AnalysisResultText>{ props.resultText }</AnalysisResultText>
			{
				props.eyeButtonIsActive &&
					<IconButtonToggle
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
	resultText: PropTypes.string.isRequired,
	bulletColor: PropTypes.string.isRequired,
	eyeButtonIsActive: PropTypes.bool.isRequired,
	buttonId: PropTypes.string.isRequired,
	pressed: PropTypes.bool.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	score: PropTypes.string.isRequired,
};

export default AnalysisResult;
