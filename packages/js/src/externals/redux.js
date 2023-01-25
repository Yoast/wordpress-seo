import * as actions from "../redux/actions";
import { default as reducers } from "../redux/reducers";
import * as selectors from "../redux/selectors";

window.yoast = window.yoast || {};
window.yoast.externals = window.yoast.externals || {};
window.yoast.externals.redux = {
	selectors,
	reducers,
	actions,
};
