"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.default = exports.actions = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _analysisDataSlice = _interopRequireWildcard(require("./analysis-data-slice"));

var _provider = _interopRequireDefault(require("./provider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable require-jsdoc */
const actions = { ..._analysisDataSlice.actions
};
exports.actions = actions;
const selectors = { ..._analysisDataSlice.selectors
};
exports.selectors = selectors;

const createAnalysisStore = ({
  getSeoResults,
  getReadabilityResults,
  getResearchResults,
  middleware = []
}) => {
  const store = (0, _toolkit.configureStore)({
    reducer: {
      analysisData: _analysisDataSlice.default
    },
    middleware: getDefaultMiddleware => [...getDefaultMiddleware({
      thunk: {
        extraArgument: {
          getSeoResults,
          getReadabilityResults,
          getResearchResults
        }
      }
    }), ...middleware]
  });
  const Provider = (0, _provider.default)({
    store
  });
  return {
    dispatch: store.dispatch,
    select: (selector, ...args) => selector(store.getState(), ...args),
    Provider
  };
};

var _default = createAnalysisStore;
exports.default = _default;