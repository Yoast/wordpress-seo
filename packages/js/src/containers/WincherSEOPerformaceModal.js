import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import WincherSEOPerformanceModal from "../components/WincherSEOPerformanceModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherModalOpen,
			getWincherLoginStatus,
		} = select( "yoast-seo/editor" );

		return {
			whichModalOpen: getWincherModalOpen(),
			isLoggedIn: getWincherLoginStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherNoKeyphraseMessage,
			setWincherOpenModal,
			setWincherDismissModal,
			setWincherLoginStatus,
		} = dispatch( "yoast-seo/editor" );

		return {
			onOpenWithNoKeyphrase: () => {
				setWincherNoKeyphraseMessage();
			},
			onOpen: ( location ) => {
				setWincherOpenModal( location );
			},
			onClose: () => {
				setWincherDismissModal();
			},
			onAuthentication: ( status ) => {
				// setWincherLoginStatus( status );
			},
		};
	} ),
] )( WincherSEOPerformanceModal );
