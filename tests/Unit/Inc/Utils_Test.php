<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey\Functions;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class.
 *
 * @coversDefaultClass WPSEO_Utils
 */
final class Utils_Test extends TestCase {

	/**
	 * Tests the URL to post ID fallback.
	 *
	 * @covers ::url_to_postid
	 *
	 * @return void
	 */
	public function test_url_to_postid() {
		Functions\expect( 'url_to_postid' )
			->once()
			->with( 'https://example.com/post/' )
			->andReturn( 42 );

		$this->assertSame( 42, WPSEO_Utils::url_to_postid( 'https://example.com/post/' ) );
	}

	/**
	 * Tests the remote GET fallback without arguments.
	 *
	 * @covers ::wp_remote_get
	 *
	 * @return void
	 */
	public function test_wp_remote_get_without_arguments() {
		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://example.com/' )
			->andReturn( [ 'response' => [ 'code' => 200 ] ] );

		$this->assertSame(
			[ 'response' => [ 'code' => 200 ] ],
			WPSEO_Utils::wp_remote_get( 'https://example.com/' ),
		);
	}

	/**
	 * Tests the remote GET fallback with arguments.
	 *
	 * @covers ::wp_remote_get
	 *
	 * @return void
	 */
	public function test_wp_remote_get_with_arguments() {
		$args = [ 'timeout' => 5 ];

		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://example.com/', $args )
			->andReturn( [ 'response' => [ 'code' => 200 ] ] );

		$this->assertSame(
			[ 'response' => [ 'code' => 200 ] ],
			WPSEO_Utils::wp_remote_get( 'https://example.com/', $args ),
		);
	}
}
