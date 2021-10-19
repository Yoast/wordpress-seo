"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.default = exports.actions = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _lodash = require("lodash");

var _analysisDataSlice = _interopRequireWildcard(require("./analysis-data-slice"));

var _analysisResultsSlice = _interopRequireWildcard(require("./analysis-results-slice"));

var _helpers = require("./helpers");

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable require-jsdoc */
const actions = { ..._analysisDataSlice.analysisDataActions,
  ..._analysisResultsSlice.analysisResultsActions
};
exports.actions = actions;
const selectors = { ..._analysisDataSlice.analysisDataSelectors,
  ..._analysisResultsSlice.analysisResultsSelectors
};
exports.selectors = selectors;

const createAnalysisStore = ({
  fetchSeoResults,
  fetchReadabilityResults,
  fetchResearchResults,
  preparePaper = _lodash.identity,
  middleware = []
}) => {
  const store = (0, _toolkit.configureStore)({
    reducer: {
      analysisData: _analysisDataSlice.default,
      analysisResults: _analysisResultsSlice.default
    },
    middleware: getDefaultMiddleware => [...getDefaultMiddleware({
      thunk: {
        extraArgument: {
          preparePaper,
          fetchSeoResults,
          fetchReadabilityResults,
          fetchResearchResults
        }
      }
    }), ...middleware]
  });
  const Provider = (0, _provider.default)(store);
  return {
    actions: (0, _helpers.createActions)(store, actions),
    selectors: (0, _helpers.createSelectors)(store, selectors),
    Provider
  };
};

var _default = createAnalysisStore;
exports.default = _default;