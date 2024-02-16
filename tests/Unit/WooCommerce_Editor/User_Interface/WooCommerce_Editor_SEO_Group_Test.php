<?php

namespace Yoast\WP\SEO\Tests\Unit\WooCommerce_Editor\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\WooCommerce_Editor\User_Interface\WooCommerce_Editor_SEO_Group;

/**
 * Tests WooCommerce_Editor_SEO_Group.
 *
 * @group woocommerce-editor
 * @coversDefaultClass \Yoast\WP\SEO\Woocommerce_Editor\User_Interface\WooCommerce_Editor_SEO_Group
 */
final class WooCommerce_Editor_SEO_Group_Test extends TestCase {

	/**
	 * The WooCommerce_Editor_SEO_Group.
	 *
	 * @var WooCommerce_Editor_SEO_Group
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WooCommerce_Editor_SEO_Group();
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
			->with(
				'woocommerce_block_template_area_product-form_after_add_block_general',
				[
					$this->instance,
					'add_seo_group',
				]
			)
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the happy path of add_seo_group.
	 *
	 * @covers ::add_seo_group
	 *
	 * @return void
	 */
	public function test_add_seo_group() {
		$block  = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface' );
		$parent = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockTemplateInterface' );

		$block->shouldReceive( 'get_parent' )->andReturn( $parent );
		$block->shouldReceive( 'get_order' )->andReturn( 10 );
		$parent->shouldReceive( 'get_id' )->andReturn( 'simple-product' );
		$parent->shouldReceive( 'add_group' )->with(
			[
				'id'         => WooCommerce_Editor_SEO_Group::GROUP_ID,
				'order'      => 15,
				'attributes' => [
					'title' => 'Yoast SEO',
				],
			]
		)->once();

		$this->instance->add_seo_group( $block );
	}

	/**
	 * Tests that add_seo_group bails when the parent is falsy.
	 *
	 * @covers ::add_seo_group
	 *
	 * @return void
	 */
	public function test_add_seo_group_only_if_parent() {
		$block = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface' );

		$block->shouldReceive( 'get_parent' )->andReturn( null );
		$block->shouldNotReceive( 'get_order' );

		$this->instance->add_seo_group( $block );
	}

	/**
	 * Tests that add_seo_group bails when the parent ID is not 'simple_product'.
	 *
	 * @covers ::add_seo_group
	 *
	 * @return void
	 */
	public function test_add_seo_group_only_on_simple_product() {
		$block  = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface' );
		$parent = Mockery::mock( '\Automattic\WooCommerce\Admin\BlockTemplates\BlockTemplateInterface' );

		$block->shouldReceive( 'get_parent' )->andReturn( $parent );
		$block->shouldReceive( 'get_order' )->andReturn( 10 );
		$parent->shouldReceive( 'get_id' )->andReturn( 'not-a-simple-product' );
		$parent->shouldNotReceive( 'add_group' );

		$this->instance->add_seo_group( $block );
	}
}
