<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
 */
final class Robots_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the global don't index author archives option.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_global_dont_index_author_archives() {
		$this->mock_global_author_option( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests don't index without a current author (safety check).
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_global_dont_index_without_current_author() {
		$this->mock_global_author_option();
		$this->setup_get_userdata();

		// Should never get that far in the code.
		$this->options
			->expects( 'get' )
			->with( 'noindex-author-noposts-wpseo', false )
			->never();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the global don't index without posts.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_global_dont_index_without_posts() {
		$this->mock_global_author_option();
		$this->setup_get_userdata( (object) [ 'ID' => 1 ] );
		$this->mock_get_author_archive_post_types();
		$this->mock_global_author_posts_count_option( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the global don't index without posts, but with posts.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_global_dont_index_without_posts_with_posts() {
		$this->mock_global_author_option();
		$this->setup_get_userdata( (object) [ 'ID' => 1 ] );
		$this->mock_get_author_archive_post_types();
		$this->mock_global_author_posts_count_option( true, 16 );
		$this->mock_author_no_index_option();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'             => 'index',
			'follow'            => 'follow',
			'max-snippet'       => 'max-snippet:-1',
			'max-image-preview' => 'max-image-preview:large',
			'max-video-preview' => 'max-video-preview:-1',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the user's don't index option.
	 *
	 * @covers ::generate_robots
	 *
	 * @return void
	 */
	public function test_generate_robots_user_dont_index() {
		$this->mock_global_author_option();
		$this->setup_get_userdata( (object) [ 'ID' => 1 ] );
		$this->mock_get_author_archive_post_types();
		$this->mock_global_author_posts_count_option();
		$this->mock_author_no_index_option( 'on' );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Mocks option helper's get with `noindex-author-wpseo`.
	 *
	 * @param mixed $return_value Optional. What `get` should return.
	 *
	 * @return void
	 */
	private function mock_global_author_option( $return_value = false ) {
		$this->options
			->expects( 'get' )
			->with( 'noindex-author-wpseo', false )
			->once()
			->andReturn( $return_value );
	}

	/**
	 * Mocks Post_Type_Helper's `get_public_post_types`.
	 *
	 * @return void
	 */
	private function mock_get_author_archive_post_types() {
		$this->author_archive
			->expects( 'get_author_archive_post_types' )
			->withAnyArgs()
			->once()
			->andReturn( [ 'post' ] );
	}

	/**
	 * Mocks user helper's `get_meta` with `wpseo_noindex_author`.
	 *
	 * @param mixed $return_value Optional. What `get` should return.
	 *
	 * @return void
	 */
	private function mock_author_no_index_option( $return_value = 'off' ) {
		$this->user
			->expects( 'get_meta' )
			->with( 1, 'wpseo_noindex_author', true )
			->once()
			->andReturn( $return_value );
	}

	/**
	 * Mocks the helpers needed for the global author posts count.
	 *
	 * @param mixed $options_get_return_value      Optional. What `get` should return.
	 * @param mixed $user_count_posts_return_value Optional. What `count_posts` should return.
	 *
	 * @return void
	 */
	private function mock_global_author_posts_count_option( $options_get_return_value = false, $user_count_posts_return_value = 0 ) {
		$this->options
			->expects( 'get' )
			->with( 'noindex-author-noposts-wpseo', false )
			->once()
			->andReturn( $options_get_return_value );

		$this->user
			->expects( 'count_posts' )
			->with( 1, [ 'post' ] )
			->times( ( $options_get_return_value ) ? 1 : 0 )
			->andReturn( $user_count_posts_return_value );
	}

	/**
	 * Mocks WP_Query_Wrapper's `get_query`.
	 *
	 * @param mixed $return_value Optional. What `get_queried_object` should return.
	 *
	 * @return void
	 */
	private function setup_get_userdata( $return_value = false ) {
		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->andReturn( $return_value );
	}
}
