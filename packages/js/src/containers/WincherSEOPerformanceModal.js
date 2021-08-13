import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import WincherSEOPerformanceModal from "../components/WincherSEOPerformanceModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getFocusKeyphrase,
			getWincherModalOpen,
			getWincherLoginStatus,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: [ getFocusKeyphrase() ],
			whichModalOpen: getWincherModalOpen(),
			isLoggedIn: getWincherLoginStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherOpenModal,
			setWincherDismissModal,
			setWincherLoginStatus,
		} = dispatch( "yoast-seo/editor" );

		return {
			onOpen: ( location ) => {
				setWincherOpenModal( location );
			},
			onClose: () => {
				setWincherDismissModal();
			},
			onAuthentication: ( status ) => {
				setWincherLoginStatus( status );
			},
		};
	} ),
] )( WincherSEOPerformanceModal );
