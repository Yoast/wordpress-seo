import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { debounce } from "lodash";
import { ANALYZE_DEBOUNCE_TIME_IN_MS, STORE_NAME } from "../constants";
import useEffectWithCompare from "./use-effect-with-compare";

const useAnalyze = ( debounceTimeInMs = ANALYZE_DEBOUNCE_TIME_IN_MS ) => {
	const { analyze } = useDispatch( STORE_NAME );
	const data = useSelect( select => select( STORE_NAME ).selectData() );
	const keyphrases = useSelect( select => select( STORE_NAME ).selectKeyphrases() );
	const config = useSelect( select => select( STORE_NAME ).selectConfig() );
	const debouncedAnalyze = useCallback( () => debounce( analyze, debounceTimeInMs ), [ analyze, debounceTimeInMs ] );

	useEffectWithCompare( () => {
		debouncedAnalyze();
	}, [ debouncedAnalyze, data, keyphrases, config ] );
};

export default useAnalyze;
