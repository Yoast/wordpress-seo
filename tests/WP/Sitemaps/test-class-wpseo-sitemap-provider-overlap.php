<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemap_Provider_Overlap_Test.
 *
 * @group sitemaps
 *
 * @covers WPSEO_Sitemaps
 */
class WPSEO_Sitemap_Provider_Overlap_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemaps_Double
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();

		// Make sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );
	}

	/**
	 * Set up our double class and register the taxonomy.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Sitemaps_Double();

		// Reset the instance.
		self::$class_instance->reset();

		// Create private taxonomy "author", overlapping the "author" sitemap.
		register_taxonomy( 'author', [ 'post' ], [ 'public' => false ] );
	}

	/**
	 * Clean up the taxonomy.
	 */
	public function tear_down() {
		unregister_taxonomy( 'author' );
		parent::tear_down();
	}

	/**
	 * Makes sure the private taxonomy "author" does not override the "Author" sitemap.
	 */
	public function test_private_taxonomy_author_overlap() {
		// Create a user with a post.
		$user_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->factory->post->create_many( 1, [ 'post_author' => $user_id ] );

		// Fetch the global sitemap.
		set_query_var( 'sitemap', '1' );

		// Load the sitemap.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$url = home_url( 'author-sitemap.xml' );

		// Expect the author-sitemap to be present in the index.
		$this->expectOutputContains(
			'<loc>' . $url . '</loc>'
		);
	}

	/**
	 * Makes sure the private taxonomy "author" does not override the "Author" sitemap.
	 */
	public function test_private_taxonomy_author_overlap_author_in_sitemap() {
		// Create a user with a post.
		$user_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->factory->post->create_many( 1, [ 'post_author' => $user_id ] );

		// Fetch the global sitemap.
		set_query_var( 'sitemap', 'author' );

		// Load the sitemap.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		// Expect the author-sitemap to be present in the index.
		$this->expectOutputContains(
			'<loc>' . get_author_posts_url( $user_id ) . '</loc>'
		);
	}
}
