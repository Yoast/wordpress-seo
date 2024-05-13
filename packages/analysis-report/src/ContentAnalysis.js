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

	${ StyledIconsButton } {
		padding: 8px 0;
		color: ${ colors.$color_blue };
		margin: -2px 8px 0 -2px; // Compensate icon size set to 18px.
	}
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
class ContentAnalysis extends React.Component {
	/**
	 * Renders a Collapsible component with a list of Analysis results.
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
				headingProps={ { level: headingLevel, fontSize: "13px", fontWeight: "500", color: "#1e1e1e" } }
			>
				<AnalysisList
					results={ results }
					marksButtonActivatedResult={ this.props.activeMarker }
					marksButtonStatus={ this.props.marksButtonStatus }
					marksButtonClassName={ this.props.marksButtonClassName }
					editButtonClassName={ this.props.editButtonClassName }
					markButtonFactory={ this.props.markButtonFactory }
					onMarksButtonClick={ this.props.onMarkButtonClick }
					onEditButtonClick={ this.props.onEditButtonClick }
					renderAIFixesButton={ this.props.renderAIFixesButton }
					isPremium={ this.props.isPremium }
					onResultChange={ this.props.onResultChange }
					shouldUpsellHighlighting={ this.props.shouldUpsellHighlighting }
					renderHighlightingUpsell={ this.props.renderHighlightingUpsell }
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
			upsellResults,
			headingLevel,
			resultCategoryLabels,
		} = this.props;
		const errorsFound = errorsResults.length;
		const problemsFound = problemsResults.length;
		const improvementsFound = improvementsResults.length;
		const considerationsFound = considerationsResults.length;
		const goodResultsFound = goodResults.length;
		const numberOfUpsellResults = upsellResults.length;

		const defaultLabels = {
			errors: __( "Errors", "wordpress-seo" ),
			problems: __( "Problems", "wordpress-seo" ),
			improvements: __( "Improvements", "wordpress-seo" ),
			considerations: __( "Considerations", "wordpress-seo" ),
			goodResults: __( "Good results", "wordpress-seo" ),
		};

		const labels = Object.assign( defaultLabels, resultCategoryLabels );

		// Analysis collapsibles are only rendered when there is at least one analysis result for that category present.
		return (
			<ContentAnalysisContainer>
				{ errorsFound > 0 &&
					this.renderCollapsible( labels.errors, headingLevel, errorsResults )
				}
				{ ( problemsFound + numberOfUpsellResults ) > 0 &&
					this.renderCollapsible( labels.problems, headingLevel, [ ...upsellResults, ...problemsResults ] )
				}
				{ improvementsFound > 0 &&
					this.renderCollapsible( labels.improvements, headingLevel, improvementsResults )
				}
				{ considerationsFound > 0 &&
					this.renderCollapsible( labels.considerations, headingLevel, considerationsResults )
				}
				{ goodResultsFound > 0 &&
					this.renderCollapsible( labels.goodResults, headingLevel, goodResults )
				}
			</ContentAnalysisContainer>
		);
	}
}

ContentAnalysis.propTypes = {
	onMarkButtonClick: PropTypes.func,
	onEditButtonClick: PropTypes.func,
	problemsResults: PropTypes.array,
	improvementsResults: PropTypes.array,
	goodResults: PropTypes.array,
	considerationsResults: PropTypes.array,
	errorsResults: PropTypes.array,
	upsellResults: PropTypes.array,
	headingLevel: PropTypes.number,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	markButtonFactory: PropTypes.func,
	editButtonClassName: PropTypes.string,
	activeMarker: PropTypes.string,
	isPremium: PropTypes.bool,
	resultCategoryLabels: PropTypes.shape( {
		errors: PropTypes.string,
		problems: PropTypes.string,
		improvements: PropTypes.string,
		considerations: PropTypes.string,
		goodResults: PropTypes.string,
	} ),
	onResultChange: PropTypes.func,
	shouldUpsellHighlighting: PropTypes.bool,
	renderHighlightingUpsell: PropTypes.func,
	renderAIFixesButton: PropTypes.func,
};

ContentAnalysis.defaultProps = {
	onMarkButtonClick: () => {},
	onEditButtonClick: () => {},
	problemsResults: [],
	improvementsResults: [],
	goodResults: [],
	considerationsResults: [],
	errorsResults: [],
	upsellResults: [],
	headingLevel: 4,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	markButtonFactory: null,
	editButtonClassName: "",
	activeMarker: "",
	isPremium: false,
	resultCategoryLabels: {},
	onResultChange: () => {},
	shouldUpsellHighlighting: false,
	renderHighlightingUpsell: () => {},
	renderAIFixesButton: () => {},
};

export default ContentAnalysis;
