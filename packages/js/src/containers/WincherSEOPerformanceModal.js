/* External dependencies */
import { withDispatch, withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";

/* Internal dependencies */
import WincherSEOPerformanceModal from "../components/WincherSEOPerformanceModal";

export default compose( [
	withSelect( ( select ) => {
		const {
			getWincherModalOpen,
			getWincherTrackableKeyphrases,
		} = select( "yoast-seo/editor" );

		return {
			keyphrases: getWincherTrackableKeyphrases(),
			whichModalOpen: getWincherModalOpen(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setWincherOpenModal,
			setWincherDismissModal,
			setWincherNoKeyphrase,
		} = dispatch( "yoast-seo/editor" );

		return {
			onOpen: ( location ) => {
				setWincherOpenModal( location );
			},
			onClose: () => {
				setWincherDismissModal();
			},
			onNoKeyphraseSet: () => {
				setWincherNoKeyphrase();
			},
		};
	} ),
] )( WincherSEOPerformanceModal );
