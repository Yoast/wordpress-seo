import { GoogleContent, SocialContent, TwitterContent } from "../components";
import { PREVIEW_TYPE } from "../constants";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {JSX.ElementType} The content component for the given preview type.
 */
export const usePreviewContent = () => {
	const { previewType } = useTypeContext();

	switch ( previewType ) {
		case PREVIEW_TYPE.social:
			return SocialContent;
		case PREVIEW_TYPE.twitter:
			return TwitterContent;
		default:
			return GoogleContent;
	}
};
