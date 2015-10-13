<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Fetching the indexable status from the OnPage.org API and store it in the options
 */
class WPSEO_OnPage_Status {

	/**
	 * @var string Target url for the indexable status lookup.
	 */
	private $target_url;

	/**
	 * @var bool The fetched status of the target url is indexable or not.
	 */
	private $fetched_index_status;

	/**
	 * Construct the status object
	 *
	 * @param string $target_url The URL that will be fetched.
	 */
	public function __construct( $target_url = '' ) {
		$this->target_url = $target_url;
	}

	/**
	 * Fetching the new status from the API for the set target_url
	 */
	public function fetch_new_status() {
		$response           = $this->do_request( $this->target_url );
		$this->fetched_index_status = ( $response['is_indexable'] === 1 );
	}

	/**
	 * Compare new index status and store the value when the current status isn't different from the new status
	 *
	 * @return bool
	 */
	public function compare_index_status() {
		// When the status isn't different from the current status, just save the new status.
		if ( $this->get_current_index_status() !== $this->fetched_index_status ) {
			$this->set_index_status();

			return true;
		}

		return false;
	}

	/**
	 * Returns the indexable status of the website.
	 *
	 * @return bool
	 */
	public function is_indexable() {
		return ! empty( $this->get_current_index_status() );
	}

	/**
	 * Returns the value of the fetched_index_status property
	 *
	 * @return bool
	 */
	public function get_fetched_index_status() {
		return $this->fetched_index_status;
	}

	/**
	 * Sending a request to OnPage to check if the $home_url is indexable
	 *
	 * @param string $home_url The URL that will be send to the API.
	 *
	 * @return array
	 */
	private function do_request( $home_url ) {
		$response  = wp_remote_get( WPSEO_ONPAGE . $this->get_end_url( $home_url ) );
		$json_body = json_decode( wp_remote_retrieve_body( $response ), true );

		// OnPage.org recognized a redirect, fetch the data of that URL by calling this method with the value from OnPage.org.
		if ( ! empty( $json_body['passes_juice_to'] ) ) {
			return $this->do_request( $json_body['passes_juice_to'] );
		}

		return $json_body;
	}

	/**
	 * Getting the current saved index status.
	 *
	 * @return int|null
	 */
	private function get_current_index_status() {
		return get_site_option( 'wpseo_onpage_index_status', null );
	}

	/**
	 * Setting the new index status
	 */
	private function set_index_status() {
		update_site_option( 'wpseo_onpage_index_status', (int) $this->fetched_index_status );
	}

	/**
	 * Check if the $home_url is redirected to another page.
	 *
	 * @param string $home_url Fetch a possible redirect url.
	 *
	 * @return string
	 */
	private function get_end_url( $home_url ) {
		$response         = wp_remote_get( $home_url, array( 'redirection' => 0 ) );
		$response_headers = wp_remote_retrieve_headers( $response );

		if ( ! empty( $response_headers['location'] ) ) {
			return $response_headers['location'];
		}

		return $home_url;
	}

}
