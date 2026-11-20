<?php

namespace Yoast\WP\SEO\Tests\Unit\Schema\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Schema_Disabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Schema\Infrastructure\Disable_Schema_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Disable_Schema_Integration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema\Infrastructure\Disable_Schema_Integration
 *
 * @group schema
 */
final class Disable_Schema_Integration_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Disable_Schema_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Disable_Schema_Integration( $this->options_helper );
	}

	/**
	 * Tests the conditionals of the integration.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [ Schema_Disabled_Conditional::class ], Disable_Schema_Integration::get_conditionals() );
	}

	/**
	 * Tests that the filter is registered outside of the admin.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_json_ld_output', [ $this->instance, 'disable_schema_output' ] ) );
	}

	/**
	 * Tests that the filter is not registered in the admin.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_in_admin() {
		Monkey\Functions\when( 'is_admin' )->justReturn( true );

		$this->instance->register_hooks();

		$this->assertFalse( Monkey\Filters\has( 'wpseo_json_ld_output', [ $this->instance, 'disable_schema_output' ] ) );
	}

	/**
	 * Tests that the schema output is turned off while the setting is disabled.
	 *
	 * @covers ::disable_schema_output
	 *
	 * @return void
	 */
	public function test_disable_schema_output_when_setting_disabled() {
		$this->options_helper
			->expects( 'get' )
			->with( 'enable_schema', true )
			->andReturnFalse();

		$this->assertFalse( $this->instance->disable_schema_output( [ '_deprecated' => 'data' ] ) );
	}

	/**
	 * Tests that the schema data is left untouched once the setting has been enabled within the same request.
	 *
	 * @covers ::disable_schema_output
	 *
	 * @return void
	 */
	public function test_disable_schema_output_when_setting_enabled() {
		$data = [ '_deprecated' => 'data' ];

		$this->options_helper
			->expects( 'get' )
			->with( 'enable_schema', true )
			->andReturnTrue();

		$this->assertSame( $data, $this->instance->disable_schema_output( $data ) );
	}
}
