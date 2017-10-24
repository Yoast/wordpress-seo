import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";

import AnalysisResult from "../components/AnalysisResult.js";
import AnalysisCollapsible from "../components/AnalysisCollapsible.js";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
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
export default class ContentAnalysis extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			checked: "2",
		};
	}

	handleClick( id ) {
		if ( id === this.state.checked ) {
			this.setState( {
				checked: "-1",
			} );
			return;
		}

		this.setState( {
			checked: id,
		} );
	}

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

	getResults( results ) {
		return results.map( ( result ) => {
			let color = this.getColor( result.rating );

			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				ariaLabel="highlight this result in the text"
				pressed={ result.id === this.state.checked }
				buttonId={ result.id }
				onButtonClick={ this.handleClick.bind( this, result.id ) }
			/>;
		} );
	}

	render() {
		return (
			<ContentAnalysisContainer>
				{ this.props.problemsResults.results.length > 0 ? <AnalysisCollapsible initialIsOpen={ this.props.problemsResults.initialIsOpen } title= { this.props.problemsResults.heading }>
					{ this.getResults( this.props.problemsResults.results ) }
				</AnalysisCollapsible> : null }
				{ this.props.improvementsResults.results.length > 0 ? <AnalysisCollapsible initialIsOpen={ this.props.improvementsResults.initialIsOpen } title= { this.props.improvementsResults.heading }>
					{ this.getResults( this.props.improvementsResults.results ) }
				</AnalysisCollapsible> : null }
				{ this.props.goodResults.results.length > 0 ? <AnalysisCollapsible initialIsOpen={ this.props.goodResults.initialIsOpen } title= { this.props.goodResults.heading }>
					{ this.getResults( this.props.goodResults.results ) }
				</AnalysisCollapsible> : null }
				{ this.props.considerationsResults.results.length > 0 ? <AnalysisCollapsible initialIsOpen={ this.props.considerationsResults.initialIsOpen } title= { this.props.considerationsResults.heading }>
					{ this.getResults( this.props.considerationsResults.results ) }
				</AnalysisCollapsible> : null }
				{ this.props.errorsResults.results.length > 0 ? <AnalysisCollapsible initialIsOpen={ this.props.errorsResults.initialIsOpen } title= { this.props.errorsResults.heading }>
					{ this.getResults( this.props.errorsResults.results ) }
				</AnalysisCollapsible> : null }
			</ContentAnalysisContainer>
		);
	}
}
