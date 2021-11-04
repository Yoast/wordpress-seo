import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { debounce } from "lodash";
import { ANALYZE_DEBOUNCE_TIME_IN_MS, STORE_NAME } from "../common/constants";
import { useEffectWithCompare } from "../common/hooks";

export const useAnalyze = ( debounceTimeInMs = ANALYZE_DEBOUNCE_TIME_IN_MS ) => {
	const { analyze } = useDispatch( STORE_NAME );
	const paper = useSelect( select => select( STORE_NAME ).selectPaper() );
	const keyphrases = useSelect( select => select( STORE_NAME ).selectKeyphrases() );
	const config = useSelect( select => select( STORE_NAME ).selectConfig() );
	const editor = useSelect( select => select( STORE_NAME ).selectEditor() );
	const debouncedAnalyze = useCallback( () => debounce( analyze, debounceTimeInMs ), [ analyze, debounceTimeInMs ] );

	useEffectWithCompare( () => {
		debouncedAnalyze();
	}, [ debouncedAnalyze, paper, keyphrases, config, editor ] );
};
