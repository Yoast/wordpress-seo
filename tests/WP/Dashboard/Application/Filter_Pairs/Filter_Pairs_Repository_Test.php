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
 * @covers Yoast\WP\SEO\Dashboard\Application\Filter_Pairs\Filter_Pairs_Repository::get_taxonomy
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
	}

	/**
	 * Tests get_taxonomy to see if it returns the correct data when a pair is found.
	 *
	 * @dataProvider data_get_taxonomy
	 *
	 * @param string        $taxonomy_name    The taxonomy to register.
	 * @param string        $object_type_name The object type that is looking.
	 * @param bool          $is_public        If the taxonomy should be public.
	 * @param bool          $show_in_rest     If the taxonomy should show in rest.
	 * @param Taxonomy|null $expected         The expected result.
	 *
	 * @return void
	 */
	public function test_get_taxonomy(
		string $taxonomy_name,
		string $object_type_name,
		bool $is_public,
		bool $show_in_rest,
		?Taxonomy $expected
	) {
		\register_taxonomy(
			$taxonomy_name,
			$object_type_name,
			[
				'public'       => $is_public,
				'show_in_rest' => $show_in_rest,
			]
		);
		self::assertEquals( $expected, $this->instance->get_taxonomy( $object_type_name ) );
		\unregister_taxonomy( $taxonomy_name );
	}

	/**
	 * The data provider for the `get_taxonomy` test.
	 *
	 * @return array<array<string,bool,null,Taxonomy>> The data.
	 */
	public function data_get_taxonomy(): array {
		return [
			'Find product_cat taxonomy for product' => [
				'product_cat',
				'product',
				true,
				true,
				new Taxonomy( 'product_cat', 'Tags', 'http://example.org/index.php?rest_route=/wp/v2/product_cat' ),
			],
			'Don\'t find product_cat taxonomy for product when not public' => [
				'product_cat',
				'product',
				false,
				true,
				null,
			],
			'Don\'t find product_cat taxonomy for product when not in rest' => [
				'product_cat',
				'product',
				true,
				false,
				null,
			],
			'Don\'t find taxonomy for a product that has no pair' => [
				'not_found',
				'fourofour',
				true,
				true,
				null,
			],
		];
	}
}
