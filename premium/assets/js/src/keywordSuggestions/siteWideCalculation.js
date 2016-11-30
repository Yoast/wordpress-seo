import { getRelevantWords } from "yoastseo/js/stringProcessing/relevantWords";
import ProminentWordStorage from "./ProminentWordStorage";
import EventEmitter from "events";

let postStatuses = [ "future", "draft", "pending", "private", "publish" ];

class SiteWideCalculation extends EventEmitter {

	constructor( { recalculateAll = false, totalPosts, rootUrl, nonce, allProminentWordIds } ) {
		super();

		this._perPage = 10;
		this._totalPosts = totalPosts;
		this._pages = Math.ceil( totalPosts / this._perPage );
		this._processedPosts = 0;
		this._currentPage = 1;
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._recalculateAll = recalculateAll;
		this._allProminentWordIds = allProminentWordIds;

		this.continueProcessing = this.continueProcessing.bind( this );
		this.processResponse = this.processResponse.bind( this );
		this.incrementProcessedPosts = this.incrementProcessedPosts.bind( this );
	}

	start() {
		this.calculate();
	}

	/**
	 *
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

	processResponse( response ) {

		let processPromises = response.map( ( post ) => {
			return this.processPost( post );
		} );

		Promise.all( processPromises ).then( this.continueProcessing ).catch( this.continueProcessing );
	}

	continueProcessing() {
		this.emit( "processedPage", this._currentPage, this._pages );

		if ( this._currentPage < this._pages ) {
			this._currentPage += 1;
			this.calculate();
		} else {
			this.emit( "complete" );
		}
	}

	/**
	 *
	 * @param post
	 * @retuns {Promise}
	 */
	processPost( post ) {
		let content = post.content.rendered;

		let prominentWords = getRelevantWords( content );

		let prominentWordStorage = new ProminentWordStorage( {
			postID: post.id,
			rootUrl: this._rootUrl,
			nonce: this._nonce,
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
