import { SkeletonLoader } from "@yoast/ui-library";
import { useFetch } from "../../hooks/use-fetch";
import { ContentStatusDescription } from "../components/content-status-description";
import { ScoreChart } from "../components/score-chart";
import { ScoreList } from "../components/score-list";
import { SCORE_META } from "../score-meta";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Term} Term
 * @type {import("../index").Score} Score
 */

/**
 * @param {ContentType} contentType The selected contentType.
 * @param {Term?} [term] The selected term.
 * @returns {JSX.Element} The element.
 */
export const SeoScoreContent = ( { contentType, term } ) => {
	const { data: scores = [], isPending } = useFetch( {
		dependencies: [ contentType.name, term?.name ],
		url: "/wp-content/plugins/wordpress-seo/packages/js/src/dashboard/scores/seo/scores.json",
		//		url: `/wp-json/yoast/v1/scores/${ contentType.name }/${ term?.name }`,
		options: { headers: { "Content-Type": "application/json" } },
		fetchDelay: 0,
		doFetch: async( url, options ) => {
			await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
			try {
				const response = await fetch( url, options );
				if ( ! response.ok ) {
					// From the perspective of the results, we want to reject this as an error.
					throw new Error( "Not ok" );
				}
				return response.json();
			} catch ( error ) {
				return Promise.reject( error );
			}
		},
	} );

	if ( isPending ) {
		return (
			<>
				<SkeletonLoader className="yst-w-full yst-my-6">&nbsp;</SkeletonLoader>
				<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-7 yst-gap-6">
					<ul className="yst-col-span-4">
						{ Object.entries( SCORE_META ).map( ( [ name, { label } ] ) => (
							<li
								key={ `skeleton-loader--${ name }` }
								className="yst-flex yst-items-center yst-min-h-[1rem] yst-py-3 yst-border-b last:yst-border-b-0"
							>
								<SkeletonLoader className="yst-w-3 yst-h-3 yst-rounded-full" />
								<SkeletonLoader className="yst-ml-3 yst-mr-2">{ label }</SkeletonLoader>
								<SkeletonLoader className="yst-w-7">1</SkeletonLoader>
								<SkeletonLoader className="yst-ml-auto yst-button yst-button--small">View</SkeletonLoader>
							</li>
						) ) }
					</ul>
					<div className="yst-col-span-3 yst-relative">
						<SkeletonLoader className="yst-w-full yst-aspect-square yst-rounded-full" />
						<div className="yst-absolute yst-inset-5 yst-aspect-square yst-bg-white yst-rounded-full" />
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<ContentStatusDescription scores={ scores } />
			<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-7 yst-gap-6">
				{ scores && <ScoreList scores={ scores } /> }
				{ scores && <ScoreChart scores={ scores } /> }
			</div>
		</>
	);
};
