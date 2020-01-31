<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Permalink_Watcher_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Permalink_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Permalink_Watcher
	 */
	protected $instance;

	/**
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Does the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->post_type = Mockery::mock( Post_Type_Helper::class );
		$this->instance  = Mockery::mock( Indexable_Permalink_Watcher::class, [ $this->post_type ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests resetting the permalinks.
	 *
	 * @covers ::reset_permalinks
	 */
	public function test_reset_permalinks() {
		$this->post_type
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post' ] );

		Monkey\Filters\expectApplied( 'wpseo_post_types' )
			->once()
			->with( [ 'post' ], 'update_permalink' );

		Monkey\Functions\expect( 'get_object_taxonomies' )
			->with( 'post', 'names' )
			->once()
			->andReturn( [ 'category' ] );

		$this->instance->expects( 'reset_permalink_indexables' )->with( 'post', 'post' )->once();
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'post-type-archive', 'post' )->once();
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'term', 'category' )->once();
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'author' )->once();
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'date-archive' )->once();
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'system-page' )->once();

		$this->instance->reset_permalinks();
	}

	/**
	 * Test resetting the permalinks for a term.
	 *
	 * @covers ::reset_permalinks_term
	 */
	public function test_reset_permalinks_term() {
		$this->instance->expects( 'reset_permalink_indexables' )->with( 'term', 'category' )->once();

		$this->instance->reset_permalinks_term( null, null, 'category_base' );
	}
}
