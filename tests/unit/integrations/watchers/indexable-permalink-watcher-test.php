<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
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
 * @covers ::<!public>
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
	 * @var Mockery\MockInterface|Indexable_Helperex
	 */
	protected $indexable_helper;

	/**
	 * Does the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->post_type        = Mockery::mock( Post_Type_Helper::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = Mockery::mock( Indexable_Permalink_Watcher::class, [ $this->post_type, $this->options, $this->indexable_helper ] )
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

		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post', 'post' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'term', 'category' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'user' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'date-archive' )->once();
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( 'system-page' )->once();

		$this->instance->reset_permalinks();
	}

	/**
	 * Test resetting the permalinks for a post type.
	 *
	 * @covers ::reset_permalinks_post_type
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
	 */
	public function test_reset_permalinks_term() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'category' )
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
			->with( 'term', 'post_tag' )
			->once();

		$this->instance->reset_permalinks_term( null, null, 'tag_base' );
	}
}
