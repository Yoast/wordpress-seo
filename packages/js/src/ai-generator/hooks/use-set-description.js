import { useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { noop } from "lodash";
import { PREVIEW_TYPE, STORE_NAME_EDITOR } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {function} The set description function.
 */
export const useSetDescription = () => {
	const { previewType } = useTypeContext();
	const { updateData, setFacebookPreviewDescription, setTwitterPreviewDescription } = useDispatch( STORE_NAME_EDITOR );

	return useMemo( () => {
		switch ( previewType ) {
			case PREVIEW_TYPE.google:
				return description => updateData( { description } );
			case PREVIEW_TYPE.social:
				return setFacebookPreviewDescription;
			case PREVIEW_TYPE.twitter:
				return setTwitterPreviewDescription;
			default:
				return noop;
		}
	}, [ previewType, updateData, setFacebookPreviewDescription, setTwitterPreviewDescription ] );
};
