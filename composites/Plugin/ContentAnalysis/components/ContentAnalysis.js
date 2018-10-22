/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import colors from "../../../../style-guide/colors.json";
import AnalysisList from "./AnalysisList";
import Collapsible, { StyledIconsButton } from "../../../../composites/Plugin/Shared/components/Collapsible";

export const ContentAnalysisContainer = styled.div`
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
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			checked: "",
		};
	}

	/**
	 * Handles button clicks. Makes sure no more than one button can be active at the same time.
	 *
	 * @param {string} id The button id.
	 * @param {function} marker Function to apply marker to the editor.
	 *
	 * @returns {void}
	 */
	handleClick( id, marker ) {
		let checkedId = id;

		// Uncheck if button is deactivated.
		if ( id === this.state.checked ) {
			checkedId = "";
		}

		// Set state and call onMarkButtonClick callback.
		this.setState( {
			checked: checkedId,
		}, () => {
			this.props.onMarkButtonClick( this.state.checked, marker );
		} );
	}

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
					marksButtonActivatedResult={ this.state.checked }
					marksButtonStatus={ this.props.marksButtonStatus }
					marksButtonClassName={ this.props.marksButtonClassName }
					onMarksButtonClick={ this.handleClick.bind( this ) }
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
					this.renderCollapsible( __( "Errors", "yoast-components" ), headingLevel, errorsResults )
				}
				{ problemsFound > 0 &&
					this.renderCollapsible( __( "Problems", "yoast-components" ), headingLevel, problemsResults )
				}
				{ improvementsFound > 0 &&
					this.renderCollapsible( __( "Improvements", "yoast-components" ), headingLevel, improvementsResults )
				}
				{ considerationsFound > 0 &&
					this.renderCollapsible( __( "Considerations", "yoast-components" ), headingLevel, considerationsResults )
				}
				{ goodResultsFound > 0 &&
					this.renderCollapsible( __( "Good results", "yoast-components" ), headingLevel, goodResults )
				}
			</ContentAnalysisContainer>
		);
	}
}

export const contentAnalysisPropType = {
	onMarkButtonClick: PropTypes.func,
	problemsResults: PropTypes.array,
	improvementsResults: PropTypes.array,
	goodResults: PropTypes.array,
	considerationsResults: PropTypes.array,
	errorsResults: PropTypes.array,
	headingLevel: PropTypes.number,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
};

ContentAnalysis.propTypes = {
	...contentAnalysisPropType,
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
};

export default ContentAnalysis;
