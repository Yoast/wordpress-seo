import { getValuesFromCheckboxes } from "../../src/helpers/getValuesFromCheckboxes";
import { getPostCategoryCheckboxes } from "../../src/classic-editor/helpers/dom";
import { createCategoryElements } from "../testHelpers/createDomTestData";

const checkboxesElements = createCategoryElements();
document.body.appendChild( checkboxesElements.allCategories );

describe( "a test for retrieving the values from checked checkboxes", () => {
	it( "should return an empty array if no checkboxes is checked", () => {
		const checkedCheckboxes = getPostCategoryCheckboxes().filter( checkbox => checkbox.checked );
		expect( getValuesFromCheckboxes( checkedCheckboxes ) ).toEqual( [] );
	} );
	it( "should return the values of the checked checkboxes, ordered alphabetically", () => {
		checkboxesElements.category1.checked = true;
		checkboxesElements.category4.checked = true;
		const checkedCheckboxes = getPostCategoryCheckboxes().filter( checkbox => checkbox.checked );
		expect( getValuesFromCheckboxes( checkedCheckboxes ) ).toEqual( [
			{ id: "4", name: "Birds" },
			{ id: "1", name: "cat1" },
		] );
	} );
} );
