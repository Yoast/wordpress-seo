import { __ } from "@wordpress/i18n";
import { isEqual } from "lodash";
import { ErrorAlert } from "../components/error-alert";
import { NoDataParagraph } from "../components/no-data-paragraph";
import { Widget } from "../components/widget";
import { OrganicSessionsCompare, useOrganicSessionsCompare } from "./organic-sessions/compare";
import { OrganicSessionsDaily, useOrganicSessionsDaily } from "./organic-sessions/daily";

/**
 * @type {import("../services/data-provider")} DataProvider
 * @type {import("../services/remote-data-provider")} RemoteDataProvider
 * @type {import("../services/data-formatter-interface")} DataFormatterInterface
 */

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatterInterface} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
const OrganicSessionsContent = ( { dataProvider, remoteDataProvider, dataFormatter } ) => {
	const supportLink = dataProvider.getLink( "errorSupport" );
	const daily = useOrganicSessionsDaily( dataProvider, remoteDataProvider, dataFormatter );
	const compare = useOrganicSessionsCompare( dataProvider, remoteDataProvider, dataFormatter );

	// Collapse the errors if they are the same.
	if ( compare.error && daily.error && isEqual( compare.error, daily.error ) ) {
		return (
			<ErrorAlert className="yst-mt-4" error={ compare.error } supportLink={ supportLink } />
		);
	}

	// Don't show the comparison when there is no data.
	if ( daily.data?.labels.length === 0 ) {
		return (
			<NoDataParagraph />
		);
	}

	return (
		<>
			<div className="yst-flex yst-justify-between yst-mt-4">
				<OrganicSessionsCompare data={ compare.data } error={ compare.error } isPending={ compare.isPending } supportLink={ supportLink } />
			</div>
			<OrganicSessionsDaily
				data={ daily.data }
				error={ daily.error }
				isPending={ daily.isPending }
				supportLink={ supportLink }
			/>
		</>
	);
};

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatterInterface} dataFormatter The data formatter.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsWidget = ( { dataProvider, remoteDataProvider, dataFormatter } ) => (
	<Widget
		className="yst-paper__content yst-col-span-4"
		title={ __( "Organic sessions", "wordpress-seo" ) }
		tooltip={ __( "The number of organic sessions that began on your website.", "wordpress-seo" ) }
		dataSources={ [
			{
				source: "Site Kit by Google",
			},
		] }
		errorSupportLink={ dataProvider.getLink( "errorSupport" ) }
	>
		<OrganicSessionsContent dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } dataFormatter={ dataFormatter } />
	</Widget>
);
