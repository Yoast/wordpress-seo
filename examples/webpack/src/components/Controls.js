/* External */
import { noop } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";

/* Internal */
import { setConfigurationAttribute } from "../redux/actions/configuration";
import { clearStorage } from "../redux/utils/localstorage";
import AutomaticAnalysis from "./AutomaticAnalysis";
import Button from "./Button";
import Container from "./Container";

function clearStorageAction() {
	clearStorage();
	window.location.reload();
}

function Controls( {
	useKeywordDistribution,
	useTaxonomy,
	onInitialize,
	onAnalyze,
	onAnalyzeSpam,
	setConfigurationAttribute: setConfigAttribute,
} ) {
	return <Fragment>
		<div className="button-container">
			<AutomaticAnalysis />

			<Button onClick={ onInitialize }>Initialize</Button>
			<Button onClick={ onAnalyze }>Analyze</Button>
			<Button onClick={ clearStorageAction }>Clear</Button>
			<Button onClick={ onAnalyzeSpam }>Analyze Spam</Button>
		</div>

		<h2>Configuration</h2>

		<Container>
			<Toggle
				id="toggle-use-keyword-distribution"
				labelText="Use keyphrase distribution"
				isEnabled={ useKeywordDistribution }
				onSetToggleState={ value => {
					setConfigAttribute( "useKeywordDistribution", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>
		<Container>
			<Toggle
				id="toggle-use-taxonomy"
				labelText="Is taxonomy page"
				isEnabled={ useTaxonomy }
				onSetToggleState={ value => {
					setConfigAttribute( "useTaxonomy", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			useKeywordDistribution: state.configuration.useKeywordDistribution,
			useTaxonomy: state.configuration.useTaxonomy,
		};
	},
	( dispatch ) => {
		return {
			setConfigurationAttribute: ( name, value ) => dispatch( setConfigurationAttribute( name, value ) ),
		};
	},
)( Controls );
