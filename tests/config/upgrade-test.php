<?php

namespace Yoast\WP\Free\Tests\Config;

use Yoast\WP\Free\Config\Upgrade;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Upgrade_Test.
 *
 * @package Yoast\Tests\Config
 */
class Upgrade_Test extends TestCase {

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

	public function test_action_hooked() {
		$migration = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Database_Migration' )
			->setMethods( null )
			->disableOriginalConstructor()
			->getMock();

		$upgrade = new Upgrade( $migration );
		$upgrade->register_hooks();

		$actual = \has_action( 'wpseo_run_upgrade', array( $upgrade, 'do_upgrade' ) );

		$this->assertNotFalse( $actual );
	}
}
