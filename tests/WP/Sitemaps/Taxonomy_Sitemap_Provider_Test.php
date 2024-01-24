<?php

namespace Yoast\WP\SEO\Tests\WP\Sitemaps;

use WPSEO_Taxonomy_Sitemap_Provider;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Sitemaps_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Taxonomy_Sitemap_Provider_Test.
 *
 * @group sitemaps
 * @coversDefaultClass WPSEO_Taxonomy_Sitemap_Provider
 */
final class Taxonomy_Sitemap_Provider_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Taxonomy_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		self::$class_instance = new WPSEO_Taxonomy_Sitemap_Provider();
	}

	/**
	 * Tests the retrieval of the index links.
	 *
	 * @covers ::get_index_links
	 *
	 * @return void
	 */
	public function test_get_index_links() {

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertEmpty( $index_links );

		$category_id = $this->factory->category->create();
		$post_id     = $this->factory->post->create();
		\wp_set_post_categories( $post_id, $category_id );

		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertNotEmpty( $index_links );
		$this->assertContains( 'http://example.org/category-sitemap.xml', $index_links[0] );

		$category2_id = $this->factory->category->create();
		$post2_id     = $this->factory->post->create();
		\wp_set_post_categories( $post2_id, $category2_id );
		$index_links = self::$class_instance->get_index_links( 1 );
		$this->assertContains( 'http://example.org/category-sitemap.xml', $index_links[0] );
		$this->assertContains( 'http://example.org/category-sitemap2.xml', $index_links[1] );
	}

	/**
	 * Tests retrieval of the sitemap links.
	 *
	 * @covers ::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_get_sitemap_links() {

		$category_id = $this->factory->category->create();
		$post_id     = $this->factory->post->create();
		\wp_set_post_categories( $post_id, $category_id );
		$sitemap_links = self::$class_instance->get_sitemap_links( 'category', 1, 1 );
		$this->assertContains( \get_category_link( $category_id ), $sitemap_links[0] );
	}

	/**
	 * Makes sure invalid sitemap pages return no contents (404).
	 *
	 * @covers ::get_index_links
	 *
	 * @return void
	 */
	public function test_get_index_links_empty_sitemap() {
		// Fetch the global sitemap.
		\set_query_var( 'sitemap', 'category' );

		// Set the page to the second one, which should not contain an entry, and should not exist.
		\set_query_var( 'sitemap_n', '2' );

		// Load the sitemap.
		$sitemaps = new Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expect an empty page (404) to be returned.
		$this->expectOutputString( '' );
	}

	/**
	 * Data provider for is_valid_taxonomy test.
	 *
	 * @return array
	 */
	public static function data_provider_is_valis_taxonomy() {
		return [
			'Pattern Categories' => [
				'taxonomy' => 'wp_pattern_category',
				'expected' => false,
			],
			'nav_menu' => [
				'taxonomy' => 'nav_menu',
				'expected' => false,
			],
			'link_category' => [
				'taxonomy' => 'link_category',
				'expected' => false,
			],
			'post_format' => [
				'taxonomy' => 'post_format',
				'expected' => false,
			],
		];
	}

	/**
	 * Tetst of is_valid_taxonomy.
	 *
	 * @covers ::is_valid_taxonomy
	 *
	 * @dataProvider data_provider_is_valis_taxonomy
	 *
	 * @param string $taxonomy Taxonomy name.
	 * @param bool   $expected Expected result.
	 *
	 * @return void
	 */
	public function test_is_valid_taxonomy( $taxonomy, $expected ) {
		$this->assertSame( $expected, self::$class_instance->is_valid_taxonomy( $taxonomy ) );
	}
}
