/* External dependencies */
import { SearchIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library/src";
import styled from "styled-components";

/* Internal dependencies */
import EditorModal from "../../../containers/EditorModal";
import BlockEditorSnippetEditor from "../../../containers/SnippetEditor";
import ElementorSnippetEditor from "../../../elementor/containers/SnippetEditor";

const StyledHeroIcon = styled( SearchIcon )`
	width: 18px;
	height: 18px;
	margin: 3px;
`;

/**
 * The Search Appearance Modal.
 *
 * @returns {JSX.Element} The Search Appearance Modal.
 */
const SearchAppearanceModal = () => {
	const svgAriaProps = useSvgAria();
	const isElementorEditor = useSelect( select => select( "yoast-seo/editor" ).getIsElementorEditor(), [] );

	return (
		<EditorModal
			title={ __( "Search appearance", "wordpress-seo" ) }
			id="yoast-search-appearance-modal"
			shouldCloseOnClickOutside={ false }
			SuffixHeroIcon={ <StyledHeroIcon className="yst-text-slate-500" { ...svgAriaProps } /> }
		>
			{ isElementorEditor === true && <ElementorSnippetEditor showCloseButton={ false } hasPaperStyle={ false } /> }
			{ isElementorEditor === false && <BlockEditorSnippetEditor showCloseButton={ false } hasPaperStyle={ false } /> }
		</EditorModal>
	);
};

export default SearchAppearanceModal;
