"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.analysisResultsSelectors = exports.analysisResultsActions = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _lodash = require("lodash");

var _constants = require("./constants");

const SLICE_NAME = "analysisResults";
const INITIAL_RESULTS = {};
const fetchSeoResults = (0, _toolkit.createAsyncThunk)(`${SLICE_NAME}/fetchSeoResults`, async ({
  key,
  paper
}, {
  dispatch,
  getState,
  extra: service
}) => {
  // NOTE: Pass key to worker here?
  const response = await service.fetchSeoResults(service.preparePaper(paper, {
    dispatch,
    getState
  }));
  return {
    key,
    results: response.data
  };
});
const analysisResultsSlice = (0, _toolkit.createSlice)({
  name: SLICE_NAME,
  initialState: {
    seo: {
      status: _constants.ASYNC_STATUS.IDLE,
      error: "",
      results: {
        // How to determine which keys are accepted here?
        focus: INITIAL_RESULTS,
        a: INITIAL_RESULTS,
        b: INITIAL_RESULTS,
        c: INITIAL_RESULTS,
        d: INITIAL_RESULTS
      }
    },
    readability: {} // research: "",

  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSeoResults.pending, state => {
      state.seo.status = _constants.ASYNC_STATUS.PENDING;
    });
    builder.addCase(fetchSeoResults.fulfilled, (state, action) => {
      state.seo.status = _constants.ASYNC_STATUS.FULFILLED;
      state.seo.results[action.payload.key] = action.payload.results;
    });
    builder.addCase(fetchSeoResults.rejected, (state, action) => {
      state.seo.status = _constants.ASYNC_STATUS.REJECTED;
      state.seo.error = action.payload;
    });
  }
});

const selectSeoResults = (state, key) => (0, _lodash.get)(state, `analysisResults.seo.results.${key}`, INITIAL_RESULTS);

const analysisResultsSelectors = {
  selectSeoResults
};
exports.analysisResultsSelectors = analysisResultsSelectors;
const analysisResultsActions = { ...analysisResultsSlice.actions,
  fetchSeoResults
};
exports.analysisResultsActions = analysisResultsActions;
var _default = analysisResultsSlice.reducer;
exports.default = _default;