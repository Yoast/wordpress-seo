import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
export const defaultConfigState = {
  analysisType: "post",
  isSeoActive: true,
  isReadabilityActive: true,
  researches: ["morphology"]
};
const configSlice = createSlice({
  name: "config",
  initialState: defaultConfigState,
  reducers: {
    updateAnalysisType: (state, _ref) => {
      let {
        payload
      } = _ref;
      state.analysisType = payload;
    },
    updateIsSeoActive: (state, _ref2) => {
      let {
        payload
      } = _ref2;
      state.isSeoActive = Boolean(payload);
    },
    updateIsReadabilityActive: (state, _ref3) => {
      let {
        payload
      } = _ref3;
      state.isReadabilityActive = Boolean(payload);
    },
    addResearch: (state, _ref4) => {
      let {
        payload
      } = _ref4;
      state.researches.push(payload);
    },
    removeResearch: (state, _ref5) => {
      let {
        payload
      } = _ref5;
      state.researches = state.researches.filter(research => research !== payload);
    }
  }
});
export const configSelectors = {
  selectAnalysisConfig: state => get(state, "analysis.config"),
  selectAnalysisType: state => get(state, "analysis.config.analysisType"),
  selectIsSeoAnalysisActive: state => get(state, "analysis.config.isSeoActive"),
  selectIsReadabilityAnalysisActive: state => get(state, "analysis.config.isReadabilityActive"),
  selectResearches: state => get(state, "analysis.config.researches")
};
export const configActions = configSlice.actions;
export default configSlice.reducer;
//# sourceMappingURL=config.js.map