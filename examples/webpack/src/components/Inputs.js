import { capitalize, noop } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toggle from "yoast-components/composites/Plugin/Shared/components/Toggle";

import { setConfigurationAttribute } from "../redux/actions/configuration";
import { setPaperAttribute } from "../redux/actions/paper";
import measureTextWidth from "../utils/measureTextWidth";
import Container from "./Container";
import Input from "./Input";
import TextArea from "./TextArea";
import { ColumnLeft, ColumnRight, Columns } from "./Columns";

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

function renderLeftColumn( props ) {
	return <section>
		{ renderPaperAttribute( props, "keyword", "Choose a focus keyword", "Focus keyphrase" ) }
		<Container marginTop="8px">
			<Toggle
				id="toggle-is-related-keyword"
				labelText="Is a related keyphrase"
				isEnabled={ props.isRelatedKeyphrase }
				onSetToggleState={ value => {
					props.setConfigurationAttribute( "isRelatedKeyphrase", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>
		{ renderPaperAttribute( props, "synonyms", "Choose keyword synonyms" ) }
		{ renderPaperAttribute( props, "title", "Write the SEO title", "SEO title", ( id, value ) => {
			props.setPaperAttribute( id, value );
			props.setPaperAttribute( "titleWidth", measureTextWidth( value ) );
		} ) }
		{ renderPaperAttribute( props, "description", "Write a meta description", "Meta description" ) }
		{ renderPaperAttribute( props, "url", "Choose a slug", "Slug", ( id, value ) => {
			props.setPaperAttribute( id, value );
			props.setPaperAttribute( "permalink", `${window.location.origin}/${value}` );
		} ) }
		{ renderPaperAttribute( props, "locale", "en_US" ) }
	</section>;
}

function renderRightColumn( props ) {
	return <section>
		<Container>
			<Toggle
				id="toggle-is-related-keyword"
				labelText="Is a Cornerstone article"
				isEnabled={ props.useCornerstone }
				onSetToggleState={ value => {
					props.setConfigurationAttribute( "useCornerstone", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>
	</section>;
}

function Inputs( props ) {
	return <Fragment>
		{ renderPaperAttribute( props, "text", "Write a text", null, null, TextArea ) }
		<Columns minWidth="1000px">
			<ColumnLeft>
				{ renderLeftColumn( props ) }
			</ColumnLeft>
			<ColumnRight>
				{ renderRightColumn( props ) }
			</ColumnRight>
		</Columns>
	</Fragment>;
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
			useCornerstone: state.configuration.useCornerstone,
			isRelatedKeyphrase: state.configuration.isRelatedKeyphrase,
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			setPaperAttribute,
			setConfigurationAttribute,
		}, dispatch );
	}
)( Inputs );
