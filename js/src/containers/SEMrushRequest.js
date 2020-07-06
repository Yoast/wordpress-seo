
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";


export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase()
			//The OAuth key
		}
}),
	withDispatch( ( dispatch ) => {

}),
] )( RelatedKeyphrasesModal );
