import { createPostReplacementVariableConfigurations, createTermReplacementVariableConfigurations } from "../replacement-variables";

/**
 * Return the replacement variable configuration per content type.
 *
 * @returns {object} The replacements per content type.
 */
export function getContentTypeReplacements() {
	return {
		post: {
			name: "post",
			replacementVariableConfigurations: createPostReplacementVariableConfigurations(),
		},
		term: {
			name: "term",
			replacementVariableConfigurations: createTermReplacementVariableConfigurations(),
		},
	};
}
