import { createInterpolateElement, useMemo } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";
import { useSelectSettings } from "../hooks";

/**
 * @param {string} link The link/URL.
 * @param {string} content Expected to contain 2 replacements, indicating the start and end anchor tags.
 * @param {string} id The ID.
 * @param {Object} [anchorProps] Extra anchor properties.
 * @returns {JSX.Element} The anchor element.
 */
const useSelectLink = ( { link, content, id, ...anchorProps } ) => {
	const href = useSelectSettings( "selectLink", [ link ], link );
	return useMemo( () => createInterpolateElement(
		sprintf( content, "<a>", "</a>" ),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id={ id }
				href={ href }
				target="_blank"
				rel="noopener noreferrer"
				{ ...anchorProps }
			/>,
		}
	), [ href, content, id, anchorProps ] );
};

export default useSelectLink;
