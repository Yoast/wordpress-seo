import { get } from "lodash";

export const postInitialState = {
	isPost: get( window, "wpseoScriptData.metabox.entity.entityType", false ) === "post",
	id: Number( get( window, "wpseoScriptData.metabox.entity.id", null ) ),
	type: get( window, "wpseoScriptData.metabox.entity.type", "" ),
	status: get( window, "wpseoScriptData.metabox.entity.status", "" ),
};
