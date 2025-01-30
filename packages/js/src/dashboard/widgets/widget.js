import { Paper, Title } from "@yoast/ui-library";

/**
 * @param {string} [title] The title in an H2.
 * @param {JSX.Element} children The content.
 * @returns {JSX.Element} The element.
 */
export const Widget = ( { title, children } ) => {
	return (
		<Paper className="yst-grow yst-p-8 yst-shadow-md yst-mt-6">
			{ title && (
				<Title as="h2" className=" yst-text-slate-900 yst-font-medium">
					{ title }
				</Title>
			) }
			{ children }
		</Paper>
	);
};
