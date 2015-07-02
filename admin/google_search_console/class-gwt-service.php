<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Service
 */
class WPSEO_GWT_Service {

	/**
	 * @var Yoast_Google_Client
	 */
	private $client;
	/**
	 * @var string
	 */
	private $profile;

	/**
	 * Constructor
	 *
	 * @param string $profile
	 */
	public function __construct( $profile = '' ) {
		$this->profile = $profile;

		$client       = new WPSEO_GWT_Client_Setup();
		$this->client = $client->get_client();
	}

	/**
	 * Returns the client
	 *
	 * @return Yoast_Google_Client
	 */
	public function get_client() {
		return $this->client;
	}

	/**
	 * Get all sites that are registered in the GWT panel
	 *
	 * @return array
	 */
	public function get_sites() {
		$sites = array();

		// Do list sites request.
		$response = $this->client->do_request( 'sites' );

		if ( $response_json = $this->client->decode_response( $response ) ) {
			if ( ! empty( $response_json->siteEntry ) ) {
				foreach ( $response_json->siteEntry as $entry ) {
					$sites[ str_ireplace( 'sites/', '', (string) $entry->siteUrl ) ] = (string) $entry->siteUrl;
				}
			}

			// Sorting the retrieved sites.
			asort( $sites );
		}

		return $sites;
	}

	/**
	 * Get crawl issues
	 *
	 * @return array
	 */
	public function get_crawl_issue_counts() {

		// Setup crawl error list.
		$crawl_error_counts = $this->get_crawl_error_counts( $this->profile );

		$return = array();
		if ( ! empty( $crawl_error_counts->countPerTypes ) ) {
			foreach ( $crawl_error_counts->countPerTypes as $category ) {
				$return[ $category->platform ][ $category->category ] = array(
					'count'      => $category->entries[0]->count,
					'last_fetch' => null,
				);
			}
		}

		return $return;
	}

	/**
	 * Sending request to mark issue as fixed
	 *
	 * @param string $url
	 * @param string $platform
	 * @param string $category
	 *
	 * @return bool
	 */
	public function mark_as_fixed( $url, $platform, $category ) {
		$response = $this->client->do_request( 'sites/' .  urlencode( $this->profile ) .  '/urlCrawlErrorsSamples/' . urlencode( ltrim( $url, '/' ) ) . '?category=' . $category . '&platform=' . $platform . '', 'DELETE' );
		return ( $response->getResponseHttpCode() === 204 && $response->getResponseBody() === '' );
	}

	/**
	 * Fetching the issues from the GWT API
	 *
	 * @param string $platform
	 * @param string $category
	 *
	 * @return mixed
	 */
	public function fetch_category_issues( $platform, $category ) {
		$response = $this->client->do_request(
			'sites/'. urlencode( $this->profile ) . '/urlCrawlErrorsSamples?category=' . $category . '&platform=' . $platform
		);

		if ( $issues = $this->client->decode_response( $response ) ) {
			if ( ! empty ($issues->urlCrawlErrorSample ) ) {
				return $issues->urlCrawlErrorSample;
			}
		}
	}

	/**
	 * Removes the option and calls the clients clear_data method to clear that one as well
	 */
	public function clear_data() {
		// Clear client data.
		$this->client->clear_data();
	}

	/**
	 * Getting the crawl error counts
	 *
	 * @param string $profile
	 *
	 * @return mixed
	 */
	private function get_crawl_error_counts( $profile ) {
		$crawl_error_counts = $this->client->do_request(
			'sites/' . urlencode( $profile ) . '/urlCrawlErrorsCounts/query'
		);

		if ( $response = $this->client->decode_response( $crawl_error_counts ) ) {
			return $response;
		}
	}

}
