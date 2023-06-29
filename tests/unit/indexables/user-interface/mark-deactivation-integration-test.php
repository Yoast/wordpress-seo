<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\User_Interface;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\User_Interface\Mark_Deactivation_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Mark_Deactivation_Integration_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\User_Interface\Mark_Deactivation_Integration
 */
class Mark_Deactivation_Integration_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Mark_Deactivation_Integration
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var \Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->instance = new Mark_Deactivation_Integration( $this->options_helper );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::register_hooks
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Functions\expect( 'add_action' )
			->with( 'wpseo_deactivate', [ $this->instance, 'register_deactivation' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get_conditionals
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
			],
			Mark_Deactivation_Integration::get_conditionals()
		);
	}

	/**
	 * Tests setting the deactivation option.
	 *
	 * @covers ::register_deactivation
	 * @return void
	 */
	public function test_register_deactivation() {
		$this->options_helper->expects()->set( Mark_Deactivation_Integration::PLUGIN_DEACTIVATED_AT_OPTION, \time() );

		$this->instance->register_deactivation();
	}
}
