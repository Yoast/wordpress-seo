import { Paper, Title } from "@yoast/ui-library";
import classNames from "classnames";
import { InfoTooltip } from "../components/info-tooltip";
import { LearnMoreLink } from "../components/learn-more-link";

/**
 * @param {ReactNode} children The content of the title.
 * @param {Object} [props] Any title props.
 * @returns {JSX.Element} The widget title.
 */
export const WidgetTitle = ( { children, ...props } ) => (
	<Title as="h2" { ...props }>
		{ children }
	</Title>
);
WidgetTitle.displayName = "Widget.Title";

/**
 * @param {ReactNode} children The content of the paragraph.
 * @param {string} [learnMoreLink] The URL to the learn more page.
 * @returns {JSX.Element} The widget tooltip with paragraph and optional learn more link.
 */
export const WidgetTooltip = ( { children, learnMoreLink } ) => (
	<InfoTooltip>
		<p className="yst-mb-2">{ children }</p>
		{ learnMoreLink && <LearnMoreLink href={ learnMoreLink } /> }
	</InfoTooltip>
);
WidgetTooltip.displayName = "Widget.Tooltip";

/**
 * @param {string} [className] The class name.
 * @param {string} [title] The title in an H2.
 * @param {string} [tooltip] The description in a tooltip of an info button.
 * @param {string} [tooltipLearnMoreLink] The learn more link for the tooltip.
 * @param {ReactNode} children The content.
 * @returns {JSX.Element} The widget.
 */
export const Widget = ( { className = "yst-paper__content", title, tooltip, tooltipLearnMoreLink, children } ) => (
	<Paper className={ classNames( "yst-shadow-md", className ) }>
		{ ( title || tooltip ) && <div className="yst-flex yst-justify-between">
			{ title && <WidgetTitle>{ title }</WidgetTitle> }
			{ tooltip && <WidgetTooltip learnMoreLink={ tooltipLearnMoreLink }>{ tooltip }</WidgetTooltip> }
		</div> }
		{ children }
	</Paper>
);
