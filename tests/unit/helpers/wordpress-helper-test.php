<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

// phpcs:disable WordPress.WP.CapitalPDangit.MisspelledClassName -- It is spelled like `Wordpress_Helper` because of Yoast's naming conventions for classes, which would otherwise break dependency injection in some cases.

use Yoast\WP\SEO\Helpers\Wordpress_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wordpress_Helper_Test.
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
