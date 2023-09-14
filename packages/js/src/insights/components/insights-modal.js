import { LightBulbIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { isFeatureEnabled } from "@yoast/feature-flag";
import { useSvgAria } from "@yoast/ui-library/src";
import PropTypes from "prop-types";
import styled from "styled-components";
import EditorModal from "../../containers/EditorModal";
import EstimatedReadingTime from "./estimated-reading-time";
import FleschReadingEase from "./flesch-reading-ease";
import ProminentWords from "./prominent-words";
import TextFormality from "./text-formality";
import TextLength from "./text-length";

const StyledHeroIcon = styled( LightBulbIcon )`
	width: 18px;
	height: 18px;
	margin: 3px;
`;

/**
 * Insights modal component.
 * @param {string} location The location of this modal.
 * @returns {JSX.Element} The element.
 */
const InsightsModal = ( { location } ) => {
	const isElementorEditor = useSelect( select => select( "yoast-seo/editor" ).getIsElementorEditor(), [] );
	const isFleschReadingEaseAvailable = useSelect( select => select( "yoast-seo/editor" ).isFleschReadingEaseAvailable(), [] );

	const svgAriaProps = useSvgAria();

	return (
		<EditorModal
			title={ __( "Insights", "wordpress-seo" ) }
			id={ `yoast-insights-modal-${ location }` }
			shouldCloseOnClickOutside={ ! isElementorEditor }
			showChangesWarning={ false }
			SuffixHeroIcon={ <StyledHeroIcon className="yst-text-slate-500" { ...svgAriaProps } /> }
		>
			<div className="yoast-insights yoast-modal-content--columns">
				<ProminentWords location={ location } />
				<div>
					{ isFleschReadingEaseAvailable && <div className="yoast-insights-row">
						<FleschReadingEase />
					</div> }
					<div className="yoast-insights-row yoast-insights-row--columns">
						<EstimatedReadingTime />
						<TextLength />
					</div>
					{ isFeatureEnabled( "TEXT_FORMALITY" ) &&
					<TextFormality location={ location } name={ "YoastTextFormalityMetabox" } /> }
				</div>
			</div>
		</EditorModal>
	);
};

InsightsModal.propTypes = {
	location: PropTypes.string,
};

InsightsModal.defaultProps = {
	location: "sidebar",
};

export default InsightsModal;
