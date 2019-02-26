<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class Test_WPSEO_Sitemap_Provider_Overlap
 *
 * @group sitemaps
 */
class Test_WPSEO_Sitemap_Provider_Overlap extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Sitemaps_Double
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemaps_Double();

		// Reset the instance
		self::$class_instance->reset();
	}

	/**
	 * Set up our double class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		// Make sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );
	}

	/**
	 * Makes sure the private taxonomy "author" does not override the "Author" sitemap.
	 */
	public function test_private_taxonomy_author_overlap() {
		// Create private taxonomy "author", overlapping the "author" sitemap.
		register_taxonomy( 'author', array( 'post' ), array( 'public' => false ) );

		// Create a user with a post.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->post->create_many( 1, array( 'post_author' => $user_id ) );

		// Fetch the global sitemap.
		set_query_var( 'sitemap', '1' );

		// Load the sitemap.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$url = home_url( 'author-sitemap.xml' );

		// Expect the author-sitemap to be present in the index.
		$this->expectOutputContains(
			'<loc>' . $url . '</loc>'
		);

		unregister_taxonomy( 'author' );
	}

	/**
	 * Makes sure the private taxonomy "author" does not override the "Author" sitemap.
	 */
	public function test_private_taxonomy_author_overlap_author_in_sitemap() {
		// Create private taxonomy "author", overlapping the "author" sitemap.
		register_taxonomy( 'author', array( 'post' ), array( 'public' => false ) );

		// Create a user with a post.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->post->create_many( 1, array( 'post_author' => $user_id ) );

		// Fetch the global sitemap.
		set_query_var( 'sitemap', 'author' );

		// Load the sitemap.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		// Expect the author-sitemap to be present in the index.
		$this->expectOutputContains(
			'<loc>' . get_author_posts_url( $user_id ) . '</loc>'
		);

		unregister_taxonomy( 'author' );
	}
}
