<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Post_Type_Sitemap_Provider_Double extends WPSEO_Post_Type_Sitemap_Provider {

	/**
	 * Reset static variables.
	 */
	public function reset() {
		self::$home_url          = null;
		self::$page_on_front_id  = null;
		self::$page_for_posts_id = null;
	}

	/**
	 * @inheritdoc
	 */
	public function get_url( $post ) {
		return parent::get_url( $post );
	}

	/**
	 * Sets the classifier.
	 */
	public function set_classifier( $classifier ) {
		self::$classifier = $classifier;
	}

	/**
	 * @inheritdoc
	 */
	public function get_excluded_posts() {
		return parent::get_excluded_posts();
	}
}
