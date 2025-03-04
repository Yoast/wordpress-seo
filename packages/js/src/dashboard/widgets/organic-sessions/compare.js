import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SkeletonLoader, Title } from "@yoast/ui-library";
import { ErrorAlert } from "../../components/error-alert";
import { Trend } from "../../components/trend";
import { useRemoteData } from "../../services/use-remote-data";
import { getDifference } from "../../transformers/difference";

/**
 * @type {import("../services/data-provider")} DataProvider
 * @type {import("../services/remote-data-provider")} RemoteDataProvider
 * @type {import("../services/data-formatter")} DataFormatter
 */

/**
 * @typedef {"current"|"previous"} OrganicSessionsPeriod The organic sessions period.
 */

/**
 * @typedef {Object<OrganicSessionsPeriod, Object<"sessions",number>>} RawOrganicSessionsCompareData The organic sessions compare data.
 */

/**
 * @typedef {Object} OrganicSessionsCompareData The processed organic sessions compare data.
 * @property {string} sessions The number of current sessions.
 * @property {number} difference The difference percentage.
 * @property {string} formattedDifference The formatted difference percentage.
 */

/**
 * @param {DataFormatter} dataFormatter The data formatter.
 * @returns {function(?RawOrganicSessionsCompareData[]): OrganicSessionsCompareData} Function to format the organic sessions compare data.
 */

export const createOrganicSessionsCompareFormatter = ( dataFormatter ) => ( [ data ] ) => {
	const current = data?.current?.sessions || NaN;
	const difference = getDifference( current, data?.previous?.sessions || NaN );
	return {
		sessions: dataFormatter.format( current, "sessions", { widget: "organicSessions", type: "compare" } ),
		difference,
		formattedDifference: dataFormatter.format( difference, "difference", { widget: "organicSessions" } ),
	};
};

/**
 * @param {DataProvider} dataProvider The data provider.
 * @param {RemoteDataProvider} remoteDataProvider The remote data provider.
 * @param {DataFormatter} dataFormatter The data formatter.
 * @returns {{data: *, error: Error, isPending: boolean}} The remote data info.
 */
export const useOrganicSessionsCompare = ( dataProvider, remoteDataProvider, dataFormatter ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<OrganicSessionsDailyData[]|Error>} The promise of OrganicSessionsData or an Error.
	 */
	const getOrganicSessionsCompare = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "οrganicSessionsCompare" } },
			options );
	}, [ dataProvider ] );

	/**
	 * @type {function(?RawOrganicSessionsCompareData[]): OrganicSessionsCompareData} Function to format the organic sessions data.
	 */
	const formatOrganicSessionsCompare = useMemo( () => createOrganicSessionsCompareFormatter( dataFormatter ), [ dataFormatter ] );

	return useRemoteData( getOrganicSessionsCompare, formatOrganicSessionsCompare );
};

/**
 * Shared layout between loading and actual.
 * @param {ReactNode} children The sessions and difference.
 * @returns {JSX.Element} The element.
 */
const Layout = ( { children } ) => (
	<div className="yst-flex yst-flex-col yst-gap-1">
		<div className="yst-flex yst-gap-3">
			{ children }
		</div>
		<span>{ __( "Last 28 days", "wordpress-seo" ) }</span>
	</div>
);

/**
 * @param {?OrganicSessionsCompareData} [data] The organic sessions compare data.
 * @param {boolean} isPending Whether the data is pending.
 * @param {?Error} [error] The error.
 * @param {string} supportLink The support link.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsCompare = ( { data, isPending, error, supportLink } ) => {
	if ( isPending ) {
		return (
			<Layout>
				<SkeletonLoader className="yst-title yst-title--1">10_000</SkeletonLoader>
				<SkeletonLoader>^ +100%</SkeletonLoader>
			</Layout>
		);
	}
	if ( error ) {
		return (
			<ErrorAlert error={ error } supportLink={ supportLink } />
		);
	}

	return (
		<Layout>
			<Title as="h2" size="1" className="yst-font-bold">{ data.sessions }</Title>
			<Trend value={ data.difference } formattedValue={ data.formattedDifference } />
		</Layout>
	);
};
