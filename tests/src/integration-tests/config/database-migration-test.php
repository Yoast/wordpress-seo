<?php

namespace Yoast\Tests\IntegrationTests\Config;

use Yoast\YoastSEO\Config\Database_Migration;

/**
 * Class Database_Migration_Test
 *
 * @group   db-migrations
 *
 * @package Yoast\Tests
 */
class Database_Migration_Test extends \PHPUnit_Framework_TestCase {
	/**
	 * Tests if the migrations are usable.
	 */
	public function test_is_usable() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Database_Migration' )
			->disableOriginalConstructor()
			->setMethods( null )
			->getMock();

		\set_transient( Database_Migration::MIGRATION_ERROR_TRANSIENT_KEY, Database_Migration::MIGRATION_STATE_SUCCESS );

		/**
		 * @var \Yoast\YoastSEO\Config\Database_Migration $instance
		 */
		$this->assertTrue( $instance->is_usable() );
	}

	/**
	 * Tests if the migrations are usable.
	 */
	public function test_is_not_usable() {
		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Database_Migration' )
			->disableOriginalConstructor()
			->setMethods( null )
			->getMock();

		\set_transient( Database_Migration::MIGRATION_ERROR_TRANSIENT_KEY, Database_Migration::MIGRATION_STATE_ERROR );

		/**
		 * @var \Yoast\YoastSEO\Config\Database_Migration $instance
		 */
		$this->assertFalse( $instance->is_usable() );
	}

}
