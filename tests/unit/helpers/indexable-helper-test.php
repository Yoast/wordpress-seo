<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_Helper
 *
 * @group helpers
 */
class Indexable_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Indexable_Helper
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Indexable_Helper();
	}

	/**
	 * Retrieves the permalink for a post indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_post_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		Monkey\Functions\expect( 'get_permalink' )
			->andReturn( 'https://example.org/permalink' );

		$this->assertEquals(
			'https://example.org/permalink',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for an attachment indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_attachment_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = 'attachment';

		Monkey\Functions\expect( 'wp_get_attachment_url' )
			->andReturn( 'https://example.org/attachment' );

		$this->assertEquals(
			'https://example.org/attachment',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a home page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_homepage_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'home-page';

		Monkey\Functions\expect( 'get_permalink' )
			->andReturn( 'https://example.org/homepage' );

		$this->assertEquals(
			'https://example.org/homepage',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $term )
			->andReturn( false );

		Monkey\Functions\expect( 'get_term_link' )
			->with( $term, 'category' )
			->andReturn( 'https://example.org/term' );

		$this->assertEquals(
			'https://example.org/term',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable and term not found.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable_term_not_found() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( null );


		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable with term being wp_error.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable_term_is_wp_error() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		Monkey\Functions\expect( 'is_wp_error' )
			->with( $term )
			->andReturn( true );

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_search_page_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'system-page';
		$indexable->object_sub_type = 'search-page';

		Monkey\Functions\expect( 'get_search_link' )
			->andReturn( 'https://example.org/search' );

		$this->assertEquals(
			'https://example.org/search',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_post_type_archive_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post-type-archive';
		$indexable->object_sub_type = 'post-type';

		Monkey\Functions\expect( 'get_post_type_archive_link' )
			->with( 'post-type' )
			->andReturn( 'https://example.org/post-type' );

		$this->assertEquals(
			'https://example.org/post-type',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_user_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'user';
		$indexable->object_id   = 1;

		Monkey\Functions\expect( 'get_author_posts_url' )
			->with( 1 )
			->andReturn( 'https://example.org/user/1' );

		$this->assertEquals(
			'https://example.org/user/1',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_unknown_type_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'unknown';

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Tests the get_page_type_for_indexable_provider function.
	 *
	 * @param int    $object_type        The object type.
	 * @param int    $object_sub_type    The object sub type.
	 * @param bool   $is_front_page      Whether or not the indexable is the front page.
	 * @param bool   $is_posts_page      Whether or not the indexable is the posts page.
	 * @param string $expected_page_type The expected page type.
	 *
	 * @covers ::get_page_type_for_indexable
	 * @dataProvider get_page_type_for_indexable_provider
	 */
	public function test_get_page_type_for_indexable( $object_type, $object_sub_type, $is_front_page, $is_posts_page, $expected_page_type ) {
		if ( $object_type === 'post' ) {
			Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'page_on_front' )
				->andReturn( ( $is_front_page ) ? 1 : 0 );

			if ( ! $is_front_page ) {
				Monkey\Functions\expect( 'get_option' )
					->once()
					->with( 'page_for_posts' )
					->andReturn( ( $is_posts_page ) ? 1 : 0 );
			}
		}

		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id       = 1;
		$indexable->object_type     = $object_type;
		$indexable->object_sub_type = $object_sub_type;

		$this->assertEquals( $expected_page_type, $this->instance->get_page_type_for_indexable( $indexable ) );
	}

	/**
	 * Data provider for the test_get_page_type_for_indexable_provider function.
	 *
	 * @return array The test data.
	 */
	public function get_page_type_for_indexable_provider() {
		return [
			[ 'post', 'page', true, false, 'Static_Home_Page' ],
			[ 'post', 'page', false, true, 'Static_Posts_Page' ],
			[ 'post', 'post', false, false, 'Post_Type' ],
			[ 'term', 'tag', false, false, 'Term_Archive' ],
			[ 'user', null, false, false, 'Author_Archive' ],
			[ 'home-page', null, false, false, 'Home_Page' ],
			[ 'post-type-archive', 'post', false, false, 'Post_Type_Archive' ],
			[ 'system-page', 'search-result', false, false, 'Search_Result_Page' ],
			[ 'system-page', '404', false, false, 'Error_Page' ],
		];
	}
}
