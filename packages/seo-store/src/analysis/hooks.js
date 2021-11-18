import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { debounce } from "lodash";
import { STORE_NAME } from "../common/constants";
import { useEffectWithDeepCompare } from "../common/hooks";
import { ANALYZE_DEBOUNCE_TIME_IN_MS } from "./constants";

/**
 * Analyzes whenever data changes.
 *
 * Which data is being watched?
 * - Paper data
 * - Keyphrases and synonyms
 * - Analysis on-the-fly configuration
 * - Editor data: as this is the common source of replacevars
 *
 * A choice has been made here to not apply the replacevars in the paper data yet.
 * Instead, the editor data is being watched. This should be expanded to all relevant state being kept in this store.
 * When implementers add replacevars with sources outside of this store, they are responsible for calling analyze for themselves.
 * The positive here is that this does not rely on outside data calls (which the replacevars can be/are).
 *
 * @param {number} debounceTimeInMs Amount of millisecond to debounce for.
 *
 * @returns {void}
 */
export const useAnalyze = ( debounceTimeInMs = ANALYZE_DEBOUNCE_TIME_IN_MS ) => {
	const { analyze } = useDispatch( STORE_NAME );
	const paper = useSelect( select => select( STORE_NAME ).selectPaper() );
	const keyphrases = useSelect( select => select( STORE_NAME ).selectKeyphrases() );
	const config = useSelect( select => select( STORE_NAME ).selectAnalysisConfig() );
	const editor = useSelect( select => select( STORE_NAME ).selectEditor() );
	const debouncedAnalyze = useCallback(
		debounce( analyze, debounceTimeInMs ),
		[ analyze, debounceTimeInMs ],
	);

	useEffectWithDeepCompare( () => {
		debouncedAnalyze();
	}, [ debouncedAnalyze, paper, keyphrases, config, editor ] );
};
