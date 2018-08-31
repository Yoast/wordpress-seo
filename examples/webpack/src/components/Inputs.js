import TextArea from "./TextArea";
import React from "react";
import Input from "./Input";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as configurationActionCreators from "../redux/actions/configuration";
import * as paperActionCreators from "../redux/actions/paper";
import * as resultsActionCreators from "../redux/actions/results";

function renderPaperAttribute( props, id, placeholder, label = null, Component = Input, defaultValue = "" ) {
	const { actions, paper } = props;

	return (
		<Component
			id={ id }
			value={ paper[ id ] || defaultValue }
			label={ label || id }
			placeholder={ placeholder }
			onChange={ value => actions.setPaperAttribute( id, value ) }
		/>
	);
}

function Inputs( props ) {
	return <section>
		{ renderPaperAttribute( props, "Text", "Write a text", null, TextArea ) }
		{ renderPaperAttribute( props, "Keyword", "Choose a focus keyword", "Focus keyword" ) }
		{ renderPaperAttribute( props, "Synonyms", "Choose keyword synonyms" ) }
		{ renderPaperAttribute( props, "Title", "Write the SEO title" ) }
		{ renderPaperAttribute( props, "Description", "Write a meta description" ) }
		{ renderPaperAttribute( props, "Locale", "en_US" ) }
	</section>;
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
		};
	},
	( dispatch ) => {
		return {
			actions: bindActionCreators( {
				...configurationActionCreators,
				...paperActionCreators,
				...resultsActionCreators,
			}, dispatch ),
		};
	}
)( Inputs );
