<?php

namespace Yoast\WP\SEO\Tests\Unit\Memoizers;

use Brain\Monkey;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Blocks_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Memoizers\Presentation_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Memoizers\Meta_Tags_Context_Memoizer_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Tags_Context_Memoizer_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer
 *
 * @group memoizers
 */
final class Meta_Tags_Context_Memoizer_Test extends TestCase {

	/**
	 * The blocks helper.
	 *
	 * @var Blocks_Helper
	 */
	protected $blocks;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	protected $meta_tags_context;

	/**
	 * The presentation memoizer.
	 *
	 * @var Presentation_Memoizer
	 */
	protected $presentation_memoizer;

	/**
	 * The WP_Post.
	 *
	 * @var WP_Post
	 */
	protected $wp_post;

	/**
	 * The indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * The meta tags context mock.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $meta_tags_context_mock;

	/**
	 * Represents the instance to test.
	 *
	 * @var Meta_Tags_Context_Memoizer_Double
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->blocks                = Mockery::mock( Blocks_Helper::class );
		$this->current_page          = Mockery::mock( Current_Page_Helper::class );
		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->meta_tags_context     = Mockery::mock( Meta_Tags_Context::class );
		$this->presentation_memoizer = Mockery::mock( Presentation_Memoizer::class );
		$this->wp_post               = Mockery::mock( WP_Post::class );

		$this->indexable     = new Indexable_Mock();
		$this->indexable->id = 301;

		$this->instance = new Meta_Tags_Context_Memoizer_Double(
			$this->blocks,
			$this->current_page,
			$this->indexable_repository,
			$this->meta_tags_context,
			$this->presentation_memoizer
		);

		$this->meta_tags_context_mock        = new Meta_Tags_Context_Mock();
		$this->meta_tags_context_mock->title = 'the_title';
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Blocks_Helper::class,
			$this->getPropertyValue( $this->instance, 'blocks' )
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page' )
		);
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'repository' )
		);
		$this->assertInstanceOf(
			Meta_Tags_Context::class,
			$this->getPropertyValue( $this->instance, 'context_prototype' )
		);
		$this->assertInstanceOf(
			Presentation_Memoizer::class,
			$this->getPropertyValue( $this->instance, 'presentation_memoizer' )
		);
	}

	/**
	 * Tests getting the meta tags context for the current page when it hasn't yet been cached.
	 *
	 * @covers ::for_current_page
	 *
	 * @return void
	 */
	public function test_for_current_page_without_cache() {
		$this->indexable_repository
			->expects( 'for_current_page' )
			->once()
			->withNoArgs()
			->andReturn( $this->indexable );

		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->withNoArgs()
			->andReturn( 'the_page_type' );

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->mock_get();

		$this->assertEquals( $this->meta_tags_context_mock, $this->instance->for_current_page() );
	}

	/**
	 * Tests getting the meta tags context for the current page when it has been cached.
	 *
	 * @covers ::for_current_page
	 *
	 * @return void
	 */
	public function test_for_current_page_with_cache() {
		$this->instance->set_cache( 'current_page', $this->meta_tags_context_mock );

		$this->assertEquals( $this->meta_tags_context_mock, $this->instance->for_current_page() );
	}

	/**
	 * Tests getting the meta tags context given an indexable, when it already has been cached.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_when_context_has_been_cached() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock );

		$this->assertEquals( $this->meta_tags_context_mock, $this->instance->get( $this->indexable, 'the_page_type' ) );
	}

	/**
	 * Tests getting the meta tags context given an indexable (not a post), when it has not been cached.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_without_cache() {
		$this->meta_tags_context
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock );

		$this->presentation_memoizer
			->expects( 'get' )
			->once()
			->with( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' )
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->assertEquals( $this->meta_tags_context_mock, $this->instance->get( $this->indexable, 'the_page_type' ) );
	}

	/**
	 * Tests getting the meta tags context given a post indexable, when it has not been cached.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_without_cache_for_post() {
		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 20;

		$this->wp_post->post_content = 'the_content';

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( $this->indexable->object_id )
			->andReturn( $this->wp_post );

		$this->blocks
			->expects( 'get_all_blocks_from_content' )
			->once()
			->with( $this->wp_post->post_content )
			->andReturn( [ 'block1', 'block2' ] );

		$this->meta_tags_context
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock );

		$this->presentation_memoizer
			->expects( 'get' )
			->once()
			->with( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' )
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->assertEquals( $this->meta_tags_context_mock, $this->instance->get( $this->indexable, 'the_page_type' ) );
	}

	/**
	 * Tests clearing the memoization of a specific indexable.
	 *
	 * If the cache is indeed empty, the 'for_current_page' method must call
	 * a number of other methods to fill the cache again.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_for_indexable() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock );

		$this->instance->clear( $this->indexable );

		$this->indexable_repository
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->indexable );

		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->andReturn( 'the_page_type' );

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->mock_get();

		$this->instance->for_current_page();
	}

	/**
	 * Tests clearing the memoization of an indexable that is not an instance of Indexable.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_not_instance_of_indexable() {
		$this->instance->set_cache( 'not_an_instance_of_Indexable', $this->meta_tags_context_mock );

		$this->instance->clear( 'not_an_instance_of_Indexable' );

		$this->indexable_repository
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->indexable );

		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->andReturn( 'the_page_type' );

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->mock_get();

		$this->instance->for_current_page();
	}

	/**
	 * Tests clearing the memoization of the cache completely.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_complete_cache() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock );

		$this->instance->clear();

		$this->indexable_repository
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->indexable );

		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->andReturn( 'the_page_type' );

		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->mock_get();

		$this->instance->for_current_page();
	}

	/**
	 * Mocks the get method for use in other methods.
	 *
	 * @return void
	 */
	protected function mock_get() {
		$this->meta_tags_context
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock );

		$this->presentation_memoizer
			->expects( 'get' )
			->once()
			->with( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' )
			->andReturn( $this->meta_tags_context_mock->presentation );
	}
}
