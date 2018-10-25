/* External */
import React, { Fragment } from "react";
import { connect } from "react-redux";

/* Internal */
import Button from "./Button";
import { clearStorage } from "../redux/utils/localstorage";
import AutomaticAnalysis from "./AutomaticAnalysis";
import { setConfigurationAttribute } from "../redux/actions/configuration";
import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";
import { noop } from "lodash-es";

function clearStorageAction() {
	clearStorage();
	window.location.reload();
}

function Controls( { useKeywordDistribution, onInitialize, onAnalyze,
					   onAnalyzeSpam, setConfigurationAttribute: setConfigAttribute } ) {
	return <Fragment>
		<div className="button-container">
			<AutomaticAnalysis />

			<Button onClick={ onInitialize }>Initialize</Button>
			<Button onClick={ onAnalyze }>Analyze</Button>
			<Button onClick={ clearStorageAction }>Clear</Button>
			<Button onClick={ onAnalyzeSpam }>Analyze Spam</Button>
		</div>

		<h2>Configuration</h2>

		<Toggle
			id="toggle-use-keyword-distribution"
			labelText="Use keyphrase distribution"
			isEnabled={ useKeywordDistribution }
			onSetToggleState={ value => {
				setConfigAttribute( "useKeywordDistribution", value );
			} }
			onToggleDisabled={ noop }
		/>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			useKeywordDistribution: state.configuration.useKeywordDistribution,
		};
	},
	( dispatch ) => {
		return {
			setConfigurationAttribute: ( name, value ) => dispatch( setConfigurationAttribute( name, value ) ),
		};
	},
)( Controls );
