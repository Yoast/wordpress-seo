/* global wpseoIndexablesPageData */
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback, Fragment } from "@wordpress/element";
import { LockOpenIcon, LinkIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { Button, Alert, Modal } from "@yoast/ui-library";
import { makeOutboundLink } from "@yoast/helpers";
import IndexablesTable from "./components/indexables-table";
import SvgIcon from "../../../components/src/SvgIcon";

const Link = makeOutboundLink();

/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/**
 * A table.
 *
 * @returns {WPElement} A table.
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
	 * @param {function} setList The list setter.
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
	 * Fetches a list of indexables.
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
	 * @param {string} listName The name of the list to fetch.
	 * @param {array} indexables The name of the list to fetch.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName, indexables ) => {
		// @TODO: we have to also check if there are even other posts to re-fetch and if not, let's just render.
		return ( indexables.length < minimumIndexablesInBuffer ) ? fetchList( listName ) : renderList( listName );
	};

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

	const handleLink = useCallback( ( e ) => {
		handleOpenModal(
			e.currentTarget.dataset.indexableid,
			e.currentTarget.dataset.incominglinkscount,
			e.currentTarget.dataset.breadcrumbtitle,
			e.currentTarget.dataset.permalink
		);
	}, [ handleOpenModal ] );

	const handleCloseModal = useCallback( () => {
		setIsModalOpen( false );
		setSuggestedLinksModalContent( null );
	}, [] );

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
		{ ignoreIndexable && <Alert><Button onClick={ onClickUndo( ignoreIndexable ) }>{ `Ignore ${ignoreIndexable.indexable.id}` }</Button></Alert> }
		<div
			id="indexables-table-grid"
			className="2xl:yst-grid 2xl:yst-grid-cols-2 2xl:yst-grid-rows-2 2xl:yst-grid-flow-row 2xl:yst-auto-rows-fr 2xl:yst-gap-4"
		>
			<div
				className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md"
			>
				<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">{ __( "Lowest readability scores", "wordpress-seo" ) }</h3>
				<IndexablesTable>
					{
						listedIndexables.least_readability.slice( 0, listSize ).map(
							indexable => {
								let colorClass = "yst-text-red-500";
								const score = indexable.readability_score;
								if ( score >= 60 ) {
									colorClass = "yst-text-orange-500";
								}
								if ( score >= 90 ) {
									colorClass = "yst-text-green-500";
								}
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_readability"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
								>
									<div key={ `readability-score-${ indexable.id }` } className="yst-min-w-[65px]">
										<span className={ "yst-font-black yst-text-xl " + colorClass }>{ score }</span>
										<span className="yst-text-xxs yst-text-gray-500">/100</span>
									</div>
									<div key={ `readability-title-${ indexable.id }` } className="yst-grow yst-min-w-0">
										<Link
											href={ indexable.permalink }
											className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-text-inherit hover:yst-text-blue-500"
										>
											<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-h-4 yst-w-4" />
										</Link>
									</div>
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
			</div>
			<div
				className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md"
			>
				<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">{ __( "Lowest SEO scores", "wordpress-seo" ) }</h3>
				<IndexablesTable>
					{
						listedIndexables.least_seo_score.slice( 0, listSize ).map(
							indexable => {
								let colorClass = "yst-text-red-500";
								const score = indexable.primary_focus_keyword_score;
								if ( score > 40 ) {
									colorClass = "yst-text-orange-500";
								}
								if ( score > 70 ) {
									colorClass = "yst-text-green-500";
								}
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_seo_score"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
								>
									<div key={ `seo-score-${ indexable.id }` } className="yst-min-w-[65px]">
										<span className={ "yst-font-black yst-text-xl " + colorClass }>{ score }</span>
										<span className="yst-text-xxs yst-text-gray-500">/100</span>
									</div>
									<div key={ `seo-title-${ indexable.id }` } className="yst-grow yst-min-w-0">
										<Link
											href={ indexable.permalink }
											className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-text-inherit hover:yst-text-blue-500"
										>
											<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-h-4 yst-w-4" />
										</Link>
									</div>
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
			</div>
			<div
				className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md"
			>
				<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">{ __( "Lowest number of incoming links", "wordpress-seo" ) }</h3>
				<IndexablesTable>
					{
						listedIndexables.least_linked.slice( 0, listSize ).map(
							indexable => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="least_linked"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
								>
									<div key={ `least-linked-score-${ indexable.id }` } className="yst-min-w-[65px] yst-shrink-0 yst-flex yst-items-center yst-gap-1">
										<LinkIcon className="yst-h-4 yst-w-4 yst-text-gray-400" />{ indexable.incoming_link_count }
									</div>
									<div key={ `least-linked-title-${ indexable.id }` } className="yst-grow yst-min-w-0">
										<Link
											href={ indexable.permalink }
											className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-text-inherit hover:yst-text-blue-500"
										>
											<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-h-4 yst-w-4" />
										</Link>
									</div>
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
			</div>
			<div
				className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md"
			>
				<h3 className="yst-mb-4 yst-text-xl yst-text-gray-900 yst-font-medium">{ __( "Highest number of incoming links", "wordpress-seo" ) }</h3>
				<IndexablesTable>
					{
						listedIndexables.most_linked.slice( 0, listSize ).map(
							indexable => {
								return <IndexablesTable.Row
									key={ `indexable-${ indexable.id }-row` }
									type="most_linked"
									indexable={ indexable }
									addToIgnoreList={ setIgnoreIndexable }
								>
									<div key={ `most-linked-score-${ indexable.id }` } className="yst-min-w-[65px] yst-shrink-0 yst-flex yst-items-center yst-gap-1">
										<LinkIcon className="yst-h-4 yst-w-4 yst-text-gray-400" />{ indexable.incoming_link_count }
									</div>
									<div key={ `most-linked-title-${ indexable.id }` } className="yst-grow yst-min-w-0">
										<Link
											href={ indexable.permalink }
											className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-text-inherit hover:yst-text-blue-500"
										>
											<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span><ExternalLinkIcon className="yst-h-4 yst-w-4" />
										</Link>
									</div>
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
			</div>
		</div>
	</div>;
}

export default IndexablesPage;
