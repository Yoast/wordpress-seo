import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StyledSection from "yoast-components/forms/StyledSection/StyledSection";
import colors from "yoast-components/style-guide/colors.json";

import ReadabilityAnalysis from "./ReadabilityAnalysis";
import SeoAnalysisLegacy from "./SeoAnalysisLegacy";

/**
 * Redux container for the Seo & Readability analysis.
 */
class AnalysisSection extends React.Component {
	render() {
		const { activeTab, title, className } = this.props;

		return (
			<StyledSection
				headingText={ title }
				headingLevel={ 3 }
				headingColor={ colors.$color_headings }
				headingIcon="list"
				headingIconColor={ colors.$color_headings }
				headingIconSize="16px"
				className={ className }
			>
				{ activeTab === "keyword" ? <SeoAnalysisLegacy/> : null }
				{ activeTab === "readability" ? <ReadabilityAnalysis/> : null }
			</StyledSection>
		);
	}
}

AnalysisSection.propTypes = {
	activeTab: PropTypes.string,
	title: PropTypes.string,
	className: PropTypes.string,
};

AnalysisSection.defaultProps = {
	title: "Analysis",
	className: "yoast-section",
};

/**
 * Maps redux state to AnalysisSection props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to AnalysisSection.
 */
function mapStateToProps( state ) {
	return {
		activeTab: state.activeTab,
	};
}

export default connect( mapStateToProps )( AnalysisSection );
