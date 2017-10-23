<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_Taxonomy_Sitemap_Provider_Test
 */
class WPSEO_Taxonomy_Sitemap_Provider_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Taxonomy_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Taxonomy_Sitemap_Provider();
	}

	/**
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
	 * @covers WPSEO_Taxonomy_Sitemap_Provider::get_sitemap_links
	 */
	public function test_get_sitemap_links() {

		$category_id = $this->factory->category->create();
		$post_id     = $this->factory->post->create();
		wp_set_post_categories( $post_id, $category_id );
		$sitemap_links = self::$class_instance->get_sitemap_links( 'category', 1, 1 );
		$this->assertContains( get_category_link( $category_id ), $sitemap_links[0] );
	}
}
