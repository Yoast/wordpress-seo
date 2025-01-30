import { useEffect, useState } from "@wordpress/element";
import { Scores } from "../scores/components/scores";

export const ScoreWidget = ( { analysisType, dataProvider } ) => {
	const [ contentTypes, setContentTypes ] = useState( [] );
	const [ endpoint, setEndpoint ] = useState( "" );
	const [ headers, setHeaders ] = useState( {} );

	useEffect( () => {
		// Note: fetching all and setting headers before endpoint or the requests will fail.
		Promise.allSettled( [
			dataProvider.getContentTypes(),
			dataProvider.getEndpoint( analysisType + "Scores" ),
			dataProvider.getHeaders(),
		] ).then( ( [ contentTypes, endpoint, headers ] ) => {
			setHeaders( headers.value );
			setEndpoint( endpoint.value );
			setContentTypes( contentTypes.value );
		} );
	}, [ dataProvider ] );

	// TODO: initial implementation expects data to be there before rendering.
	//  Rework to handle async contentTypes and endpoint
	//  By either no using async in data provider/using a different data provider.
	//  Or by changing the scores to not expect data to be there on initial render.
	if ( ! contentTypes.length || ! endpoint ) {
		return null;
	}

	return <Scores analysisType={ analysisType } contentTypes={ contentTypes } endpoint={ endpoint } headers={ headers } />;
};
