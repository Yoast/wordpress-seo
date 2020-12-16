
import { WarningBlock } from "../../../src/blocks/warning-block/configuration";

describe( "the warning block configuration", () => {
	it( "should have a removedBlock attribute of type string", () => {
		expect( WarningBlock ).toHaveProperty( "attributes.removedBlock" );
		expect( WarningBlock.attributes ).toHaveProperty( "removedBlock.type", "string" );
	} );

	it( "should have a removedAttributes attribute of type object", () => {
		expect( WarningBlock ).toHaveProperty( "attributes.removedAttributes" );
		expect( WarningBlock.attributes ).toHaveProperty( "removedAttributes.type", "object" );
	} );

	it( "should have a warningText attribute of type string", () => {
		expect( WarningBlock ).toHaveProperty( "attributes.warningText" );
		expect( WarningBlock.attributes ).toHaveProperty( "warningText.type", "string" );
	} );

	it( "should have an isRequired attribute of type boolean", () => {
		expect( WarningBlock ).toHaveProperty( "attributes.isRequired" );
		expect( WarningBlock.attributes ).toHaveProperty( "isRequired.type", "boolean" );
	} );

	it( "has an empty parent property, such that it is not available to the user", () => {
		expect( WarningBlock ).toHaveProperty( "parent" );
		expect( WarningBlock.parent ).toEqual( [] );
	} );

	it( "has an empty save method, such that it is not shown on the frontend", () => {
		expect( WarningBlock ).toHaveProperty( "save" );
		// @ts-ignore
		expect( WarningBlock.save() ).toEqual( null );
	} );

	it( "has an edit method.", () => {
		expect( WarningBlock ).toHaveProperty( "edit" );
	} );
} );
