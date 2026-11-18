import { withDispatch, withSelect } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";
import { compose } from "@wordpress/compose";
import SEMrushRelatedKeyphrasesModal from "../components/SEMrushRelatedKeyphrasesModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getSEMrushModalOpen,
			getSEMrushLoginStatus,
			getSEMrushSelectedCountry,
			getPreference,
			selectLinkParams,
			getFocusKeyphrase,
		} = select( "yoast-seo/editor" );

		return {
			whichModalOpen: getSEMrushModalOpen(),
			isLoggedIn: getSEMrushLoginStatus(),
			countryCode: getSEMrushSelectedCountry(),
			isRtl: getPreference( "isRtl", false ),
			learnMoreLink: addQueryArgs( "https://yoa.st/3-v", selectLinkParams() ),
			keyphrase: getFocusKeyphrase(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setSEMrushNoKeyphraseMessage,
			setSEMrushOpenModal,
			setSEMrushDismissModal,
			setSEMrushLoginStatus,
			setSEMrushNewRequest,
		} = dispatch( "yoast-seo/editor" );

		return {
			onOpenWithNoKeyphrase: () => {
				setSEMrushNoKeyphraseMessage();
			},
			onOpen: ( location ) => {
				setSEMrushOpenModal( location );
			},
			onClose: () => {
				setSEMrushDismissModal();
			},
			onAuthentication: ( status ) => {
				setSEMrushLoginStatus( status );
			},
			newRequest: ( countryCode, keyphrase ) => {
				setSEMrushNewRequest( countryCode, keyphrase );
			},
		};
	} ),
] )( SEMrushRelatedKeyphrasesModal );
