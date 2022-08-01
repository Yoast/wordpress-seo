/* global wpseoIndexablesPageData */
import PropTypes from "prop-types";
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback, Fragment } from "@wordpress/element";
import { LockOpenIcon, LinkIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { Button, Alert, Modal } from "@yoast/ui-library";
import { makeOutboundLink } from "@yoast/helpers";
import IndexablesTable from "./components/indexables-table";
import SvgIcon from "../../../components/src/SvgIcon";

const Link = makeOutboundLink();

/**
 * A score representation.
 *
 * @param {int} score The indexable score.
 * @param {int} mediumThreshold The threshold to render a score as medium
 * @param {int} goodThreshold The threshold to render a score as good
 *
 * @returns {WPElement} A div with a styled score representation.
 */
function IndexableScore( { score, mediumThreshold, goodThreshold } ) {
	let colorClass = "yst-text-red-500";
	if ( score > mediumThreshold ) {
		colorClass = "yst-text-amber-500";
	}
	if ( score > goodThreshold ) {
		colorClass = "yst-text-emerald-500";
	}

	return <div className="yst-min-w-[65px]">
		<span className={ "yst-font-black yst-text-xl " + colorClass }>{ score }</span>
		<span className="yst-text-xxs yst-text-gray-500">/100</span>
	</div>;
}

IndexableScore.propTypes = {
	score: PropTypes.number.isRequired,
	mediumThreshold: PropTypes.number.isRequired,
	goodThreshold: PropTypes.number.isRequired,
};

/**
 * A link count representation.
 *
 * @param {int} count The number of links.
 *
 * @returns {WPElement} A div with a styled link count representation.
 */
function IndexableLinkCount( { count } ) {
	return 	<div className="yst-min-w-[40px] yst-shrink-0 yst-flex yst-items-center yst-gap-1">
		<LinkIcon className="yst-h-4 yst-w-4 yst-text-gray-400" />
		{ count }
	</div>;
}
IndexableLinkCount.propTypes = {
	count: PropTypes.number.isRequired,
};

/**
 * A link to the indexable.
 *
 * @param {object} indexable The indexable.
 *
 * @returns {WPElement} A div with a styled link to the indexable.
 */
function IndexableTitleLink( { indexable } ) {
	return <div className="yst-grow yst-min-w-0 yst-flex yst-h-3/5">
		<Link
			href={ indexable.permalink }
			className="yst-min-w-0 yst-rounded-md focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500 yst-flex yst-items-center yst-gap-2 yst-no-underline yst-text-inherit hover:yst-text-indigo-500"
		>
			<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-shrink-0 yst-h-[13px] yst-w-[13px]" />
		</Link>
	</div>;
}

IndexableTitleLink.propTypes = {
	indexable: PropTypes.shape( {
		permalink: PropTypes.string.isRequired,
		/* eslint-disable-next-line camelcase */
		breadcrumb_title: PropTypes.string.isRequired,
	} ).isRequired,
};

/**
 * A card for the indexables page.
 *
 * @param {string}   title     The indexable title.
 * @param {boolean}  isLoading Wether the card is loading or not.
 * @param {JSX.node} children  The React children.
 *
 * @returns {WPElement} A div with a styled link to the indexable.
 */
function IndexablesPageCard( { title, isLoading, children } ) {
	return <div
		className="yst-bg-white yst-rounded-lg yst-px-8 yst-py-6 yst-shadow"
	>
		<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">
			{ isLoading
				? title
				: <div className="yst-flex yst-items-center yst-h-8 yst-animate-pulse"><div className="yst-w-3/5 yst-bg-gray-200 yst-h-3 yst-rounded" /></div>
			}
		</h3>
		{ children }
	</div>;
}

IndexablesPageCard.propTypes = {
	title: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
};

/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/* eslint-disable complexity */
/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the main indexables page.
 */
function IndexablesPage() {
	const listSize = parseInt( wpseoIndexablesPageData.listSize, 10 );
	const isPremiumInstalled = Boolean( wpseoIndexablesPageData.isPremium );
	const isLinkSuggestionsEnabled = Boolean( wpseoIndexablesPageData.isLinkSuggestionsEnabled );
	const minimumIndexablesInBuffer = listSize * 2;

	const [ listedIndexables, setlistedIndexables ] = useState(
		{
			least_readability: [],
			least_seo_score: [],
			most_linked: [],
			least_linked: [],
		}
	);
	const [ ignoreIndexable, setIgnoreIndexable ] = useState( null );
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ suggestedLinksModalContent, setSuggestedLinksModalContent ] = useState( null );

	/**
	 * Fetches a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 *
	 * @returns {boolean} True if the request was successful.
	 */
	const fetchList = async( listName ) => {
		try {
			const response = await apiFetch( {
				path: `yoast/v1/${ listName }`,
				method: "GET",
			} );

			const parsedResponse = await response.json;
			let newList = parsedResponse.list;

			if ( ignoreIndexable !== null ) {
				newList = newList.filter( indexable => {
					return indexable.id !== ignoreIndexable.indexable.id;
				} );
			}

			setlistedIndexables( prevState => {
				return {
					...prevState,
					[ listName ]: newList,
				};
			  } );
			return true;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	/**
	 * Updates a list in case an indexable has been ignored.
	 *
	 * @param {string} listName The name of the list to fetch.
	 *
	 * @returns {void}
	 */
	const renderList = ( listName ) => {
		if ( ignoreIndexable === null ) {
			return;
		}

		setlistedIndexables( prevState => {
			return {
				...prevState,
				[ listName ]: prevState[ listName ].filter( indexable => {
					return indexable.id !== ignoreIndexable.indexable.id;
				} ),
			};
		} );
	};

	/* eslint-disable  complexity */
	/**
	 * Updates the content of a list of indexables.
	 *
	 * @param {string} listName   The name of the list to fetch.
	 * @param {array}  indexables The name of the list to fetch.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName, indexables ) => {
		// @TODO: we have to also check if there are even other posts to re-fetch and if not, let's just render.
		return ( indexables.length < minimumIndexablesInBuffer ) ? fetchList( listName ) : renderList( listName );
	};

	/**
	 * Handles the rendering of the links modal.
	 *
	 * @param {int}    indexableId         The id of the indexable.
	 * @param {int}    incomingLinksCount The number of incoming links.
	 * @param {string} breadcrumbTitle    The title of the indexable.
	 * @param {string} permalink          The link to the indexable.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const handleOpenModal = useCallback( async( indexableId, incomingLinksCount, breadcrumbTitle, permalink ) => {
		setIsModalOpen( true );

		if ( ! isPremiumInstalled ) {
			return;
		}
		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/link_suggestions?indexableId=" + indexableId,
				method: "GET",
			} );

			const parsedResponse = await response.json;

			if ( parsedResponse.length === 0 ) {
				setSuggestedLinksModalContent( {
					incomingLinksCount: incomingLinksCount,
					linksList: [],
					breadcrumbTitle: breadcrumbTitle,
					permalink: permalink,
				 } );
				 return true;
			}
			if ( parsedResponse.length > 0 ) {
				setSuggestedLinksModalContent( {
					incomingLinksCount: incomingLinksCount,
					linksList: parsedResponse,
					breadcrumbTitle: breadcrumbTitle,
					permalink: permalink,
				 } );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ setSuggestedLinksModalContent, setIsModalOpen ] );

	/**
	 * Handles the click event of the link button.
	 *
	 * @param {event} e The click event.
	 *
	 * @returns {void}
	 */
	const handleLink = useCallback( ( e ) => {
		handleOpenModal(
			e.currentTarget.dataset.indexableid,
			e.currentTarget.dataset.incominglinkscount,
			e.currentTarget.dataset.breadcrumbtitle,
			e.currentTarget.dataset.permalink
		);
	}, [ handleOpenModal ] );

	/**
	 * Handles the closing of the modal.
	 *
	 * @returns {void}
	 */
	const handleCloseModal = useCallback( () => {
		setIsModalOpen( false );
		setSuggestedLinksModalContent( null );
	}, [] );

	/**
	 * Handles the undo action
	 * @param {object} ignored The ignored indexable.
	 *
	 * @returns {boolean} True if the action was successful.
	 */
	const handleUndo = useCallback( async( ignored ) => {
		const id = ignored.indexable.id;
		const type = ignored.type;
		const indexable = ignored.indexable;
		const position = ignored.position;

		try {
			const response = await apiFetch( {
				path: "yoast/v1/restore_indexable",
				method: "POST",
				data: { id: id, type: type },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				setlistedIndexables( prevState => {
					const newData = prevState[ type ].slice( 0 );

					newData.splice( position, 0, indexable );
					return {
						...prevState,
						[ type ]: newData,
					};
				} );
				setIgnoreIndexable( null );
				return true;
			}
			// @TODO: Throw an error notification.
			console.error( "Undoing post has failed." );
			return false;
		} catch ( error ) {
			// @TODO: Throw an error notification.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setlistedIndexables, listedIndexables, setIgnoreIndexable ] );

	const onClickUndo = useCallback( ( ignored ) => {
		return () => handleUndo( ignored );
	}, [ handleUndo ] );

	useEffect( async() => {
		updateList( "least_readability", listedIndexables.least_readability );
	}, [] );

	useEffect( async() => {
		updateList( "least_seo_score", listedIndexables.least_seo_score );
	}, [] );

	useEffect( async() => {
		updateList( "most_linked", listedIndexables.most_linked );
	}, [] );

	useEffect( async() => {
		updateList( "least_linked", listedIndexables.least_linked );
	}, [] );

	// We update a list each time the content of ignoreIndexable changes
	useEffect( async() => {
		if ( ignoreIndexable !== null ) {
			return updateList( ignoreIndexable.type, listedIndexables[ ignoreIndexable.type ] );
		}
	}, [ ignoreIndexable ] );

	/**
	 * Renders the suggested links modal content.
	 *
	 * @returns {WPElement} The modal content.
	 */
	const renderSuggestedLinksModal = () => {
		if ( ! isLinkSuggestionsEnabled ) {
			return <span>You have links suggestion disabled.</span>;
		}

		if ( suggestedLinksModalContent === null ) {
			return <SvgIcon icon="loading-spinner" />;
		} else if ( suggestedLinksModalContent.linksList.length === 0 ) {
			return <Fragment>
				<h2>
					{ suggestedLinksModalContent.breadcrumbTitle }
					<span className="yst-italic">{ ` - ${suggestedLinksModalContent.incomingLinksCount} ${__( "incoming links", "wordpress-seo" )}` }</span>
				</h2>
				<p className="yst-italic yst-mb-2">No suggestions available</p>
			</Fragment>;
		}
		return <Fragment>
			<h2>
				{ suggestedLinksModalContent.breadcrumbTitle }
				<span className="yst-italic">{ ` - ${suggestedLinksModalContent.incomingLinksCount} ${__( "incoming links", "wordpress-seo" )}` }</span>
			</h2>
			<p className="yst-italic yst-mb-2">{ `(${suggestedLinksModalContent.permalink})` }</p>
			<ul>
				{
					suggestedLinksModalContent.linksList.map( ( link, idx ) => {
						return <li key={ idx }>
							{ link.breadcrumb_title }
							<a href={ "/wp-admin/post.php?action=edit&post=" + link.object_id } target="_blank" rel="noopener noreferrer">{ __( "Edit to add link", "wordpress-seo" ) }<span className="yst-dashicons yst-dashicons-external" /></a>
						</li>;
					}
					)
				}
			</ul>
		</Fragment>;
	};

	/**
	 * Renders the upsell content in suggested links modal.
	 *
	 * @returns {WPElement} The modal content.
	 */
	const renderUpsellLinksModal = () => {
		return (
			<div className="yst-max-w-xs">
				<h2>Upgrade to Yoast SEO Premium</h2>
				<Button
					id="indexables-page-suggested-links-upsell-button"
					type="button"
					as="a"
					href="#"
					variant="upsell"
					className="yst-w-full yst-text-gray-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{ __( "Unlock with Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</div>
		);
	};

	return <div
		className="yst-max-w-full yst-mt-6"
	>
		<Modal
			onClose={ handleCloseModal }
			isOpen={ isModalOpen }
		>
			{ isPremiumInstalled ? renderSuggestedLinksModal() : renderUpsellLinksModal() }
		</Modal>
		{ ignoreIndexable && <Alert><Button onClick={ onClickUndo( ignoreIndexable ) }>{ `Undo ignore ${ignoreIndexable.indexable.id}` }</Button></Alert> }
		<div
			id="indexables-table-grid"
			className="yst-max-w-7xl yst-grid yst-grid-cols-1 2xl:yst-grid-cols-2 2xl:yst-grid-rows-2 2xl:yst-grid-flow-row 2xl:yst-auto-rows-fr yst-gap-6"
		>
			<IndexablesPageCard title={ __( "Lowest SEO scores", "wordpress-seo" ) } isLoading={ listedIndexables.least_seo_score.length > 0 }>
				<IndexablesTable>
					{
						listedIndexables.least_seo_score.slice( 0, listSize ).map(
							( indexable, position ) => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_seo_score"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
									position={ position }
								>
									<IndexableScore
										key={ `seo-score-${ indexable.id }` }
										score={ parseInt( indexable.primary_focus_keyword_score, 10 ) }
										mediumThreshold={ 40 }
										goodThreshold={ 70 }
									/>
									<IndexableTitleLink key={ `seo-title-${ indexable.id }` } indexable={ indexable } />
									<div key={ `seo-improve-${ indexable.id }` }>
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
			<IndexablesPageCard title={ __( "Lowest readability scores", "wordpress-seo" ) } isLoading={ listedIndexables.least_readability.length > 0 }>
				<IndexablesTable>
					{
						listedIndexables.least_readability.slice( 0, listSize ).map(
							( indexable, position ) => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_readability"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
									position={ position }
								>
									<IndexableScore
										key={ `readability-score-${ indexable.id }` }
										score={ parseInt( indexable.readability_score, 10 ) }
										mediumThreshold={ 59 }
										goodThreshold={ 89 }
									/>
									<IndexableTitleLink key={ `readability-title-${ indexable.id }` } indexable={ indexable } />
									<div key={ `readability-improve-${ indexable.id }` }>
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
			<IndexablesPageCard title={ __( "Lowest number of incoming links", "wordpress-seo" ) } isLoading={ listedIndexables.least_linked.length > 0 }>
				<IndexablesTable>
					{
						listedIndexables.least_linked.slice( 0, listSize ).map(
							( indexable, position ) => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_linked"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
									position={ position }
								>
									<IndexableLinkCount key={ `least-linked-score-${ indexable.id }` } count={ parseInt( indexable.incoming_link_count, 10 ) } />
									<IndexableTitleLink key={ `least-linked-title-${ indexable.id }` } indexable={ indexable } />
									<div key={ `least-linked-modal-button-${ indexable.id }` }>
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
			</IndexablesPageCard>
			<IndexablesPageCard title={ __( "Highest number of incoming links", "wordpress-seo" ) } isLoading={ listedIndexables.most_linked.length > 0 }>
				<IndexablesTable>
					{
						listedIndexables.most_linked.slice( 0, listSize ).map(
							( indexable, position ) => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="most_linked"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
									position={ position }
								>
									<IndexableLinkCount key={ `most-linked-score-${ indexable.id }` } count={ parseInt( indexable.incoming_link_count, 10 ) } />
									<IndexableTitleLink key={ `most-linked-title-${ indexable.id }` } indexable={ indexable } />
									<div key={ `most-linked-edit-${ indexable.id }` }>
										<Link
											href={ "/wp-admin/post.php?action=edit&post=" + indexable.object_id }
											className="yst-button yst-button--secondary yst-text-gray-500"
										>
											{ __( "Edit", "wordpress-seo" ) }
										</Link>
									</div>
								</IndexablesTable.Row>;
							}
						)
					}
				</IndexablesTable>
			</IndexablesPageCard>
		</div>
	</div>;
}

export default IndexablesPage;
