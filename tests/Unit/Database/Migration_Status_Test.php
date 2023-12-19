<?php

namespace Yoast\WP\SEO\Tests\Unit\Database;

use Brain\Monkey;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Migration_Runner_Test.
 *
 * @group db-migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Migration_Status
 * @covers \Yoast\WP\SEO\Config\Migration_Status
 */
final class Migration_Status_Test extends TestCase {

	/**
	 * Tests whether the migration is run when the migration option key exists.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_run_migration() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '0.9' ] );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * Tests whether the migration is run when the migration option key exists.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_run_migration_with_custom_version() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );

		$instance = new Migration_Status();

		$this->assertFalse( $instance->should_run_migration( 'test', '0.9' ) );
	}

	/**
	 * Tests whether the migration is run when the migration option key doesn't exist.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_run_migration_without_option() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( false );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * Tests whether the migration is run when the migration option key has a lock.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_run_migration_with_old_lock() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn(
				[
					'version' => '1.0',
					'lock'    => \strtotime( '-20 minutes' ),
				]
			);

		$instance = new Migration_Status();

		$this->assertTrue( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * Tests that the migration doesn't run.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_not_run_migration() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => \WPSEO_VERSION ] );

		$instance = new Migration_Status();

		$this->assertFalse( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * Tests that the migration does not run because of a lock.
	 *
	 * @covers ::should_run_migration
	 *
	 * @return void
	 */
	public function test_should_not_run_migration_with_lock() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn(
				[
					'version' => '1.0',
					'lock'    => \strtotime( 'now' ),
				]
			);

		$instance = new Migration_Status();

		$this->assertFalse( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * Tests the is version check.
	 *
	 * @covers ::is_version
	 *
	 * @return void
	 */
	public function test_is_version() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->is_version( 'test', '1.0' ) );
	}

	/**
	 * Tests the default case of the version comparison.
	 *
	 * @covers ::is_version
	 *
	 * @return void
	 */
	public function test_is_version_default() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => \WPSEO_VERSION ] );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->is_version( 'test' ) );
	}

	/**
	 * Tests comparison of the version with having the version lower than the saved on.
	 *
	 * @covers ::is_version
	 *
	 * @return void
	 */
	public function test_is_version_lower() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '2.0' ] );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->is_version( 'test', '1.0' ) );
	}

	/**
	 * Tests the comparison of a version, with having a higher version.
	 *
	 * @covers ::is_version
	 *
	 * @return void
	 */
	public function test_is_version_higher() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );

		$instance = new Migration_Status();

		$this->assertFalse( $instance->is_version( 'test', '2.0' ) );
	}

	/**
	 * Tests the comparison agains a version, with having the saved version value empty.
	 *
	 * @covers ::is_version
	 *
	 * @return void
	 */
	public function test_is_version_empty() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( false );

		$instance = new Migration_Status();

		$this->assertFalse( $instance->is_version( 'test', '2.0' ) );
	}

	/**
	 * Tests getting the set error.
	 *
	 * @covers ::get_error
	 *
	 * @return void
	 */
	public function test_get_error() {
		$error = [
			'message' => 'Something went wrong',
			'time'    => \strtotime( 'now' ),
			'version' => '2.0',
		];

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn(
				[
					'version' => '1.0',
					'error'   => $error,
				]
			);

		$instance = new Migration_Status();

		$this->assertSame( $error, $instance->get_error( 'test' ) );
	}

	/**
	 * Tests the retrieval of an error which isn't set.
	 *
	 * @covers ::get_error
	 *
	 * @return void
	 */
	public function test_get_error_with_no_error() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );

		$instance = new Migration_Status();

		$this->assertFalse( $instance->get_error( 'test' ) );
	}

	/**
	 * Tests setting the error.
	 *
	 * @covers ::set_error
	 *
	 * @return void
	 */
	public function test_set_error() {
		$error_message   = 'Something went wrong';
		$expected_option = [
			'version' => '1.0',
			'error'   => [
				'message' => $error_message,
				'time'    => \strtotime( 'now' ),
				'version' => \WPSEO_VERSION,
			],
		];

		Monkey\Functions\expect( 'get_current_blog_id' )->twice()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );
		Monkey\Functions\expect( 'update_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test', $expected_option )
			->once()
			->andReturn( true );

		$instance = new Migration_Status();

		$instance->set_error( 'test', $error_message );
	}

	/**
	 * Tests setting the error.
	 *
	 * @covers ::set_error
	 *
	 * @return void
	 */
	public function test_set_error_custom_version() {
		$error_message   = 'Something went wrong';
		$expected_option = [
			'version' => '1.0',
			'error'   => [
				'message' => $error_message,
				'time'    => \strtotime( 'now' ),
				'version' => '1.9',
			],
		];

		Monkey\Functions\expect( 'get_current_blog_id' )->twice()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );
		Monkey\Functions\expect( 'update_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test', $expected_option )
			->once()
			->andReturn( true );

		$instance = new Migration_Status();

		$instance->set_error( 'test', $error_message, '1.9' );
	}

	/**
	 * Tests the success status setting.
	 *
	 * @covers ::set_success
	 *
	 * @return void
	 */
	public function test_set_success() {
		$expected_option = [ 'version' => \WPSEO_VERSION ];

		Monkey\Functions\expect( 'get_current_blog_id' )->twice()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );
		Monkey\Functions\expect( 'update_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test', $expected_option )
			->once()
			->andReturn( true );

		$instance = new Migration_Status();

		$instance->set_success( 'test' );
	}

	/**
	 * Tests the success status setting.
	 *
	 * @covers ::set_success
	 *
	 * @return void
	 */
	public function test_set_success_custom_version() {
		$expected_option = [ 'version' => '1.9' ];

		Monkey\Functions\expect( 'get_current_blog_id' )->twice()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );
		Monkey\Functions\expect( 'update_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test', $expected_option )
			->once()
			->andReturn( true );

		$instance = new Migration_Status();

		$instance->set_success( 'test', '1.9' );
	}

	/**
	 * Tests the locking of a migration.
	 *
	 * @covers ::lock_migration
	 *
	 * @return void
	 */
	public function test_lock_migration() {
		$expected_option = [
			'version' => '1.0',
			'lock'    => \strtotime( 'now' ),
		];

		Monkey\Functions\expect( 'get_current_blog_id' )->twice()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );
		Monkey\Functions\expect( 'update_option' )
			->with( Migration_Status::MIGRATION_OPTION_KEY . 'test', $expected_option )
			->once()
			->andReturn( true );

		$instance = new Migration_Status();

		$instance->lock_migration( 'test' );
	}
}
