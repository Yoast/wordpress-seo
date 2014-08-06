<?php
/**
 * Retrieve GitHub issue status to determine whether or not to skip a unit test
 *
 * Main differences between this class and the WP Core Unit test Trac class:
 * - Well obviously the source of the data
 * - Deals with GitHub private repos by requiring an API key. For non-private repos, it will use the API
 *   key if it's available to get the benefit of a higher rate limit.
 * - This class will always use the local cache if the last update through the API was less than an hour ago
 *   The caching is needed as the rate limit for anonymous requests is 60 per hour which you would quickly
 *   reach if you run repeated unit tests.
 * - The trac class only retrieves closed tickets, while this class retrieves all tickets
 *   The reason for this is that with a 'closed' only list in combination with the local file caching, re-opened
 *   issues would not be recognized as open.
 *
 * Similarly to the WP Core Unit test Trac class, this class will assume a ticket is closed if the status can
 * not be determined. This will force the test to be run, which may or may not be a good thing.
 *
 * Note: the local caching will not work in combination with travis as travis will set up a new environment
 * each time it runs the tests. This may mean that we'll be running into the rate limits rather quickly as we
 * also don't have access to the Etag/Last mod properties to run conditional requests (which don't count against
 * the rate limit).
 *
 * @todo It might be interesting to see if we can save (push) the cache file somehow after a travis run
 * and pull it in again via the 'before script' commands to avoid having to publish an API key in the
 * travis script.
 *
 * @see https://developer.github.com/v3/#authentication
 * @see https://developer.github.com/v3/#pagination
 * @see https://developer.github.com/v3/#rate-limiting
 * @see https://developer.github.com/v3/#user-agent-required
 * @see https://developer.github.com/v3/#conditional-requests
 * @see https://developer.github.com/v3/issues/
 * @see https://developer.github.com/guides/traversing-with-pagination/
 *
 * @version 1.0
 * @author  Juliette Reinders Folmer <wpunit_githubissues_nospam@adviesenzo.nl>
 */
class GithubIssues {

	/**
	 * When the issue list for a GitHub repo is requested, the results are stored here.
	 *
	 * @var array
	 *
	 * The array will have three main keys:
	 *   'issues'        array  key = issue number, value = issue state (open/closed)
	 *   'urls'          array  key = url, value = array with 'etag', 'last_mod', 'next_url',
	 *   'last_updated'  int    Unix timestamp of last save after API update
	 */
	protected static $github_issue_cache;

	/**
	 * @var string Filename of the cache file.
	 *             Used for reading and saving the cache file.
	 */
	protected static $cache_file;

	/**
	 * @var string (Next) url to be requested from the API.
	 */
	protected static $url = '';

	/**
	 * @var int Number of issues per page to retrieve.
	 *          Up this number if you are running into rate limit issues.
	 */
	protected static $issues_per_page = 100;


	/**
	 * Check the status of a GitHub issue
	 *
	 * @uses $GLOBALS['github_repo']
	 * @uses GithubIssues::$github_issue_cache
	 *
	 * @param  int $issue_id GitHub issue id
	 *
	 * @return bool Whether the issue is still open or (presumed) closed
	 */
	public static function is_github_issue_open( $issue_id ) {
		// Bail out if this is a private repo and we don't have an API key
		if ( $GLOBALS['github_repo']['private'] === true && ( ! isset( $GLOBALS['github_repo']['api_key'] ) || ! is_string( $GLOBALS['github_repo']['api_key'] ) || $GLOBALS['github_repo']['api_key'] === '' ) ) {
			register_shutdown_function( array( 'GithubIssues', 'auth_required' ) );
			return false;
		}

		// Set up the values for the statics, only run the first time the function is called
		if ( ! isset( self::$cache_file ) || empty( self::$cache_file ) ) {
			self::$cache_file = DIR_TESTDATA . '/.github-ticket-cache-' . $GLOBALS['github_repo']['organisation'] . '-' . $GLOBALS['github_repo']['repo_slug'] . '.txt';
		}
		if ( ! isset( self::$github_issue_cache ) || empty( self::$github_issue_cache ) ) {
			self::read_cache_file();
		}
		$callback = self::maybe_update_issue_list();


		// Oh dear, (still) no cache, so update via API failed - assume issue is closed
		if ( ! is_array( self::$github_issue_cache['issues'] ) || self::$github_issue_cache['issues'] === array() ) {
			register_shutdown_function( array( 'GithubIssues', 'forcing_known_bugs' ) );
			return false;
		}

		// Ok, so we have a cache, now did we get any feedback from the update routine ?
		if ( isset( $callback ) && is_callable( $callback ) ) {
			if ( $callback !== array( 'GithubIssues', 'using_local_cache' ) ) {
				// More serious issue, reset the cache to force an update next time, assume issue is closed
				register_shutdown_function( $callback );
				unset( self::$github_issue_cache['issues'] );
				self::save_cache_file();
				return false;
			}
			else {
				register_shutdown_function( $callback );
			}
		}

		// Now, let's see if the issue is open or not
		if ( isset( self::$github_issue_cache['issues'][ $issue_id ] ) && self::$github_issue_cache['issues'][ $issue_id ] === 'open' ) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Update the issue list via API requests to GitHub is cache has not been updated
	 * in the last hour or is not available.
	 *
	 * @uses $GLOBALS['github_repo']
	 * @uses GithubIssues::$github_issue_cache
	 * @uses GithubIssues::$url
	 *
	 * @return void|mixed If applicable, a callback to add to shutdown
	 */
	protected static function maybe_update_issue_list() {
		/* Was the last update less than an hour ago and we acually have an issue list ? Bail out.
			(won't happen when using travis as no issue file is retained, so last_updated will not be set) */
		if ( ( is_array( self::$github_issue_cache['issues'] ) && self::$github_issue_cache['issues'] !== array() ) && ( isset( self::$github_issue_cache['last_updated'] ) && ( time() - self::$github_issue_cache['last_updated'] ) < ( 60 * 60 ) ) ) {
			return null;
		}
		else {
			$callback = null;

			self::set_first_url();

			while ( is_string( self::$url ) && self::$url !== '' ) {
				$request_headers = self::set_request_headers();

				// Retrieve the file using a stream so we can send the headers
				$opts = array(
					'http' => array(
						'method'     => 'GET',
						'timeout'    => 5,
						// GitHub demands a custom user agent
						'user_agent' => 'Unittests-for-' . $GLOBALS['github_repo']['organisation'] . '-' . $GLOBALS['github_repo']['repo_slug'],
						'header'     => $request_headers,
					)
				);

				$context          = stream_context_create( $opts );
				$response         = @file_get_contents( self::$url, false, $context );
				$response_headers = self::handle_response_headers( $http_response_header );


				// Handle the response
				switch ( $response_headers['status'] ) {
					case 200:
						// = Ok, process response
						if ( self::update_cache( $response ) !== true ) {
							// empty response, something must have gone wrong with this page
							$callback = array( 'GithubIssues', 'using_local_cache' );
						}
						break;

					case 304:
						// = Not modified
						// Nothing to do, move on to the next url
						break;

					case 401:
						// = Bad credentials
						$callback = array( 'GithubIssues', 'auth_required' );
						// break out of the while loop as well as further calls would be useless
						break 2;

					case 403:
						// = Forbidden
						if ( isset( $response_headers['ratelimit_remaining'] ) && $response_headers['ratelimit_remaining'] == 0 ) {
							$callback = array( 'GithubIssues', 'using_local_cache' );
						}
						else {
							$callback = array( 'GithubIssues', 'forcing_known_bugs' );
						}
						// break out of the while loop as well as further calls would be useless
						break 2;

					default:
						// Some other state, presume just a one-page hickup
						$callback = array( 'GithubIssues', 'using_local_cache' );
						break;
				}


				self::set_next_url( $response_headers );
			}

			self::save_cache_file();

			return $callback;
		}
	}


	/**
	 * Determine the url for the first request to GitHub.
	 *
	 * @uses $GLOBALS['github_repo']
	 * @uses GithubIssues::$issues_per_page
	 * @uses GithubIssues::$url
	 */
	protected static function set_first_url() {
		$scheme = 'https';
		if ( ! extension_loaded( 'openssl' ) ) {
			$scheme = 'http';
		}

		self::$url = sprintf(
			'%s://api.github.com/repos/%s/%s/issues?state=all&per_page=%d',
			$scheme,
			rawurlencode( $GLOBALS['github_repo']['organisation'] ),
			rawurlencode( $GLOBALS['github_repo']['repo_slug'] ),
			urlencode( self::$issues_per_page )
		);
	}


	/**
	 * Determine the url for the next page API request
	 *
	 * @uses GithubIssues::$github_issue_cache
	 * @uses GithubIssues::$url
	 *
	 * @param array $headers Relevant response headers from the current page request
	 */
	protected static function set_next_url( $headers ) {
		if ( isset( $headers['next'] ) && ! empty( $headers['next'] ) ) {
			self::$url = $headers['next'];
		}
		// responses > 200 don't send the link header, so get a previously cached version
		elseif ( isset( self::$github_issue_cache['urls'][ self::$url ]['next_url'] ) && ! empty( self::$github_issue_cache['urls'][ self::$url ]['next_url'] ) ) {
			self::$url = self::$github_issue_cache['urls'][ self::$url ]['next_url'];
		}
		else {
			// We've reached the last page
			self::$url = false;
		}
	}


	/**
	 * Determine the request headers we can send with the API request
	 *
	 * @uses GithubIssues::$github_issue_cache
	 * @uses $GLOBALS['github_repo']
	 *
	 * @return string  Headers to be used for the request
	 */
	protected static function set_request_headers() {
		// prevent 15 seconds delay if keep-alive would be open on GH and they would use http 1.1
		$headers = "Connection: close\r\n";

		// Add etag or lastmod header if available
		if ( isset( self::$github_issue_cache['urls'][ self::$url ]['etag'] ) && ! empty( self::$github_issue_cache['urls'][ self::$url ]['etag'] ) ) {
			$headers .= 'If-None-Match: ' . self::$github_issue_cache['urls'][ self::$url ]['etag'] . "\r\n";
		}
		elseif (  isset( self::$github_issue_cache['urls'][ self::$url ]['last_mod'] ) && ! empty( self::$github_issue_cache['urls'][ self::$url ]['last_mod'] ) ) {
			$headers .= 'If-Modified-Since: ' . self::$github_issue_cache['urls'][ self::$url ]['last_mod'] . "\r\n";
		}

		// Add authorisation header if api key is available
		if ( ! empty( $GLOBALS['github_repo']['api_key'] ) ) {
			$headers .= 'Authorization: token ' . $GLOBALS['github_repo']['api_key'] . "\r\n";
		}
		return $headers;
	}


	/**
	 * Parse the received response headers and save some to the local issue cache
	 *
	 * @uses GithubIssues::$github_issue_cache
	 *
	 * @param  array $headers Received response headers
	 *
	 * @return array Relevant response headers
	 */
	protected static function handle_response_headers( $headers ) {
		$relevant_headers = array();

		if ( is_array( $headers ) && $headers !== array() ) {
			foreach ( $headers as $header ) {
				switch ( true ) {
					case ( strpos( $header, 'X-RateLimit-Remaining:' ) === 0 ):
						$value = str_replace( 'X-RateLimit-Remaining: ', '', $header );
						$value = trim( $value );
						if ( ! empty( $value ) ) {
							$relevant_headers['ratelimit_remaining'] = $value;
						}
						break;

					case ( strpos( $header, 'ETag:' ) === 0 ):
						$value = str_replace( 'ETag: ', '', $header );
						$value = trim( $value );
						if ( ! empty( $value ) ) {
							$relevant_headers['etag']                               = $value;
							self::$github_issue_cache['urls'][ self::$url ]['etag'] = $value;
						}
						break;

					case ( strpos( $header, 'Last-Modified:' ) === 0 ):
						$value = str_replace( 'Last-Modified: ', '', $header );
						$value = trim( $value );
						if ( ! empty( $value ) ) {
							$relevant_headers['last_mod']                               = $value;
							self::$github_issue_cache['urls'][ self::$url ]['last_mod'] = $value;
						}
						break;

					case ( strpos( $header, 'Status:' ) === 0 ):
						$value = str_replace( 'Status: ', '', $header );
						$value = trim( $value );
						if ( ! empty( $value ) ) {
							$relevant_headers['status'] = (int) $value;
						}
						break;

					case ( strpos( $header, 'Link:' ) === 0 ):
						$value = str_replace( 'Link: ', '', $header );
						$value = trim( $value );
						$value = explode( ',', $value );
						if ( is_array( $value ) && $value !== array() ) {
							foreach ( $value as $link ) {
								$link = explode( ';', $link );
								if ( isset( $link[1] ) && trim( $link[1] ) === 'rel="next"' ) {
									$url = trim( $link[0], "<> \t\n\r\0\x0B" );
									if ( ! empty( $url ) ) {
										$relevant_headers['next']                                   = $url;
										self::$github_issue_cache['urls'][ self::$url ]['next_url'] = $url;
									}
									break;
								}
							}
						}
						break;
				}
			}
		}
		return $relevant_headers;
	}


	/**
	 * Update the local GitHub issue cache from a json API response.
	 *
	 * @uses GithubIssues::$github_issue_cache
	 *
	 * @param  string $response JSON encoded response body from API call
	 *
	 * @return bool             Whether the cache was updated
	 */
	protected static function update_cache( $response ) {
		$issues = json_decode( $response, true );
		if ( is_array( $issues ) && $issues !== array() ) {
			foreach ( $issues as $issue ) {
				self::$github_issue_cache['issues'][ $issue['number'] ] = $issue['state'];
			}
			return true;
		}
		else {
			return false;
		}
	}


	/**
	 * Save local GitHub issue cache to file.
	 *
	 * @uses GithubIssues::$cache_file
	 * @uses GithubIssues::$github_issue_cache
	 */
	protected static function save_cache_file() {
		$file = self::$cache_file;

		if ( ! is_file( $file ) ) {
			// Make sure that the write won't fail because the dir doesn't exist
			$dirs      = explode( '/', $file );
			$file_name = array_pop( $dirs );
			$dirs      = implode( '/', $dirs );
			if ( ! is_dir( $dirs ) ) {
				mkdir( $dirs, 0777, true );
			}
		}

		self::$github_issue_cache['last_updated'] = time();
		file_put_contents( $file, serialize( self::$github_issue_cache ) );
	}


	/**
	 * Read GitHub issue cache from file if available.
	 *
	 * @uses GithubIssues::$cache_file
	 * @uses GithubIssues::$github_issue_cache
	 */
	protected static function read_cache_file() {
		if ( file_exists( self::$cache_file ) ) {
			$cache = file_get_contents( self::$cache_file );
			$cache = unserialize( $cache );
			if ( $cache !== false ) {
				self::$github_issue_cache = $cache;
			}
			else {
				self::$github_issue_cache = null;
			}
		}
	}


	/**
	 * Send 'authorisation required' error to PHPUnit
	 */
	public static function auth_required() {
		echo PHP_EOL . "\x1b[0m\x1b[37;41m\x1b[2K";
		echo "ERROR: This repository needs API authorisation and no API key or an invalid API key was provided, so couldn't skip known bugs." . PHP_EOL;
		echo "\x1b[0m\x1b[2K";
	}


	/**
	 * Send 'using local cache' message to PHPUnit
	 */
	public static function using_local_cache() {
		echo PHP_EOL . "\x1b[0m\x1b[30;43m\x1b[2K";
		echo 'INFO: GitHub was inaccessible, the API rate limit was exceeded, or we already had a recent cache, so a local ticket status cache was used.' . PHP_EOL;
		echo "\x1b[0m\x1b[2K";
	}


	/**
	 * Send 'update failed' error to PHPUnit
	 */
	public static function forcing_known_bugs() {
		echo PHP_EOL . "\x1b[0m\x1b[37;41m\x1b[2K";
		echo "ERROR: GitHub was inaccessible, so couldn't skip known bugs." . PHP_EOL;
		echo "\x1b[0m\x1b[2K";
	}
}
