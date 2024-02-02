<?php

namespace Yoast\WP\SEO\Tests\Unit\Database;

use Exception;
use Mockery;
use wpdb;
use Yoast\WP\Lib\Migrations\Adapter;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Initializers\Migration_Runner;
use Yoast\WP\SEO\Loader;
use Yoast\WP\SEO\Tests\Unit\Doubles\Database\Migration_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Migration_Runner_Test.
 *
 * @group db-migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Migration_Runner
 * @covers \Yoast\WP\SEO\Initializers\Migration_Runner
 */
final class Migration_Runner_Test extends TestCase {

	/**
	 * Setup the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		$wpdb = $this->get_wpdb_mock();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[],
			Migration_Runner::get_conditionals()
		);
	}

	/**
	 * Tests that initialize runs migrations.
	 *
	 * @covers ::initialize
	 * @covers ::run_free_migrations
	 *
	 * @return void
	 */
	public function test_initialize() {
		$instance = Mockery::mock( Migration_Runner::class )->makePartial();
		$instance->expects( 'run_migrations' )->once()->with( 'free' );

		$instance->initialize();

		$this->assertNotFalse( \has_action( '_yoast_run_migrations', [ $instance, 'run_free_migrations' ] ) );
	}

	/**
	 * Tests the initializing when everything goes as planned.
	 *
	 * @covers ::run_migrations
	 *
	 * @return void
	 */
	public function test_migration_success() {
		$status_mock  = Mockery::mock( Migration_Status::class );
		$loader_mock  = Mockery::mock( Loader::class );
		$adapter_mock = Mockery::mock( Adapter::class );

		$status_mock->expects( 'should_run_migration' )->once()->with( 'test', \WPSEO_VERSION )->andReturn( true );
		$status_mock->expects( 'lock_migration' )->once()->with( 'test' )->andReturn( true );
		$status_mock->expects( 'set_success' )->once()->with( 'test', \WPSEO_VERSION );
		$adapter_mock->expects( 'create_schema_version_table' )->once();
		$adapter_mock->expects( 'get_migrated_versions' )->once()->andReturn( [] );
		$adapter_mock->expects( 'start_transaction' )->once();
		$adapter_mock->expects( 'add_version' )->once()->with( 'version' );
		$adapter_mock->expects( 'commit_transaction' )->once();
		$loader_mock->expects( 'get_migrations' )->once()->with( 'test' )->andReturn( [ 'version' => Migration_Double::class ] );

		$instance = new Migration_Runner( $status_mock, $loader_mock, $adapter_mock );

		Migration_Double::$was_run      = false;
		Migration_Double::$should_error = false;

		$this->assertTrue( $instance->run_migrations( 'test' ) );
		$this->assertTrue( Migration_Double::$was_run );
	}

	/**
	 * Tests the initializing when the migration should not run.
	 *
	 * @covers ::run_migrations
	 *
	 * @return void
	 */
	public function test_migration_should_not_run() {
		$status_mock  = Mockery::mock( Migration_Status::class );
		$loader_mock  = Mockery::mock( Loader::class );
		$adapter_mock = Mockery::mock( Adapter::class );

		$status_mock->expects( 'should_run_migration' )->once()->with( 'test', \WPSEO_VERSION )->andReturn( false );

		$instance = new Migration_Runner( $status_mock, $loader_mock, $adapter_mock );

		$this->assertTrue( $instance->run_migrations( 'test' ) );
	}

	/**
	 * Tests the initializing when the migration is locked.
	 *
	 * @covers ::run_migrations
	 *
	 * @return void
	 */
	public function test_migration_locked() {
		$status_mock  = Mockery::mock( Migration_Status::class );
		$loader_mock  = Mockery::mock( Loader::class );
		$adapter_mock = Mockery::mock( Adapter::class );

		$status_mock->expects( 'should_run_migration' )->once()->with( 'test', \WPSEO_VERSION )->andReturn( true );
		$status_mock->expects( 'lock_migration' )->once()->with( 'test' )->andReturn( false );

		$instance = new Migration_Runner( $status_mock, $loader_mock, $adapter_mock );

		$this->assertFalse( $instance->run_migrations( 'test' ) );
	}

	/**
	 * Tests the initializing when no migrations are present.
	 *
	 * @covers ::run_migrations
	 *
	 * @return void
	 */
	public function test_migration_with_no_migrations() {
		$status_mock  = Mockery::mock( Migration_Status::class );
		$loader_mock  = Mockery::mock( Loader::class );
		$adapter_mock = Mockery::mock( Adapter::class );

		$status_mock->expects( 'should_run_migration' )->once()->with( 'test', \WPSEO_VERSION )->andReturn( true );
		$status_mock->expects( 'lock_migration' )->once()->with( 'test' )->andReturn( true );
		$status_mock->expects( 'set_error' )->once()->with( 'test', 'Could not perform test migrations. No migrations found.', \WPSEO_VERSION );
		$loader_mock->expects( 'get_migrations' )->once()->with( 'test' )->andReturn( false );

		$instance = new Migration_Runner( $status_mock, $loader_mock, $adapter_mock );

		$this->assertFalse( $instance->run_migrations( 'test' ) );
	}

	/**
	 * Tests the initializing when everything goes wrong.
	 *
	 * @covers ::run_migrations
	 *
	 * @return void
	 */
	public function test_migration_error() {
		$this->expectException( Exception::class );
		$this->expectExceptionMessage( 'Migration error' );

		$status_mock  = Mockery::mock( Migration_Status::class );
		$loader_mock  = Mockery::mock( Loader::class );
		$adapter_mock = Mockery::mock( Adapter::class );

		$status_mock->expects( 'should_run_migration' )->once()->with( 'test', \WPSEO_VERSION )->andReturn( true );
		$status_mock->expects( 'lock_migration' )->once()->with( 'test' )->andReturn( true );
		$status_mock->expects( 'set_error' )->once()->with( 'test', Migration_Double::class . ' - Migration error', \WPSEO_VERSION );
		$adapter_mock->expects( 'create_schema_version_table' )->once();
		$adapter_mock->expects( 'get_migrated_versions' )->once()->andReturn( [] );
		$adapter_mock->expects( 'start_transaction' )->once();
		$adapter_mock->expects( 'rollback_transaction' )->once();
		$loader_mock->expects( 'get_migrations' )->once()->with( 'test' )->andReturn( [ 'version' => Migration_Double::class ] );

		$instance = new Migration_Runner( $status_mock, $loader_mock, $adapter_mock );

		Migration_Double::$was_run      = false;
		Migration_Double::$should_error = true;

		$this->assertFalse( $instance->run_migrations( 'test' ) );
	}

	/**
	 * Returns a wpdb mock.
	 *
	 * @return wpdb The wpdb mock.
	 */
	protected function get_wpdb_mock() {
		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'test';

		return $wpdb;
	}
}
