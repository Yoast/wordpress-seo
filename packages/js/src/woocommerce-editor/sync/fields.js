import { omit } from "lodash";
import { META_FIELDS as PURE_META_FIELDS } from "../../shared-admin/constants";

export const META_FIELDS = {
	...omit( PURE_META_FIELDS, [ "wordProofTimestamp" ] ),
	primaryProductCategory: {
		key: "primary_product_cat",
		get: "getPrimaryProductCategory",
		set: "setPrimaryProductCategory",
	},
};
