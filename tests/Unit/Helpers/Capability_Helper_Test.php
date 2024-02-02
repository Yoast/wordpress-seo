<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use WP_Roles;
use WP_User;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Capability_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Capability_Helper
 */
final class Capability_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Mockery\Mock|Capability_Helper
	 */
	private $instance;

	/**
	 * Set up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Capability_Helper();
	}

	/**
	 * Tests the get_applicable_users method.
	 *
	 * @covers ::get_applicable_users
	 * @covers ::get_applicable_roles
	 *
	 * @return void
	 */
	public function test_get_applicable_users() {
		$roles = [
			'administrator' => 'Administrator',
			'author'        => 'Author',
		];

		$capabilities = [
			'administrator' => [
				'wpseo_manage' => true,
				'edit_users'   => true,
				'edit_posts'   => true,
			],
			'author'        => [
				'wpseo_manage' => false,
				'edit_users'   => false,
				'edit_posts'   => true,
			],
		];

		Monkey\Functions\expect( 'wp_roles' )
			->andReturn( $this->mock_wp_roles( $roles, $capabilities ) );

		$applicable_users = [
			Mockery::mock( WP_User::class ),
		];

		Monkey\Functions\expect( 'get_users' )
			->with( [ 'role__in' => [ 'administrator' ] ] )
			->andReturn( $applicable_users );

		$actual = $this->instance->get_applicable_users( 'wpseo_manage' );

		$this->assertSame( $applicable_users, $actual );
	}

	/**
	 * Tests that the get_applicable_users method returns the empty array
	 * when no roles with the given capability exist.
	 *
	 * @covers ::get_applicable_users
	 * @covers ::get_applicable_roles
	 *
	 * @return void
	 */
	public function test_get_applicable_users_no_applicable_roles() {
		$roles = [
			'administrator' => 'Administrator',
			'author'        => 'Author',
		];

		$capabilities = [
			'administrator' => [
				'wpseo_manage' => false,
				'edit_users'   => true,
				'edit_posts'   => true,
			],
			'author'        => [
				'wpseo_manage' => false,
				'edit_users'   => false,
				'edit_posts'   => true,
			],
		];

		Monkey\Functions\expect( 'wp_roles' )
			->andReturn( $this->mock_wp_roles( $roles, $capabilities ) );

		$this->assertEmpty( $this->instance->get_applicable_users( 'wpseo_manage' ) );
	}

	/**
	 * Tests the get_applicable_roles method.
	 *
	 * @covers ::get_applicable_roles
	 *
	 * @return void
	 */
	public function test_get_applicable_roles() {
		$roles = [
			'administrator' => 'Administrator',
			'author'        => 'Author',
		];

		$capabilities = [
			'administrator' => [
				'wpseo_manage' => true,
				'edit_users'   => true,
				'edit_posts'   => true,
			],
			'author'        => [
				'wpseo_manage' => false,
				'edit_users'   => false,
				'edit_posts'   => true,
			],
		];

		Monkey\Functions\expect( 'wp_roles' )
			->andReturn( $this->mock_wp_roles( $roles, $capabilities ) );

		$actual = $this->instance->get_applicable_roles( 'wpseo_manage' );

		$this->assertSame( [ 'administrator' ], $actual );
	}

	/**
	 * Tests that the get_applicable_roles method does not error
	 * when a role does not exist.
	 *
	 * @covers ::get_applicable_roles
	 *
	 * @return void
	 */
	public function test_get_applicable_roles_no_role() {
		$roles = [
			'administrator' => 'Administrator',
			'author'        => 'Author',
		];

		$capabilities = [
			'administrator' => [
				'wpseo_manage' => true,
				'edit_users'   => true,
				'edit_posts'   => true,
			],
			'author'        => [
				'wpseo_manage' => false,
				'edit_users'   => false,
				'edit_posts'   => true,
			],
		];

		$wp_roles = Mockery::mock( WP_Roles::class );
		$wp_roles->expects( 'get_names' )
			->andReturn( $roles );

		$wp_roles->expects( 'get_role' )
			->with( 'administrator' )
			->andReturn(
				(object) [
					'name'         => 'administrator',
					'capabilities' => $capabilities['administrator'],
				]
			);

		$wp_roles->expects( 'get_role' )
			->with( 'author' )
			->andReturn( null );

		Monkey\Functions\expect( 'wp_roles' )
			->andReturn( $wp_roles );

		$actual = $this->instance->get_applicable_roles( 'wpseo_manage' );

		$this->assertSame( [ 'administrator' ], $actual );
	}

	/**
	 * Tests that the current_user_can method can check if
	 * the current user has the `wp_seo_manage` capability.
	 *
	 * @covers ::current_user_can
	 * @covers ::has_any
	 *
	 * @return void
	 */
	public function test_current_user_can_wpseo_manage_options() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( $this->instance->current_user_can( 'wpseo_manage_options' ) );
	}

	/**
	 * Tests that the current_user_can method can check if
	 * the current user has a capability, other than `wp_seo_manage`.
	 *
	 * @covers ::current_user_can
	 * @covers ::has_any
	 *
	 * @return void
	 */
	public function test_current_user_can_other_capability() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->andReturn( true );

		$this->assertTrue( $this->instance->current_user_can( 'edit_posts' ) );
	}

	/**
	 * Tests that the current_user_can method returns `false`
	 * when the current user does not have the given capability
	 * plus the `wp_seo_manage` capability.
	 *
	 * @covers ::current_user_can
	 * @covers ::has_any
	 *
	 * @return void
	 */
	public function test_current_user_can_returns_false_when_user_has_no_appropriate_capability() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->andReturn( false );

		$this->assertFalse( $this->instance->current_user_can( 'edit_posts' ) );
	}

	/**
	 * Mocks a WP_Roles object.
	 *
	 * @param array $roles        An array mapping roles to their names.
	 * @param array $capabilities An array mapping roles to their capabilities.
	 *
	 * @return Mockery\MockInterface|WP_Roles The mocked WP_Roles object.
	 */
	private function mock_wp_roles( $roles, $capabilities ) {
		$wp_roles = Mockery::mock( WP_Roles::class );
		$wp_roles->expects( 'get_names' )
			->andReturn( $roles );

		foreach ( $roles as $id => $name ) {
			$wp_roles->expects( 'get_role' )
				->with( $id )
				->andReturn(
					(object) [
						'name'         => $id,
						'capabilities' => $capabilities[ $id ],
					]
				);
		}

		return $wp_roles;
	}
}
