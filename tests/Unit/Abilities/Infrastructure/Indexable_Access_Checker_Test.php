<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Indexable_Access_Checker class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker
 */
final class Indexable_Access_Checker_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Indexable_Access_Checker
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->instance = new Indexable_Access_Checker();
	}

	/**
	 * Data provider for the object types and the capability each is checked against.
	 *
	 * @return array<string, array<string>> The object types and their capabilities.
	 */
	public static function provide_object_types(): array {
		return [
			'term' => [ 'term', 'edit_term' ],
			'post' => [ 'post', 'edit_post' ],
		];
	}

	/**
	 * Tests that ensure_can_edit passes for an object the user may edit.
	 *
	 * @covers ::ensure_can_edit
	 *
	 * @dataProvider provide_object_types
	 *
	 * @param string $object_type The object type of the indexable.
	 * @param string $capability  The capability the object is checked against.
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_editable( string $object_type, string $capability ) {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( $capability, 7 )
			->andReturn( true );

		$this->assertTrue( $this->instance->ensure_can_edit( $this->make_indexable( $object_type ) ) );
	}

	/**
	 * Tests that ensure_can_edit refuses an object the user may not edit.
	 *
	 * @covers ::ensure_can_edit
	 *
	 * @dataProvider provide_object_types
	 *
	 * @param string $object_type The object type of the indexable.
	 * @param string $capability  The capability the object is checked against.
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_forbidden( string $object_type, string $capability ) {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( $capability, 7 )
			->andReturn( false );

		// WP_Error is doubled as an empty class in unit context, so only the type is asserted.
		$this->assertInstanceOf( WP_Error::class, $this->instance->ensure_can_edit( $this->make_indexable( $object_type ) ) );
	}

	/**
	 * Tests that ensure_can_edit passes for a user the current user may edit, holding edit_users.
	 *
	 * @covers ::ensure_can_edit
	 * @covers ::ensure_can_edit_user
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_editable_user() {
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'edit_users' )->andReturn( true );
		Monkey\Functions\expect( 'current_user_can' )->once()->with( 'edit_user', 7 )->andReturn( true );

		$this->assertTrue( $this->instance->ensure_can_edit( $this->make_indexable( 'user' ) ) );
	}

	/**
	 * Tests that ensure_can_edit refuses a user the current user may not edit.
	 *
	 * @covers ::ensure_can_edit
	 * @covers ::ensure_can_edit_user
	 *
	 * @dataProvider provide_user_capabilities
	 *
	 * @param bool $can_edit_users Whether the current user has edit_users.
	 * @param bool $can_edit_user  Whether the current user may edit the given user.
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_forbidden_user( bool $can_edit_users, bool $can_edit_user ) {
		Monkey\Functions\when( 'current_user_can' )->alias(
			static function ( $capability ) use ( $can_edit_users, $can_edit_user ) {
				return ( $capability === 'edit_users' ) ? $can_edit_users : $can_edit_user;
			},
		);

		// WP_Error is doubled as an empty class in unit context, so only the type is asserted.
		$this->assertInstanceOf( WP_Error::class, $this->instance->ensure_can_edit( $this->make_indexable( 'user' ) ) );
	}

	/**
	 * Data provider for test_ensure_can_edit_forbidden_user.
	 *
	 * @return array<string, array<string, bool>> The capabilities of the current user.
	 */
	public static function provide_user_capabilities(): array {
		return [
			// Like an author editing their own profile, which does not show the Yoast SEO fields.
			'own user without edit_users' => [
				'can_edit_users' => false,
				'can_edit_user'  => true,
			],
			'other user not editable'     => [
				'can_edit_users' => true,
				'can_edit_user'  => false,
			],
		];
	}

	/**
	 * Builds an indexable of the given object type, for the object with ID 7.
	 *
	 * @param string $object_type The object type.
	 *
	 * @return Indexable_Mock The indexable.
	 */
	private function make_indexable( string $object_type ): Indexable_Mock {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = $object_type;
		$indexable->object_id   = 7;

		return $indexable;
	}
}
