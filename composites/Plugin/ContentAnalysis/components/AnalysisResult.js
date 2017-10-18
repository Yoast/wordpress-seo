import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";

import { circle } from "../../../../style-guide/svg/index";
import { eye } from "../../../../style-guide/svg/index";
import { Icon } from "../../Shared/components/Icon.js";
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
			<Icon
				icon={ circle }
				color={ props.bulletColor }
				size="13px"
				aria-label={ "SEO score " + props.score }
				aria-hidden={ false }
				focusable={ true }
			/>
			<AnalysisResultText>{ props.resultText }</AnalysisResultText>
			{
				props.eyeButtonIsActive
					? <IconButtonToggle
						onClick={ props.onClick }
						id={ props.id }
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
	id: PropTypes.string.isRequired,
	pressed: PropTypes.bool.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	score: PropTypes.string.isRequired,
};

export default AnalysisResult;
