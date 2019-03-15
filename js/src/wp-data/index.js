/* External dependencies */
import {
	registerStore,
} from "@wordpress/data";
import {
	filter,
} from "lodash";

/* Internal dependencies */
import reducer from "./reducer";
import * as selectors from "./selectors";
import * as resolvers from "./resolvers";
import * as actions from "./actions";
import controls from "./controls";

export const NAMESPACE = "yoast-seo/wp-data";

registerStore( NAMESPACE, {
	reducer,
	selectors,
	resolvers,
	controls,
	actions: filter( actions, action => typeof action === "function" ),
} );
