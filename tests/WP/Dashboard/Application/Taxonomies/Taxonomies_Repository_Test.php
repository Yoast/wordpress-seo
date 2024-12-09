<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Application\Taxonomies;

use Yoast\WP\SEO\Dashboard\Application\Filter_Pairs\Filter_Pairs_Repository;
use Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Filter_Pairs\Product_Category_Filter_Pair;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Taxonomies\Taxonomies_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Taxonomies\Taxonomy_Validator;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository.
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Taxonomies\Taxonomies_Repository::get_content_type_taxonomy
 */
final class Taxonomies_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Taxonomies_Repository
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$taxonomy_validator     = new Taxonomy_Validator();
		$taxonomy_collector     = new Taxonomies_Collector( $taxonomy_validator );
		$filter_pair_repository = new Filter_Pairs_Repository( $taxonomy_collector, new Product_Category_Filter_Pair() );

		$this->instance = new Taxonomies_Repository( $taxonomy_collector, $filter_pair_repository );

		\register_post_type(
			'book',
			[
				'label'        => 'Books',
				'labels'       => [
					'name'          => 'Books',
					'singular_name' => 'Book',
					'add_new'       => 'Add New',
					'Book',
					'add_new_item'  => 'Add new book',
				],
				'description'  => 'Our books post type',
				'public'       => true,
				'menu_icon'    => 'dashicons-book-alt',
				'has_archive'  => 'my-books',
				'rewrite'      => [
					'slug' => 'yoast-test-books',
				],
				'show_in_rest' => true,
			]
		);
		\register_taxonomy(
			'alternative-genre',
			'book',
			[
				'label'          => 'Alternative Genres',
				'public'         => true,
				'show_in_rest'   => true,
				'rest_base'      => 'alternative_genres',
				'rest_namespace' => 'my_custom_namespace/v1',
				'rewrite'        => [ 'slug' => 'alternative-genre' ],
			]
		);

		\register_taxonomy(
			'product_cat',
			'product',
			[
				'public'       => true,
				'show_in_rest' => true,
			]
		);
	}

	/**
	 * Remove the custom post type and taxonomy after each test.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Remove possibly set post type.
		\unregister_post_type( 'book' );
		\unregister_taxonomy( 'product_cat' );
		\unregister_taxonomy( 'alternative-genre' );

		parent::tear_down();
	}

	/**
	 * Tests get content type for the `post` content type. Which is the fallback of the system.
	 *
	 * @return void
	 */
	public function test_get_content_type_taxonomy_posts() {
		$category_taxonomy = new Taxonomy( 'category', 'Categories', 'http://example.org/index.php?rest_route=/wp/v2/categories' );
		self::assertEquals( $category_taxonomy, $this->instance->get_content_type_taxonomy( 'post' ) );
	}

	/**
	 * Tests get content type a non existing post type.
	 *
	 * @return void
	 */
	public function test_get_content_type_taxonomies_non_existing_taxonomy() {
		self::assertNull( $this->instance->get_content_type_taxonomy( 'something_random' ) );
	}

	/**
	 * Tests get content type a predefined filter pair.
	 *
	 * @return void
	 */
	public function test_get_content_type_taxonomies_product_pair() {
		$product_cat = new Taxonomy( 'product_cat', 'Tags', 'http://example.org/index.php?rest_route=/wp/v2/product_cat' );
		self::assertEquals( $product_cat, $this->instance->get_content_type_taxonomy( 'product' ) );
	}

	/**
	 * Tests get content type for a custom post type that has not been added to the list of valid taxonomies.
	 *
	 * @return void
	 */
	public function test_get_content_type_taxonomies_custom_added_post_type() {
		self::assertNull( $this->instance->get_content_type_taxonomy( 'book' ) );
	}

	/**
	 * Tests get content type for a custom post type which is also added to the valid taxonomies with a filter.
	 *
	 * @return void
	 */
	public function test_get_content_type_taxonomies_custom_added_post_type_with_filter() {
		\add_filter( 'wpseo_book_filtering_taxonomy', [ $this, 'book_filtering_taxonomy' ] );
		$alternative_genre = new Taxonomy( 'alternative-genre', 'Alternative Genres', 'http://example.org/index.php?rest_route=/my_custom_namespace/v1/alternative_genres' );
		self::assertEquals( $alternative_genre, $this->instance->get_content_type_taxonomy( 'book' ) );
	}

	/**
	 * The filter callback.
	 *
	 * @return string
	 */
	public function book_filtering_taxonomy(): string {
		return 'alternative-genre';
	}
}
