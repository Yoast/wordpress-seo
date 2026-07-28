<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Access_Checker;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_Access_Checker class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Post_Access_Checker
 */
final class Post_Access_Checker_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Post_Access_Checker
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

		$this->instance = new Post_Access_Checker();
	}

	/**
	 * Tests that ensure_can_edit passes for an editable post.
	 *
	 * @covers ::ensure_can_edit
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_editable() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 42 )
			->andReturn( true );

		$this->assertTrue( $this->instance->ensure_can_edit( 42 ) );
	}

	/**
	 * Tests that ensure_can_edit refuses a post the user may not edit with a 403 error.
	 *
	 * @covers ::ensure_can_edit
	 * @covers ::forbidden_error
	 *
	 * @return void
	 */
	public function test_ensure_can_edit_forbidden() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 42 )
			->andReturn( false );

		// WP_Error is doubled as an empty class in unit context, so only the type is asserted.
		$this->assertInstanceOf( WP_Error::class, $this->instance->ensure_can_edit( 42 ) );
	}

	/**
	 * Tests that filter_editable keeps only the posts the user may edit.
	 *
	 * @covers ::filter_editable
	 *
	 * @return void
	 */
	public function test_filter_editable() {
		$editable                = Mockery::mock( Indexable_Mock::class );
		$editable->object_id     = 1;
		$not_editable            = Mockery::mock( Indexable_Mock::class );
		$not_editable->object_id = 2;

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 1 )
			->andReturn( true );
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 2 )
			->andReturn( false );

		$this->assertSame( [ $editable ], $this->instance->filter_editable( [ $editable, $not_editable ] ) );
	}

	/**
	 * Tests that filter_editable returns an empty list untouched.
	 *
	 * @covers ::filter_editable
	 *
	 * @return void
	 */
	public function test_filter_editable_empty() {
		Monkey\Functions\expect( 'current_user_can' )->never();

		$this->assertSame( [], $this->instance->filter_editable( [] ) );
	}
}
