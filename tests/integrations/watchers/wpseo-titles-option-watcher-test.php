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
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\WPSEO_Titles_Option_Watcher
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
		$this->instance              = Mockery::mock(
			WPSEO_Titles_Option_Watcher::class,
			[ $this->repository_mock, $this->builder_mock, $this->post_type_helper_mock ]
		)->makePartial();

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
	 * Tests if checking post type archive indexables results in a build request when the option value has changed.
	 *
	 * @param string $option_prefix The prefix for the archive option.
	 *
	 * @dataProvider get_post_type_archive_option_prefix
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::has_option_value_changed
	 */
	public function test_check_ptarchive_option_update( $option_prefix ) {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );

		$this->instance->check_ptarchive_option( [ $option_prefix . 'my-post-type' => 'bar' ], [ $option_prefix . 'my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if checking post type archive indexables results in a build request when the option value has been set.
	 *
	 * @param string $option_prefix The prefix for the archive option.
	 *
	 * @dataProvider get_post_type_archive_option_prefix
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::has_option_value_changed
	 */
	public function test_check_ptarchive_option_new( $option_prefix ) {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );

		$this->instance->check_ptarchive_option( [], [ $option_prefix . 'my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if checking post type archive indexables results in two build requests when the title option keys have been switched.
	 *
	 * @param string $option_prefix The prefix for the archive option.
	 *
	 * @dataProvider get_post_type_archive_option_prefix
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 * @covers ::has_option_value_changed
	 */
	public function test_check_ptarchive_option_switched( $option_prefix ) {
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'my-post-type' );
		$this->instance->expects( 'build_ptarchive_indexable' )->once()->with( 'other-post-type' );

		$this->instance->check_ptarchive_option( [ $option_prefix . 'my-post-type' => 'baz' ], [ $option_prefix . 'other-post-type' => 'baz' ] );
	}

	/**
	 * Tests if checking post type archive indexables is being ignored when no option value has changed.
	 *
	 * @param string $option_prefix The prefix for the archive option.
	 *
	 * @dataProvider get_post_type_archive_option_prefix
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 */
	public function test_check_ptarchive_option_same_value( $option_prefix ) {
		$this->instance->expects( 'build_ptarchive_indexable' )->never();

		$this->instance->check_ptarchive_option( [ $option_prefix . 'my-post-type' => 'bar' ], [ $option_prefix . 'my-post-type' => 'bar' ] );
	}

	/**
	 * Tests if checking post type archive indexables is being ignored when a non-relevant key changes value.
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 */
	public function test_check_ptarchive_option_without_change() {
		$this->instance->expects( 'build_ptarchive_indexable' )->never();

		$this->instance->check_ptarchive_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
	}

	/**
	 * Tests if checking post type archive indexables results in no build requests when one value is not an array.
	 *
	 * @param string $option_prefix The prefix for the archive option.
	 *
	 * @dataProvider get_post_type_archive_option_prefix
	 *
	 * @covers ::__construct
	 * @covers ::check_ptarchive_option
	 */
	public function test_check_ptarchive_option_non_array( $option_prefix ) {
		$this->instance->expects( 'build_ptarchive_indexable' )->never();

		$this->instance->check_ptarchive_option( [ $option_prefix . 'my-post-type' => 'baz' ], 'not an array' );
	}

	/**
	 * Tests building the post type archive indexable.
	 *
	 * @covers ::__construct
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_build_ptarchive_indexable() {
		$this->repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $this->indexable_mock );
		$this->builder_mock->expects( 'build_for_post_type_archive' )->once()->with( 'my-post-type', $this->indexable_mock )->andReturn( $this->indexable_mock );
		$this->indexable_mock->expects( 'save' )->once();

		$this->instance->build_ptarchive_indexable( 'my-post-type' );
	}

	/**
	 * Tests if updating post type archive indexables works as expected when no indexable exists yet.
	 *
	 * @covers ::__construct
	 * @covers ::build_ptarchive_indexable
	 */
	public function test_build_pt_archive_indexable_without_indexable() {
		$this->repository_mock->expects( 'find_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_post_type_archive' )->once()->with( 'my-post-type', false )->andReturn( $this->indexable_mock );
		$this->indexable_mock->expects( 'save' )->once();

		$this->instance->build_ptarchive_indexable( 'my-post-type' );
	}

	/**
	 * Returns the option prefix that represents a post type archive option.
	 *
	 * Test data provider.
	 *
	 * @return array The key prefix.
	 */
	public function get_post_type_archive_option_prefix() {
		return [
			[ 'option_prefix' => 'title-ptarchive-' ],
			[ 'option_prefix' => 'metadesc-ptarchive-' ],
			[ 'option_prefix' => 'bctitle-ptarchive-' ],
			[ 'option_prefix' => 'noindex-ptarchive-' ],
		];
	}
}
