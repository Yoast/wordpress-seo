<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Taxonomy_Sitemap_Provider_Test.
 *
 * @group sitemaps
 */
class WPSEO_Taxonomy_Sitemap_Provider_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Taxonomy_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Taxonomy_Sitemap_Provider();
	}

	/**
	 * Tests the retrieval of the index links.
	 *
	 * @covers WPSEO_Taxonomy_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links() {

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertEmpty( $index_links );

		$category_id = $this->factory->category->create();
		$post_id     = $this->factory->post->create();
		wp_set_post_categories( $post_id, $category_id );

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertNotEmpty( $index_links );
		$this->assertContains( 'http://example.org/category-sitemap.xml', $index_links[0] );

		$category2_id = $this->factory->category->create();
		$post2_id     = $this->factory->post->create();
		wp_set_post_categories( $post2_id, $category2_id );
		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertContains( 'http://example.org/category-sitemap1.xml', $index_links[0] );
		$this->assertContains( 'http://example.org/category-sitemap2.xml', $index_links[1] );
	}

	/**
	 * Tests retrieval of the sitemap links.
	 *
	 * @covers WPSEO_Taxonomy_Sitemap_Provider::get_sitemap_links
	 */
	public function test_get_sitemap_links() {

		$category_id = $this->factory->category->create();
		$post_id     = $this->factory->post->create();
		wp_set_post_categories( $post_id, $category_id );
		$sitemap_links = self::$class_instance->get_sitemap_links( 'category', 1, 1 );
		$this->assertContains( get_category_link( $category_id ), $sitemap_links[0] );
	}

	/**
	 * Makes sure invalid sitemap pages return no contents (404).
	 *
	 * @covers WPSEO_Taxonomy_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_empty_sitemap() {
		// Fetch the global sitemap.
		set_query_var( 'sitemap', 'category' );

		// Set the page to the second one, which should not contain an entry, and should not exist.
		set_query_var( 'sitemap_n', '2' );

		// Load the sitemap.
		$sitemaps = new WPSEO_Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expect an empty page (404) to be returned.
		$this->expectOutputString( '' );
	}
}
