import _extends from "@babel/runtime/helpers/extends";
import { createElement } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { SEO_STORE_NAME } from "@yoast/seo-store";
import { PropTypes } from "prop-types";
import { useReplacementVariables } from "../../hooks/useReplacementVariables";
/**
 * Handles known data for a Facebook editor component.
 *
 * @param {JSX.Element} as A Facebook editor component.
 * @param {Object} restProps Props to pass to the Facebook editor component, that are unhandled by this container.
 *
 * @returns {JSX.Element} A wrapped Facebook editor component.
 */

const FacebookEditorContainer = _ref => {
  let {
    as: Component,
    ...restProps
  } = _ref;
  const facebookTitle = useSelect(select => select(SEO_STORE_NAME).selectFacebookTitle());
  const facebookDescription = useSelect(select => select(SEO_STORE_NAME).selectFacebookDescription());
  const facebookImageUrl = useSelect(select => select(SEO_STORE_NAME).selectFacebookImageURL());
  const facebookImageAlt = useSelect(select => select(SEO_STORE_NAME).selectFacebookImage()).alt;
  const socialDescriptionTemplate = useSelect(select => select(SEO_STORE_NAME).selectSocialDescriptionTemplate());
  const contentDescription = useSelect(select => select(SEO_STORE_NAME).selectMetaDescription());
  const contentExcerpt = useSelect(select => select(SEO_STORE_NAME).selectExcerpt());
  const socialTitleTemplate = useSelect(select => select(SEO_STORE_NAME).selectSocialTitleTemplate());
  const seoTitle = useSelect(select => select(SEO_STORE_NAME).selectSeoTitle());
  const {
    updateFacebookTitle,
    updateFacebookDescription
  } = useDispatch(SEO_STORE_NAME);
  const socialMediumName = "Facebook";
  const {
    replacementVariables,
    recommendedReplacementVariables
  } = useReplacementVariables();
  return createElement(Component, _extends({
    title: facebookTitle,
    description: facebookDescription,
    imageUrl: facebookImageUrl,
    alt: facebookImageAlt,
    onTitleChange: updateFacebookTitle,
    onDescriptionChange: updateFacebookDescription,
    replacementVariables: replacementVariables,
    recommendedReplacementVariables: recommendedReplacementVariables,
    titleInputPlaceholder: "",
    descriptionInputPlaceholder: "",
    descriptionPreviewFallback: socialDescriptionTemplate || contentDescription || contentExcerpt || "",
    titlePreviewFallback: socialTitleTemplate || seoTitle || "",
    socialMediumName: socialMediumName
  }, restProps));
};

FacebookEditorContainer.propTypes = {
  as: PropTypes.elementType.isRequired
};
export default FacebookEditorContainer;
//# sourceMappingURL=facebook-container.js.map