import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";
import { makeOutboundLink } from "@yoast/helpers";

import IndexablesPageCard from "./indexables-card";
import IndexablesTable from "./indexables-table";
import IndexableTitleLink from "./indexable-title-link";

const Link = makeOutboundLink();

/**
 * A score representation.
 *
 * @param {string} colorClass The color of the bullet.
 *
 * @returns {WPElement} A div with a styled score representation.
 */
export function IndexableScore( { colorClass } ) {
	return <div className="yst-flex yst-items-center">
		<span className={ "yst-rounded-full yst-w-3 yst-h-3 " + colorClass } />
	</div>;
}

IndexableScore.propTypes = {
	colorClass: PropTypes.string.isRequired,
};

/**
 * 
 * @returns {WPElement} The indexables score card.
 */
function IndexablesScoreCard( {
	title,
	setIgnoredIndexable,
	scoreThresholds,
	indexablesLists,
	scoreKey,
	listSize,
	listKey,
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

	return (
		<IndexablesPageCard
			title={
				isLoading
					? <div className="yst-flex yst-items-center yst-h-8 yst-animate-pulse"><div className="yst-w-3/5 yst-bg-gray-200 yst-h-3 yst-rounded" /></div>
					: title
			}
			className="yst-mb-6 last:yst-mb-0"
		>
			<IndexablesTable>
				{
					isLoading
						? []
						: indexablesLists[ listKey ].slice( 0, listSize ).map(
							( indexable, position ) => {
								const score = parseInt( indexable[ scoreKey ], 10 );
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type={ listKey }
									indexable={ indexable }
									addToIgnoreList={ setIgnoredIndexable }
									position={ position }
								>
									<IndexableScore
										colorClass={ score > scoreThresholds.medium ? "yst-bg-amber-500" : "yst-bg-red-500" }
									/>
									<IndexableTitleLink indexable={ indexable } />
									<div>
										<Link
											href={ "/wp-admin/post.php?action=edit&post=" + indexable.object_id }
											className="yst-button yst-button--secondary yst-text-gray-700"
										>
											{ __( "Improve", "wordpress-seo" ) }
										</Link>
									</div>
								</IndexablesTable.Row>;
							}
						)
				}
			</IndexablesTable>
		</IndexablesPageCard>
	);
}

export default IndexablesScoreCard;
