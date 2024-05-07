import { hiddenFieldsSync } from "../../../src/helpers/fields/hiddenFieldsSync";
import { createCollectorFromObject, createWatcher } from "../../../src/helpers/create-watcher";
import { reduce, debounce } from "lodash";
import { subscribe, select } from "@wordpress/data";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	subscribe: jest.fn(),
} ) );

jest.mock( "lodash", () => ( {
	debounce: jest.fn(),
	get: jest.fn( ()=> true ),
	pickBy: jest.fn( () => {} ),
	forEach: jest.fn(),
	reduce: jest.fn( ()=>{
		return { test: "test" };
	} ),
} ) );

jest.mock( "../../../src/helpers/create-watcher", () => ( {
	createWatcher: jest.fn(),
	createCollectorFromObject: jest.fn(),
} ) );

describe( "hiddenFieldsSync", () => {
	it( "should subscribe to changes, debounce, create watcher and createCollectorFromObject", () => {
		select.mockImplementation( () => ( {
			getIsPost: jest.fn( () => "1" ),
			getPrimaryTaxonomyId: jest.fn(),
			getPrimaryTaxonomies: jest.fn(),
		} ) );

		hiddenFieldsSync();

		expect( subscribe ).toHaveBeenCalled();
		expect( debounce ).toHaveBeenCalled();
		expect( createWatcher ).toHaveBeenCalled();
		expect( reduce ).toHaveBeenCalledTimes( 2 );
		expect( createCollectorFromObject ).toHaveBeenCalledWith( { test: "test" } );
	} );
} );
