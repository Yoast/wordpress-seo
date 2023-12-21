<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Capabilities;

use Brain\Monkey;
use Mockery;
use WP_Roles;
use WPSEO_Capability_Utils;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests WPSEO_Admin_Asset.
 *
 * @coversDefaultClass \WPSEO_Capability_Utils
 *
 * @group capabilities
 */
final class Capabilities_Utils_Test extends TestCase {

	/**
	 * The roles object.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface
	 */
	protected $roles;

	/**
	 * Does the setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->roles = Mockery::mock( WP_Roles::class );

		$this->roles
			->expects( 'get_names' )
			->once()
			->andReturn(
				[
					'administrator' => 'Administrator',
				]
			);

		Monkey\Functions\expect( 'wp_roles' )
			->once()
			->andReturn( $this->roles );
	}

	/**
	 * Test happy path of the method.
	 *
	 * @covers ::get_applicable_users
	 *
	 * @return void
	 */
	public function test_get_applicable_users() {
		$this->roles
			->expects( 'get_role' )
			->once()
			->with( 'administrator' )
			->andReturn(
				(object) [
					'capabilities' => [
						'wpseo_manage_options' => true,
					],
				]
			);

		Monkey\Functions\expect( 'get_users' )
			->once()
			->with( [ 'role__in' => [ 'administrator' ] ] )
			->andReturn( [ 'array with user objects' ] );

		$expected = [ 'array with user objects' ];
		$actual   = WPSEO_Capability_Utils::get_applicable_users( 'wpseo_manage_options' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Test the method with no found roles.
	 *
	 * @covers ::get_applicable_users
	 *
	 * @return void
	 */
	public function test_get_applicable_users_no_roles_found() {
		$this->roles
			->expects( 'get_role' )
			->once()
			->with( 'administrator' )
			->andReturnNull();

		$expected = [];
		$actual   = WPSEO_Capability_Utils::get_applicable_users( 'wpseo_manage_options' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the retrieving of the roles without having the capability.
	 *
	 * @dataProvider get_applicable_roles_provider
	 * @covers       ::get_applicable_roles
	 *
	 * @param object|null $role     The role data that is returned.
	 * @param array       $expected The expected value.
	 * @param string      $message  The message to show when test fails.
	 *
	 * @return void
	 */
	public function test_get_applicable_roles( $role, $expected, $message ) {
		$this->roles
			->expects( 'get_role' )
			->once()
			->with( 'administrator' )
			->andReturn( $role );

		$actual = WPSEO_Capability_Utils::get_applicable_roles( 'wpseo_manage_options' );

		$this->assertEquals( $expected, $actual, $message );
	}

	/**
	 * Test data provider.
	 *
	 * @return array
	 */
	public static function get_applicable_roles_provider() {
		return [
			[
				'role'     => (object) [
					'capabilities' => [
						'wpseo_manage_options' => true,
					],
				],
				'expected' => [ 'administrator' ],
				'message'  => 'Role with capability (Happy Path)',
			],
			[
				'role'     => (object) [
					'capabilities' => [
						'wpseo_not_manage_options' => true,
					],
				],
				'expected' => [],
				'message'  => 'Role without the capability',
			],
			[
				'role'     => null,
				'expected' => [],
				'message'  => 'Role not found',
			],
		];
	}
}
