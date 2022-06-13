<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Ajax;

use Brain\Monkey;
use WPSEO_Shortcode_Filter;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests WPSEO_Shortcode_Filter.
 *
 * @coversDefaultClass WPSEO_Shortcode_Filter
 */
class Shortcode_Filter_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Crawl_Cleanup_Rss
	 */
	private $instance;

	/**
	 * Prepare the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Shortcode_Filter();
	}

	/**
	 * Test constructor
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertNotFalse( Monkey\Actions\has( 'wp_ajax_wpseo_filter_shortcodes', [ $this->instance, 'do_filter' ] ) );
	}

	/**
	 * Tests parsing the shortcodes.
	 *
	 * @dataProvider provider_do_filter
	 * @covers ::do_filter
	 *
	 * @param array $post_data           The $_POST data.
	 * @param int   $shortcode_times     The times we're gonna do_shortcode().
	 * @param array $expanded_shortcodes The result of the do_shortcode().
	 * @param array $parsed_shortcodes   The shortcode/expanded shortcode pair.
	 * @param int   $error_times         The times that we're going to have an error.
	 * @param int   $success_times       The times that we're going to have a success.
	 */
	public function test_do_filter( $post_data, $shortcode_times, $expanded_shortcodes, $parsed_shortcodes, $error_times, $success_times ) {

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'wpseo-filter-shortcodes', 'nonce' );

		$_POST = $post_data;

		Monkey\Functions\expect( 'wp_die' )
			->times( $error_times )
			->with( [] );

		Monkey\Functions\expect( 'do_shortcode' )
			->times( $shortcode_times )
			->andReturn( ...$expanded_shortcodes );

		Monkey\Functions\expect( 'wp_die' )
			->times( $success_times )
			->with( WPSEO_Utils::format_json_encode( $parsed_shortcodes ) );

		$this->instance->do_filter();
	}

	/**
	 * Provides data for test_do_filter.
	 *
	 * @return array The test data to use.
	 */
	public function provider_do_filter() {
		return [
			'Valid shortcodes' => [
				'post_data'           => [
					'data' => [
						'[wpseo_address]',
						'[wpseo_address1]',
					],
				],
				'shortcode_times'     => 2,
				'expanded_shortcodes' => [
					'Expanded Shortcode 1',
					'Expanded Shortcode 2',
				],
				'parsed_shortcodes'   => [
					[
						'shortcode' => '[wpseo_address]',
						'output'    => 'Expanded Shortcode 1',
					],
					[
						'shortcode' => '[wpseo_address1]',
						'output'    => 'Expanded Shortcode 2',
					],
				],
				'error_times'         => 0,
				'success_times'       => 1,
			],
		];
	}
}
