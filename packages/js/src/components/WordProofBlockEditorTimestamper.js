import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

import WordProofTimestamper from "./WordProofTimestamper";

/**
 * Registers the timestamp callback.
 *
 * @param {Function} callback The callback.
 *
 * @returns {void}
 */
function useTimestampCallback( callback ) {
	let firstTime = true;
	const isSavingPost = useSelect( ( select ) => select( "core/editor" ).isSavingPost(), [] );
	const isAutosavingPost = useSelect( ( select ) => select( "core/editor" ).isAutosavingPost(), [] );
	const didPostSaveRequestSucceed = useSelect( ( select ) => select( "core/editor" ).didPostSaveRequestSucceed(), [] );

	// Subscribe to Block editor post save.
	useEffect( () => {
		if ( firstTime ) {
			firstTime = false;
			return;
		}

		if ( isSavingPost && didPostSaveRequestSucceed && ! isAutosavingPost ) {
			callback();
			return;
		}
	}, [ isSavingPost, isAutosavingPost, didPostSaveRequestSucceed ] );
}

/**
 * WordProof timestamper component for the block editor.
 *
 * @returns {null} Returns null.
 */
export default function WordProofBlockEditorTimestamper() {
	const { createSuccessNotice, createErrorNotice } = useDispatch( "core/notices" );

	return <WordProofTimestamper
		createErrorNotice={ createErrorNotice }
		createSuccessNotice={ createSuccessNotice }
		useTimestampCallback={ useTimestampCallback }
	/>;
}
