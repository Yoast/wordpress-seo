<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Blocks;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Integrations\Blocks\Block_Editor_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for block editor integration.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Blocks\Block_Editor_Integration
 *
 * @group blocks
 */
final class Block_Editor_Integration_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var Block_Editor_Integration
	 */
	protected $instance;

	/**
	 * Holds the asset manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Sets an instance for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );

		$this->instance = new Block_Editor_Integration( $this->asset_manager );
	}

	/**
	 * Tests that the integration is loaded when the
	 * right conditionals are met.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Post_Conditional::class ],
			Block_Editor_Integration::get_conditionals()
		);
	}

	/**
	 * Test constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' )
		);
	}

	/**
	 * Tests that register_hooks registers the expected hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Functions\expect( 'add_action' )
			->once()
			->with( 'enqueue_block_assets', [ $this->instance, 'enqueue' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that enqueue enqueues the expected assets.
	 *
	 * @covers ::enqueue
	 *
	 * @return void
	 */
	public function test_enqueue() {
		$this->asset_manager->expects( 'enqueue_style' )
			->once()
			->with( 'block-editor' );

		$this->instance->enqueue();
	}
}
