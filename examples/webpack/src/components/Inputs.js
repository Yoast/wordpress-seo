import TextArea from "./TextArea";
import React from "react";
import Input from "./Input";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { setPaperAttribute } from "../redux/actions/paper";

function renderPaperAttribute( props, id, placeholder, label = null, Component = Input, defaultValue = "" ) {
	const { setPaperAttribute: onChange, paper } = props;

	return (
		<Component
			id={ id }
			value={ paper[ id ] || defaultValue }
			label={ label || id }
			placeholder={ placeholder }
			onChange={ onChange }
		/>
	);
}

function Inputs( props ) {
	return <section>
		{ renderPaperAttribute( props, "text", "Write a text", null, TextArea ) }
		{ renderPaperAttribute( props, "keyword", "Choose a focus keyword", "Focus keyword" ) }
		{ renderPaperAttribute( props, "synonyms", "Choose keyword synonyms" ) }
		{ renderPaperAttribute( props, "title", "Write the SEO title" ) }
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
