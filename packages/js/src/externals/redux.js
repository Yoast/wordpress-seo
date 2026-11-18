import * as actions from "../redux/actions";
import { default as reducers } from "../redux/reducers";
import * as selectors from "../redux/selectors";
import { createFreezeReducer } from "../redux/utils/create-freeze-reducer";
import { createSnapshotReducer } from "../redux/utils/create-snapshot-reducer";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.redux = {
	selectors,
	reducers,
	actions,
	utils: {
		createFreezeReducer,
		createSnapshotReducer,
	},
};
