import { focusFocusKeyphraseInput } from "../../../src/ai-generator/helpers";

describe( "Tests focusFocusKeyphraseInput", () => {
	afterEach( () => {
		// Clean up the document after each test to ensure a fresh environment.
		document.body.innerHTML = "";
	} );

	it( 'should focus on the sidebar input when location is "modal"', () => {
		document.body.innerHTML = '<input id="focus-keyword-input-sidebar" />';
		focusFocusKeyphraseInput( "modal" );
		const inputElement = document.getElementById( "focus-keyword-input-sidebar" );
		expect( document.activeElement ).toBe( inputElement );
	} );

	it( 'should focus on the location input when location is not "modal" or "metabox"', () => {
		document.body.innerHTML = '<input id="focus-keyword-input-testLocation" />';
		focusFocusKeyphraseInput( "testLocation" );
		const inputElement = document.getElementById( "focus-keyword-input-testLocation" );
		expect( document.activeElement ).toBe( inputElement );
	} );

	it( 'should click on tabElement and focus on the box input when location is "metabox"', () => {
		document.body.innerHTML = `
      <div id="wpseo-meta-tab-content"></div>
      <input id="focus-keyword-input-metabox" />
    `;
		const tabElement = document.getElementById( "wpseo-meta-tab-content" );
		tabElement.click = jest.fn();
		focusFocusKeyphraseInput( "metabox" );
		expect( tabElement.click ).toHaveBeenCalled();
		const inputElement = document.getElementById( "focus-keyword-input-metabox" );
		expect( document.activeElement ).toBe( inputElement );
	} );

	it( "should not throw an error if elements are not found", () => {
		expect( () => focusFocusKeyphraseInput( "modal" ) ).not.toThrow();
		expect( () => focusFocusKeyphraseInput( "metabox" ) ).not.toThrow();
		expect( () => focusFocusKeyphraseInput( "testLocation" ) ).not.toThrow();
	} );
} );

