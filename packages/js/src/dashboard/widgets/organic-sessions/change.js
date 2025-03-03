import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SkeletonLoader, Title } from "@yoast/ui-library";
import { DifferencePercentage } from "../../components/difference-percentage";
import { ErrorAlert } from "../../components/error-alert";
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
 * @typedef {Object<OrganicSessionsPeriod, Object<"sessions",number>>} RawOrganicSessionsChangeData The organic sessions change data.
 */

/**
 * @typedef {Object} OrganicSessionsChangeData The processed organic sessions change data.
 * @property {string} sessions The number of current sessions.
 * @property {number} difference The difference percentage.
 * @property {string} formattedDifference The formatted difference percentage.
 */

/**
 * @param {DataFormatter} dataFormatter The data formatter.
 * @returns {function(?RawOrganicSessionsChangeData[]): OrganicSessionsChangeData} Function to format the organic sessions change data.
 */
// eslint-disable-next-line complexity -- Fallbacks to zero, easy enough to read.
export const createOrganicSessionsChangeFormatter = ( dataFormatter ) => ( [ data ] ) => {
	const current = data?.current?.sessions || 0;
	const difference = getDifference( current, data?.previous?.sessions || 0 );
	return {
		sessions: dataFormatter.format( current, "sessions", { widget: "organicSessions", type: "change" } ),
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
export const useOrganicSessionsChange = ( dataProvider, remoteDataProvider, dataFormatter ) => {
	/**
	 * @param {RequestInit} options The options.
	 * @returns {Promise<OrganicSessionsDailyData[]|Error>} The promise of OrganicSessionsData or an Error.
	 */
	const getOrganicSessionsChange = useCallback( ( options ) => {
		return remoteDataProvider.fetchJson(
			dataProvider.getEndpoint( "timeBasedSeoMetrics" ),
			{ options: { widget: "οrganicSessionsChange" } },
			options );
	}, [ dataProvider ] );

	/**
	 * @type {function(?RawOrganicSessionsChangeData[]): OrganicSessionsChangeData} Function to format the organic sessions data.
	 */
	const formatOrganicSessionsChange = useMemo( () => createOrganicSessionsChangeFormatter( dataFormatter ), [ dataFormatter ] );

	return useRemoteData( getOrganicSessionsChange, formatOrganicSessionsChange );
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
 * @param {?OrganicSessionsChangeData} [data] The organic sessions change data.
 * @param {boolean} isPending Whether the data is pending.
 * @param {?Error} [error] The error.
 * @param {string} supportLink The support link.
 * @returns {JSX.Element} The element.
 */
export const OrganicSessionsChange = ( { data, isPending, error, supportLink } ) => {
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
			<DifferencePercentage isNegative={ data.difference < 0 } formattedValue={ data.formattedDifference } />
		</Layout>
	);
};
