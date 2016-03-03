<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Exposes the protected functions of the WPSEO Twitter class for testing
 */
class WPSEO_Sitemaps_Double extends WPSEO_Sitemaps {

	/**
	 * Overwrite sitemap_close() so we don't die on outputting the sitemap
	 */
	function sitemap_close() {
		remove_all_actions( 'wp_footer' );
	}

	/**
	 * Cleans out the sitemap variable
	 */
	public function reset() {
		$this->sitemap     = false;
		$this->bad_sitemap = false;
	}
}

/**
 * Exposes protected defaults from WPSEO_Option_XML class
 */
class WPSEO_Option_XML_Double extends WPSEO_Option_XML {
	public function get_defaults() {
		return $this->defaults;
	}
}

/**
 * Class WPSEO_Sitemaps_Test
 */
class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Sitemaps_Double;
	}

	/**
	 * Remove all created filters.
	 */
	public function tearDown() {
		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_no_posts' ) );
		remove_filter( 'get_usernumposts', array( $this, 'filter_user_has_posts' ) );

		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_enable_author_sitemaps' ) );
		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_role' ) );
		remove_filter( 'pre_option_wpseo_xml', array( $this, 'filter_exclude_author_by_no_posts' ) );

		remove_filter( 'get_the_author_wpseo_excludeauthorsitemap',
			array( $this, 'filter_user_meta_exclude_author_from_sitemap' ) );
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
	 * @covers WPSEO_Sitemaps::canonical
	 */
	public function test_canonical() {
		$url = site_url();
		$this->assertNotEmpty( self::$class_instance->canonical( $url ) );

		set_query_var( 'sitemap', 'sitemap_value' );
		$this->assertFalse( self::$class_instance->canonical( $url ) );

		set_query_var( 'xsl', 'xsl_value' );
		$this->assertFalse( self::$class_instance->canonical( $url ) );
	}

	/**
	 * @covers WPSEO_Sitemaps::get_last_modified
	 */
	public function test_get_last_modified() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$date = self::$class_instance->get_last_modified( array( 'post' ) );
		$post = get_post( $post_id );

		$this->assertEquals( $date, date( 'c', strtotime( $post->post_modified_gmt ) ) );
	}

	/**
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_post_sitemap() {
		self::$class_instance->reset();

		$post_id   = $this->factory->post->create();
		$permalink = get_permalink( $post_id );

		set_query_var( 'sitemap', 'post' );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<?xml',
			'<urlset ',
			'<loc>' . $permalink . '</loc>',
		) );
	}

	/**
	 * Tests the main sitemap and also tests the transient cache
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_main_sitemap() {
		self::$class_instance->reset();

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		// Go to the XML sitemap twice, see if transient cache is set
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );
		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
		) );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Served from transient cache',
		) );
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
		add_filter( 'get_the_author_wpseo_excludeauthorsitemap',
			array( $this, 'filter_user_meta_exclude_author_from_sitemap' ) );

		$result = self::$class_instance->user_sitemap_remove_excluded_authors( array( $user ) );

		// User should be removed
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
	 * @param $false
	 *
	 * @return array
	 */
	public function filter_exclude_author_by_administrator_role( $false ) {
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
	 * @param $false
	 *
	 * @return array
	 */
	public function filter_enable_author_sitemaps( $false ) {
		return $this->wpseo_option_xml_defaults();
	}

	/**
	 * Exclude author that has no posts
	 *
	 * @param $false
	 *
	 * @return array
	 */
	public function filter_exclude_author_by_no_posts( $false ) {
		return array_merge(
			$this->wpseo_option_xml_defaults(),
			array(
				'disable_author_noposts' => true
			)
		);
	}

	/**
	 * Exclude author by profile setting
	 *
	 * @param $value
	 *
	 * @return string
	 */
	public function filter_user_meta_exclude_author_from_sitemap( $value ) {
		return 'on';
	}

	/**
	 * Pretend user has 0 posts
	 *
	 * @param $count
	 *
	 * @return int
	 */
	public function filter_user_has_no_posts( $count ) {
		return 0;
	}

	/**
	 * Pretend user has posts
	 *
	 * @param $count
	 *
	 * @return int
	 */
	public function filter_user_has_posts( $count ) {
		return 1;
	}
}
