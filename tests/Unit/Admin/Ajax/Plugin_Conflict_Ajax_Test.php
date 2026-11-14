<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Ajax;

use Brain\Monkey;
use RuntimeException;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Plugin_Conflict_Ajax;

/**
 * Tests the plugin conflict dismissal endpoint.
 *
 * @coversDefaultClass Yoast_Plugin_Conflict_Ajax
 */
final class Plugin_Conflict_Ajax_Test extends TestCase {

	/**
	 * Tests dismissal of sanitized plugins for the current user.
	 *
	 * @dataProvider provider_dismissed_conflicts
	 * @covers ::__construct
	 * @covers ::dismiss_notice
	 * @covers ::get_dismissed_option
	 * @covers ::get_dismissed_conflicts
	 * @covers ::save_dismissed_conflicts
	 * @covers ::compare_plugins
	 * @covers ::compare_plugin
	 *
	 * @param mixed                   $stored   The stored user meta.
	 * @param array<string, string[]> $expected The expected updated user meta.
	 *
	 * @return void
	 */
	public function test_dismiss_notice( $stored, $expected ) {
		$_POST = [
			'data' => [
				'section' => '<b>sitemap</b>',
				'plugins' => [ '<b>plugin/plugin.php</b>', 'plugin/plugin.php' ],
			],
		];

		Monkey\Functions\expect( 'check_ajax_referer' )->once()->with( 'dismiss-plugin-conflict' );
		Monkey\Functions\when( 'get_current_user_id' )->justReturn( 42 );
		Monkey\Functions\when( 'sanitize_text_field' )->alias( 'strip_tags' );
		Monkey\Functions\expect( 'get_user_meta' )->twice()->with( 42, 'wpseo_dismissed_conflicts', true )->andReturn( $stored );
		Monkey\Functions\expect( 'update_user_meta' )->once()->with( 42, 'wpseo_dismissed_conflicts', $expected );
		Monkey\Functions\expect( 'wp_die' )->once()->with( 'true' );

		$instance = new Yoast_Plugin_Conflict_Ajax();
		$instance->dismiss_notice();
	}

	/**
	 * Provides stored metadata, including a user's first dismissal.
	 *
	 * @return array<string, array<mixed>> The metadata and expected dismissal state.
	 */
	public static function provider_dismissed_conflicts() {
		return [
			'first dismissal'        => [ '', [ 'sitemap' => [ 'plugin/plugin.php' ] ] ],
			'existing dismissals'    => [
				[
					'sitemap'   => [ 'previous/plugin.php' ],
					'opengraph' => [ 'social/plugin.php' ],
				],
				[
					'sitemap'   => [ 'previous/plugin.php', 'plugin/plugin.php' ],
					'opengraph' => [ 'social/plugin.php' ],
				],
			],
			'duplicate dismissal'    => [
				[ 'sitemap' => [ 'plugin/plugin.php' ] ],
				[ 'sitemap' => [ 'plugin/plugin.php' ] ],
			],
			'invalid stored section' => [
				[ 'sitemap' => 'invalid' ],
				[ 'sitemap' => [ 'plugin/plugin.php' ] ],
			],
		];
	}

	/**
	 * Tests that malformed input cannot update user meta.
	 *
	 * @dataProvider provider_invalid_requests
	 * @covers ::__construct
	 * @covers ::dismiss_notice
	 *
	 * @param array<string, mixed> $post_data The request payload.
	 *
	 * @return void
	 */
	public function test_invalid_request( $post_data ) {
		$_POST = $post_data;

		Monkey\Functions\expect( 'check_ajax_referer' )->once()->with( 'dismiss-plugin-conflict' );
		Monkey\Functions\expect( 'get_user_meta' )->never();
		Monkey\Functions\expect( 'update_user_meta' )->never();
		Monkey\Functions\expect( 'wp_die' )->once()->with( '[]' )->andThrow( new RuntimeException( 'Invalid request' ) );
		$this->expectExceptionMessage( 'Invalid request' );

		$instance = new Yoast_Plugin_Conflict_Ajax();
		$instance->dismiss_notice();
	}

	/**
	 * Provides malformed request payloads.
	 *
	 * @return array<string, array<array<string, mixed>>> The malformed payloads.
	 */
	public static function provider_invalid_requests() {
		return [
			'missing data'        => [ [] ],
			'scalar data'         => [ [ 'data' => 'sitemap' ] ],
			'missing section'     => [ [ 'data' => [ 'plugins' => [] ] ] ],
			'missing plugins'     => [ [ 'data' => [ 'section' => 'sitemap' ] ] ],
			'array section'       => [
				[
					'data' => [
						'section' => [],
						'plugins' => [],
					],
				],
			],
			'scalar plugins'      => [
				[
					'data' => [
						'section' => 'sitemap',
						'plugins' => 'plugin/plugin.php',
					],
				],
			],
			'nested plugin array' => [
				[
					'data' => [
						'section' => 'sitemap',
						'plugins' => [ [ 'plugin/plugin.php' ] ],
					],
				],
			],
			'non-string plugin'   => [
				[
					'data' => [
						'section' => 'sitemap',
						'plugins' => [ 42 ],
					],
				],
			],
		];
	}
}
