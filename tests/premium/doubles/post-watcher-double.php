<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Post_Watcher_Double extends WPSEO_Post_Watcher {
	/**
	 * @inheritdoc
	 */
	public function set_hooks() {
		parent::set_hooks();
	}

	/**
	 * @inheritdoc
	 */
	public function remove_colliding_redirect( $post, $post_before ) {
		parent::remove_colliding_redirect( $post, $post_before );
	}

	/**
	 * @inheritdoc
	 */
	public function is_redirect_relevant( $post, $post_before ) {
		return parent::is_redirect_relevant( $post, $post_before );
	}

	/**
	 * @inheritdoc
	 */
	public function get_target_url( $post ) {
		return parent::get_target_url( $post );
	}

	/**
	 * @inheritdoc
	 */
	public function get_old_url( $post, $post_before ) {
		return parent::get_old_url( $post, $post_before );
	}

	/**
	 * @inheritdoc
	 */
	public function get_post_action() {
		return parent::get_post_action();
	}

	/**
	 * @inheritdoc
	 */
	public function get_post_old_post_url() {
		return parent::get_post_old_post_url();
	}
}
