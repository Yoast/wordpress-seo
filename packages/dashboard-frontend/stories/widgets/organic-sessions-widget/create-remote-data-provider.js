/**
 * @param {array|any} compare The compare data.
 * @param {array|any} daily The daily data.
 * @returns {{fetchJson: function: Promise}} The remote data provider.
 */
export const createRemoteDataProvider = ( compare, daily ) => ( {
	fetchJson: ( _, params ) => {
		if ( params.options.widget === "organicSessionsCompare" ) {
			return Array.isArray( compare ) ? Promise.resolve( compare ) : Promise.reject( new Error( compare ) );
		}
		return Array.isArray( daily ) ? Promise.resolve( daily ) : Promise.reject( new Error( daily ) );
	},
} );
