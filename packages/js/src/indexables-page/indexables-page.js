/* global wpseoIndexablesPageData */
import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback, Fragment } from "@wordpress/element";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Button, Alert, Modal } from "@yoast/ui-library";
import IndexablesTable from "./components/indexables-table";
import SvgIcon from "../../../components/src/SvgIcon";

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
		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/link_suggestions?indexableId=" + indexableId,
				method: "GET",
			} );

			const parsedResponse = await response.json;

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

		return suggestedLinksModalContent === null ? <SvgIcon icon="loading-spinner" /> : <Fragment>
			<h2>
				{ suggestedLinksModalContent.breadcrumbTitle }
				<span className="yst-italic">{ ` &ndash; ${suggestedLinksModalContent.incomingLinksCount} ${__( "incoming links", "wordpress-seo" )}` }</span>
			</h2>
			<p className="yst-italic yst-mb-2">{ `(${suggestedLinksModalContent.permalink})` }</p>
			<ul>
				{
					suggestedLinksModalContent.linksList.map( ( link, idx ) => {
						return <li key={ idx }>
							{ link.breadcrumb_title }
							<a href={ link.permalink } target="_blank" rel="noopener noreferrer">{ __( "Edit to add link", "wordpress-seo" ) }<span className="yst-dashicons yst-dashicons-external" /></a>
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
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>
		<Modal
			onClose={ handleCloseModal }
			isOpen={ isModalOpen }
		>
			{ isPremiumInstalled ? renderSuggestedLinksModal() : renderUpsellLinksModal() }
		</Modal>

		{ ignoreIndexable && <Alert><Button onClick={ onClickUndo( ignoreIndexable ) }>{ `Ignore ${ignoreIndexable.indexable.id}` }</Button></Alert> }
		<header className="yst-border-b yst-border-gray-200"><div className="yst-max-w-screen-sm yst-p-8"><h2 className="yst-text-2xl yst-font-bold">{ __( "Indexables page", "wordpress-seo" ) }</h2></div></header>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Readability Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_readability }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					readability_score: __( "Readability Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_readability"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
			listSize={ listSize }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least SEO Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_seo_score }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					primary_focus_keyword_score: __( "SEO Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_seo_score"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
			listSize={ listSize }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_linked }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_linked"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
			listSize={ listSize }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Most Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.most_linked }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="most_linked"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
			listSize={ listSize }
		/>

	</div>;
}

export default IndexablesPage;
