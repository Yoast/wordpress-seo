/* global jest beforeEach describe it expect */
import DataProvider from "../../src/replacevar/data-provider";

const DataCollector = jest.fn().mockImplementation( () => ( {
	getParentId: jest.fn().mockReturnValue( 1 ),
	getParentTitle: jest.fn().mockImplementation( ( parentId, callback ) => {
		callback( "The title" );
	} ),
} ) );

let collector;
let store;

beforeEach( () => {
	collector = new DataCollector();
	store = {
		getState: jest.fn(),
		dispatch: jest.fn(),
	};
} );

describe( "DataProvider", () => {
	it( "doesn't call the data collector when a cached value is available", () => {
		const refresh = jest.fn();
		store.getState.mockReturnValue( {
			replacevars: {
				parentTitle: {
					1: "The title",
				},
			},
		} );
		const provider = new DataProvider( refresh, collector, store );
		expect( provider.getParentTitle() ).toBe( "The title" );
		expect( collector.getParentTitle ).not.toHaveBeenCalled();
	} );

	it( "calls the data collector when no cached value is available", done => {
		const refresh = () => {
			expect( store.dispatch ).toHaveBeenCalledWith( {
				type: "WPSEO_ADD_REPLACEVAR",
				replacevar: {
					type: "parentTitle",
					id: 1,
					value: "The title",
				},
			} );
			done();
		};
		store.getState.mockReturnValue( {
			replacevars: {},
		} );
		const provider = new DataProvider( refresh, collector, store );
		expect( provider.getParentTitle() ).toBe( "" );
	} );
} );
