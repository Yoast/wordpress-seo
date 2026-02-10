<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WP_Term;
use Yoast\WP\SEO\Conditionals\Dynamic_Product_Permalinks_Conditional;
use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Version_Conditional;
use Yoast\WP\SEO\Integrations\Woocommerce_Product_Category_Permalink_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Woocommerce_Product_Category_Permalink_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Woocommerce_Product_Category_Permalink_Integration
 *
 * @group integrations
 */
final class Woocommerce_Product_Category_Permalink_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Woocommerce_Product_Category_Permalink_Integration
	 */
	private $instance;

	/**
	 * Represents the Dynamic_Product_Permalinks_Conditional.
	 *
	 * @var Mockery\MockInterface|Dynamic_Product_Permalinks_Conditional
	 */
	private $dynamic_product_permalinks_conditional;

	/**
	 * Method that runs before each test case.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->dynamic_product_permalinks_conditional = Mockery::mock( Dynamic_Product_Permalinks_Conditional::class );

		$this->instance = new Woocommerce_Product_Category_Permalink_Integration(
			$this->dynamic_product_permalinks_conditional
		);
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				WooCommerce_Version_Conditional::class,
				Woo_SEO_Inactive_Conditional::class,
			],
			Woocommerce_Product_Category_Permalink_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Dynamic_Product_Permalinks_Conditional::class,
			$this->getPropertyValue( $this->instance, 'dynamic_product_permalinks_conditional' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			\has_filter( 'wc_product_post_type_link_product_cat', [ $this->instance, 'restore_legacy_permalink_category' ] ),
			'Does not have expected wc_product_post_type_link_product_cat filter'
		);
	}

	/**
	 * Tests restore_legacy_permalink_category when dynamic permalinks are enabled.
	 *
	 * @covers ::restore_legacy_permalink_category
	 *
	 * @return void
	 */
	public function test_restore_legacy_permalink_category_with_dynamic_permalinks_enabled() {
		$category = Mockery::mock( WP_Term::class );
		$terms    = [ $category ];

		$this->dynamic_product_permalinks_conditional
			->expects( 'is_met' )
			->once()
			->andReturnTrue();

		$result = $this->instance->restore_legacy_permalink_category( $category, $terms );

		$this->assertSame( $category, $result );
	}

	/**
	 * Tests restore_legacy_permalink_category when dynamic permalinks are disabled.
	 *
	 * @covers ::restore_legacy_permalink_category
	 *
	 * @return void
	 */
	public function test_restore_legacy_permalink_category_with_dynamic_permalinks_disabled() {
		$category1          = Mockery::mock( WP_Term::class );
		$category1->parent  = 0;
		$category1->term_id = 10;

		$category2          = Mockery::mock( WP_Term::class );
		$category2->parent  = 5;
		$category2->term_id = 20;

		$terms = [ $category1, $category2 ];

		// After sorting by parent DESC, term_id ASC, category2 (parent=5) comes before category1 (parent=0).
		$sorted_terms = [ $category2, $category1 ];

		$this->dynamic_product_permalinks_conditional
			->expects( 'is_met' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_list_sort' )
			->once()
			->with(
				$terms,
				[
					'parent'  => 'DESC',
					'term_id' => 'ASC',
				]
			)
			->andReturn( $sorted_terms );

		$result = $this->instance->restore_legacy_permalink_category( $category1, $terms );

		// The result should be the first term after sorting (category2).
		$this->assertSame( $category2, $result );
	}
}
