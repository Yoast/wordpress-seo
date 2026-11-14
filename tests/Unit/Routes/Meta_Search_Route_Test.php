<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Yoast\WP\SEO\Routes\Meta_Search_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests searching custom fields without exposing protected metadata.
 *
 * @group routes
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Meta_Search_Route
 */
final class Meta_Search_Route_Test extends TestCase {

	/**
	 * Tests that protected metadata is excluded for every query.
	 *
	 * @covers ::search_meta
	 * @dataProvider data_provider_search_meta
	 *
	 * @param string                       $query    The search query.
	 * @param array<array<string, string>> $expected The expected matches.
	 *
	 * @return void
	 */
	public function test_search_meta( $query, $expected ) {
		$meta = [
			'_secret'       => [ 'private value' ],
			'custom_secret' => [ 'filter-protected value' ],
			'custom_field'  => [ 'public value', 'second value' ],
			'custom_array'  => [ 'a:0:{}' ],
			'other_field'   => [ 'other value' ],
		];

		Monkey\Functions\expect( 'get_post_custom' )->once()->with( 123 )->andReturn( $meta );
		Monkey\Functions\when( 'is_protected_meta' )->alias(
			function ( $key, $meta_type ) {
				$this->assertSame( 'post', $meta_type );
				return \in_array( $key, [ '_secret', 'custom_secret' ], true );
			},
		);
		Monkey\Functions\when( 'is_serialized' )->alias(
			static function ( $value ) {
				return $value === 'a:0:{}';
			},
		);
		Monkey\Functions\expect( 'rest_ensure_response' )->once()->andReturnFirstArg();

		$instance = new Meta_Search_Route();
		$this->assertSame(
			[ 'meta' => $expected ],
			$instance->search_meta(
				[
					'post_id' => 123,
					'query'   => $query,
				],
			),
		);
	}

	/**
	 * Provides queries covering protected and public metadata.
	 *
	 * @return array<string, array<mixed>>
	 */
	public static function data_provider_search_meta() {
		$public_match = [
			'key'   => 'custom_field',
			'value' => 'public value',
		];
		$other_match  = [
			'key'   => 'other_field',
			'value' => 'other value',
		];

		return [
			'empty query'                => [ '', [ $public_match, $other_match ] ],
			'protected prefix'           => [ '_', [] ],
			'protected exact key'        => [ '_secret', [] ],
			'filter-protected prefix'    => [ 'custom_', [ $public_match ] ],
			'filter-protected exact key' => [ 'custom_secret', [] ],
			'public exact key'           => [ 'custom_field', [ $public_match ] ],
			'serialized value'           => [ 'custom_array', [] ],
			'no matching keys'           => [ 'missing', [] ],
		];
	}
}
