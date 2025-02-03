import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Scores } from "../scores/components/scores";
import { Widget } from "./widget";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").AnalysisType} AnalysisType
 */

/**
 * @param {AnalysisType} analysisType The analysis type.
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @returns {?JSX.Element} The element.
 */
export const ScoreWidget = ( { analysisType, dataProvider, remoteDataProvider } ) => {
	const [ contentTypes, setContentTypes ] = useState( () => dataProvider.getContentTypes() );

	useEffect( () => {
		setContentTypes( dataProvider.getContentTypes() );
	}, [ dataProvider ] );

	if ( ! contentTypes?.length ) {
		return null;
	}

	return (
		<Widget
			className="yst-paper__content yst-@container yst-max-w-screen-sm"
			title={ analysisType === "readability" ? __( "Readability scores", "wordpress-seo" ) : __( "SEO scores", "wordpress-seo" ) }
		>
			<Scores
				analysisType={ analysisType }
				contentTypes={ contentTypes }
				dataProvider={ dataProvider }
				remoteDataProvider={ remoteDataProvider }
			/>
		</Widget>
	);
};
