<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\Woocommerce_Permalinks;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WooCommerce_Permalinks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Woocommerce_Permalinks
 * @covers \Yoast\WP\SEO\Integrations\Third_Party\Woocommerce_Permalinks
 *
 * @group integrations
 * @group woocommerce
 */
class WooCommerce_Permalinks_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Woocommerce_Permalinks
	 */
	protected $instance;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = new Woocommerce_Permalinks( $this->indexable_helper );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[ WooCommerce_Conditional::class, Migrations_Conditional::class ],
			Woocommerce_Permalinks::get_conditionals()
		);
	}

	/**
	 * Tests if the constructor sets the right properties.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		static::assertNotFalse( Monkey\Filters\has( 'wpseo_post_types_reset_permalinks', [ $this->instance, 'filter_product_from_post_types' ] ) );
		static::assertNotFalse( Monkey\Actions\has( 'update_option_woocommerce_permalinks', [ $this->instance, 'reset_woocommerce_permalinks' ] ) );
	}

	/**
	 * Filters the product from the post types.
	 *
	 * @covers ::filter_product_from_post_types
	 */
	public function test_filter_product_from_post_types() {
		$this->assertEquals(
			[
				'post' => 'post',
				'page' => 'page',
			],
			$this->instance->filter_product_from_post_types(
				[
					'post'    => 'post',
					'page'    => 'page',
					'product' => 'product',
				]
			)
		);
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_product_base() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'post', 'product' );

		$old_value = [
			'product_base' => 'bar',
		];
		$new_value = [
			'product_base' => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old_value, $new_value );
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_attribute_base() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'my_attribute' );

		$attribute = (object) [
			'attribute_name' => 'my_attribute',
		];

		Monkey\Functions\expect( 'wc_get_attribute_taxonomies' )
			->once()
			->andReturn( [ $attribute ] );

		Monkey\Functions\expect( 'wc_attribute_taxonomy_name' )
			->once()
			->with( 'my_attribute' )
			->andReturn( 'my_attribute' );

		$old_value = [
			'attribute_base' => 'bar',
		];
		$new_value = [
			'attribute_base' => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old_value, $new_value );
	}

	/**
	 * Tests resetting the product on product_base change.
	 *
	 * @covers ::reset_woocommerce_permalinks
	 */
	public function test_reset_woocommerce_permalinks_terms_base() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'product_cat' );

		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->once()
			->with( 'term', 'product_tag' );

		$old_value = [
			'category_base' => 'bar',
			'tag_base'      => 'bar',
			'no_base'       => 'bar',
		];
		$new_value = [
			'category_base' => 'foo',
			'tag_base'      => 'foo',
			'no_base'       => 'foo',
		];

		$this->instance->reset_woocommerce_permalinks( $old_value, $new_value );
	}
}
