import { createContext } from "@wordpress/element";
import { EDIT_TYPE, PREVIEW_TYPE, POST_TYPE, CONTENT_TYPE } from "../constants";

const defaultTypeContext = {
	editType: EDIT_TYPE.title,
	previewType: PREVIEW_TYPE.google,
	postType: POST_TYPE.post,
	contentType: CONTENT_TYPE.post,
};

export const TypeContext = createContext( defaultTypeContext );
export const TypeProvider = TypeContext.Provider;
