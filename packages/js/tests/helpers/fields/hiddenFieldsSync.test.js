import { hiddenFieldsSync } from "../../../src/helpers/fields/hiddenFieldsSync";
import { createCollectorFromObject, createWatcher } from "../../../src/helpers/create-watcher";
import { mapKeys, debounce } from "lodash";
import { subscribe } from "@wordpress/data";

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	subscribe: jest.fn(),
} ) );

jest.mock( "lodash", () => ( {
	debounce: jest.fn(),
	get: jest.fn( ()=> true ),
	pickBy: jest.fn( () => {} ),
	forEach: jest.fn(),
	mapKeys: jest.fn( ()=>{
		return { test: "test" };
	} ),
} ) );

jest.mock( "../../../src/helpers/create-watcher", () => ( {
	createWatcher: jest.fn(),
	createCollectorFromObject: jest.fn(),
} ) );

describe( "hiddenFieldsSync", () => {
	it( "should subscribe to changes, debounce, create watcher and createCollectorFromObject", () => {
		hiddenFieldsSync();

		expect( subscribe ).toHaveBeenCalled();
		expect( debounce ).toHaveBeenCalled();
		expect( createWatcher ).toHaveBeenCalled();
		expect( mapKeys ).toHaveBeenCalledTimes( 2 );
		expect( createCollectorFromObject ).toHaveBeenCalledWith( { test: "test" } );
	} );
} );
