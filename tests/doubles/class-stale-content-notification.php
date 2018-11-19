<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Stale_Content_Notification_Double extends WPSEO_Stale_Content_Notification {

	/**
	 * @inheritdoc
	 */
	public function is_applicable( $is_beta_enabled, $is_cornerstone_content_enabled ) {
		return parent::is_applicable( $is_beta_enabled, $is_cornerstone_content_enabled );
	}

	/**
	 * @inheritdoc
	 */
	public function get_notification_message( array $post_types ) {
		return parent::get_notification_message( $post_types );
	}
}

