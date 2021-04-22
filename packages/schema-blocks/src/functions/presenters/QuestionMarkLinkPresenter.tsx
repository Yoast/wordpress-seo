import { createElement } from "@wordpress/element";

interface QuestionMarkLinkProps {
	URL: string;
}

/**
 * Renders a ReactElement containing a clickable question mark icon from HeroIcons.
 *
 * @param props The properties.
 *
 * @returns A ReactElement containing the question mark icon with a link.
 */
export function QuestionMarkLink( props: QuestionMarkLinkProps ): JSX.Element {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 20 18" fill="currentColor" height="15" width="22">
			<a href={ props.URL } rel="noopener noreferrer" target="_blank">
				<path
					fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113
				8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
					clipRule="evenodd"
				/>
			</a>
		</svg>
	);
}
