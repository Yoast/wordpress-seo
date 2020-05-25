<?php

namespace Yoast\WP\SEO\Tests\Database;

use Brain\Monkey;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Migration_Runner_Test.
 *
 * @group db-migrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Migration_Status
 * @covers ::<!public>
 */
class Migration_Status_Test extends TestCase {

	/**
	 * @covers ::should_run_migration
	 */
	public function test_should_run_migration() {
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->with( Migration_Status::MIGRATION_OPTION_KEY . 'test' )
			->once()
			->andReturn( [ 'version' => '1.0' ] );

		$instance = new Migration_Status();

		$this->assertTrue( $instance->should_run_migration( 'test' ) );
	}

	/**
	 * @covers ::should_run_migration
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
	 * @covers ::should_run_migration
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
	 * @covers ::should_run_migration
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
	 * @covers ::should_run_migration
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
	 * @covers ::is_version
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
	 * @covers ::is_version
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
	 * @covers ::is_version
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
	 * @covers ::is_version
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
	 * @covers ::is_version
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
	 * @covers ::get_error
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
	 * @covers ::get_error
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
	 * @covers ::set_error
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
	 * @covers ::set_success
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
	 * @covers ::lock_migration
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
