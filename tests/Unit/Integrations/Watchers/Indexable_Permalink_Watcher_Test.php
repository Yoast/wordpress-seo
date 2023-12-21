<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
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
final class Indexable_Permalink_Watcher_Test extends TestCase {

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
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_permalink_structure', [ $this->instance, 'reset_permalinks' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'update_option_category_base', [ $this->instance, 'reset_permalinks_term' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'update_option_tag_base', [ $this->instance, 'reset_permalinks_term' ] ) );
	}

	/**
	 * Tests resetting the permalinks.
	 *
	 * @covers ::reset_permalinks
	 *
	 * @return void
	 */
	public function test_reset_permalinks() {
		$this->instance->expects( 'get_post_types' )->once()->andReturn( [ 'post' ] );
		$this->instance->expects( 'get_taxonomies_for_post_types' )->once()->with( [ 'post' ] )->andReturn( [ 'category' ] );

		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post', 'post' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'term', 'category' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'user' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'date-archive' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'system-page' )->once();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$this->options
			->expects( 'set' )
			->with( 'permalink_structure', '/%postname%/' )
			->once();

		$this->instance->reset_permalinks();
	}

	/**
	 * Test resetting the permalinks for a post type.
	 *
	 * @covers ::reset_permalinks_post_type
	 *
	 * @return void
	 */
	public function test_reset_permalinks_post_type() {
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post', 'post' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post' )->once();

		$this->instance->reset_permalinks_post_type( 'post' );
	}

	/**
	 * Test resetting the permalinks for a term.
	 *
	 * @covers ::reset_permalinks_term
	 *
	 * @return void
	 */
	public function test_reset_permalinks_term() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'category', Indexing_Reasons::REASON_CATEGORY_BASE_PREFIX )
			->once();

		$this->instance->reset_permalinks_term( null, null, 'category_base' );
	}

	/**
	 * Test resetting the permalinks for the term tag.
	 *
	 * @covers ::reset_permalinks_term
	 *
	 * @return void
	 */
	public function test_reset_permalinks_for_term_tag() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'post_tag', Indexing_Reasons::REASON_TAG_BASE_PREFIX )
			->once();

		$this->instance->reset_permalinks_term( null, null, 'tag_base' );
	}

	/**
	 * Test forced flushing of permalinks.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_permalinks() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->with( 'tag_base_url' )->never();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->with( 'category_base_url' )->never();

		$this->instance->expects( 'should_reset_permalinks' )->andReturnTrue();

		$this->instance
			->expects( 'reset_permalinks' )
			->once();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->never();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test forced flushing of tag base permalinks.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_tag_base() {

		Monkey\Functions\expect( 'get_option' )
			->twice()
			->with( 'tag_base' )
			->andReturn( '/tag' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once()
			->andReturn( '/tag_base' );

		$this->instance->expects( 'reset_permalinks_term' )
			->once()
			->with( null, null, 'tag_base' );

		$this->options->expects( 'set' )
			->with( 'tag_base_url', '/tag' )->once();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->never();

		$this->instance->expects( 'should_reset_permalinks' )->andReturnFalse();

		$this->instance
			->expects( 'reset_permalinks' )
			->never();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->once();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test forced flushing of category base permalinks.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_category_base() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once();

		Monkey\Functions\expect( 'get_option' )
			->twice()
			->with( 'category_base' )
			->andReturn( '/category' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once()
			->andReturn( '/category_base' );

		$this->instance->expects( 'reset_permalinks_term' )
			->once()
			->with( null, null, 'category_base' );

		$this->options->expects( 'set' )
			->with( 'category_base_url', '/category' )->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->never();

		$this->instance->expects( 'should_reset_permalinks' )->andReturnFalse();

		$this->instance
			->expects( 'reset_permalinks' )
			->never();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->once();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test forced flushing of permalinks not executing.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_permalinks_not_executing() {

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'tag_base' );

		$this->options
			->expects( 'get' )
			->with( 'tag_base_url' )
			->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->with( 'tag_base_url' )->never();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'category_base' );

		$this->options
			->expects( 'get' )
			->with( 'category_base_url' )
			->once();

		$this->instance->expects( 'reset_permalinks_term' )->never();

		$this->options->expects( 'set' )->with( 'category_base_url' )->never();

		$this->instance->expects( 'should_reset_permalinks' )->andReturnFalse();

		$this->instance
			->expects( 'reset_permalinks' )
			->never();

		$this->instance
			->expects( 'reset_altered_custom_taxonomies' )
			->once();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test that permalinks should be reset.
	 *
	 * @covers ::should_reset_permalinks
	 *
	 * @return void
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
	 * Test that permalinks should not be reset.
	 *
	 * @covers ::should_reset_permalinks
	 *
	 * @return void
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

		$this->assertFalse( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that custom taxonomy permalinks should be reset.
	 *
	 * @covers ::reset_altered_custom_taxonomies
	 *
	 * @return void
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
			->with( 'term', 'book-category' );

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
	 *
	 * @return void
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
