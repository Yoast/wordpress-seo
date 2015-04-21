<?php
/**
 * @package    WPSEO
 * @subpackage Premium
 */


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