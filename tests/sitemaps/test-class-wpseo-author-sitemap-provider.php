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

		WPSEO_Options::set( 'disable-author', false );
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );
		self::$class_instance = new WPSEO_Author_Sitemap_Provider();
	}

	/**
	 * Remove all created filters.
	 */
	public function tearDown() {
		parent::tearDown();
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
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should not be seen.
		$this->assertEmpty( $sitemap_links );

		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should now be in the XML sitemap as user now has 3 posts.
		$this->assertCount( 1, $sitemap_links );

	}

	/**
	 * Test if a user is NOT excluded from the sitemap when there are no posts
	 */
	public function test_author_not_excluded_from_sitemap_by_zero_posts() {
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		// Add three more users (of different types) without posts.
		$this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->user->create( array( 'role' => 'administrator' ) );
		$this->factory->user->create( array( 'role' => 'editor' ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// We should now have three in the XML sitemap.
		$this->assertCount( 3, $sitemap_links );
	}

	/**
	 * Test whether setting a user to not be visible in search results excludes user from XML sitemap.
	 */
	public function test_author_exclusion() {
		// Create a user with 3 posts.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );
		update_user_meta( $user_id, 'wpseo_noindex_author', 'on' );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should not be in the XML sitemap.
		$this->assertEmpty( $sitemap_links );
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
