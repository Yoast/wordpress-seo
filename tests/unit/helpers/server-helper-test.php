<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Server_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Server_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Server_Helper
 * @covers             \Yoast\WP\SEO\Helpers\Server_Helper
 */
class Server_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Server_Helper
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Server_Helper();
	}

	/**
	 * Tests whether is_apache correctly returns if the site runs on apache.
	 *
	 * @covers ::is_apache
	 */
	public function test_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( $this->instance->is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( $this->instance->is_apache() );
	}

	/**
	 * Tests whether is_apache correctly returns if the site runs on nginx.
	 *
	 * @covers ::is_nginx
	 */
	public function test_is_nginx() {
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertTrue( $this->instance->is_nginx() );

		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertFalse( $this->instance->is_nginx() );
	}
}
