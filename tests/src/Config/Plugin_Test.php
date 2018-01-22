<?php

namespace Yoast\Tests\Config;

use Yoast\Tests\Doubles\Plugin_Double;

/**
 * Class Plugin_Test
 *
 * @group   yoastmeta
 *
 * @package Yoast\Tests\Config
 */
class Plugin_Test extends \WPSEO_UnitTestCase {
	/**
	 * Tests registering hooks.
	 */
	public function test_add_integration() {
		$instance = new Plugin_Double( $this->get_dependecy_management_mock(), $this->get_database_migration_mock() );

		$integration = $this->getMockBuilder( '\Yoast\YoastSEO\WordPress\Integration' )
							->getMock();

		$instance->add_integration( $integration );

		$this->assertContains( $integration, $instance->get_integrations() );
	}

	public function test_default_dependency_management() {
		$instance = new Plugin_Double( null, $this->get_database_migration_mock() );

		$this->assertInstanceOf( '\Yoast\YoastSEO\Config\Dependency_Management', $instance->get_dependency_management() );
	}

	public function test_default_database_migration() {
		$instance = new Plugin_Double( null, null );

		$this->assertInstanceOf( '\Yoast\YoastSEO\Config\Database_Migration', $instance->get_database_migration() );
	}

	protected function get_dependecy_management_mock() {
		return $this->getMockBuilder( '\Yoast\YoastSEO\Config\Dependency_Management' )
					->setMethods( array( 'initialize' ) )
					->getMock();
	}

	protected function get_database_migration_mock() {
		return $this->getMockBuilder( '\Yoast\YoastSEO\Config\Database_Migration' )
					->setMethods( array( 'initialize' ) )
					->setConstructorArgs( array( null, $this->get_dependecy_management_mock() ) )
					->getMock();
	}
}
