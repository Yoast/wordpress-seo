import { ArrowNarrowUpIcon } from "@heroicons/react/outline";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SkeletonLoader, Title } from "@yoast/ui-library";
import classNames from "classnames";
import { useRemoteData } from "../../services/use-remote-data";
import { ErrorAlert } from "../../components/error-alert";

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
	const previous = data?.previous?.sessions || 0;
	// Delta / average.
	const difference = Math.abs( current - previous ) / ( ( current + previous ) / 2 );
	return ( {
		sessions: dataFormatter.format( current, "sessions", { widget: "organicSessions", type: "change" } ),
		difference,
		formattedDifference: dataFormatter.format( difference, "difference", { widget: "organicSessions" } ),
	} );
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
 * @param {?OrganicSessionsChangeData} [data] The organic sessions change data.
 * @param {boolean} isPending Whether the data is pending.
 * @param {?Error} [error] The error.
 * @param {string} supportLink The support link.
 * @returns {JSX.Element} The element.
 */
// eslint-disable-next-line complexity -- We need this if/else state control somehow.
export const OrganicSessionsChange = ( { data, isPending, error, supportLink } ) => {
	if ( isPending ) {
		return (
			<div className="yst-flex yst-flex-col yst-gap-1">
				<div className="yst-flex yst-gap-3">
					<SkeletonLoader className="yst-title yst-title--1">10_000</SkeletonLoader>
					<SkeletonLoader>^ +100%</SkeletonLoader>
				</div>
				<span>{ __( "Last 28 days", "wordpress-seo" ) }</span>
			</div>
		);
	}
	if ( error ) {
		return (
			<ErrorAlert error={ error } supportLink={ supportLink } />
		);
	}
	if ( ! data ) {
		return (
			<p>
				{ __( "No data to display: Your site hasn't received any visitors yet.", "wordpress-seo" ) }
			</p>
		);
	}

	const isNegative = data.difference < 0;

	return (
		<div className="yst-flex yst-flex-col yst-gap-1">
			<div className="yst-flex yst-gap-3">
				<Title as="h2" size="1" className="yst-font-bold">{ data.sessions }</Title>
				<div
					className={ classNames(
						"yst-flex yst-items-center yst-text-[14px] yst-font-semibold",
						isNegative ? "yst-text-red-600" : "yst-text-green-600"
					) }
				>
					<ArrowNarrowUpIcon
						className={ classNames(
							"yst-w-[18px] yst-shrink-0",
							// Point the arrow downwards if negative.
							isNegative && "yst-rotate-180"
						) }
					/>
					{ isNegative ? "-" : "+" }{ data.formattedDifference }
				</div>
			</div>
			<span className="yst-text-[14px]">{ __( "Last 28 days", "wordpress-seo" ) }</span>
		</div>
	);
};
