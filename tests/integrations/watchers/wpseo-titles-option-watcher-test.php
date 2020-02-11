<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\WPSEO_Titles_Option_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class WPSEO_Titles_Option_Watcher.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass WPSEO_Titles_Option_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class WPSEO_Titles_Option_Watcher_Test extends TestCase {

	/**
	 * Indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * Indexable builder mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * Post type helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper_mock;

	/**
	 * Indexable mock.
	 *
	 * @var Mockery\MockInterface|Indexable
	 */
	private $indexable_mock;

	/**
	 * The class instance.
	 *
	 * @var WPSEO_Titles_Option_Watcher
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		$this->repository_mock       = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock          = Mockery::mock( Indexable_Builder::class );
		$this->post_type_helper_mock = Mockery::mock( Post_Type_Helper::class );
		$this->indexable_mock        = Mockery::mock( Indexable::class );
		$this->instance              = Mockery::mock( WPSEO_Titles_Option_Watcher::class )->makePartial();

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			WPSEO_Titles_Option_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_ptarchive_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_post_type_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_author_archive_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_authors_without_posts_option' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_date_archive_option' ] ) );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when the option value has changed.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_update_ptarchive_indexable() {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );
		$this->instance->check_ptarchive_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when the option value has been set.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_update_wpseo_titles_value_new() {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );
		$this->instance->check_ptarchive_option( [], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when the title option keys have been switched.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_update_wpseo_titles_value_switched() {
//		$this->indexable_mock->expects( 'save' )->once();

		$other_indexable_mock = Mockery::mock( Indexable::class );
		$other_indexable_mock->expects( 'save' )->once();
//
//		$this->repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $this->indexable_mock );
//		$this->repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'other-post-type', false )->andReturn( $other_indexable_mock );
//
//		$this->builder_mock->expects( 'build_for_post_type_archive' )->once()->with( 'my-post-type', $this->indexable_mock )->andReturn( $this->indexable_mock );
//		$this->builder_mock->expects( 'build_for_post_type_archive' )->once()->with( 'other-post-type', $other_indexable_mock )->andReturn( $other_indexable_mock );

		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );
//		$other_indexable_mock->expects( 'build_ptarchive_indexable' )->once()->with( 'other-post-type' );

		$this->instance->check_ptarchive_option( [ 'title-ptarchive-my-post-type' => 'baz' ], [ 'title-ptarchive-other-post-type' => 'baz' ] );
	}

	/**
	 * Tests building the ptarchive indexable.
	 */
	public function test_build_ptarchive_indexable() {
		$this->repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $this->indexable_mock );
		$this->builder_mock->expects( 'build_for_post_type_archive' )->once()->with( 'my-post-type', $this->indexable_mock )->andReturn( $this->indexable_mock );
		$this->indexable_mock->expects( 'save' )->once();

		$this->instance->build_ptarchive_indexable( 'my-post-type' );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when no option value has changed.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_update_wpseo_titles_value_same_value() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_ptarchive_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'bar' ] );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when a non-relevant key changes value.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_update_wpseo_titles_value_without_change() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_ptarchive_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when no indexable exists yet.
	 *
	 * @covers ::__construct
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_build_pt_archive_indexable_without_indexable() {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );
		$this->instance->build_ptarchive_indexable( 'my-post-type' );
	}

	/**
	 * Tests if updating post type indexables works as expected when the option value has changed.
	 *
	 * @covers ::__construct
	 * @covers ::check_post_type_option
	 * @covers ::build_post_type_indexable
	 */
	public function _test_update_post_type_indexable() {
		$this->instance->check_post_type_option( [ 'title-post-type-option' => 'bar' ], [ 'title-post-type-option' => 'baz' ] );
	}

	/**
	 * Tests if updating author archive indexables works as expected when one option value has changed.
	 *
	 * @covers ::__construct
	 * @covers ::check_author_archive_option
	 * @covers ::build_author_archive_indexable
	 */
	public function _test_update_author_archive_indexable() {
		$this->instance->check_author_archive_option( [ 'title-author-archive-option' => 'bar' ], [ 'title-author-archive-option' => 'baz' ] );
	}
}
