<?php

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
		self::$class_instance = new WPSEO_Author_Sitemap_Provider;
	}

	/**
	 * Remove all created filters.
	 */
	public function tearDown() {
		parent::tearDown();

		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_no_posts' ) );
		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_posts' ) );

		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_enable_author_sitemaps' ) );
		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_role' ) );
		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_no_posts' ) );

		remove_filter( 'get_the_author_wpseo_excludeauthorsitemap', array( $this, 'filter_user_meta_exclude_author_from_sitemap' ) );
	}

	/**
	 * Get a test user
	 *
	 * @return stdClass
	 */
	public function get_user() {
		static $userID = 1;
		$user        = new stdClass();
		$user->roles = array( 'administrator' );
		$user->ID    = $userID ++;

		return $user;
	}

	/**
	 * Exclude user from sitemaps by excluding the entire role
	 */
	public function test_author_exclusion_from_sitemap_by_role() {
		$user = $this->get_user();

		// Filter out all administrators.
		add_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_administrator_role' ) );

		$result = self::$class_instance->user_sitemap_remove_excluded_authors( array( $user ) );

		// User should be removed.
		$this->assertEquals( $result, array() );
	}

	/**
	 * Test if a user is excluded from sitemaps when disabled on profile
	 */
	public function test_author_exclusion_from_sitemap_by_preference() {
		$user = $this->get_user();

		// Enable author sitemaps.
		add_filter( 'pre_option_wpseo_xml', array( $this, 'filter_enable_author_sitemaps' ) );

		// Make sure the user has posts.
		add_filter( 'get_usernumposts', array( $this, 'filter_user_has_posts' ) );

		// Add filter to exclude the user.
		add_filter( 'get_the_author_wpseo_excludeauthorsitemap', array( $this, 'filter_user_meta_exclude_author_from_sitemap' ) );

		$result = self::$class_instance->user_sitemap_remove_excluded_authors( array( $user ) );

		// User should be removed.
		$this->assertEquals( $result, array() );
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

		$result = self::$class_instance->user_sitemap_remove_excluded_authors( array( $user ) );

		// User should be removed.
		$this->assertEquals( $result, array() );
	}

	/**
	 * Test if a user is -not- excluded from the sitemap when there are posts
	 */
	public function test_author_not_exclused_from_sitemap_by_zero_posts() {
		$user = $this->get_user();

		// Don't allow no posts.
		add_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_no_posts' ) );

		// Make the user -have- posts.
		add_filter( 'get_usernumposts', array( $this, 'filter_user_has_posts' ) );

		$result = self::$class_instance->user_sitemap_remove_excluded_authors( array( $user ) );

		// User should not be removed.
		$this->assertEquals( $result, array( $user ) );
	}

	/**
	 * Get defaults
	 *
	 * @return array
	 */
	private function wpseo_option_xml_defaults() {
		static $defaults;

		if ( ! isset( $defaults ) ) {
			$wpseo_option_xml = WPSEO_Option_XML_Double::get_instance();
			$defaults         = $wpseo_option_xml->get_defaults();

			// Make sure the author sitemaps are enabled.
			$defaults['disable_author_sitemap'] = false;
		}

		return $defaults;
	}

	/**
	 * Exclude author by role
	 *
	 * @param mixed $false False.
	 *
	 * @return array
	 */
	public function filter_exclude_author_by_administrator_role( $false = false ) {
		return array_merge(
			$this->wpseo_option_xml_defaults(),
			array(
				'user_role-administrator-not_in_sitemap' => true,
			)
		);
	}

	/**
	 * Don't exclude author by role
	 *
	 * @param mixed $false False.
	 *
	 * @return array
	 */
	public function filter_enable_author_sitemaps( $false = false ) {
		return $this->wpseo_option_xml_defaults();
	}

	/**
	 * Exclude author that has no posts
	 *
	 * @param mixed $false False.
	 *
	 * @return array
	 */
	public function filter_exclude_author_by_no_posts( $false = false ) {
		return array_merge(
			$this->wpseo_option_xml_defaults(),
			array(
				'disable_author_noposts' => true,
			)
		);
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