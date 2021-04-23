import { createElement } from "@wordpress/element";
import { QuestionMarkLink } from "./QuestionMarkLinkPresenter";

interface StringWithClickableQuestionMark {
	text: string;
	URL: string;
}

/**
 * Renders a string followed by a clickable question mark icon.
 *
 * @param props The properties.
 *
 * @returns A ReactElement containing the string followed by a clickable question mark icon.
 */
export default function StringWithClickableQuestionMark( props: StringWithClickableQuestionMark ): JSX.Element {
	return (
		<div className="yoast-block-string-with-clickable-question-mark">
			<div className="yoast-block-sidebar-title">
				{ props.text }
				<span className="yoast-inline-icon">
					<QuestionMarkLink URL={ props.URL } />
				</span>
			</div>
		</div>
	);
}
