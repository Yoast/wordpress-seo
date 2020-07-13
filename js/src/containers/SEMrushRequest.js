import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import RelatedKeyphrasesModal from "../components/RelatedKeyphrasesModal";


export default compose( [
	withSelect( ( select ) => {
		return {
			keyphrase: select( "yoast-seo/editor" ).getRequestKeyphrase(),
			currentCountry: select( "yoast-seo/editor" ).getRequestCountry(),
			OAuthToken: select( "yoast-seo/editor" ).getRequestOAuthToken(),
			limitReached: select( "yoast-seo/editor" ).getRequestLimitReached(),
			response: select( "yoast-seo/editor" ).getRequestResponse(),
			isSuccess: select( "yoast-seo/editor" ).getRequestIsSuccess(),
			isPending: select( "yoast-seo/editor" ).getIsRequestPending(),
		}
}),
	withDispatch( ( dispatch ) => {
		const { setSEMrushNewRequest, setSEMrushRequestSucceeded, setSEMrushRequestFailed, setSEMrushSetRequestLimitReached } = dispatch(
			"yoast-seo/editor"
		);
		return {
			newRequest: ( country, keyphrase, OAuthToken ) => {
				setSEMrushNewRequest( country, keyphrase, OAuthToken )
			},
			requestSucceeded: () => {
				console.log("jooo")
				setSEMrushRequestSucceeded( response )
			},
			requestFailed: () => {
				setSEMrushRequestFailed( response )
			},
			setLimitReached: ( country ) => {
				setSEMrushSetRequestLimitReached()
			},
		}
}),
] )( RelatedKeyphrasesModal );
//The corresponding component
