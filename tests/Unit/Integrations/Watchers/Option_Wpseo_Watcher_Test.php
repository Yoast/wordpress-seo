<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Option_Wpseo_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 */
final class Option_Wpseo_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Option_Wpseo_Watcher
	 */
	protected $instance;

	/**
	 * Does the setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Option_Wpseo_Watcher();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_wpseo', [ $this->instance, 'check_semrush_option_disabled' ] ) );
	}

	/**
	 * Tests with the new value being true.
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::check_semrush_option_disabled
	 *
	 * @return void
	 */
	public function test_check_semrush_option_disabled_with_new_value_being_true() {
		$this->assertFalse( $this->instance->check_semrush_option_disabled( null, [ 'semrush_integration_active' => true ] ) );
	}

	/**
	 * Tests with the new value being false .
	 *
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Option_Wpseo_Watcher::check_semrush_option_disabled
	 *
	 * @return void
	 */
	public function test_check_semrush_option_disabled_with_new_value_being_false() {
		$options_helper = Mockery::mock( Options_Helper::class );
		$options_helper->expects( 'set' )->once()->andReturn( true );

		$container = $this->create_container_with( [ Options_Helper::class => $options_helper ] );

		Monkey\Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$this->assertTrue( $this->instance->check_semrush_option_disabled( null, [ 'semrush_integration_active' => false ] ) );
	}
}
