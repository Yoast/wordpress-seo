<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use WP_Query;
use WP_Rewrite;
use Yoast\WP\SEO\Helpers\Settings_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;
use Yoast\WP\SEO\Wrappers\WP_Rewrite_Wrapper;

/**
 * Class Settings_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Settings_Helper
 */
class Settings_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Settings_Helper
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Settings_Helper();
	}

	/**
	 * Tests the get_route method.
	 *
	 * @covers ::get_route
	 *
	 * @dataProvider get_route_provider
	 *
	 * @param string $name      The name.
	 * @param array  $rewrite   The rewrite data.
	 * @param string $rest_base The rest base.
	 * @param string $expected  The expected route.
	 */
	public function test_get_route( $name, $rewrite, $rest_base, $expected ) {
		$this->assertEquals( $this->instance->get_route( $name, $rewrite, $rest_base ), $expected );
	}

	/**
	 * Data provider for tet_get_route.
	 *
	 * @covers ::get_route
	 *
	 * @return array
	 */
	public function get_route_provider() {
		return [
			[
				'name',
				[ 'slug' => 'slug' ],
				'rest_base',
				'rest_base',
			],
			[
				'name',
				[ 'slug' => 'slug' ],
				null,
				'slug',
			],
			[
				'name',
				null,
				null,
				'name',
			],
			[
				'name',
				null,
				'rest_base',
				'rest_base',
			],
		];
	}
}
