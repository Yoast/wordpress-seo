import { createElement } from "@wordpress/element";
import { HelpLink } from "./HelpLinkPresenter";

interface LabelWithHelpLink {
	text: string;
	URL: string;
}

/**
 * Renders a label followed by a clickable question mark icon.
 *
 * @param props The properties.
 *
 * @returns A ReactElement containing the label followed by a clickable question mark icon.
 */
export default function LabelWithHelpLink( props: LabelWithHelpLink ): JSX.Element {
	return (
		<div className="yoast-block-label-with-help-link">
			<div className="yoast-block-sidebar-title">
				{ props.text }
				<span className="yoast-inline-icon">
					<HelpLink URL={ props.URL } />
				</span>
			</div>
		</div>
	);
}
