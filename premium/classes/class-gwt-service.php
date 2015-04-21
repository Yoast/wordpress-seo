<?php
/**
 * @package    WPSEO
 * @subpackage Premium
 */

/**
 * Class WPSEO_GWT_Service
 */
class WPSEO_GWT_Service {

	/**
	 * @var Google_Client
	 */
	private $client;

	/**
	 * Constructor
	 *
	 * @param Yoast_Google_Client $client
	 */
	public function __construct( Yoast_Google_Client $client ) {
		$this->client = $client;
	}

	/**
	 * Get all sites that are registered in the GWT panel
	 *
	 * @return array
	 */
	public function get_sites() {
		$sites = array();

		// Do list sites request
		$response = $this->client->do_request( 'sites' );

		if ( $response_json = $this->client->decode_response( $response ) ) {
			if ( ! empty( $response_json->siteEntry ) ) {
				foreach ( $response_json->siteEntry as $entry ) {
					$sites[ str_ireplace( 'sites/', '', (string) $entry->siteUrl ) ] = (string) $entry->siteUrl;
				}
			}
		}

		return $sites;
	}

	/**
	 * Get crawl issues
	 *
	 * @return array
	 */
	public function get_crawl_issues() {

		// Setup crawl error list
		$crawl_issues       = array();
		$profile            = $this->get_profile();
		$crawl_error_counts = $this->get_crawl_error_counts( $profile );

		if ( ! empty( $crawl_error_counts->countPerTypes ) ) {
			foreach ( $crawl_error_counts->countPerTypes as $category ) {
				if ( $category->entries[0]->count > 0 ) {
					$crawl_category = new WPSEO_Crawl_Category_Issues( $this->client, $category, $profile );
					$crawl_category->fetch_issues( $crawl_issues );
				}
			}
		}

		return $crawl_issues;
	}

	/**
	 * Sending request to mark issue as fixed
	 *
	 * @param $url
	 * @param $platform
	 * @param $category
	 *
	 * @return bool
	 */
	public function mark_as_fixed( $url, $platform, $category ) {

		$profile = $this->get_profile();
		if ( strpos( $profile, 'http://' ) !== 0 ) {
			$profile = 'http://' .$profile;
		}

		$response      = $this->client->do_request( 'sites/' .  urlencode( $profile ) .  '/urlCrawlErrorsSamples/' . urlencode( ltrim( $url, '/' ) ) . '?category=' . $category . '&platform=' . $platform . '', 'DELETE' );
		return ( $response->getResponseHttpCode() === 204 && $response->getResponseBody() === '' );
	}

	/**
	 * Get the GWT profile
	 *
	 * @return string
	 */
	private function get_profile() {

		// Get option
		$option = get_option( 'wpseo-premium-gwt', array( 'profile' => '' ) );

		// Set the profile
		$profile = $option['profile'];

		// Check if the profile is set
		if ( $profile === '' ) {
			$profile = get_option( 'siteurl' );
		}

		// Backwards compatibility fix - This is the old API endpoint
		if ( strpos( $profile, 'https://www.google.com/webmasters/tools/feeds/' ) ) {
			$profile = str_replace( 'https://www.google.com/webmasters/tools/feeds/', '', $profile );
		}

		// Return the profile
		return trim( $profile, '/' );
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
