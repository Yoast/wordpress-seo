// External dependencies.
import { noop } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Toggle, IconButton } from "@yoast/components";

// Internal dependencies.
import { setConfigurationAttribute } from "../redux/actions/configuration";
import { setOption } from "../redux/actions/options";
import { clearStorage } from "../redux/utils/localstorage";
import AutomaticAnalysis from "./AutomaticAnalysis";
import { ButtonContainer, Container, HeadingContainer } from "./Container";
import SelectTestPaper from "./SelectTestPaper";

function clearStorageAction() {
	clearStorage();
	window.location.reload();
}

function Controls( {
	isTreeBuilderEnabled,
	useKeywordDistribution,
	onInitialize,
	onAnalyze,
	onAnalyzeSpam,
	setConfigAttribute,
	setOptionAttribute,
	onPolishPerformanceAnalysis,
} ) {
	return <Fragment>
		<Container marginTop="0">
			<SelectTestPaper />
		</Container>

		<ButtonContainer>
			<IconButton icon="gear" onClick={ onInitialize }>Initialize</IconButton>
			<IconButton icon="search" onClick={ () => onAnalyze() }>Analyze</IconButton>
			<IconButton icon="search" onClick={ onAnalyzeSpam }>Spam analyze</IconButton>
			<IconButton icon="times" onClick={ clearStorageAction }>Clear inputs</IconButton>
			<IconButton icon="gear" onClick={ onPolishPerformanceAnalysis }>Compare performance Polish/Spanish/English</IconButton>
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

			<Container>
				<Toggle
					id="toggle-is-tree-builder-enabled"
					labelText="Build the tree"
					isEnabled={ isTreeBuilderEnabled }
					onSetToggleState={ value => {
						setOptionAttribute( "isTreeBuilderEnabled", value );
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
			isTreeBuilderEnabled: state.options.isTreeBuilderEnabled,
			useKeywordDistribution: state.configuration.useKeywordDistribution,
		};
	},
	( dispatch ) => {
		return {
			setConfigAttribute: ( name, value ) => dispatch( setConfigurationAttribute( name, value ) ),
			setOptionAttribute: ( name, value ) => dispatch( setOption( name, value ) ),
		};
	},
)( Controls );
