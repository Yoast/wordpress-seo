<?php

namespace Yoast\Tests\UnitTests\Config;

/**
 * Class Upgrade_Test.
 *
 * @package Yoast\Tests\UnitTests\Config
 */
class Upgrade_Test extends \PHPUnit_Framework_TestCase {

	public function test_do_upgrade() {
		$migration = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Database_Migration' )
			->setMethods( array( 'run_migrations' ) )
			->disableOriginalConstructor()
			->getMock();

		$migration->expects( $this->once() )
			->method( 'run_migrations' );

		$instance = $this
			->getMockBuilder( '\Yoast\YoastSEO\Config\Upgrade' )
			->setMethods( null )
			->setConstructorArgs( array( $migration ) )
			->getMock();

		$instance->do_upgrade( 'version' );
	}
}
