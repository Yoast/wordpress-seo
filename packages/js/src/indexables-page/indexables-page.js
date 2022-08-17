/* global wpseoIndexablesPageData */
import PropTypes from "prop-types";
import apiFetch from "@wordpress/api-fetch";
import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { Button, Modal } from "@yoast/ui-library";
import { addLinkToString } from "../helpers/stringHelpers";
import SuggestedLinksModal from "./components/suggested-links-modal";
import IndexablesScoreCard from "./components/indexables-score-card";
import IndexablesLinksCard from "./components/indexables-links-card";
import { SEOScoreAssessment, ReadabilityScoreAssessment, LeastLinkedAssessment, MostLinkedeAssessment } from "./assessment-functions";

const leastLinkedIntro = addLinkToString(
	// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
	sprintf(
		__(
			"If you want to prevent your content from being orphaned, you need to make sure to link to that content. " +
			"Linking to it from other places on your site will help Google and your audience reach it. " +
			"%1$sLearn more about orphaned content%2$s.",
			"wordpress-seo"
		),
		"<a>",
		"</a>"
	),
	"https://www.yoast.com"
);

const leastLinkedOutro = addLinkToString(
	// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
	sprintf( __( "Find and fix any orphaned content on your site by using this %1$sstep-by-step workout%2$s!", "wordpress-seo" ),
		"<a>",
		"</a>" ),
	"https://www.yoast.com"
);

const mostLinkedIntro = addLinkToString(
	// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
	sprintf(
		__(
			"The content below is supposed to be your cornerstone content: the most important and extensive articles on your site. " +
			"Make sure to mark this content as cornerstone content to get all bullets green. " +
			"%1$sLearn more about cornerstone content%2$s.",
			"wordpress-seo"
		),
		"<a>",
		"</a>"
	),
	"https://www.yoast.com"
);

const mostLinkedOutro = addLinkToString(
	// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
	sprintf( __( "Improve rankings for all your cornerstones by using this %1$sstep-by-step workout%2$s!", "wordpress-seo" ),
		"<a>",
		"</a>" ),
	"https://www.yoast.com"
);

/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/* eslint-disable complexity */

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the main indexables page.
 */
function IndexablesPage( { setupInfo } ) {
	const listSize = parseInt( wpseoIndexablesPageData.listSize, 10 );
	const minimumIndexablesInBuffer = listSize * 2;
	const isPremiumInstalled = Boolean( wpseoIndexablesPageData.isPremium );
	const isLinkSuggestionsEnabled = Boolean( wpseoIndexablesPageData.isLinkSuggestionsEnabled );

	const [ indexablesLists, setIndexablesLists ] = useState(
		{
			least_readability: null,
			least_seo_score: null,
			most_linked: null,
			least_linked: null,
		}
	);

	const [ indexablesListsFetchLength, setIndexablesListsFetchLength ] = useState(
		{
			least_readability: null,
			least_seo_score: null,
			most_linked: null,
			least_linked: null,
		}
	);

	const [ ignoredIndexable, setIgnoredIndexable ] = useState( null );
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ suggestedLinksModalData, setSuggestedLinksModalData ] = useState( null );

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

			setIndexablesLists( prevState => {
				return {
					...prevState,
					[ listName ]: parsedResponse.list,
				};
			} );

			setIndexablesListsFetchLength( prevState => {
				return {
					...prevState,
					[ listName ]: parsedResponse.list.length,
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
	const maybeRemoveIgnored = ( listName ) => {
		if ( ignoredIndexable === null ) {
			return;
		}

		setIndexablesLists( prevState => {
			return {
				...prevState,
				[ listName ]: prevState[ listName ].filter( indexable => {
					return indexable.id !== ignoredIndexable.indexable.id;
				} ),
			};
		} );
	};

	/**
	 * Updates the content of a list of indexables.
	 *
	 * @param {string} listName       The name of the list to fetch.
	 * @param {array}  indexablesList The current content of the list.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName, indexablesList ) => {
		if ( indexablesList === null ) {
			return fetchList( listName );
		}

		return ( indexablesList.length < minimumIndexablesInBuffer  && indexablesListsFetchLength[ listName ] >= minimumIndexablesInBuffer )
			? fetchList( listName )
			: maybeRemoveIgnored( listName );
	};

	useEffect( () => {
		if ( setupInfo.enoughContent && setupInfo.enoughAnalysedContent ) {
			if ( setupInfo.enabledFeatures.isReadabilityEnabled ) {
				updateList( "least_readability", indexablesLists.least_readability );
			}

			if ( setupInfo.enabledFeatures.isSeoScoreEnabled ) {
				updateList( "least_seo_score", indexablesLists.least_seo_score );
			}

			if ( setupInfo.enabledFeatures.isLinkCountEnabled ) {
				updateList( "most_linked", indexablesLists.most_linked );
				updateList( "least_linked", indexablesLists.least_linked );
			}
		}
	}, [] );

	// We update a list each time the content of ignoredIndexable changes
	useEffect( async() => {
		if ( ignoredIndexable !== null ) {
			return updateList( ignoredIndexable.type, indexablesLists[ ignoredIndexable.type ] );
		}
	}, [ ignoredIndexable ] );

	/**
	 * Handles the rendering of the links modal.
	 *
	 * @param {int}    indexableId        The id of the indexable.
	 * @param {int}    incomingLinksCount The number of incoming links.
	 * @param {string} breadcrumbTitle    The title of the indexable.
	 * @param {string} permalink          The link to the indexable.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const handleOpenModal = useCallback( async( indexableId, incomingLinksCount, breadcrumbTitle, permalink ) => {
		setIsModalOpen( true );

		if ( ! isPremiumInstalled ) {
			setSuggestedLinksModalData( {
				incomingLinksCount: incomingLinksCount,
				linksList: null,
				breadcrumbTitle: breadcrumbTitle,
				permalink: permalink,
			 } );
			 return true;
		}
		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/link_suggestions?indexableId=" + indexableId,
				method: "GET",
			} );

			const parsedResponse = await response.json;

			if ( parsedResponse.length === 0 ) {
				setSuggestedLinksModalData( {
					incomingLinksCount: incomingLinksCount,
					linksList: [],
					breadcrumbTitle: breadcrumbTitle,
					permalink: permalink,
				 } );
				 return true;
			}
			if ( parsedResponse.length > 0 ) {
				setSuggestedLinksModalData( {
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
	}, [ setSuggestedLinksModalData, setIsModalOpen ] );

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
		setSuggestedLinksModalData( null );
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
				setIndexablesLists( prevState => {
					const newData = prevState[ type ].slice( 0 );

					newData.splice( position, 0, indexable );
					return {
						...prevState,
						[ type ]: newData,
					};
				} );
				setIgnoredIndexable( null );
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
	}, [ apiFetch, setIndexablesLists, indexablesLists, setIgnoredIndexable ] );

	const onClickUndo = useCallback( ( ignored ) => {
		return () => handleUndo( ignored );
	}, [ handleUndo ] );

	const seoScoresCard = <IndexablesScoreCard
		key="lowest-seo-scores"
		title={ __( "Lowest SEO scores", "wordpress-seo" ) }
		setIgnoredIndexable={ setIgnoredIndexable }
		indexablesLists={ indexablesLists }
		listKey={ "least_seo_score" }
		listSize={ listSize }
		assessmentFunction={ SEOScoreAssessment }
	/>;

	const readabilityScoresCard = <IndexablesScoreCard
		key="lowest-readability-scores"
		title={ __( "Lowest readability scores", "wordpress-seo" ) }
		setIgnoredIndexable={ setIgnoredIndexable }
		indexablesLists={ indexablesLists }
		listKey={ "least_readability" }
		listSize={ listSize }
		assessmentFunction={ ReadabilityScoreAssessment }
	/>;

	const leastLinksCard = <IndexablesLinksCard
		key="lowest-link-count"
		title={ __( "Lowest number of incoming links", "wordpress-seo" ) }
		intro={ leastLinkedIntro }
		outro={ leastLinkedOutro }
		setIgnoredIndexable={ setIgnoredIndexable }
		indexablesLists={ indexablesLists }
		countKey={ "incoming_link_count" }
		listKey={ "least_linked" }
		listSize={ listSize }
		handleLink={ handleLink }
		assessmentFunction={ LeastLinkedAssessment }
	/>;

	const mostLinksCard = <IndexablesLinksCard
		key="highest-link-count"
		title={ __( "Highest number of incoming links", "wordpress-seo" ) }
		intro={ mostLinkedIntro }
		outro={ mostLinkedOutro }
		setIgnoredIndexable={ setIgnoredIndexable }
		indexablesLists={ indexablesLists }
		countKey={ "incoming_link_count" }
		listKey={ "most_linked" }
		listSize={ listSize }
		handleLink={ handleLink }
		assessmentFunction={ MostLinkedeAssessment }
	/>;

	const orderedCards = [ seoScoresCard, leastLinksCard, readabilityScoresCard, mostLinksCard ];

	return setupInfo && <div
		className="yst-max-w-full yst-mt-6"
	>
		<Modal
			onClose={ handleCloseModal }
			isOpen={ isModalOpen }
		>
			 <SuggestedLinksModal
				isLinkSuggestionsEnabled={ isLinkSuggestionsEnabled }
				isPremium={ isPremiumInstalled }
				suggestedLinksModalData={ suggestedLinksModalData }
			 />
		</Modal>
		<div
			id="indexables-table-columns"
			className="yst-max-w-7xl 2xl:yst-columns-2 yst-gap-6"
		>
			{ orderedCards }
		</div>
		{ ignoredIndexable && <div className="yst-flex yst-justify-center"><Button className="yst-button yst-button--primary" onClick={ onClickUndo( ignoredIndexable ) }>{ `Undo ignore ${ignoredIndexable.indexable.id}` }</Button></div> }
	</div>;
}

IndexablesPage.propTypes = {
	setupInfo: PropTypes.object.isRequired,
};

export default IndexablesPage;
