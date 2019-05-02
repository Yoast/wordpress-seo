<?php

namespace Yoast\Tests\IntegrationTests\Config;

use Yoast\WP\Free\Config\Upgrade;

/**
 * Class Upgrade_Test.
 *
 * @package Yoast\Tests\IntegrationTests\Config
 */
class Upgrade_Test extends \PHPUnit_Framework_TestCase {

	public function test_action_hooked() {
		$migration = $this
			->getMockBuilder( '\Yoast\WP\Free\Config\Database_Migration' )
			->setMethods( null )
			->disableOriginalConstructor()
			->getMock();

		$upgrade = new Upgrade( $migration );
		$upgrade->register_hooks();

		$actual = has_action( 'wpseo_run_upgrade', array( $upgrade, 'do_upgrade' ) );

		$this->assertEquals( 10, $actual );
	}
}
