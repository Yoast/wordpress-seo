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
		// let processPromises = response.map( ( post ) => {
		// 	return this.processPost( post );
		// } );

		let processPromises = response.reduce( ( previousPromise, post ) => {
			return previousPromise.then( () => {
				return this.processPost( post );
			} );
		}, Promise.resolve() );

		processPromises.then( this.continueProcessing ).catch( this.continueProcessing );
	}

	/*

	 <tr><th align='left' bgcolor='#f57900' colspan="5"><span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>( ! )</span> Warning: strtolower() expects parameter 1 to be string, array given in /srv/www/wordpress-default/wp-includes/formatting.php on line <i>1870</i></th></tr>
	 <tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
	 <tr><th align='center' bgcolor='#eeeeec'>#</th><th align='left' bgcolor='#eeeeec'>Time</th><th align='left' bgcolor='#eeeeec'>Memory</th><th align='left' bgcolor='#eeeeec'>Function</th><th align='left' bgcolor='#eeeeec'>Location</th></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>1</td><td bgcolor='#eeeeec' align='center'>0.0013</td><td bgcolor='#eeeeec' align='right'>242448</td><td bgcolor='#eeeeec'>{main}(  )</td><td title='/srv/www/wordpress-default/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>0</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>2</td><td bgcolor='#eeeeec' align='center'>0.0016</td><td bgcolor='#eeeeec' align='right'>242896</td><td bgcolor='#eeeeec'>require( <font color='#00bb00'>'/srv/www/wordpress-default/wp-blog-header.php'</font> )</td><td title='/srv/www/wordpress-default/index.php' bgcolor='#eeeeec'>.../index.php<b>:</b>17</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>3</td><td bgcolor='#eeeeec' align='center'>0.5277</td><td bgcolor='#eeeeec' align='right'>10321176</td><td bgcolor='#eeeeec'>wp( ??? )</td><td title='/srv/www/wordpress-default/wp-blog-header.php' bgcolor='#eeeeec'>.../wp-blog-header.php<b>:</b>16</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>4</td><td bgcolor='#eeeeec' align='center'>0.5277</td><td bgcolor='#eeeeec' align='right'>10321440</td><td bgcolor='#eeeeec'>WP->main( <span><font color='#cc0000'>string(0)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/functions.php' bgcolor='#eeeeec'>.../functions.php<b>:</b>963</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>5</td><td bgcolor='#eeeeec' align='center'>0.5277</td><td bgcolor='#eeeeec' align='right'>10322920</td><td bgcolor='#eeeeec'>WP->parse_request( <span><font color='#cc0000'>string(0)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>725</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>6</td><td bgcolor='#eeeeec' align='center'>0.5282</td><td bgcolor='#eeeeec' align='right'>10392064</td><td bgcolor='#eeeeec'>do_action_ref_array( <span><font color='#cc0000'>string(13)</font></span>, <span><font color='#ce5c00'>array(1)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/class-wp.php' bgcolor='#eeeeec'>.../class-wp.php<b>:</b>386</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>7</td><td bgcolor='#eeeeec' align='center'>0.5282</td><td bgcolor='#eeeeec' align='right'>10393800</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.call-user-func-array:{/srv/www/wordpress-default/wp-includes/plugin.php:600}' target='_new'>call_user_func_array:{/srv/www/wordpress-default/wp-includes/plugin.php:600}</a>
	 ( <span><font color='#cc0000'>string(15)</font></span>, <span><font color='#ce5c00'>array(1)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>600</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>8</td><td bgcolor='#eeeeec' align='center'>0.5282</td><td bgcolor='#eeeeec' align='right'>10393960</td><td bgcolor='#eeeeec'>rest_api_loaded( <span><font color='#8f5902'>object(WP)[351]</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/plugin.php' bgcolor='#eeeeec'>.../plugin.php<b>:</b>600</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>9</td><td bgcolor='#eeeeec' align='center'>0.6836</td><td bgcolor='#eeeeec' align='right'>12055016</td><td bgcolor='#eeeeec'>WP_REST_Server->serve_request( <span><font color='#cc0000'>string(12)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/rest-api.php' bgcolor='#eeeeec'>.../rest-api.php<b>:</b>147</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>10</td><td bgcolor='#eeeeec' align='center'>0.6843</td><td bgcolor='#eeeeec' align='right'>12068680</td><td bgcolor='#eeeeec'>WP_REST_Server->dispatch( <span><font color='#8f5902'>object(WP_REST_Request)[92]</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>326</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>11</td><td bgcolor='#eeeeec' align='center'>0.6861</td><td bgcolor='#eeeeec' align='right'>12379704</td><td bgcolor='#eeeeec'>WP_REST_Request->sanitize_params(  )</td><td title='/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-server.php' bgcolor='#eeeeec'>.../class-wp-rest-server.php<b>:</b>871</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>12</td><td bgcolor='#eeeeec' align='center'>0.6861</td><td bgcolor='#eeeeec' align='right'>12381200</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.call-user-func:{/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-request.php:803}' target='_new'>call_user_func:{/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-request.php:803}</a>
	 ( <span><font color='#cc0000'>string(12)</font></span>, <span><font color='#ce5c00'>array(5)</font></span>, <span><font color='#8f5902'>object(WP_REST_Request)[92]</font></span>, <span><font color='#cc0000'>string(6)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-request.php' bgcolor='#eeeeec'>.../class-wp-rest-request.php<b>:</b>803</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>13</td><td bgcolor='#eeeeec' align='center'>0.6861</td><td bgcolor='#eeeeec' align='right'>12381240</td><td bgcolor='#eeeeec'>sanitize_key( <span><font color='#ce5c00'>array(5)</font></span>, <span><font color='#8f5902'>object(WP_REST_Request)[92]</font></span>, <span><font color='#cc0000'>string(6)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/rest-api/class-wp-rest-request.php' bgcolor='#eeeeec'>.../class-wp-rest-request.php<b>:</b>803</td></tr>
	 <tr><td bgcolor='#eeeeec' align='center'>14</td><td bgcolor='#eeeeec' align='center'>0.6861</td><td bgcolor='#eeeeec' align='right'>12381288</td><td bgcolor='#eeeeec'><a href='http://www.php.net/function.strtolower' target='_new'>strtolower</a>
	 ( <span><font color='#ce5c00'>array(5)</font></span> )</td><td title='/srv/www/wordpress-default/wp-includes/formatting.php' bgcolor='#eeeeec'>.../formatting.php<b>:</b>1870</td></tr>
	 </table></font>


	 */

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
