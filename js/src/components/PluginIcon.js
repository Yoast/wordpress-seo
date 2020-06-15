import PropTypes from "prop-types";
import styled from "styled-components";
import Icon from "../../../images/Yoast_icon_kader.svg";

const PluginIcon = styled( Icon )`
	&&& circle.yoast-icon-readability-score {
		fill: ${ props => props.readabilityScoreColor };
		display: ${ props => props.isContentAnalysisActive ? "inline" : "none" };
	}
	
	&&& circle.yoast-icon-seo-score {
		fill: ${ props => props.seoScoreColor };
		display: ${ props => props.isKeywordAnalysisActive ? "inline" : "none" };
	}
`;

PluginIcon.proptypes = {
	readabilityScoreColor: PropTypes.string.isRequired,
	isContentAnalysisActive: PropTypes.bool.isRequired,
	seoScoreColor: PropTypes.string.isRequired,
	isKeywordAnalysisActive: PropTypes.bool.isRequired,
};

export default PluginIcon;
