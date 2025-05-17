<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Analytics\User_Interface\Last_Completed_Indexation_Integration;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Last_Completed_Indexation_Integration_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\User_Interface\Last_Completed_Indexation_Integration
 */
final class Last_Completed_Indexation_Integration_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var Last_Completed_Indexation_Integration
	 */
	private $sut;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper_mock;

	/**
	 * The setup method.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->options_helper_mock = Mockery::mock( Options_Helper::class );

		$this->sut = new Last_Completed_Indexation_Integration( $this->options_helper_mock );
	}

	/**
	 * Tests the register hooks function.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks(): void {
		$this->sut->register_hooks();

		$this->assertNotFalse( \has_action( 'wpseo_indexables_unindexed_calculated' ) );
	}

	/**
	 * Tests if the method sets the option on 0 indexables.
	 *
	 * @covers ::maybe_set_indexables_unindexed_calculated
	 *
	 * @return void
	 */
	public function test_maybe_set_indexables_unindexed_calculated_with_zero_indexables(): void {
		$this->options_helper_mock->expects()->get( 'last_known_no_unindexed', [] );
		$this->options_helper_mock->expects()->set( 'last_known_no_unindexed', [ 'name' => \time() ] );

		Monkey\Functions\expect( 'remove_action' )
			->with( 'update_option_wpseo', [ 'WPSEO_Utils', 'clear_cache' ] )
			->once();

		Monkey\Functions\expect( 'add_action' )
			->with( 'update_option_wpseo', [ 'WPSEO_Utils', 'clear_cache' ] )
			->once();

		$this->sut->maybe_set_indexables_unindexed_calculated( 'name', 0 );
	}

	/**
	 * Tests if the method does not set the option on 100000 indexables.
	 *
	 * @covers ::maybe_set_indexables_unindexed_calculated
	 *
	 * @return void
	 */
	public function test_maybe_set_indexables_unindexed_calculated_with_many_indexables(): void {
		$this->options_helper_mock->expects( 'set' )->never();

		Monkey\Functions\expect( 'remove_action' )
			->with( 'update_option_wpseo', [ 'WPSEO_Utils', 'clear_cache' ] )
			->never();

		Monkey\Functions\expect( 'add_action' )
			->with( 'update_option_wpseo', [ 'WPSEO_Utils', 'clear_cache' ] )
			->never();

		$this->sut->maybe_set_indexables_unindexed_calculated( 'name', 100000 );
	}
}
