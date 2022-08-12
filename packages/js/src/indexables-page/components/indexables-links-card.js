import PropTypes from "prop-types";
import { LinkIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { Button } from "@yoast/ui-library";

import IndexablesPageCard from "./indexables-card";
import IndexablesTable from "./indexables-table";
import IndexableTitleLink from "./indexable-title-link";
import { IndexableScore } from "./indexables-score-card";


/**
 * A link count representation.
 *
 * @param {int} count The number of links.
 *
 * @returns {WPElement} A div with a styled link count representation.
 */
export function IndexableLinkCount( { count } ) {
	return 	<div className="yst-min-w-[36px] yst-shrink-0 yst-flex yst-items-center yst-gap-1.5">
		<LinkIcon className="yst-h-4 yst-w-4 yst-text-gray-400" />
		{ count }
	</div>;
}

IndexableLinkCount.propTypes = {
	count: PropTypes.number.isRequired,
};

/* eslint-disable complexity */

/**
 *
 * @param {*} props The Props object.
 *
 * @returns {WPElement} The Indexables Links Card.
 */
function IndexablesLinksCard( {
	title,
	intro,
	outro,
	setIgnoredIndexable,
	indexablesLists,
	countKey,
	listSize,
	listKey,
	handleLink,
} ) {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ oldListLength, setOldListLength ] = useState( indexablesLists[ listKey ]?.length );

	const newLength = indexablesLists[ listKey ]?.length;
	useEffect( () => {
		if ( ! oldListLength > 0 && newLength > 0 ) {
			setIsLoading( false );
		}
		setOldListLength( newLength );
	}, [ indexablesLists[ listKey ] ] );


	if ( ! isLoading && ( newLength === 0 ) ) {
		return null;
	}

	return <IndexablesPageCard
		title={
			isLoading
				? <div className="yst-flex yst-items-center yst-h-8 yst-animate-pulse"><div className="yst-w-3/5 yst-bg-gray-200 yst-h-3 yst-rounded" /></div>
				: title
		}
		className="yst-mb-6 last:yst-mb-0"
	>
		<div className="yst-mb-3 yst-text-justify yst-pr-6">
			{ ! isLoading && intro }
		</div>
		<IndexablesTable>
			{
				isLoading
					? []
					: indexablesLists[ listKey ].slice( 0, listSize ).map(
						( indexable, position ) => {
							return <IndexablesTable.Row
								key={ `indexable-${ indexable.id }-row` }
								type={ listKey }
								indexable={ indexable }
								addToIgnoreList={ setIgnoredIndexable }
								position={ position }
							>
								{ /* @TODO: needs to be calculated */ }
								<IndexableScore colorClass={ parseInt( indexable.is_cornerstone, 10 ) ? "yst-bg-emerald-500" : "yst-bg-red-500" } />
								<IndexableLinkCount count={ parseInt( indexable[ countKey ], 10 ) } />
								<IndexableTitleLink indexable={ indexable } />
								<div key={ `least-linked-modal-button-${ indexable.id }` }  className="yst-shrink-0">
									<Button
										data-indexableid={ indexable.id }
										data-incominglinkscount={ indexable.incoming_link_count === null ? 0 : indexable.incoming_link_count }
										data-breadcrumbtitle={ indexable.breadcrumb_title }
										data-permalink={ indexable.permalink }
										onClick={ handleLink }
										variant="secondary"
									>
										{ __( "Add links", "wordpress-seo" ) }
									</Button>
								</div>
							</IndexablesTable.Row>;
						}
					)
			}
		</IndexablesTable>
		<div className="yst-mt-3 yst-text-justify yst-pr-6">
			{ ! isLoading && outro }
		</div>
	</IndexablesPageCard>;
}

IndexablesLinksCard.propTypes = {
	title: PropTypes.oneOfType( [ PropTypes.node, PropTypes.string ] ).isRequired,
	intro: PropTypes.oneOfType( [ PropTypes.node, PropTypes.string ] ),
	outro: PropTypes.oneOfType( [ PropTypes.node, PropTypes.string ] ),
	countKey: PropTypes.string.isRequired,
	listSize: PropTypes.number.isRequired,
	listKey: PropTypes.string.isRequired,
	setIgnoredIndexable: PropTypes.func,
	scoreThresholds: PropTypes.shape( { medium: PropTypes.number.isRequired } ),
	indexablesLists: PropTypes.object,
	handleLink: PropTypes.func,
};

IndexablesLinksCard.defaultProps = {
	setIgnoredIndexable: () => {},
	handleLink: () => {},
	indexablesLists: {},
	intro: null,
	outro: null,
};

export default IndexablesLinksCard;
