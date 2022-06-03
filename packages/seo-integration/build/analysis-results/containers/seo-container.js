import _extends from "@babel/runtime/helpers/extends";
import { createElement } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useMarker } from "../hooks/useMarker";
import { transformAnalysisResults } from "../helpers/transformAnalysisResults";
/**
 * Handles known data for a SEO results component.
 *
 * @param {JSX.Element} as A SEO results component.
 * @param {string} [keyphraseId] The keyphrase ID. Defaults to the ID of the focus keyphrase.
 * @param {Object} restProps Props to pass to the SEO results component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped SEO results component.
 */

const SeoResultsContainer = _ref => {
  var _restProps$headingLev, _restProps$marksButto;

  let {
    as: Component,
    keyphraseId,
    ...restProps
  } = _ref;
  const isSeoAnalysisActive = useSelect(select => select(SEO_STORE_NAME).selectIsSeoAnalysisActive()); // Render nothing when the SEO analysis is not active.

  if (!isSeoAnalysisActive) {
    return null;
  }

  const seoResults = useSelect(select => select(SEO_STORE_NAME).selectSeoResults(keyphraseId), [keyphraseId]);
  const keyphrase = useSelect(select => select(SEO_STORE_NAME).selectKeyphrase(keyphraseId), [keyphraseId]);
  const markerStatus = useSelect(select => select(SEO_STORE_NAME).selectMarkerStatus());
  const transformedResults = useMemo(() => transformAnalysisResults(seoResults, keyphraseId === FOCUS_KEYPHRASE_ID ? "" : keyphraseId), [seoResults]);
  const {
    markerId,
    handleMarkClick
  } = useMarker();
  return createElement(Component, _extends({}, transformedResults, {
    keywordKey: keyphrase,
    activeMarker: markerId,
    onMarkButtonClick: handleMarkClick,
    headingLevel: (_restProps$headingLev = restProps.headingLevel) !== null && _restProps$headingLev !== void 0 ? _restProps$headingLev : 2,
    marksButtonClassName: (_restProps$marksButto = restProps.marksButtonClassName) !== null && _restProps$marksButto !== void 0 ? _restProps$marksButto : "yoast-mark-button",
    marksButtonStatus: markerStatus
  }, restProps));
};

SeoResultsContainer.propTypes = {
  as: PropTypes.elementType.isRequired,
  keyphraseId: PropTypes.string
};
SeoResultsContainer.defaultProps = {
  keyphraseId: FOCUS_KEYPHRASE_ID
};
export default SeoResultsContainer;
//# sourceMappingURL=seo-container.js.map