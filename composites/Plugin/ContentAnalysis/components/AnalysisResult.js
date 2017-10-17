import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";

import { circle } from "../../../../style-guide/svg";
import Icon from "../../Shared/components/Icon.js";

/**
 * Returns a AnalysisResultBase component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The rendered AnalysisResultBase component.
 */
const AnalysisResultBase = styled.li`
	background-color: ${ colors.$color_purple };
	min-height: 300px;
`;

export const AnalysisResult = ( props ) => {
	return (
		<AnalysisResultBase>
			<Icon
				icon={ circle }
				color={ props.bulletColor }
			/>
			{ props.resultText }
		</AnalysisResultBase>
	);
};

AnalysisResult.propTypes = {
	resultText: PropTypes.string.isRequired,
	bulletColor: PropTypes.string.isRequired,
	eyeButtonIsActive: PropTypes.bool.isRequired,
};

AnalysisResult.defaultProps = {

};


export default AnalysisResult;
