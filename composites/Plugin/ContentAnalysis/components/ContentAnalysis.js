/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import colors from "../../../../style-guide/colors.json";
import AnalysisResult from "../components/AnalysisResult.js";
import AnalysisCollapsible from "../components/AnalysisCollapsible.js";

export const ContentAnalysisContainer = styled.div`
	width: 100%;
	background-color: white;
	max-width: 800px;
	margin: 0 auto;
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
	 * Gets the color for the bullet, based on the rating.
	 *
	 * @param {string} rating The rating of the result.
	 *
	 * @returns {string} The color for the bullet.
	 */
	getColor( rating ) {
		switch ( rating ) {
			case "good":
				return colors.$color_good;
			case "OK":
				return colors.$color_ok;
			case "bad":
				return colors.$color_bad;
			default:
				return colors.$color_score_icon;
		}
	}

	/**
	 * Returns an AnalysisResult component for each result.
	 *
	 * @param {array} results The analysis results.
	 *
	 * @returns {array} A list of AnalysisResult components.
	 */
	getResults( results ) {
		return results.map( ( result ) => {
			let color = this.getColor( result.rating );
			let isPressed = result.id === this.state.checked;
			let ariaLabel = "";
			if ( this.props.marksButtonStatus === "disabled" ) {
				ariaLabel = __( "Marks are disabled in current view", "yoast-components" );
			} else if ( isPressed ) {
				ariaLabel = __( "Remove highlight from the text", "yoast-components" );
			} else {
				ariaLabel = __( "Highlight this result in the text", "yoast-components" );
			}
			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				ariaLabel={ ariaLabel }
				pressed={ isPressed }
				buttonId={ result.id }
				onButtonClick={ this.handleClick.bind( this, result.id, result.marker ) }
				marksButtonClassName={ this.props.marksButtonClassName }
				marksButtonStatus={ this.props.marksButtonStatus }
			/>;
		} );
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
				<AnalysisCollapsible
					headingLevel={ headingLevel }
					title={ __( "Errors", "yoast-components" ) }
				>
					{ this.getResults( errorsResults ) }
				</AnalysisCollapsible> }
				{ problemsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ __( "Problems", "yoast-components" ) }
					>
						{ this.getResults( problemsResults ) }
					</AnalysisCollapsible> }
				{ improvementsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ __( "Improvements", "yoast-components" ) }
					>
						{ this.getResults( improvementsResults ) }
					</AnalysisCollapsible> }
				{ considerationsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ __( "Considerations", "yoast-components" ) }
					>
						{ this.getResults( considerationsResults ) }
					</AnalysisCollapsible> }
				{ goodResultsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ __( "Good results", "yoast-components" ) }
					>
						{ this.getResults( goodResults ) }
					</AnalysisCollapsible> }
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
