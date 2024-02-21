<?php

namespace Yoast\WP\SEO\Tests\Unit\WooCommerce_Editor\User_Interface;

use Brain\Monkey;
use Error;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\WooCommerce_Editor\User_Interface\WooCommerce_Editor_SEO_Block;

/**
 * Tests WooCommerce_Editor_SEO_Block.
 *
 * @group woocommerce-editor
 * @coversDefaultClass \Yoast\WP\SEO\Woocommerce_Editor\User_Interface\WooCommerce_Editor_SEO_Block
 */
final class WooCommerce_Editor_SEO_Block_Test extends TestCase {

	/**
	 * The WooCommerce_Editor_SEO_Block.
	 *
	 * @var WooCommerce_Editor_SEO_Block
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WooCommerce_Editor_SEO_Block();
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				'Yoast\WP\SEO\Conditionals\WooCommerce_Conditional',
				'Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional',
			],
			WooCommerce_Editor_SEO_Block::get_conditionals()
		);
	}

	/**
	 * Tests the register_hooks method.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Functions\expect( 'add_action' )
			->with( 'admin_init', [ $this->instance, 'register_block' ] )
			->once();

		Monkey\Functions\expect( 'add_action' )
			->with(
				'woocommerce_block_template_area_product-form_after_add_block_yoast-seo',
				[ $this->instance, 'add_seo_block' ]
			)
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests add_seo_block.
	 *
	 * @covers ::add_seo_block
	 *
	 * @return void
	 */
	public function test_add_seo_block() {
		$block = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface' );

		$block->shouldReceive( 'add_block' )
			->with(
				[
					'id'        => 'yoast-seo-woocommerce-editor-seo',
					'blockName' => 'yoast-seo/woocommerce-editor-seo',
					'order'     => 10,
				]
			)
			->once();

		$this->instance->add_seo_block( $block );
	}

	/**
	 * Tests register_block.
	 *
	 * @covers ::register_block
	 *
	 * @return void
	 */
	public function test_register_block() {
		try {
			$this->instance->register_block();
		} catch ( Error $e ) {
			$this->fail( 'The register_block method should not throw an error when the BlockRegistry class does not exist.' );
		}

		$registry = Mockery::mock( 'alias:\Automattic\WooCommerce\Admin\Features\ProductBlockEditor\BlockRegistry' );

		$registry->shouldReceive( 'get_instance' )->andReturn( $registry );
		$registry->shouldReceive( 'register_block_type_from_metadata' )
			->with( \WPSEO_PATH . 'blocks/woocommerce-editor/blocks/seo/block.json' )
			->once();

		$this->instance->register_block();
	}
}
