import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { circle } from "../../../../style-guide/svg/index";
import { eye } from "../../../../style-guide/svg/index";
import { IconWithAriaLabel } from "../../Shared/components/Icon.js";
import IconButtonToggle from "../../Shared/components/IconButtonToggle.js";

/**
 * Returns a AnalysisResultBase component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The rendered AnalysisResultBase component.
 */
const AnalysisResultBase = styled.li`
	// This is the height of the IconButtonToggle.
	min-height: 24px;
	padding: 4px 4px;
	display: inline-flex;
	align-items: center;
`;

const AnalysisResultText = styled.p`
	margin: 0 8px;
`;

export const AnalysisResult = ( props ) => {
	return (
		<AnalysisResultBase { ...props }>
			<IconWithAriaLabel
				icon={ circle }
				color={ props.bulletColor }
				size="13px"
				ariaLabel={ "SEO score " + props.score }
			/>
			<AnalysisResultText>{ props.resultText }</AnalysisResultText>
			{
				props.eyeButtonIsActive
					? <IconButtonToggle
						onClick={ props.onButtonClick }
						id={ props.buttonId }
						icon={ eye }
						pressed={ props.pressed }
						ariaLabel={ props.ariaLabel }
					/>
					: null
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
