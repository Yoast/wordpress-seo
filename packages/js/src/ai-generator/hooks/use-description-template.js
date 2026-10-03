import { useMemo } from "@wordpress/element";
import { useGetDescriptionTemplate } from ".";

/**
 * @returns {string} The description template.
 */
export const useDescriptionTemplate = () => {
	const getDescriptionTemplate = useGetDescriptionTemplate();
	return useMemo( getDescriptionTemplate, [ getDescriptionTemplate ] );
};
