<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use stdClass;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Type_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Post_Type_Helper
 */
final class Post_Type_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Post_Type_Helper
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$options_helper = Mockery::mock( Options_Helper::class );
		$this->instance = new Post_Type_Helper( $options_helper );
	}

	/**
	 * Checks if a post type is marked as indexable if it is marked as such.
	 *
	 * @covers ::is_post_type_archive_indexable
	 * @covers ::get_indexable_post_archives
	 *
	 * @dataProvider post_type_archive_provider
	 *
	 * @param stdClass $return_object      The object returned by the get_post_type_object function.
	 * @param array    $post_types         A list of post_types.
	 * @param string   $post_type_to_check The post type to check.
	 * @param bool     $expected_result    The expected result if the archive is indexable.
	 *
	 * @return void
	 */
	public function test_is_post_type_archive_indexable( $return_object, $post_types, $post_type_to_check, $expected_result ): void {

		Monkey\Functions\expect( 'get_post_types' )
			->andReturn( $post_types );
		Monkey\Functions\expect( 'post_type_exists' )
			->andReturnTrue();
		Monkey\Functions\expect( 'get_post_type_object' )
			->andReturn( $return_object );

		$this->assertEquals( $expected_result, $this->instance->is_post_type_archive_indexable( $post_type_to_check ) );
	}

	/**
	 * Data provider for the `test_is_post_type_archive_indexable()` test.
	 *
	 * @return array
	 */
	public static function post_type_archive_provider() {
		$book              = new stdClass();
		$book->name        = 'books';
		$book->has_archive = true;

		$book_no              = new stdClass();
		$book_no->name        = 'books';
		$book_no->has_archive = false;

		return [
			[ $book, [ 'books' ], 'books', true ],
			[ $book, [ 'books' ], 'not_books', false ],
			[ $book_no, [ 'books' ], 'books', false ],
		];
	}

	/**
	 * Tests if a post type has an archive it is returned.
	 *
	 * @covers ::get_indexable_post_archives
	 *
	 * @dataProvider post_type_archive_object_provider
	 *
	 * @param stdClass $return_object   The object returned by the get_post_type_object function.
	 * @param array    $post_types      A list of post_types.
	 * @param array    $expected_result The expected list of indexable post archives.
	 *
	 * @return void
	 */
	public function test_get_indexable_post_archives( $return_object, $post_types, $expected_result ): void {
		Monkey\Functions\expect( 'get_post_types' )
			->andReturn( $post_types );
		Monkey\Functions\expect( 'post_type_exists' )
			->andReturnTrue();
		Monkey\Functions\expect( 'get_post_type_object' )
			->andReturn( $return_object );
		$this->assertEquals( $expected_result, $this->instance->get_indexable_post_archives() );
	}

	/**
	 * Data provider for the `test_get_indexable_post_archives()` test.
	 *
	 * @return array
	 */
	public static function post_type_archive_object_provider() {
		$book              = new stdClass();
		$book->name        = 'books';
		$book->has_archive = true;

		$book_no              = new stdClass();
		$book_no->name        = 'books';
		$book_no->has_archive = false;

		return [
			[ $book, [ 'books' ], [ 'books' => $book ] ],
			[ $book_no, [ 'books' ], [] ],
		];
	}
}
