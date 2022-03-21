<?php

namespace Yoast\WP\SEO\Tests\Unit;

use Brain\Monkey;
use Mockery;
use WPSEO_Options;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WPTestUtils\BrainMonkey\YoastTestCase;

/**
 * TestCase base class.
 */
abstract class TestCase extends YoastTestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				// Null makes it so the function returns its first argument.
				'is_admin' => false,
			]
		);

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( \call_user_func_array( 'Mockery::anyOf', $this->mocked_options ) )
			->andReturn( [] );

		// This is required to ensure backfill and other statics are set.
		WPSEO_Options::get_instance();
	}

	/**
	 * Creates an Options_Helper mock.
	 *
	 * @param int $get_times The amount of times the get is called. Defaults to 1.
	 * @param int $set_times The amount of times the set is called. Defaults to 1.
	 *
	 * @return \Mockery\MockInterface|\Yoast\WP\SEO\Helpers\Options_Helper
	 */
	protected function get_options_helper_mock( $get_times = 1, $set_times = 1 ) {
		$options_helper = Mockery::mock( Options_Helper::class );
		$options_helper->expects( 'get' )->times( $get_times )->andReturnUsing(
			static function ( $value, $default ) {
				return $default;
			}
		);
		$options_helper->expects( 'set' )->times( $set_times )->andReturnUsing(
			static function ( $value ) {
				return $value;
			}
		);

		return $options_helper;
	}
}
