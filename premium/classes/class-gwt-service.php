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
		$response = $this->client->do_request( 'https://www.googleapis.com/webmasters/v3/sites' );

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
			'https://www.googleapis.com/webmasters/v3/sites/' . urlencode( $profile ) . '/urlCrawlErrorsCounts/query'
		);

		if ( $response = $this->client->decode_response( $crawl_error_counts ) ) {
			return $response;
		}
	}

}

/**
 * Class WPSEO_Crawl_Category_Issues
 */
class WPSEO_Crawl_Category_Issues {

	/**
	 * @var object
	 */
	private $category;

	/**
	 * @var Yoast_Google_Client
	 */
	private $client;

	/**
	 * @var string
	 */
	private $profile;

	/**
	 * @param Yoast_Google_Client $client
	 * @param object              $category
	 * @param string              $profile
	 */
	public function __construct( Yoast_Google_Client $client, $category, $profile ) {
		$this->category = $category;
		$this->client   = $client;
		$this->profile  = $profile;
	}

	/**
	 * Fetching the issues for current category
	 *
	 * @param array $crawl_issues
	 */
	public function fetch_issues( array &$crawl_issues ) {

		$response = $this->client->do_request(
			'https://www.googleapis.com/webmasters/v3/sites/'. urlencode( $this->profile ) . '/urlCrawlErrorsSamples?category=' . $this->category->category . '&platform=' . $this->category->platform
		);

		if ( $issues = $this->client->decode_response( $response ) ) {
			foreach ( $issues->urlCrawlErrorSample as $issue ) {
				$crawl_issues[] = $this->create_issue( $issue );
			}
		}
	}

	/**
	 * Creates the issue
	 * @param stdClass $issue
	 *
	 * @return WPSEO_Crawl_Issue
	 */
	private function create_issue( $issue ) {
		return new WPSEO_Crawl_Issue(
			WPSEO_Redirect_Manager::format_url( (string) $issue->pageUrl ),
			(string) $this->category->platform,
			(string) $this->category->category,
			new DateTime( (string) $issue->first_detected ),
			(string) ( ! empty( $issue->responseCode ) ) ? $issue->responseCode : null,
			$this->get_linked_from_urls( $issue->pageUrl ),
			false
		);
	}

	/**
	 * Get the urls where given $url is linked from
	 *
	 * @param string $url
	 *
	 * @return array
	 */
	private function get_linked_from_urls( $url ) {

		$response = $this->client->do_request(
			'https://www.googleapis.com/webmasters/v3/sites/'. urlencode( $this->profile ) . '/urlCrawlErrorsSamples/' . $url . '?category=' . $this->category->category . '&platform=' . $this->category->platform
		);

		if ( $issue = $this->client->decode_response( $response ) ) {
			return (array) $issue->urlDetails->linkedFromUrls;
		}
	}

}