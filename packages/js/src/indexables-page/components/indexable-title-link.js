import { ExternalLinkIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";

import { makeOutboundLink } from "@yoast/helpers";
import { Badge } from "@yoast/ui-library";


const Link = makeOutboundLink();

/**
 * A link to the indexable.
 *
 * @param {object} indexable The indexable.
 *
 * @returns {WPElement} A div with a styled link to the indexable.
 */
export function IndexableTitleLink( { indexable, showType } ) {
	return <div className="yst-grow yst-min-w-0 yst-flex yst-h-3/5">
		<Link
			href={ indexable.permalink }
			className="yst-min-w-0 yst-rounded-md focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500 yst-flex yst-items-center yst-gap-2 yst-no-underline yst-text-inherit hover:yst-text-indigo-500"
		>
			<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-shrink-0 yst-h-[13px] yst-w-[13px]" />
		</Link>
		{ ( showType ) && <Badge variant="plain" className="yst-text-gray-800 yst-text-[10px] yst-self-center yst-h-4 yst-ml-2">{ indexable.object_sub_type }</Badge> }
	</div>;
}

IndexableTitleLink.propTypes = {
	indexable: PropTypes.shape( {
		permalink: PropTypes.string.isRequired,
		/* eslint-disable camelcase */
		breadcrumb_title: PropTypes.string.isRequired,
		object_sub_type: PropTypes.string,
		/* eslint-enable camelcase */
	} ).isRequired,
	showType: PropTypes.bool,
};

IndexableTitleLink.defaultProps = {
	showType: true,
};

export default IndexableTitleLink;

