import { getValuesFromCheckboxes } from "../../src/helpers/getValuesFromCheckboxes";
import { createAllCategoryElements, createCategoryElement } from "../testHelpers/createDomTestData";

const checkboxesElements = createAllCategoryElements();

const allCheckboxes = checkboxesElements.allCategoryCheckboxes;

describe( "a test for retrieving the values from checked checkboxes", () => {
	it( "should return an empty array if no checkboxes is checked", () => {
		const checkedCheckboxes = [];
		expect( getValuesFromCheckboxes( checkedCheckboxes ) ).toEqual( [] );
	} );

	allCheckboxes.cat1.checked = true;
	allCheckboxes.cat4.checked = true;
	allCheckboxes.cat5.checked = true;

	it( "should return the values of the checked checkboxes, ordered alphabetically", () => {
		const checkedCheckboxes = [
			allCheckboxes.cat1,
			allCheckboxes.cat4,
			allCheckboxes.cat5,
		];
		expect( getValuesFromCheckboxes( checkedCheckboxes ) ).toEqual( [
			{ id: "4", name: "Birds" },
			{ id: "1", name: "cat1" },
			{ id: "5", name: "dogs" },
		] );
	} );

	it( "should still return the values of the checked checkboxes ordered alphabetically when the name contains more than one word", () => {
		const newCat = createCategoryElement( "6", "busy turtle" );
		newCat.checkbox.checked = true;

		const checkedCheckboxes = [
			allCheckboxes.cat1,
			allCheckboxes.cat4,
			allCheckboxes.cat5,
			newCat.checkbox,
		];

		expect( getValuesFromCheckboxes( checkedCheckboxes ) ).toEqual( [
			{ id: "4", name: "Birds" },
			{ id: "6", name: "busy turtle" },
			{ id: "1", name: "cat1" },
			{ id: "5", name: "dogs" },
		] );
	} );
} );
