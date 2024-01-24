<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Yoast\WP\SEO\Integrations\XMLRPC;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class XMLRPC_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\XMLRPC
 *
 * @group integrations
 */
final class XMLRPC_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var XMLRPC
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new XMLRPC();
	}

	/**
	 * Tests whether we hook the noindex header as expected.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'xmlrpc_methods', [ $this->instance, 'robots_header' ] ), 'Has expected noindex action' );
	}
}
