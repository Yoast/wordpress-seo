<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Application\Filter_Pairs;

use Yoast\WP\SEO\Dashboard\Application\Filter_Pairs\Filter_Pairs_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Filter_Pairs\Product_Category_Filter_Pair;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Dashboard\Infrastructure\Taxonomies\Taxonomies_Collector;
use Yoast\WP\SEO\Dashboard\Infrastructure\Taxonomies\Taxonomy_Validator;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Yoast\WP\SEO\Dashboard\Application\Filter_Pairs\Filter_Pairs_Repository.
 *
 * @coversDefaultClass Yoast\WP\SEO\Dashboard\Application\Filter_Pairs\Filter_Pairs_Repository
 */
final class Filter_Pairs_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Filter_Pairs_Repository
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$taxonomy_validator = new Taxonomy_Validator();
		$taxonomy_collector = new Taxonomies_Collector( $taxonomy_validator );
		$this->instance     = new Filter_Pairs_Repository( $taxonomy_collector, new Product_Category_Filter_Pair() );

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
	 * Remove the taxonomy after each test.
	 *
	 * @return void
	 */
	public function tear_down() {
		\unregister_taxonomy( 'product_cat' );
		parent::tear_down();
	}

	/**
	 * Tests get_taxonomy to see if it returns the correct data when a pair is found.
	 *
	 * @covers ::get_taxonomy
	 *
	 * @return void
	 */
	public function test_get_taxonomy() {
		$product_cat_taxonomy = new Taxonomy( 'product_cat', 'Tags', 'http://example.org/index.php?rest_route=/wp/v2/product_cat' );
		self::assertNull( $this->instance->get_taxonomy( 'post' ) );
		self::assertEquals( $product_cat_taxonomy, $this->instance->get_taxonomy( 'product' ) );
	}
}
