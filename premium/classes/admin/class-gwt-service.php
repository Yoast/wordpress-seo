<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_GWT_Service {

	/**
	 * @var Google_Client
	 */
	private $client;

	/**
	 * Constructor
	 *
	 * @param Google_Client $client
	 */
	public function __construct( Google_Client $client ) {
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
		$request = new Google_HttpRequest( "https://www.google.com/webmasters/tools/feeds/sites/" );

		// Get list sites response
		$response = $this->client->getIo()->authenticatedRequest( $request );

		if ( '200' == $response->getResponseHttpCode() ) {

			$response_xml = simplexml_load_string( $response->getResponseBody() );

			if ( count( $response_xml->entry ) > 0 ) {
				foreach ( $response_xml->entry as $entry ) {
					$sites[(string) $entry->id] = (string) $entry->title;
				}
			}


		}

		return $sites;
	}

	/**
	 * Get crawl issues
	 *
	 * @param $site_url
	 *
	 * @return array
	 */
	public function get_crawl_issues( $site_url ) {

		$crawl_issues = array();

		// Encode url
		$site_url = urlencode( $site_url );

		// Do list sites request
		$request = new Google_HttpRequest( "https://www.google.com/webmasters/tools/feeds/" . $site_url . "/crawlissues/" );

		// Get list sites response
		$response = $this->client->getIo()->authenticatedRequest( $request );

		if ( '200' == $response->getResponseHttpCode() ) {

			$response_xml = simplexml_load_string( $response->getResponseBody() );

			if ( count( $response_xml->entry ) > 0 ) {
				foreach ( $response_xml->entry as $entry ) {
					$wt = $entry->children( 'wt', true );
					$crawl_issues[] = new WPSEO_Crawl_Issue( WPSEO_GWT::get()->format_admin_url( (string) $wt->url ), (string) $wt->{'crawl-type'}, (string) $wt->{'issue-type'}, new DateTime( (string) $wt->{'date-detected'} ), (string) $wt->{'detail'}, (array) $wt->{'linked-from'} );
				}
			}


		}

		return $crawl_issues;
	}

}