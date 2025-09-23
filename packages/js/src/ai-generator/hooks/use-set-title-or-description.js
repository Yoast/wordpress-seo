import { noop } from "lodash";
import { EDIT_TYPE } from "../constants";
import { useSetDescription } from "./use-set-description";
import { useSetTitle } from "./use-set-title";
import { useTypeContext } from "./use-type-context";

/**
 * @returns {function} The set function.
 */
export const useSetTitleOrDescription = () => {
	const { editType } = useTypeContext();

	switch ( editType ) {
		case EDIT_TYPE.title:
			return useSetTitle();
		case EDIT_TYPE.description:
			return useSetDescription();
		default:
			return noop;
	}
};
