<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\Elementor_Preview;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Exclude_Elementor_Post_Types_Test.
 *
 * @group integrations
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Elementor_Preview
 */
class Elementor_Preview_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Preview
	 */
	protected $instance;

	/**
	 * The mocked asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->instance      = new Elementor_Preview( $this->asset_manager );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Elementor_Activated_Conditional::class ],
			Elementor_Preview::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the appropriate hooks needed for the integration to work.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'elementor/preview/enqueue_styles', [ $this->instance, 'add_preview_styles' ] ), 'The add_preview_styles action is registered.' );
	}

	/**
	 * Tests the registration of the appropriate hooks needed for the integration to work.
	 *
	 * @covers ::add_preview_styles
	 */
	public function test_add_preview_styles() {
		$this->asset_manager->expects( 'register_assets' )->once();
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( 'inside-editor' );
		$this->instance->add_preview_styles();
	}

}
