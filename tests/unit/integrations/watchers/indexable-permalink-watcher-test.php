<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Permalink_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher
 */
class Indexable_Permalink_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Indexable_Permalink_Watcher
	 */
	protected $instance;

	/**
	 * Represents the post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the taxonomy helper.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Does the setup.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\stubs(
			[
				'wp_next_scheduled' => false,
				'wp_schedule_event' => false,
			]
		);

		$this->post_type        = Mockery::mock( Post_Type_Helper::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );
		$this->instance         = Mockery::mock( Indexable_Permalink_Watcher::class, [ $this->post_type, $this->options, $this->indexable_helper, $this->taxonomy_helper ] )
				->shouldAllowMockingProtectedMethods()
				->makePartial();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Permalink_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( Monkey\Actions\has( 'update_option_permalink_structure', [ $this->instance, 'reset_permalinks' ] ) );
		$this->assertTrue( Monkey\Actions\has( 'update_option_category_base', [ $this->instance, 'reset_permalinks_term' ] ) );
		$this->assertTrue( Monkey\Actions\has( 'update_option_tag_base', [ $this->instance, 'reset_permalinks_term' ] ) );
	}

	/**
	 * Tests resetting the permalinks.
	 *
	 * @covers ::reset_permalinks
	 */
	public function test_reset_permalinks() {
		$this->instance->expects( 'get_post_types' )->once()->andReturn( [ 'post' ] );
		$this->instance->expects( 'get_taxonomies_for_post_types' )->once()->with( [ 'post' ] )->andReturn( [ 'category' ] );

		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post', 'post', null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post', null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'term', 'category', null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'user', null, null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'date-archive', null, null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'system-page', null, null )->once();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'set' )
			->with( 'permalink_structure', '/%postname%/' )
			->once();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' )
			->andReturn( null );

		$this->options
			->expects( 'set' )
			->with( 'category_base_url', null )
			->once();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' )
			->andReturn( null );

		$this->options
			->expects( 'set' )
			->with( 'tag_base_url', null )
			->once();

		$this->instance->reset_permalinks();
	}

	/**
	 * Test resetting the permalinks for a post type.
	 *
	 * @covers ::reset_permalinks_post_type
	 */
	public function test_reset_permalinks_post_type() {
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post', 'post', null )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post', null )->once();

		$this->instance->reset_permalinks_post_type( 'post' );
	}

	/**
	 * Test resetting the permalinks for a term.
	 *
	 * @covers ::reset_permalinks_term
	 */
	public function test_reset_permalinks_term() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'post_category', 'category_base_changed' )
			->once();

		$this->instance->reset_permalinks_term( null, null, 'category_base' );
	}

	/**
	 * Test resetting the permalinks for the term tag.
	 *
	 * @covers ::reset_permalinks_term
	 */
	public function test_reset_permalinks_for_term_tag() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'post_tag', 'tag_base_changed' )
			->once();

		$this->instance->reset_permalinks_term( null, null, 'tag_base' );
	}

	/**
	 * Test forced flushing of permalinks.
	 *
	 * @covers ::force_reset_permalinks
	 */
	public function test_force_reset_permalinks() {
		$this->instance
			->expects( 'should_reset_permalinks' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'reset_permalinks' )
			->once();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->never();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test forced flushing of permalinks not executing.
	 *
	 * @covers ::force_reset_permalinks
	 */
	public function test_force_reset_permalinks_not_executing() {
		$this->instance
			->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->once();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test that permalinks should be reset.
	 *
	 * @covers ::should_reset_permalinks
	 */
	public function test_should_reset_permalinks() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'get' )
			->with( 'permalink_structure' )
			->once()
			->andReturn( '/%year%/%monthnum%/%postname%/' );

		$this->assertTrue( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that permalinks should be reset when category base is changed.
	 *
	 * @covers ::should_reset_permalinks
	 */
	public function test_should_reset_permalinks_categorychanged() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'get' )
			->with( 'permalink_structure' )
			->once()
			->andReturn( '/%postname%/' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' )
			->andReturn( '/%differentcategory%/' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once()
			->andReturn( '/%category%/' );

		$this->assertTrue( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that permalinks should be reset when tag base is changed.
	 *
	 * @covers ::should_reset_permalinks
	 */
	public function test_should_reset_permalinks_tagchanged() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'get' )
			->with( 'permalink_structure' )
			->once()
			->andReturn( '/%postname%/' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' )
			->andReturn( '/%category%/' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once()
			->andReturn( '/%category%/' );


		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' )
			->andReturn( '/%anothertag%/' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once()
			->andReturn( '/%tag%/' );

		$this->assertTrue( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that permalinks should not be reset.
	 *
	 * @covers ::should_reset_permalinks
	 */
	public function test_shouldnt_reset_permalinks() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'get' )
			->with( 'permalink_structure' )
			->once()
			->andReturn( '/%postname%/' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' )
			->andReturn( '/%category%/' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once()
			->andReturn( '/%category%/' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' )
			->andReturn( '/%tag%/' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once()
			->andReturn( '/%tag%/' );

		$this->assertFalse( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that custom taxonomy permalinks should be reset.
	 *
	 * @covers ::reset_altered_custom_taxonomies
	 */
	public function test_should_reset_altered_custom_taxonomies() {
		$this->taxonomy_helper
			->expects( 'get_custom_taxonomies' )
			->once()
			->andReturn(
				[
					'book-category' => 'book-category',
					'book-genre'    => 'book-genre',
				]
			);

		$this->options
			->expects( 'get' )
			->with( 'custom_taxonomy_slugs', [] )
			->once()
			->andReturn(
				[
					'book-category' => 'yoast-book-category',
					'book-genre'    => 'yoast-test-book-genre',
				]
			);

		$this->taxonomy_helper
			->expects( 'get_taxonomy_slug' )
			->times( 2 )
			->andReturnValues( [ 'yoast-test-book-category', 'yoast-test-book-genre' ] );

		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'book-category', null );

		$this->options
			->expects( 'set' )
			->with(
				'custom_taxonomy_slugs',
				[
					'book-category' => 'yoast-test-book-category',
					'book-genre'    => 'yoast-test-book-genre',
				]
			);

		$this->instance->reset_altered_custom_taxonomies();
	}

	/**
	 * Test that custom taxonomy permalinks shouldn't be reset.
	 *
	 * @covers ::reset_altered_custom_taxonomies
	 */
	public function test_shouldnt_reset_altered_custom_taxonomies() {
		$this->taxonomy_helper
			->expects( 'get_custom_taxonomies' )
			->once()
			->andReturn(
				[
					'book-category' => 'book-category',
					'book-genre'    => 'book-genre',
				]
			);

		$this->options
			->expects( 'get' )
			->with( 'custom_taxonomy_slugs', [] )
			->once()
			->andReturn(
				[
					'book-category' => 'yoast-test-book-category',
					'book-genre'    => 'yoast-test-book-genre',
				]
			);

		$this->taxonomy_helper
			->expects( 'get_taxonomy_slug' )
			->times( 2 )
			->andReturnValues( [ 'yoast-test-book-category', 'yoast-test-book-genre' ] );

		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->never();

		$this->options
			->expects( 'set' )
			->with(
				'custom_taxonomy_slugs',
				[
					'book-category' => 'yoast-test-book-category',
					'book-genre'    => 'yoast-test-book-genre',
				]
			);

		$this->instance->reset_altered_custom_taxonomies();
	}
}
