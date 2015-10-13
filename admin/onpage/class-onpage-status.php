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
	 * @var WPSEO_OnPage_Option The OnPage.org option class.
	 */
	private $onpage_option;

	/**
	 * @var bool The fetched status of the target url is indexable or not.
	 */
	private $fetched_index_status;

	/**
	 * @var string|null The current status before anything has been requested,
	 */
	private $current_status;

	/**
	 * Construct the status object
	 *
	 * @param string              $target_url    The URL that will be fetched.
	 * @param WPSEO_OnPage_Option $onpage_option The option object for handling the onpage response.
	 */
	public function __construct( $target_url, WPSEO_OnPage_Option $onpage_option ) {
		$this->target_url     = $target_url;
		$this->onpage_option  = $onpage_option;
		$this->current_status = $this->onpage_option->get( 'status' );
	}

	/**
	 * Fetching the new status from the API for the set target_url
	 */
	public function fetch_new_status() {
		$response                   = $this->do_request( $this->target_url );
		$this->fetched_index_status = ( $response['is_indexable'] === 1 );

		// Updates the timestamp in the option.
		$this->onpage_option->set( 'last_fetch', time() );
	}

	/**
	 * Compare new index status and store the value when the current status isn't different from the new status
	 *
	 * @return bool
	 */
	public function compare_index_status() {
		// When the status isn't different from the current status, just save the new status.
		if ( $this->current_status !== $this->fetched_index_status ) {
			$this->onpage_option->set( 'status', (int) $this->fetched_index_status );

			return true;
		}

		return false;
	}

	/**
	 * Returns the current status
	 *
	 * @return null|string
	 */
	public function get_current_status() {
		return $this->current_status;
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
