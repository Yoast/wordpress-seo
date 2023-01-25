import getFieldsToMarkHelper from "../../../src/decorator/helpers/getFieldsToMarkHelper";
import Mark from "../../../../../packages/yoastseo/src/values/Mark";

describe( "Test getFieldsToMarkHelper", () => {
	it( "returns an array with one occurrence of each field that needs to be marked.",
		() => {
			const marksMock = [
				new Mark( { original: "a", marked: "b", fieldsToMark: [ "heading" ] } ),
				new Mark( { original: "c", marked: "d", fieldsToMark: [ "nothing" ] } ),
				new Mark( { original: "c", marked: "d", fieldsToMark: [ "nothing", "heading" ] } ),
				new Mark( { original: "c", marked: "d", fieldsToMark: [] } ),
				new Mark( { original: "c", marked: "d" } ),
			];
			expect( getFieldsToMarkHelper( marksMock ) ).toEqual( [ "heading", "nothing" ] );
		} );
} );
