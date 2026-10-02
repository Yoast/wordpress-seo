<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Route_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Route_Helper
 *
 * @group helpers
 */
final class Route_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Route_Helper
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Route_Helper();
	}

	/**
	 * Tests that the route is built from the name, falling back to the rest base, with leading
	 * slashes stripped.
	 *
	 * @covers ::get_route
	 *
	 * @dataProvider provider_get_route
	 *
	 * @param string $name      The name.
	 * @param string $rest_base The rest base.
	 * @param string $expected  The expected route.
	 *
	 * @return void
	 */
	public function test_get_route( $name, $rest_base, $expected ) {
		$this->assertSame( $expected, $this->instance->get_route( $name, $rest_base ) );
	}

	/**
	 * Data provider for test_get_route.
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function provider_get_route() {
		return [
			'Uses the name when no rest base is set' => [
				'name'      => 'my-post-type',
				'rest_base' => '',
				'expected'  => 'my-post-type',
			],
			'Uses the rest base when it is set' => [
				'name'      => 'my-post-type',
				'rest_base' => 'my-rest-base',
				'expected'  => 'my-rest-base',
			],
			'Strips a leading slash from the name' => [
				'name'      => '/my-post-type',
				'rest_base' => '',
				'expected'  => 'my-post-type',
			],
			'Strips multiple leading slashes from the rest base' => [
				'name'      => 'my-post-type',
				'rest_base' => '///my-rest-base',
				'expected'  => 'my-rest-base',
			],
		];
	}
}
