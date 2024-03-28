import createWatcher, { createCollectorFromObject, createCollector } from "../../src/helpers/create-watcher";


describe( "createCollectorFromObject", () => {
	it( "should return an empty object when no getters are provided", () => {
		const collector = createCollectorFromObject( {} );
		const result = collector();
		expect( result ).toEqual( {} );
	} );

	it( "should collect data from all getters", () => {
		const getters = {
			getData1: () => "data1",
			getData2: () => "data2",
			getData3: () => "data3",
		};
		const collector = createCollectorFromObject( getters );
		const result = collector();
		expect( result ).toEqual( {
			getData1: "data1",
			getData2: "data2",
			getData3: "data3",
		} );
	} );
} );

describe( "createWatcher", () => {
	it( "should call onChange when data changes", () => {
		const getData = jest.fn().mockReturnValueOnce( "data1" ).mockReturnValueOnce( "data2" );
		const onChange = jest.fn();
		const watcher = createWatcher( getData, onChange );

		watcher();
		expect( getData ).toHaveBeenCalledTimes( 2 );
		expect( onChange ).toHaveBeenCalledTimes( 1 );
		expect( onChange ).toHaveBeenCalledWith( "data2" );
	} );

	it( "should not call onChange when data remains the same", () => {
		const getData = jest.fn().mockReturnValue( "data" );
		const onChange = jest.fn();
		const watcher = createWatcher( getData, onChange );

		watcher();

		expect( getData ).toHaveBeenCalledTimes( 2 );
		expect( onChange ).not.toHaveBeenCalled();
	} );
} );

describe( "createCollector", () => {
	it( "should return an array of data from all getters", () => {
		const getData1 = jest.fn().mockReturnValue( "data1" );
		const getData2 = jest.fn().mockReturnValue( "data2" );
		const getData3 = jest.fn().mockReturnValue( "data3" );
		const collector = createCollector( getData1, getData2, getData3 );
		const result = collector();
		expect( result ).toEqual( [ "data1", "data2", "data3" ] );
		expect( getData1 ).toHaveBeenCalledTimes( 1 );
		expect( getData2 ).toHaveBeenCalledTimes( 1 );
		expect( getData3 ).toHaveBeenCalledTimes( 1 );
	} );
} );
