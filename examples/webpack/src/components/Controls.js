/* External */
import React, { Fragment } from "react";
import { connect } from "react-redux";

/* Internal */
import Button from "./Button";
import { clearStorage } from "../redux/utils/localstorage";
import Checkbox from "./Checkbox";
import AutomaticAnalysis from "./AutomaticAnalysis";


function Controls( { useKeywordDistribution, onInitialize, onAnalyze, onAnalyzeSpam } ) {
	return <Fragment>
		<div className="button-container">
			<AutomaticAnalysis />

			<Button onClick={ onInitialize }>Initialize</Button>
			<Button onClick={ onAnalyze }>Analyze</Button>
			<Button onClick={ () => {
				clearStorage();
				window.location.reload();
			} }>Clear</Button>
			<Button onClick={ onAnalyzeSpam }>Analyze Spam</Button>
		</div>

		<h2>Configuration</h2>
		<Checkbox
			id="premium"
			value={ useKeywordDistribution }
			label="Premium"
			onChange={ value => {
				this.props.setConfigurationAttribute( "useKeywordDistribution", value );
			} }
		/>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			useKeywordDistribution: state.configuration.useKeywordDistribution,
		};
	},
)( Controls );
