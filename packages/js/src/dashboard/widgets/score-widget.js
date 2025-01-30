import { useEffect, useState } from "@wordpress/element";
import { Scores } from "../scores/components/scores";

export const ScoreWidget = ( { analysisType, dataProvider } ) => {
	const [ contentTypes, setContentTypes ] = useState( () => dataProvider.getContentTypes() );
	const [ endpoint, setEndpoint ] = useState( () => dataProvider.getEndpoint( analysisType + "Scores" ) );
	const [ headers, setHeaders ] = useState( () => dataProvider.getHeaders() );

	useEffect( () => {
		setHeaders( dataProvider.getHeaders() );
		setEndpoint( dataProvider.getEndpoint( analysisType + "Scores" ) );
		setContentTypes( dataProvider.getContentTypes() );
	}, [ dataProvider ] );

	if ( ! contentTypes.length || ! endpoint ) {
		return null;
	}

	return <Scores analysisType={ analysisType } contentTypes={ contentTypes } endpoint={ endpoint } headers={ headers } />;
};
