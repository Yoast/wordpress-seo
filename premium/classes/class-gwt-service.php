<?php

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
					$sites[str_ireplace( 'sites/', '', (string) $entry->id )] = (string) $entry->title;
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
	public function get_crawl_issues() {

		// Setup crawl error list
		$crawl_issues = array();

		// Issues per page
		$per_page = 100;
		$cur_page = 0;

		// We always have issues on first request
		$has_more_issues = true;

		$crawl_issue_manager = new WPSEO_Crawl_Issue_Manager();

		$profile_url = $crawl_issue_manager->get_profile();

		// Do multiple request
		while ( true === $has_more_issues ) {

			// Set issues to false
			$has_more_issues = false;

			// Do request
			$url = $profile_url . "/crawlissues/?start-index=" . ( ( $per_page * $cur_page ) + 1 ) . "&amp;max-results=" . $per_page;

			$request = new Google_HttpRequest( $url );

			// Get list sites response
			$response = $this->client->getIo()->authenticatedRequest( $request );

			// Check response code
			if ( '200' == $response->getResponseHttpCode() ) {

				// Create XML object from reponse body
				$response_xml = simplexml_load_string( $response->getResponseBody() );


				// Check if we got entries
				if ( count( $response_xml->entry ) > 0 ) {

					// Count, future use itemsperpage in Google reponse
					if ( 100 == count( $response_xml->entry ) ) {
						// We have issues
						$has_more_issues = true;
					}

					// Loop
					foreach ( $response_xml->entry as $entry ) {
						$wt = $entry->children( 'wt', true );

						$crawl_issues[] = new WPSEO_Crawl_Issue( WPSEO_Redirect_Manager::format_url( (string) $wt->url ), (string) $wt->{'crawl-type'}, (string) $wt->{'issue-type'}, new DateTime( (string) $wt->{'date-detected'} ), (string) $wt->{'detail'}, (array) $wt->{'linked-from'}, false );
					}

				}

			}

			// Up page nr
			$cur_page ++;

		}

		return $crawl_issues;
	}

}