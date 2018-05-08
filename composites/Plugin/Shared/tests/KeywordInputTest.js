import React from "react";
import renderer from "react-test-renderer";
import EnzymeAdapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme/build/index";

import KeywordInput from "../components/KeywordInput";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

describe( KeywordInput, () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<KeywordInput id="test-id" onChange={ () => {
			} } label="test label"/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "does not display the error message for a single keyword", () => {
		const wrapper = Enzyme.mount(
			<KeywordInput id="test-id" label="test label" />
		);
		wrapper.find( "input" ).simulate( "change", {
			target: {
				value: "Keyword1",
			},
		} );
		expect( wrapper.state().showErrorMessage ).toEqual( false );
	} );

	it( "does not display the error message for two words separated by whitespace", () => {
		const wrapper = Enzyme.mount(
			<KeywordInput id="test-id" label="test label" />
		);
		wrapper.find( "input" ).simulate( "change", {
			target: {
				value: "Keyword1 Keyword2",
			},
		} );
		expect( wrapper.state().showErrorMessage ).toEqual( false );
	} );

	it( "displays the error message for comma-separated words", () => {
		const wrapper = Enzyme.mount(
			<KeywordInput id="test-id" label="test label" />
		);
		wrapper.find( "input" ).simulate( "change", {
			target: {
				value: "Keyword1, Keyword2",
			},
		} );
		expect( wrapper.state().showErrorMessage ).toEqual( true );
		expect( wrapper.find( "div" ).text() ).toBeTruthy();
	} );
} );
