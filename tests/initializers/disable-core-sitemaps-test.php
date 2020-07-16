<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\SEO\Tests\Initializers;

use Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps
 *
 * @group integrations
 */
class Disable_Core_Sitemaps_Test extends TestCase {
	/**
	 * Represents the instance we are testing.
	 *
	 * @var Disable_Core_Sitemaps
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Disable_Core_Sitemaps();
	}

	/**
	 * Tests the situation when primary term id isn't to the category id, the id should get updated.
	 *
	 * @covers ::register_hooks
	 */
	public function test_initialize() {
		$this->instance->initialize();

		$this->assertTrue( \has_filter( 'wp_sitemaps_enabled', '__return_false' ), 'Does not have expected wp_sitemaps_is_enabled filter' );
	}

}
