"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.default = exports.actions = void 0;

var _toolkit = require("@reduxjs/toolkit");

const analysisDataSlice = (0, _toolkit.createSlice)({
  name: "analysisData",
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

const selectors = {
  selectContent
};
exports.selectors = selectors;
const actions = analysisDataSlice.actions;
exports.actions = actions;
var _default = analysisDataSlice.reducer;
exports.default = _default;