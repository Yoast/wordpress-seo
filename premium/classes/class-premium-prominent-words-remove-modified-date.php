<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Registers the hooks for altering the post data.
 */
class WPSEO_Premium_Prominent_Words_Remove_Modified_Date implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'rest_api_init', array( $this, 'register' ) );
	}

	/**
	 * Adds the hook to modify the post data by removing the modified date.
	 */
	public function register() {
		add_filter( 'wp_insert_post_data', array( $this, 'remove_modified_date' ), 10 );
	}

	/**
	 * Removes the post modified dates when the remove_modified_date flag is given.
	 *
	 * @param array $data The data to save.
	 *
	 * @return array The modified array.
	 */
	public function remove_modified_date( array $data ) {
		if ( filter_input( INPUT_POST, 'remove_modified_date' ) === 'true' ) {
			unset( $data['post_modified'], $data['post_modified_gmt'] );
		}

		return $data;
	}
}
