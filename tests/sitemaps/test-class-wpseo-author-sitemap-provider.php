<?php
/**
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class Test_WPSEO_Author_Sitemap_Provider
 */
class Test_WPSEO_Author_Sitemap_Provider extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Author_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_Author_Sitemap_Provider();
	}

	/**
	 * Remove all created filters.
	 */
	public function tearDown() {
		parent::tearDown();

		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_no_posts' ) );
		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_posts' ) );

		remove_filter( 'get_the_author_wpseo_excludeauthorsitemap', array( $this, 'filter_user_meta_exclude_author_from_sitemap' ) );
	}

	/**
	 * Get a test user
	 *
	 * @return stdClass
	 */
	public function get_user() {
		static $user_id = 1;

		$user        = new stdClass();
		$user->roles = array( 'administrator' );
		$user->ID    = $user_id++;

		return $user;
	}

	/**
	 * Test if a user is excluded from the sitemap when there are no posts
	 */
	public function test_author_excluded_from_sitemap_by_zero_posts() {
		$user = $this->get_user();

		// Don't allow no posts.
		add_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_no_posts' ) );

		// Make the user have -no- posts.
		add_filter( 'get_usernumposts', array( $this, 'filter_user_has_no_posts' ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should be removed.
		$this->assertEmpty( $sitemap_links );
	}

	/**
	 * Get defaults
	 *
	 * @return array
	 */
	private function wpseo_option_xml_defaults() {
		static $defaults;

		if ( ! isset( $defaults ) ) {
			$defaults = WPSEO_Options::get_options( array( 'wpseo', 'wpseo_titles' ) );

			// Make sure the author sitemaps are enabled.
			$defaults['noindex-author-wpseo'] = false;
		}

		return $defaults;
	}

	/**
	 * Exclude author by profile setting
	 *
	 * @param mixed $value Value.
	 *
	 * @return string
	 */
	public function filter_user_meta_exclude_author_from_sitemap( $value ) {
		return 'on';
	}

	/**
	 * Pretend user has 0 posts
	 *
	 * @param mixed $count Null.
	 *
	 * @return int
	 */
	public function filter_user_has_no_posts( $count = 0 ) {
		return 0;
	}

	/**
	 * Pretend user has posts
	 *
	 * @param mixed $count Null.
	 *
	 * @return int
	 */
	public function filter_user_has_posts( $count = 0 ) {
		return 1;
	}
}
