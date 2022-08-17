import { __, sprintf } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import PropTypes from "prop-types";
import { makeOutboundLink } from "@yoast/helpers";
import { Alert } from "@yoast/ui-library";

import IndexablesPageCard from "./indexables-card";
import IndexablesTable from "./indexables-table";
import IndexableTitleLink from "./indexable-title-link";
import { addLinkToString } from "../../helpers/stringHelpers";

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
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The indexables score card.
 */
function IndexablesScoreCard( {
	title,
	setIgnoredIndexable,
	indexablesLists,
	listSize,
	listKey,
	assessmentFunction,
	isDisabled,
	feature,
	metric,
} ) {
	const [ isLoading, setIsLoading ] = useState( ! isDisabled );
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
					/* eslint-disable max-len, no-nested-ternary */
					isDisabled
						? <Alert type={ "info" }>
							{
								addLinkToString(
									// translators: %2$s is the name of the disabled feature, %2$s and %3$s are the opening and closing anchor tags, %4$s is the score of the disabled feature.
									sprintf(
										__(
											"You've disabled the '%1$s' feature. " +
											"Enable this feature on the %2$sFeatures tab%3$s if you want us to calculate the %4$s of your content",
											"wordpress-seo"
										),
										feature,
										"<a>",
										"</a>",
										metric
									), "/wp-admin/admin.php?page=wpseo_dashboard#top#features"

								)
								/* eslint-enable max-len, no-nested-ternary */
							}
						</Alert>
						: isLoading
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
										<IndexableScore
											colorClass={ assessmentFunction( indexable ) }
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

IndexablesScoreCard.propTypes = {
	title: PropTypes.oneOfType( [ PropTypes.node, PropTypes.string ] ).isRequired,
	listSize: PropTypes.number.isRequired,
	listKey: PropTypes.string.isRequired,
	setIgnoredIndexable: PropTypes.func,
	indexablesLists: PropTypes.object,
	assessmentFunction: PropTypes.func.isRequired,
	isDisabled: PropTypes.bool,
	feature: PropTypes.string,
	metric: PropTypes.string,
};

IndexablesScoreCard.defaultProps = {
	setIgnoredIndexable: () => {},
	indexablesLists: {},
	isDisabled: false,
	feature: "",
	metric: "",
};

export default IndexablesScoreCard;
