<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Updates;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Post_Access_Checker;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Post_Access_Checker.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Post_Access_Checker
 */
final class Post_Access_Checker_Test extends TestCase {

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Holds the instance.
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

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Post_Access_Checker( $this->post_type_helper );
	}

	/**
	 * Tests exists returns whether the post can be retrieved.
	 *
	 * @covers ::__construct
	 * @covers ::exists
	 *
	 * @return void
	 */
	public function test_exists() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 123 )
			->andReturn( (object) [ 'ID' => 123 ] );

		$this->assertTrue( $this->instance->exists( 123 ) );
	}

	/**
	 * Tests exists returns false for a post that cannot be retrieved.
	 *
	 * @covers ::exists
	 *
	 * @return void
	 */
	public function test_exists_not_found() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 123 )
			->andReturnNull();

		$this->assertFalse( $this->instance->exists( 123 ) );
	}

	/**
	 * Tests is_supported_type checks the post type against the indexable post types.
	 *
	 * @covers ::is_supported_type
	 *
	 * @return void
	 */
	public function test_is_supported_type() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 123 )
			->andReturn( (object) [ 'post_type' => 'post' ] );

		$this->post_type_helper->expects( 'is_of_indexable_post_type' )
			->with( 'post' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_supported_type( 123 ) );
	}

	/**
	 * Tests is_supported_type returns false for a post that cannot be retrieved.
	 *
	 * @covers ::is_supported_type
	 *
	 * @return void
	 */
	public function test_is_supported_type_not_found() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 123 )
			->andReturnNull();

		$this->assertFalse( $this->instance->is_supported_type( 123 ) );
	}

	/**
	 * Tests can_edit checks the edit_post capability for the post.
	 *
	 * @covers ::can_edit
	 *
	 * @return void
	 */
	public function test_can_edit() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 123 )
			->andReturnTrue();

		$this->assertTrue( $this->instance->can_edit( 123 ) );
	}
}
