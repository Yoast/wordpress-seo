<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Ajax;

use Brain\Monkey;
use RuntimeException;
use WPSEO_Shortcode_Filter;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests WPSEO_Shortcode_Filter.
 *
 * @coversDefaultClass WPSEO_Shortcode_Filter
 */
final class Shortcode_Filter_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var WPSEO_Shortcode_Filter
	 */
	private $instance;

	/**
	 * Prepare the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Shortcode_Filter();
	}

	/**
	 * Test constructor
	 *
	 * @covers ::__construct
	 *
	 * @return void
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
	 * @param array<string, array<string>> $post_data           The $_POST data.
	 * @param int                          $shortcode_times     The times we're gonna do_shortcode().
	 * @param string[]                     $expanded_shortcodes The result of the do_shortcode().
	 * @param array<array<string, string>> $parsed_shortcodes   The shortcode/expanded shortcode pair.
	 * @param int                          $error_times         The times that we're going to have an error.
	 * @param int                          $success_times       The times that we're going to have a success.
	 *
	 * @return void
	 */
	public function test_do_filter( $post_data, $shortcode_times, $expanded_shortcodes, $parsed_shortcodes, $error_times, $success_times ) {

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'wpseo-filter-shortcodes', 'nonce' );

		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [], 'objects' )
			->andReturn( [ (object) [ 'cap' => (object) [ 'edit_posts' => 'edit_posts' ] ] ] );
		Monkey\Functions\expect( 'current_user_can' )->with( 'edit_posts' )->andReturn( true );

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
	 * @return array<string, array<string, mixed>> The test data to use.
	 */
	public static function provider_do_filter() {
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

	/**
	 * Tests that shortcode rendering follows registered content capabilities.
	 *
	 * @dataProvider provider_content_capabilities
	 * @covers ::do_filter
	 * @covers ::can_edit_content
	 *
	 * @param string[] $capabilities The user's content editing capabilities.
	 * @param bool     $allowed      Whether shortcode rendering is allowed.
	 *
	 * @return void
	 */
	public function test_content_capabilities( $capabilities, $allowed ) {
		$_POST = [ 'data' => [ '[example]' ] ];

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'wpseo-filter-shortcodes', 'nonce' );
		Monkey\Functions\when( 'get_post_types' )->justReturn(
			[
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_posts' ] ],
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_pages' ] ],
				(object) [ 'cap' => (object) [ 'edit_posts' => 'edit_books' ] ],
			],
		);
		Monkey\Functions\when( 'get_taxonomies' )->justReturn(
			[
				(object) [ 'cap' => (object) [ 'edit_terms' => 'manage_categories' ] ],
				(object) [ 'cap' => (object) [ 'edit_terms' => 'edit_genres' ] ],
			],
		);
		Monkey\Functions\when( 'current_user_can' )->alias(
			static function ( $capability ) use ( $capabilities ) {
				return \in_array( $capability, $capabilities, true );
			},
		);

		if ( ! $allowed ) {
			Monkey\Functions\expect( 'do_shortcode' )->never();
			Monkey\Functions\expect( 'wp_die' )->once()->with( -1, 403 )->andThrow( new RuntimeException( 'Forbidden' ) );
			$this->expectExceptionMessage( 'Forbidden' );
		}
		else {
			Monkey\Functions\expect( 'do_shortcode' )->once()->with( '[example]' )->andReturn( 'Rendered' );
			Monkey\Functions\expect( 'wp_die' )->once()->with(
				WPSEO_Utils::format_json_encode(
					[
						[
							'shortcode' => '[example]',
							'output'    => 'Rendered',
						],
					],
				),
			);
		}

		$this->instance->do_filter();
	}

	/**
	 * Provides content editing capabilities, including custom roles.
	 *
	 * @return array<string, array<mixed>> The content editing capabilities and expected access.
	 */
	public static function provider_content_capabilities() {
		return [
			'contributor'          => [ [ 'edit_posts' ], true ],
			'page editor'          => [ [ 'edit_pages' ], true ],
			'custom post editor'   => [ [ 'edit_books' ], true ],
			'category editor'      => [ [ 'manage_categories' ], true ],
			'custom term editor'   => [ [ 'edit_genres' ], true ],
			'subscriber'           => [ [ 'read' ], false ],
			'revoked capabilities' => [ [], false ],
		];
	}
}
