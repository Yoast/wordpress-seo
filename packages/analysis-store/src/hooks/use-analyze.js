import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { STORE_NAME } from "../constants";

const useAnalyze = () => {
	const { analyze } = useDispatch( STORE_NAME );
	const paper = useSelect( select => select( STORE_NAME ).selectPaper() );
	const keyphrases = useSelect( select => select( STORE_NAME ).selectKeyphrases() );
	const config = useSelect( select => select( STORE_NAME ).selectConfig() );

	useEffect( () => {
		analyze( {
			paper,
			keyphrases,
			config,
		} );
	}, [ analyze, paper, keyphrases, config ] );
};

export default useAnalyze;
