import PropTypes from "prop-types";
import styled from "styled-components";

const PluginIconSVG = styled.svg`
	&&& circle.yoast-icon-readability-score {
		fill: ${ props => props.readabilityScoreColor };
		display: ${ props => props.isContentAnalysisActive ? "inline" : "none" };
	}
	
	&&& circle.yoast-icon-seo-score {
		fill: ${ props => props.seoScoreColor };
		display: ${ props => props.isKeywordAnalysisActive ? "inline" : "none" };
	}
`;

/**
 * Renders the plugin icon SVG for Yoast SEO in the editor.
 * @param {object} props The props.
 * @returns {wp.Element} The component.
 */
const PluginIcon = function( props ) {
	/* eslint-disable max-len */
	return <PluginIconSVG { ...props } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 646.66 456.27">
		<path
			d="M73,405.26a68.53,68.53,0,0,1-12.82-4c-1-.42-2-.89-3-1.37-1.49-.72-3-1.56-4.77-2.56-1.5-.88-2.71-1.64-3.83-2.39-.9-.61-1.8-1.26-2.68-1.92q-2.64-2-5.08-4.19a68.26,68.26,0,0,1-8.4-9.17c-.92-1.2-1.68-2.25-2.35-3.24q-1.84-2.73-3.44-5.64a68.26,68.26,0,0,1-8.29-32.55V142.13a68.29,68.29,0,0,1,8.29-32.55,58.6,58.6,0,0,1,3.44-5.64,57.53,57.53,0,0,1,4-5.27A69.64,69.64,0,0,1,48.56,85.42,56.06,56.06,0,0,1,54.2,82,67.78,67.78,0,0,1,73,75.09,69.79,69.79,0,0,1,86.75,73.7H256.41L263,55.39H86.75A86.84,86.84,0,0,0,0,142.13V338.22A86.83,86.83,0,0,0,86.75,425H98.07V406.65H86.75A68.31,68.31,0,0,1,73,405.26ZM368.55,60.85l-1.41-.53L360.73,77.5l1.41.53a68.58,68.58,0,0,1,8.66,4,58.65,58.65,0,0,1,5.65,3.43A69.49,69.49,0,0,1,391,98.67c1.4,1.68,2.72,3.46,3.95,5.27s2.39,3.72,3.44,5.64a68.32,68.32,0,0,1,8.29,32.55V406.65H233.55l-.44.76c-3.07,5.37-6.26,10.48-9.49,15.19L222,425H425V142.13A87.19,87.19,0,0,0,368.55,60.85Z"
			fill="#000001"
		/>
		<path
			d="M303.66,0l-96.8,268.87-47.58-149H101.1l72.72,186.78a73.61,73.61,0,0,1,0,53.73c-7.07,18.07-19.63,39.63-54.36,46l-1.56.29v49.57l2-.08c29-1.14,51.57-10.72,70.89-30.14,19.69-19.79,36.55-50.52,53-96.68L366.68,0Z"
			fill="#000001"
		/>
		<circle
			className="yoast-icon-readability-score"
			cx="561.26"
			cy="142.43"
			r="85.04"
			fill="#000001"
			stroke="#181716"
			strokeMiterlimit="10"
			strokeWidth="0.72"
		/>
		<circle
			className="yoast-icon-seo-score"
			cx="561.26"
			cy="341.96"
			r="85.04"
			fill="#000001"
			stroke="#181716"
			strokeMiterlimit="10"
			strokeWidth="0.72"
		/>
	</PluginIconSVG>;
	/* eslint-enable max-len */
};

PluginIcon.propTypes = {
	readabilityScoreColor: PropTypes.string.isRequired,
	isContentAnalysisActive: PropTypes.bool.isRequired,
	seoScoreColor: PropTypes.string.isRequired,
	isKeywordAnalysisActive: PropTypes.bool.isRequired,
};

export default PluginIcon;
