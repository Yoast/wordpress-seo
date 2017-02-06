<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Keeps track of the prominent words version.
 */
class WPSEO_Premium_Prominent_Words_Version implements WPSEO_WordPress_Integration {

	const VERSION_NUMBER = 1;

	const POST_META_NAME = 'yst_prominent_words_version';

	/**
	 * {@inheritdoc}
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_version_number' ), 10, 1 );
	}

	/**
	 * Saves the version number as a meta.
	 *
	 * @param int $post_id The post ID to save the version number for.
	 */
	public function save_version_number( $post_id ) {
		add_post_meta( $post_id, self::POST_META_NAME, self::VERSION_NUMBER );

		// Prevent infinite loops.
		remove_action( 'save_post', array( $this, 'save_version_number' ), 10 );
	}
}
