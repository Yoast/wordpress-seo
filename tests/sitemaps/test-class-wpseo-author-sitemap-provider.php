<?php
/**
 * WPSEO plugin test file.
 *
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
	 * Set up our double class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		// Make sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );

		self::$class_instance = new WPSEO_Author_Sitemap_Provider();
	}

	/**
	 * Test if a user is excluded from the sitemap when there are no posts.
	 */
	public function test_author_excluded_from_sitemap_by_zero_posts() {
		// Remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Create a user, without any posts.
		$this->factory->user->create( array( 'role' => 'author' ) );

		// Check which authors are in the sitemap.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should not be in the list.
		$this->assertEmpty( $sitemap_links );
	}

	/**
	 * Tests if a user is NOT excluded from the sitemap when there are posts.
	 */
	public function test_author_not_excluded_from_sitemap_non_zero_posts() {
		// Remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Create a user, without any posts.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );

		// Create posts.
		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should now be in the XML sitemap as user now has 3 posts.
		$this->assertCount( 1, $sitemap_links );

		// Make sure it's the user we expected.
		$this->assertContains( get_author_posts_url( $user_id ), wp_list_pluck( $sitemap_links, 'loc' ) );
	}

	/**
	 * Test if a user is NOT excluded from the sitemap when there are no posts.
	 */
	public function test_author_not_excluded_from_sitemap_by_zero_posts() {
		// Don't remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		// Add three more users (of different types) without posts.
		$author_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$admin_id  = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// We should now have three in the XML sitemap.
		$this->assertCount( 3, $sitemap_links );

		$sitemap_urls = wp_list_pluck( $sitemap_links, 'loc' );
		$this->assertContains( get_author_posts_url( $author_id ), $sitemap_urls );
		$this->assertContains( get_author_posts_url( $admin_id ), $sitemap_urls );
		$this->assertContains( get_author_posts_url( $editor_id ), $sitemap_urls );
	}

	/**
	 * Test whether setting a user to not be visible in search results excludes user from XML sitemap.
	 */
	public function test_author_exclusion() {
		// Create a user with 3 posts.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

		// Exclude the user from the sitemaps.
		update_user_meta( $user_id, 'wpseo_noindex_author', 'on' );

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should not be in the XML sitemap.
		$this->assertEmpty( $sitemap_links );
	}
}
