import TextArea from "./TextArea";
import React from "react";
import Input from "./Input";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { setPaperAttribute } from "../redux/actions/paper";
import measureTextWidth from "../utils/measureTextWidth";

function renderPaperAttribute( props, id, placeholder, label = null, onChange = null, Component = Input, defaultValue = "" ) {
	if ( onChange === null ) {
		onChange = props.setPaperAttribute;
	}

	return (
		<Component
			id={ id }
			value={ props.paper[ id ] || defaultValue }
			label={ label || id }
			placeholder={ placeholder }
			onChange={ onChange }
		/>
	);
}

function Inputs( props ) {
	return <section>
		{ renderPaperAttribute( props, "text", "Write a text", null, null, TextArea ) }
		{ renderPaperAttribute( props, "keyword", "Choose a focus keyword", "Focus keyword" ) }
		{ renderPaperAttribute( props, "synonyms", "Choose keyword synonyms" ) }
		{ renderPaperAttribute( props, "title", "Write the SEO title", null, ( id, value ) => {
			props.setPaperAttribute( id, value );
			props.setPaperAttribute( "titleWidth", measureTextWidth( value ) );
		} ) }
		{ renderPaperAttribute( props, "description", "Write a meta description" ) }
		{ renderPaperAttribute( props, "locale", "en_US" ) }
	</section>;
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			setPaperAttribute,
		}, dispatch );
	}
)( Inputs );
