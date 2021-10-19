"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _analysisDataSlice = require("./analysis-data-slice");

var _analysisResultsSlice = require("./analysis-results-slice");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Effects = ({
  children
}) => {
  const dispatch = (0, _reactRedux.useDispatch)();
  const content = (0, _reactRedux.useSelector)(_analysisDataSlice.analysisDataSelectors.selectContent);
  (0, _react.useEffect)(() => {
    dispatch(_analysisResultsSlice.analysisResultsActions.fetchSeoResults({
      key: "focus",
      paper: content
    }));
  }, [dispatch, content]);
  return children;
};

const createProvider = store => ({
  children
}) => /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
  store: store
}, /*#__PURE__*/_react.default.createElement(Effects, null, children));

var _default = createProvider;
exports.default = _default;