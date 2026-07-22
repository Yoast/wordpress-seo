import { Title } from "@yoast/ui-library";

/**
 * The bulk editor page header: the title and a short explanation of the tool.
 *
 * @param {Object}   props               The props.
 * @param {string}   props.title         The page title.
 * @param {JSX.node} [props.description] The description below the title.
 *
 * @returns {JSX.Element} The page header.
 */
export const BulkEditorPageHeader = ( { title, description = null } ) => (
	<header className="yst-p-8 yst-border-b yst-border-slate-200">
		<div className="yst-max-w-screen-sm">
			<Title>{ title }</Title>
			{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
		</div>
	</header>
);
