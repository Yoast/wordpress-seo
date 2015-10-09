<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Fetching the indexable status from the OnPage.org API and store it in the options
 */
class WPSEO_OnPage_Status {

	/**
	 * Fetching the new status from the API for given $home_url
	 *
	 * @param string $home_url
	 *
	 * @return bool
	 */
	public function fetch_new_status( $home_url ) {
		$response         = $this->do_request( $home_url );
		$new_index_status = ( $response['is_indexable'] === 1 );

		return $new_index_status;
	}

	/**
	 * Compare new index status and store the value when the current status isn't different from the new status
	 *
	 * @param bool $new_index_status
	 */
	public function compare_index_status( $new_index_status) {
		// When the status isn't different from the current status, just save the new status.
		if($this->get_index_status() !== $new_index_status ) {
			$this->set_index_status( $new_index_status );
		}
	}

	/**
	 * Returns the indexable status of the website.
	 *
	 * @return bool
	 */
	public function is_indexable() {
		return $this->get_index_status();
	}

	/**
	 * Sending a request to OnPage to check if the $home_url is indexable
	 *
	 * @param string $home_url
	 *
	 * @return array|mixed|object
	 */
	private function do_request( $home_url ) {
		$response  = wp_remote_get( WPSEO_ONPAGE . $this->get_end_url( $home_url ) );
		$json_body = json_decode( wp_remote_retrieve_body( $response ), true );

		// OnPage recognized a redirect, fetch the data of that URL.
		if ( ! empty( $json_body['passes_juice_to'] ) ) {
			return $this->do_request( $json_body['passes_juice_to'] );
		}

		return $json_body;
	}

	/**
	 * Getting the current saved index status.
	 *
	 * @return bool
	 */
	private function get_index_status() {
		$option_value = get_site_option( 'wpseo_onpage_index_status', 0 );
		return ! empty( $option_value );
	}

	/**
	 * Setting a new index status
	 *
	 * @param bool $new_index_status
	 */
	private function set_index_status( $new_index_status ) {
		update_site_option( 'wpseo_onpage_index_status', $new_index_status );
	}

	/**
	 * Check if the $home_url is redirected to another page.
	 *
	 * @param string $home_url
	 *
	 * @return string
	 */
	private function get_end_url( $home_url ) {
		$response         = wp_remote_get( $home_url, array('redirection' => 0)  );
		$response_headers =  wp_remote_retrieve_headers( $response );

		if ( !empty( $response_headers['location'] ) ) {
			return $response_headers['location'];
		}

		return $home_url;
	}

}
