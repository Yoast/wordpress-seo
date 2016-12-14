import { getRelevantWords } from "yoastseo/js/stringProcessing/relevantWords";
import ProminentWordStorage from "./ProminentWordStorage";
import ProminentWordCache from "./ProminentWordCache";
import ProminentWordCachePopulator from "./ProminentWordCachePopulator";
import RestApi from "../helpers/restApi";
import EventEmitter from "events";

let postStatuses = [ "future", "draft", "pending", "private", "publish" ].join( "," );

/**
 * Calculates prominent words for all posts on the site.
 */
class SiteWideCalculation extends EventEmitter {

	/**
	 * Constructs a calculation object.
	 *
	 * @param {boolean} recalculateAll Whether to calculate all posts or only posts without prominent words.
	 * @param {number} totalPosts The amount of posts to calculate prominent words for.
	 * @param {string} rootUrl The root REST API URL.
	 * @param {string} nonce The nonce to use when using the REST API.
	 * @param {number[]} allProminentWordIds A list of all prominent word IDs present on the site.
	 */
	constructor( { totalPosts, rootUrl, nonce, allProminentWordIds, recalculateAll = false } ) {
		super();

		this._perPage = 10;
		this._totalPosts = totalPosts;
		this._totalPages = Math.ceil( totalPosts / this._perPage );
		this._processedPosts = 0;
		this._currentPage = 1;
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._recalculateAll = recalculateAll;
		this._allProminentWordIds = allProminentWordIds;

		let restApi =  new RestApi( { rootUrl, nonce } );

		this._prominentWordCache = new ProminentWordCache();
		this._prominentWordCachePopulator = new ProminentWordCachePopulator( { cache: this._prominentWordCache, restApi: restApi } );

		this.processPost = this.processPost.bind( this );
		this.continueProcessing = this.continueProcessing.bind( this );
		this.processResponse = this.processResponse.bind( this );
		this.incrementProcessedPosts = this.incrementProcessedPosts.bind( this );
		this.calculate = this.calculate.bind( this );
	}

	/**
	 * Starts calculating prominent words.
	 *
	 * @returns {void}
	 */
	start() {
		this._prominentWordCachePopulator.populate()
			.then( this.calculate );
	}

	/**
	 * Does a calculation step for the current page.
	 *
	 * @returns {void}
	 */
	calculate() {
		let data = {
			page: this._currentPage,
			// eslint-disable-next-line camelcase
			per_page: this._perPage,
			status: postStatuses,
		};

		if ( ! this._recalculateAll ) {
			// eslint-disable-next-line camelcase
			data.yst_prominent_words = this._allProminentWordIds;
		}

		jQuery.ajax( {
			type: "GET",
			url: this._rootUrl + "wp/v2/posts/",
			beforeSend: ( xhr ) => {
				xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
			},
			data: data,
			dataType: "json",
			success: this.processResponse,
		} );
	}

	/**
	 * Process response from the index request for posts.
	 *
	 * @param {Array} response The list of found posts from the server.
	 * @returns {void}
	 */
	processResponse( response ) {
		let processPromises = response.reduce( ( previousPromise, post ) => {
			return previousPromise.then( () => {
				return this.processPost( post );
			} );
		}, Promise.resolve() );

		processPromises.then( this.continueProcessing ).catch( this.continueProcessing );
	}

	/**
	 * Continues processing by going to the next page if there is one.
	 *
	 * @returns {void}
	 */
	continueProcessing() {
		this.emit( "processedPage", this._currentPage, this._totalPages );

		if ( this._currentPage < this._totalPages ) {
			this._currentPage += 1;
			this.calculate();
		} else {
			this.emit( "complete" );
		}
	}

	/**
	 * Processes a post returned from the REST API.
	 *
	 * @param {Object} post A post object with rendered content.
	 * @returns {Promise} Resolves when the prominent words are saved for the post.
	 */
	processPost( post ) {
		let content = post.content.rendered;

		let prominentWords = getRelevantWords( content );

		let prominentWordStorage = new ProminentWordStorage( {
			postID: post.id,
			rootUrl: this._rootUrl,
			nonce: this._nonce,
			cache: this._prominentWordCache,
			postSaveEndpoint: post._links.self[0].href,
		} );

		return prominentWordStorage.saveProminentWords( prominentWords ).then( this.incrementProcessedPosts, this.incrementProcessedPosts );
	}

	/**
	 * Increments the amount of processed posts by one.
	 *
	 * @returns {void}
	 */
	incrementProcessedPosts() {
		this._processedPosts += 1;

		this.emit( "processedPost", this._processedPosts, this._totalPosts );
	}
}

export default SiteWideCalculation;
