<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Helpers\Wordpress_Helper;

/**
 * Class WordPress_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Wordpress_Helper
 */
class Wordpress_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Wordpress_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Wordpress_Helper();
	}

	/**
	 * Tests retrieval of the global WordPress version
	 *
	 * @covers ::get_wordpress_version
	 */
	public function test_get_wordpress_version() {
		global $wp_version;
		self::assertEquals( $wp_version, $this->instance->get_wordpress_version() );
	}
}
