<?php

namespace Yoast\Tests\Config;

/**
 * Class Upgrade_Test.
 *
 * @package Yoast\Tests\Config
 */
class Upgrade_Test extends \Yoast\Tests\TestCase {

	public function test_do_upgrade() {
		$migration = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Database_Migration' )
			->setMethods( array( 'run_migrations' ) )
			->disableOriginalConstructor()
			->getMock();

		$migration->expects( $this->once() )
			->method( 'run_migrations' );

		$instance = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Upgrade' )
			->setMethods( null )
			->setConstructorArgs( array( $migration ) )
			->getMock();

		$instance->do_upgrade( 'version' );
	}
}
