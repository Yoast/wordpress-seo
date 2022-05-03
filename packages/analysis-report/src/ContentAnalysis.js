// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";
import { Collapsible, StyledIconsButton } from "@yoast/components";

// Internal dependencies.
import AnalysisList from "./AnalysisList";

const ContentAnalysisContainer = styled.div`
	width: 100%;
	background-color: white;
	border-bottom: 1px solid transparent; // Avoid parent and child margin collapsing.
`;

const StyledCollapsible = styled( Collapsible )`
	margin-bottom: 8px;

	button:first-child svg {
		margin: -2px 8px 0 -2px; // Compensate icon size set to 18px.
	}

	${ StyledIconsButton } {
		padding: 8px 0;
		color: ${ colors.$color_blue }
	}
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
class ContentAnalysis extends React.Component {
	/**
	 * Renders a Collapsible component with a liset of Analysis results.
	 *
	 * @param {string} title        The title of the collapsible section.
	 * @param {number} headingLevel Heading level: 1 for h1, 2 for h2, etc.
	 * @param {object} results      The list of results to display.
	 *
	 * @returns {ReactElement} The collapsible section with list of results.
	 */
	renderCollapsible( title, headingLevel, results ) {
		return (
			<StyledCollapsible
				initialIsOpen={ true }
				title={ `${ title } (${ results.length })` }
				prefixIcon={ { icon: "angle-up", color: colors.$color_grey_dark, size: "18px" } }
				prefixIconCollapsed={ { icon: "angle-down", color: colors.$color_grey_dark, size: "18px" } }
				suffixIcon={ null }
				suffixIconCollapsed={ null }
				headingProps={ { level: headingLevel, fontSize: "13px", fontWeight: "bold" } }
			>
				<AnalysisList
					results={ results }
					marksButtonActivatedResult={ this.props.activeMarker }
					marksButtonStatus={ this.props.marksButtonStatus }
					marksButtonClassName={ this.props.marksButtonClassName }
					onMarksButtonClick={ this.props.onMarkButtonClick }
				/>
			</StyledCollapsible>
		);
	}

	/**
	 * Renders a ContentAnalysis component.
	 *
	 * @returns {ReactElement} The rendered ContentAnalysis component.
	 */
	render() {
		const {
			problemsResults,
			improvementsResults,
			goodResults,
			considerationsResults,
			errorsResults,
			headingLevel,
		} = this.props;
		const errorsFound = errorsResults.length;
		const problemsFound = problemsResults.length;
		const improvementsFound = improvementsResults.length;
		const considerationsFound = considerationsResults.length;
		const goodResultsFound = goodResults.length;

		// Analysis collapsibles are only rendered when there is at least one analysis result for that category present.
		return (
			<ContentAnalysisContainer>
				{ errorsFound > 0 &&
					this.renderCollapsible( __( "Errors", "wordpress-seo" ), headingLevel, errorsResults )
				}
				{ problemsFound > 0 &&
					this.renderCollapsible( __( "Problems", "wordpress-seo" ), headingLevel, problemsResults )
				}
				{ improvementsFound > 0 &&
					this.renderCollapsible( __( "Improvements", "wordpress-seo" ), headingLevel, improvementsResults )
				}
				{ considerationsFound > 0 &&
					this.renderCollapsible( __( "Considerations", "wordpress-seo" ), headingLevel, considerationsResults )
				}
				{ goodResultsFound > 0 &&
					this.renderCollapsible( __( "Good results", "wordpress-seo" ), headingLevel, goodResults )
				}
			</ContentAnalysisContainer>
		);
	}
}

ContentAnalysis.propTypes = {
	onMarkButtonClick: PropTypes.func,
	problemsResults: PropTypes.array,
	improvementsResults: PropTypes.array,
	goodResults: PropTypes.array,
	considerationsResults: PropTypes.array,
	errorsResults: PropTypes.array,
	headingLevel: PropTypes.number,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	activeMarker: PropTypes.string,
};

ContentAnalysis.defaultProps = {
	onMarkButtonClick: () => {},
	problemsResults: [],
	improvementsResults: [],
	goodResults: [],
	considerationsResults: [],
	errorsResults: [],
	headingLevel: 4,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	activeMarker: "",
};

export default ContentAnalysis;
