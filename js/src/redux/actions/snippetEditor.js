export const SNIPPET_EDITOR_SWITCH_MODE = "SNIPPET_EDITOR_SWITCH_MODE";
export const SNIPPET_EDITOR_UPDATE_DATA = "SNIPPET_EDITOR_UPDATE_DATA";

export function switchMode( mode ) {
	return {
		type: "SNIPPET_EDITOR_SWITCH_MODE",
		mode,
	};
}

export function updateData( data ) {
	return {
		type: SNIPPET_EDITOR_UPDATE_DATA,
		data,
	};
}
