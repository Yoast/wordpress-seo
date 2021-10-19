"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.analysisDataSelectors = exports.analysisDataActions = void 0;

var _toolkit = require("@reduxjs/toolkit");

const SLICE_NAME = "analysisData";
const analysisDataSlice = (0, _toolkit.createSlice)({
  name: SLICE_NAME,
  initialState: {
    content: ""
  },
  reducers: {
    updatedContent: (state, action) => {
      state.content = action.payload;
    }
  }
});

const selectContent = state => state.analysisData.content;

const analysisDataSelectors = {
  selectContent
};
exports.analysisDataSelectors = analysisDataSelectors;
const analysisDataActions = analysisDataSlice.actions;
exports.analysisDataActions = analysisDataActions;
var _default = analysisDataSlice.reducer;
exports.default = _default;