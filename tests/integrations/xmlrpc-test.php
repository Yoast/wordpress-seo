<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\SEO\Tests\Integrations;

use Yoast\WP\SEO\Integrations\XMLRPC;
use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;


/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\XMLRPC
 *
 * @group integrations
 */
class XMLRPC_Test extends TestCase {
	/**
	 * Represents the instance we are testing.
	 *
	 * @var XMLRPC
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new XMLRPC();
	}

	/**
	 * Tests whether we hook the noindex header as expected.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( \has_action( 'xmlrpc_methods', [ $this->instance, 'robots_header' ] ), 'Has expected noindex action' );
	}

}
