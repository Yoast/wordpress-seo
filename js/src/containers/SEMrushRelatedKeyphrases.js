/* External dependencies */
import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import RelatedKeyphraseModalContent from "../components/RelatedKeyphraseModalContent";

export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getFocusKeyphrase(),
		};
	} ),
] )( RelatedKeyphraseModalContent );
