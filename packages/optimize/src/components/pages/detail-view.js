import { ArrowSmLeftIcon, EyeIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/admin-ui-toolkit/components";
import { isErrorStatus, isLoadingStatus } from "@yoast/admin-ui-toolkit/helpers";
import { useEffectWithDeepCompare } from "@yoast/admin-ui-toolkit/hooks";
import { debounce, isEmpty } from "lodash";
import { PropTypes } from "prop-types";
import { Link, useParams } from "react-router-dom";
import { ANALYSIS_DELAY, OPTIMIZE_STORE_KEY } from "../../constants";
import Editor from "../editor";
import { Placeholder } from "../placeholders";
import SideBar from "../sidebar";

/**
 * Hooks to run the analysis of the focus keyphrase.
 *
 * @param {string} contentType The content type.
 *
 * @returns {void}
 */
function useAnalysis( contentType ) {
	const hasReadabilityAnalysis = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.hasReadabilityAnalysis` ),
		[],
	);
	const hasSeoAnalysis = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.hasSeoAnalysis` ),
		[],
	);
	if ( ! ( hasReadabilityAnalysis && hasSeoAnalysis ) ) {
		// Don't run the analysis when the content type does not support it.
		return;
	}

	const data = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getAnalysisData( contentType ), [] );
	const { runAnalysis } = useDispatch( OPTIMIZE_STORE_KEY );
	const debouncedRun = useCallback( debounce( runAnalysis, ANALYSIS_DELAY ), [] );

	useEffectWithDeepCompare( () => {
		debouncedRun( { contentType } );
	}, [ data ] );
}

/**
 * Hooks to run the analysis of the related keyphrases.
 *
 * @param {string} contentType The content type.
 *
 * @returns {void}
 */
function useRelatedKeyphrasesAnalysis( contentType ) {
	const hasRelatedKeyphrases = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.hasRelatedKeyphrases` ),
		[],
	);
	if ( ! hasRelatedKeyphrases ) {
		// Don't run the related keyphrase analysis when the content type does not support it.
		return;
	}

	const data = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getRelatedKeyphrasesAnalysisData( contentType ), [] );
	const { runRelatedKeyphrasesAnalysis } = useDispatch( OPTIMIZE_STORE_KEY );
	const debouncedRun = useCallback( debounce( runRelatedKeyphrasesAnalysis, ANALYSIS_DELAY ), [] );

	useEffectWithDeepCompare( () => {
		// Only run if there are any related keyphrases.
		if ( ! isEmpty( data.relatedKeyphrases ) ) {
			debouncedRun( { contentType } );
		}
	}, [ data ] );
}

/**
 * A detail view wrapper that holds the editor and sidebar for a specific content item.
 *
 * @param {Object} props The props.
 * @param {Object} props.contentType The content type options.
 * @param {Object} props.listTarget Route target back to list we came from.
 *
 * @returns {JSX.Element} DetailView component.
 */
const DetailView = ( { contentType, listTarget } ) => {
	const { id } = useParams();
	const data = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getData(), [] );
	const getDetailStatus = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getDetailStatus(), [] );
	const editUrl = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getMetadata( "editUrl" ), [] );
	const previewUrl = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getMetadata( "previewUrl" ), [] );
	const cmsName = useSelect( select => select( OPTIMIZE_STORE_KEY ).getOption( "cmsName" ) );
	const { getDetail, resetData } = useDispatch( OPTIMIZE_STORE_KEY );

	const isLoading = isLoadingStatus( getDetailStatus );

	useAnalysis( contentType.slug );
	useRelatedKeyphrasesAnalysis( contentType.slug );

	useEffect( () => {
		// Get new data on mount
		resetData();
		getDetail( {
			contentType: contentType.slug,
			id,
			...( contentType.requestData ? contentType.requestData : {} ),
		} );
	}, [ id, getDetail ] );

	return <div className="yst-flex-grow yst-max-w-full yst-p-8">
		<header className="yst-mb-8 yst-flex yst-justify-between yst-items-center yst-flex-wrap yst-gap-4">
			<div className="yst-flex yst-items-center">
				<Link
					className="yst-button yst-bg-white yst-border yst-border-gray-300 yst-shadow-sm yst-rounded-md yst-p-2 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500 yst-mr-4"
					to={ listTarget }
					id="yst-back-to-overview"
					// translators: %s is replaced by the type of content in the overview.
					aria-label={ sprintf( __( "Back to %s overview.", "admin-ui" ), contentType.label.toLowerCase() ) }
				>
					<ArrowSmLeftIcon className="yst-h-5 yst-w-5 yst-text-gray-500" />
				</Link>
				{ isLoading ? <Placeholder /> : (
					<h1 className="yst-text-2xl">
						{ data.title }
					</h1>
				) }
			</div>
			<div>
				<a href={ editUrl } target="_blank" rel="noopener noreferrer" className="yst-button yst-button--secondary yst-mr-1">
					<PencilAltIcon className="yst--ml-1 yst-mr-1.5 yst-h-4 yst-w-4 yst-text-gray-400" />
					<span>{ sprintf(
						// translators: %1$s expands to the CMS name.
						__( "Edit with %1$s", "admin-ui" ),
						cmsName,
					) }</span>
				</a>
				{ previewUrl && <a href={ previewUrl } target="_blank" rel="noopener noreferrer" className="yst-button yst-button--secondary">
					<EyeIcon className="yst--ml-1 yst-mr-1.5 yst-h-4 yst-w-4 yst-text-gray-400" />
					<span>{ sprintf(
						// translators: %s expands to the singular form of the content type label, e.g. product.
						__( "View %s", "admin-ui" ),
						contentType.labelSingular.toLowerCase(),
					) }</span>
				</a> }
			</div>
		</header>
		{ isErrorStatus( getDetailStatus ) &&
		<Alert type="error">
			<p>{ __( "Oops, something went wrong. Please refresh the page.", "admin-ui" ) }</p>
		</Alert> }
		<main className="md:yst-grid md:yst-grid-cols-5 md:yst-gap-8">
			<Editor contentType={ contentType } id={ id } isLoading={ isLoading } />
			<SideBar contentType={ contentType } isLoading={ isLoading } />
		</main>
	</div>;
};

DetailView.propTypes = {
	contentType: PropTypes.object.isRequired,
	listTarget: PropTypes.string.isRequired,
};

export default DetailView;
