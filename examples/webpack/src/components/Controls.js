// External dependencies.
import { noop } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { IconButton } from "yoast-components/composites/Plugin/Shared/components/Button";
import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";

// Internal dependencies.
import { setConfigurationAttribute } from "../redux/actions/configuration";
import { clearStorage } from "../redux/utils/localstorage";
import AutomaticAnalysis from "./AutomaticAnalysis";
import { Container, ButtonContainer, HeadingContainer } from "./Container";

function clearStorageAction() {
	clearStorage();
	window.location.reload();
}

function Controls( {
	useKeywordDistribution,
	onInitialize,
	onAnalyze,
	onAnalyzeSpam,
	setConfigurationAttribute: setConfigAttribute,
} ) {
	return <Fragment>
		<ButtonContainer>
			<IconButton icon="gear" onClick={ onInitialize }>Initialize</IconButton>
			<IconButton icon="search" onClick={ () => onAnalyze() }>Analyze</IconButton>
			<IconButton icon="search" onClick={ onAnalyzeSpam }>Spam analyze</IconButton>
			<IconButton icon="times" onClick={ clearStorageAction }>Clear inputs</IconButton>
		</ButtonContainer>

		<HeadingContainer heading="H3" title="Configuration">
			<Container>
				<AutomaticAnalysis />
			</Container>

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
		</HeadingContainer>
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
