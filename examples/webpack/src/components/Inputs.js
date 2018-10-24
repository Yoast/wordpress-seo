import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { capitalize, noop } from "lodash-es";
import styled from "styled-components";

import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";

import Input from "./Input";
import TextArea from "./TextArea";
import { setPaperAttribute } from "../redux/actions/paper";
import measureTextWidth from "../utils/measureTextWidth";
import { setConfigurationAttribute } from "../redux/actions/configuration";

const ToggleContainer = styled.div`
	margin-top: 8px;
`;

function renderPaperAttribute( props, id, placeholder, label = null, onChange = null, Component = Input, defaultValue = "" ) {
	if ( onChange === null ) {
		onChange = props.setPaperAttribute;
	}

	return (
		<Component
			id={ id }
			value={ props.paper[ id ] || defaultValue }
			label={ label || capitalize( id ) }
			placeholder={ placeholder }
			onChange={ onChange }
		/>
	);
}

function Inputs( props ) {
	return <section>
		{ renderPaperAttribute( props, "text", "Write a text", null, null, TextArea ) }
		{ renderPaperAttribute( props, "keyword", "Choose a focus keyword", "Focus keyphrase" ) }
		{ renderPaperAttribute( props, "synonyms", "Choose keyword synonyms" ) }
		{ renderPaperAttribute( props, "title", "Write the SEO title", null, ( id, value ) => {
			props.setPaperAttribute( id, value );
			props.setPaperAttribute( "titleWidth", measureTextWidth( value ) );
		} ) }
		{ renderPaperAttribute( props, "description", "Write a meta description" ) }
		{ renderPaperAttribute( props, "permalink", "Choose a slug", "Slug" ) }
		{ renderPaperAttribute( props, "locale", "en_US" ) }
		<ToggleContainer>
			<Toggle
				id="toggle-use-cornerstone"
				labelText="Is cornerstone article"
				isEnabled={ props.useCornerstone }
				onSetToggleState={ value => {
					props.setConfigurationAttribute( "useCornerstone", value );
				} }
				onToggleDisabled={ noop }
			/>
		</ToggleContainer>
	</section>;
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
			useCornerstone: state.configuration.useCornerstone,
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			setPaperAttribute,
			setConfigurationAttribute,
		}, dispatch );
	}
)( Inputs );
