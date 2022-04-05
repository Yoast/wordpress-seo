<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Post_Type_Sitemap_Provider_Test.
 *
 * @group sitemaps
 */
class WPSEO_Post_Type_Sitemap_Provider_Test extends WPSEO_UnitTestCase {

	/**
	 * Sitemap Provider instance.
	 *
	 * @var WPSEO_Post_Type_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * List of posts to exclude from sitemap generation.
	 *
	 * @var array
	 */
	private $excluded_posts = [];

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Post_Type_Sitemap_Provider();
	}

	/**
	 * No entries in the post or page types should still generate an index entry.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_no_entries() {
		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertNotEmpty( $index_links );
		$this->assertContains( 'http://example.org/post-sitemap.xml', $index_links[0] );
		$this->assertContains( 'http://example.org/page-sitemap.xml', $index_links[1] );
	}

	/**
	 * Multiple pages of a post-type should result in multiple index entries.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_one_entry_paged() {

		$this->factory->post->create();

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertNotEmpty( $index_links );
		$this->assertContains( 'http://example.org/post-sitemap.xml', $index_links[0] );

		$this->factory->post->create();

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertContains( 'http://example.org/post-sitemap.xml', $index_links[0] );
		$this->assertContains( 'http://example.org/post-sitemap2.xml', $index_links[1] );
	}

	/**
	 * Multiple entries should be on the same sitemap if not over page limit.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_multiple_entries_non_paged() {
		$this->factory->post->create();
		$this->factory->post->create();

		$index_links = self::$class_instance->get_index_links( 5 );

		$this->assertContains( 'http://example.org/post-sitemap.xml', $index_links[0] );
	}

	/**
	 * Makes sure the filtered out entries do not cause a sitemap index link to return a 404.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_empty_bucket() {

		$this->factory->post->create();
		$this->excluded_posts = [ $this->factory->post->create() ]; // Remove this post.
		$this->factory->post->create();

		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'exclude_post' ] );
		add_filter( 'wpseo_sitemap_entries_per_page', [ $this, 'return_one' ] );

		// Fetch the global sitemap.
		set_query_var( 'sitemap', 'post' );

		// Set the page to the second one, which should not contain an entry, but should exist.
		set_query_var( 'sitemap_n', '2' );

		// Load the sitemap.
		$sitemaps = new WPSEO_Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expect an empty list to be output.
		$this->expectOutputContains(
			'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\r\n" . '</urlset>'
		);

		// Remove the filter.
		remove_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'exclude_post' ] );
	}

	/**
	 * Makes sure invalid sitemap pages return no contents (404).
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_empty_sitemap() {
		// Fetch the global sitemap.
		set_query_var( 'sitemap', 'post' );

		// Set the page to the second one, which should not contain an entry, and should not exist.
		set_query_var( 'sitemap_n', '2' );

		// Load the sitemap.
		$sitemaps = new WPSEO_Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expect an empty page (404) to be returned.
		$this->expectOutputString( '' );
	}

	/**
	 * Tests the sitemap links for the different homepage possibilities.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 */
	public function test_get_sitemap_links() {
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		$current_show_on_front  = get_option( 'show_on_front' );
		$current_page_on_front  = (int) get_option( 'page_on_front' );
		$current_page_for_posts = (int) get_option( 'page_for_posts' );

		$front_page = $this->factory()->post->create_and_get( [ 'post_type' => 'page' ] );
		$posts_page = $this->factory()->post->create_and_get( [ 'post_type' => 'page' ] );
		$post_id    = $this->factory()->post->create_and_get( [ 'post_type' => 'post' ] );

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $front_page->ID );
		update_option( 'page_for_posts', 0 );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'page', 1, 1 );
		$this->assertContains( get_permalink( $front_page->ID ), $sitemap_links[0] );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'post', 1, 1 );
		$this->assertContains( get_permalink( $post_id ), $sitemap_links[0] );

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $front_page->ID );
		update_option( 'page_for_posts', $posts_page->ID );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'page', 1, 1 );
		$this->assertContains( YoastSEO()->helpers->url->home(), $sitemap_links[0] );
		$this->assertContains( get_permalink( $front_page->ID ), $sitemap_links[0] );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'post', 2, 1 );
		$this->assertContains( get_post_type_archive_link( 'post' ), $sitemap_links[0] );
		$this->assertContains( get_permalink( $posts_page->ID ), $sitemap_links[0] );
		$this->assertContains( get_permalink( $post_id ), $sitemap_links[1] );

		update_option( 'show_on_front', 'posts' );
		update_option( 'page_on_front', 0 );
		update_option( 'page_for_posts', 0 );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'page', 1, 1 );
		$this->assertContains( YoastSEO()->helpers->url->home(), $sitemap_links[0] );

		$sitemap_links = $sitemap_provider->get_sitemap_links( 'post', 2, 1 );
		$this->assertContains( YoastSEO()->helpers->url->home(), $sitemap_links[0] );
		$this->assertContains( get_permalink( $post_id ), $sitemap_links[1] );

		update_option( 'show_on_front', $current_show_on_front );
		update_option( 'page_for_posts', $current_page_for_posts );
		update_option( 'page_on_front', $current_page_on_front );
	}

	/**
	 * Tests the excluded posts with the usage of the filter.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_excluded_posts
	 */
	public function test_get_excluded_posts_with_set_filter() {
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'filter_with_output' ] );

		$expected = [
			0 => 5,
			1 => 600,
			2 => 23,
			3 => 0,
			5 => 3,
		];

		$this->assertEquals( $expected, $sitemap_provider->get_excluded_posts( 'post' ) );

		remove_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'filter_with_output' ] );
	}

	/**
	 * Tests the excluded posts with the usage of a filter that returns an invalid value.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_excluded_posts
	 */
	public function test_get_excluded_posts_with_set_filter_that_has_invalid_return_value() {
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'filter_with_invalid_output' ] );

		$this->assertEquals( [], $sitemap_provider->get_excluded_posts( 'post' ) );

		remove_filter( 'wpseo_exclude_from_sitemap_by_post_ids', [ $this, 'filter_with_invalid_output' ] );
	}

	/**
	 * Filter method for test.
	 *
	 * @param array $excluded_post_ids The excluded post IDs.
	 *
	 * @return array The post IDs.
	 */
	public function filter_with_output( $excluded_post_ids ) {
		$excluded_post_ids[] = 5;
		$excluded_post_ids[] = 600;
		$excluded_post_ids[] = '23books';
		$excluded_post_ids[] = '';
		$excluded_post_ids[] = [];
		$excluded_post_ids[] = '    3';

		return $excluded_post_ids;
	}

	/**
	 * Filter method for test.
	 *
	 * @param array $excluded_post_ids The excluded post IDs.
	 *
	 * @return string An invalid value.
	 */
	public function filter_with_invalid_output( $excluded_post_ids ) {
		return '1,2,3,4';
	}

	/**
	 * Tests if external URLs are not being included in the sitemap.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_url
	 */
	public function test_get_url() {
		$current_home     = get_option( 'home' );
		$sitemap_provider = new WPSEO_Post_Type_Sitemap_Provider_Double();

		$post_object = $this->factory()->post->create_and_get();
		$post_url    = $sitemap_provider->get_url( $post_object );

		$this->assertStringContainsString( $current_home, $post_url['loc'] );

		// Change home URL.
		update_option( 'home', 'http://example.com' );
		wp_cache_delete( 'alloptions', 'options' );

		$this->assertFalse( $sitemap_provider->get_url( $post_object ) );

		// Revert original home URL.
		update_option( 'home', $current_home );
		wp_cache_delete( 'alloptions', 'options' );
	}

	/**
	 * Tests a regular post is added to the sitemap.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 */
	public function test_regular_post() {
		$this->factory->post->create();

		// Expect the created post to be in the sitemap list.
		$this->assertCount( 1, self::$class_instance->get_sitemap_links( 'post', 100, 0 ) );
	}

	/**
	 * Tests to make sure password protected posts are not in the sitemap.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 */
	public function test_password_protected_post() {
		// Create password protected post.
		$this->factory->post->create(
			[
				'post_password' => 'secret',
			]
		);

		// Expect the protected post should not be added.
		$this->assertCount(
			0,
			self::$class_instance->get_sitemap_links( 'post', 100, 0 ),
			'Password protected posts should not be in the sitemap'
		);
	}

	/**
	 * Tests to make sure a regular attachment is include in the sitemap.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 */
	public function test_regular_attachment() {
		// Enable attachments in the sitemap.
		WPSEO_Options::set( 'disable-attachment', false );

		// Create non-password-protected post.
		$post_id = $this->factory->post->create(
			[
				'post_password' => '',
			]
		);

		$this->factory->post->create(
			[
				'post_parent' => $post_id,
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
			]
		);

		// Expect the attchment to be in the list.
		$this->assertCount( 1, self::$class_instance->get_sitemap_links( 'attachment', 100, 0 ) );
	}

	/**
	 * Tests to make sure attachment is not added when parent is a protected post.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_sitemap_links
	 *
	 * @link https://github.com/Yoast/wordpress-seo/issues/9194
	 */
	public function test_password_protected_post_parent_attachment() {
		// Enable attachments in the sitemap.
		WPSEO_Options::set( 'disable-attachment', false );

		// Create password protected post.
		$post_id = $this->factory->post->create(
			[
				'post_password' => 'secret',
			]
		);

		$this->factory->post->create(
			[
				'post_parent' => $post_id,
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
			]
		);

		// Expect the attachment not to be added to the list.
		$this->assertCount( 0, self::$class_instance->get_sitemap_links( 'attachment', 100, 0 ) );
	}

	/**
	 * Filter to exclude desired posts from the sitemap.
	 *
	 * @param array $post_ids List of post ids.
	 *
	 * @return array
	 */
	public function exclude_post( $post_ids ) {
		return $this->excluded_posts;
	}

	/**
	 * Sets the number of entries in the sitemap to one.
	 *
	 * @return int
	 */
	public function return_one() {
		return 1;
	}
}
