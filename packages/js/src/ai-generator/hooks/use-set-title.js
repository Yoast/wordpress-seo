import { useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { noop } from "lodash";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { PREVIEW_TYPE } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {function} The set title function.
 */
export const useSetTitle = () => {
	const { previewType } = useTypeContext();
	const { updateData, setFacebookPreviewTitle, setTwitterPreviewTitle } = useDispatch( STORE_NAME_EDITOR.free );

	return useMemo( () => {
		switch ( previewType ) {
			case PREVIEW_TYPE.google:
				return title => updateData( { title } );
			case PREVIEW_TYPE.social:
				return setFacebookPreviewTitle;
			case PREVIEW_TYPE.twitter:
				return setTwitterPreviewTitle;
			default:
				return noop;
		}
	}, [ previewType, updateData, setFacebookPreviewTitle, setTwitterPreviewTitle ] );
};
