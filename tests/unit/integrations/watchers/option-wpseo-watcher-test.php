<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\WordProof_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Option_Wpseo_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 */
class Option_Wpseo_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Option_Wpseo_Watcher
	 */
	protected $instance;

	/**
	 * Does the setup.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Option_Wpseo_Watcher( Mockery::mock( WordProof_Helper::class ) );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_wpseo', [ $this->instance, 'check_semrush_option_disabled' ] ) );
	}

	/**
	 * Tests with the new value being true.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::check_semrush_option_disabled
	 */
	public function test_check_semrush_option_disabled_with_new_value_being_true() {
		$this->assertFalse( $this->instance->check_semrush_option_disabled( null, [ 'semrush_integration_active' => true ] ) );
	}

	/**
	 * Tests with the new value being false .
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::check_semrush_option_disabled
	 */
	public function test_check_semrush_option_disabled_with_new_value_being_false() {
		$options_helper = Mockery::mock( Options_Helper::class );
		$options_helper->expects( 'set' )->once()->andReturn( true );

		$helper_surface          = Mockery::mock( Helpers_Surface::class );
		$helper_surface->options = $options_helper;

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $helper_surface ] );

		$this->assertTrue( $this->instance->check_semrush_option_disabled( null, [ 'semrush_integration_active' => false ] ) );
	}
}
