import { __ } from "@wordpress/i18n";
import { createElement } from "@wordpress/element";
import { QuestionMarkLink } from "./QuestionMarkLinkPresenter";

/**
 * Renders the sidebar header.
 *
 * @returns A ReactElement containing the sidebar header.
 */
export default function SidebarHeader(): JSX.Element {
	return (
		<div className="yoast-block-sidebar-header">
			<div className="yoast-block-sidebar-title">
				{ __( "Information for Schema output", "yoast-schema-blocks" ) }
				<span className="yoast-inline-icon">
					<QuestionMarkLink URL={ "https://yoa.st/4dk" } />
				</span>
			</div>
		</div>
	);
}
