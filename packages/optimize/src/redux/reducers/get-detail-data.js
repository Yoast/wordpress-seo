import { createAsyncActionReducer } from "@yoast/admin-ui-toolkit/helpers";

import {
	GET_DETAIL_REQUEST,
	GET_DETAIL_SUCCESS,
	GET_DETAIL_ERROR,
} from "../constants.js";

/**
 * Reducer for the handle save async status and result.
 * @param {Object} state The current state.
 * @param {Action} action The action object.
 * @returns {Object} The new state.
 */
const getDetailDataReducer = createAsyncActionReducer( [ GET_DETAIL_REQUEST, GET_DETAIL_SUCCESS, GET_DETAIL_ERROR ] );

export default getDetailDataReducer;
