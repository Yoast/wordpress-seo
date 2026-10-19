<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Access_Checker;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_Access_Checker class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Term_Access_Checker
 */
final class Term_Access_Checker_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Term_Access_Checker
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

		$this->instance = new Term_Access_Checker();
	}

	/**
	 * Tests that ensure_can_edit passes for an editable term.
	 *
	 * @covers ::ensure_can_edit
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_editable() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_term', 7 )
			->andReturn( true );

		$this->assertTrue( $this->instance->ensure_can_edit( 7 ) );
	}

	/**
	 * Tests that ensure_can_edit refuses a term the user may not edit.
	 *
	 * @covers ::ensure_can_edit
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_forbidden() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_term', 7 )
			->andReturn( false );

		// WP_Error is doubled as an empty class in unit context, so only the type is asserted.
		$this->assertInstanceOf( WP_Error::class, $this->instance->ensure_can_edit( 7 ) );
	}
}
