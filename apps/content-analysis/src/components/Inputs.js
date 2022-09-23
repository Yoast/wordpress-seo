// External dependencies.
import { capitalize, isEmpty, noop } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toggle } from "@yoast/components";

// Internal dependencies.
import { setConfigurationAttribute } from "../redux/actions/configuration";
import { setOption } from "../redux/actions/options";
import { setPaperAttribute } from "../redux/actions/paper";
import measureTextWidth from "../utils/measureTextWidth";
import { ColumnLeft, ColumnRight, Columns } from "./Columns";
import { Container } from "./Container";
import { H3 } from "./headings";
import Input from "./Input";
import TextArea from "./TextArea";

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
		<Container>
			{ renderPaperAttribute( props, "keyword", "Choose a focus keyword", "Focus keyphrase" ) }
		</Container>

		<Container marginTop="8px">
			<Toggle
				id="toggle-is-related-keyword"
				labelText="Is a related keyphrase"
				isEnabled={ props.isRelatedKeyphrase }
				onSetToggleState={ value => {
					props.setOption( "isRelatedKeyphrase", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>

		<Container>
			{ renderPaperAttribute( props, "synonyms", "Choose keyword synonyms" ) }
		</Container>

		<Container>
			{ renderPaperAttribute( props, "title", "Write the SEO title", "SEO title", ( id, value ) => {
				props.setPaperAttribute( id, value );
				props.setPaperAttribute( "titleWidth", measureTextWidth( value ) );
			} ) }
		</Container>

		<Container>
			<TextArea
				id="description"
				value={ props.paper.description }
				label="Meta description"
				placeholder="Write a meta description"
				onChange={ props.setPaperAttribute }
				minHeight="80px"
			/>
		</Container>

		<Container>
			{ renderPaperAttribute( props, "slug", "Choose a slug", "Slug", ( id, value ) => {
				props.setPaperAttribute( id, value );
				props.setPaperAttribute( "permalink", `${window.location.origin}/${value}` );
			} ) }
		</Container>

		<Container>
			{ renderPaperAttribute( props, "locale", "en_US", "Locale", ( id, value ) => {
				props.setPaperAttribute( id, value );
				props.setConfigurationAttribute( id, value );
				/*
				 * Set the language used on window.localStorage and refresh the page, so that a new web worker
				 * with the correct language-specific researcher can be initialized.
				 */
				window.localStorage.language = value.split( "_" )[ 0 ];
				setTimeout( () => window.location.reload(), 2000 );
			} ) }
		</Container>
	</section>;
}

function renderRightColumn( props ) {
	return <section>
		<Container>
			<H3>Feature toggles</H3>
		</Container>

		<Container>
			<Toggle
				id="toggle-is-related-keyword"
				labelText="Is a cornerstone article"
				isEnabled={ props.useCornerstone }
				onSetToggleState={ value => {
					props.setConfigurationAttribute( "useCornerstone", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>

		<Container>
			<Toggle
				id="toggle-use-taxonomy"
				labelText="Is a taxonomy page"
				isEnabled={ props.useTaxonomy }
				onSetToggleState={ value => {
					props.setConfigurationAttribute( "useTaxonomy", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>

		<Container>
			<Toggle
				id="toggle-use-morphology"
				labelText="Use morphology"
				isEnabled={ props.useMorphology }
				onSetToggleState={ value => {
					props.setOption( "useMorphology", value );
				} }
				onToggleDisabled={ noop }
			/>
		</Container>
	</section>;
}

function Inputs( props ) {
	return <Fragment>
		{ renderPaperAttribute( props, "text", "Write a text", null, null, TextArea ) }
		<Columns minWidth="1400px">
			<ColumnLeft minWidth="1400px">
				{ renderLeftColumn( props ) }
			</ColumnLeft>
			<ColumnRight minWidth="1400px">
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
			useTaxonomy: state.configuration.useTaxonomy,
			isRelatedKeyphrase: state.options.isRelatedKeyphrase,
			useMorphology: state.options.useMorphology,
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			setConfigurationAttribute,
			setOption,
			setPaperAttribute,
		}, dispatch );
	},
)( Inputs );
