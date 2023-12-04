<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Mockery;
use WPSEO_Meta;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Meta_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Post_Meta_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Meta_Watcher
 */
class Indexable_Post_Meta_Watcher_Test extends TestCase {

	/**
	 * The post watcher.
	 *
	 * @var Indexable_Post_Watcher
	 */
	protected $post_watcher;

	/**
	 * The test instance.
	 *
	 * @var Indexable_Post_Meta_Watcher
	 */
	protected $instance;

	/**
	 * Initializes the test mocks.
	 */
	protected function set_up() {
		parent::set_up();
		$this->post_watcher = Mockery::mock( Indexable_Post_Watcher::class );
		$this->instance     = new Indexable_Post_Meta_Watcher( $this->post_watcher );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Post_Watcher::get_conditionals()
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

		// Register all posts whose meta have changed.
		$this->assertNotFalse( \has_action( 'added_post_meta', [ $this->instance, 'add_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'updated_post_meta', [ $this->instance, 'add_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'deleted_post_meta', [ $this->instance, 'add_post_id' ] ) );

		// Remove posts that get saved as they are handled by the Indexable_Post_Watcher.
		$this->assertNotFalse( \has_action( 'wp_insert_post', [ $this->instance, 'remove_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'delete_post', [ $this->instance, 'remove_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'edit_attachment', [ $this->instance, 'remove_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'add_attachment', [ $this->instance, 'remove_post_id' ] ) );
		$this->assertNotFalse( \has_action( 'delete_attachment', [ $this->instance, 'remove_post_id' ] ) );
	}

	/**
	 * Tests updating post meta for yoast meta keys.
	 *
	 * @covers ::add_post_id
	 * @covers ::update_indexables
	 */
	public function test_adding_yoast_meta_key() {
		$this->post_watcher->expects( 'build_indexable' )->once()->with( 1 );

		$this->instance->add_post_id( 0, 1, WPSEO_Meta::$meta_prefix . 'key' );
		$this->instance->update_indexables();
	}

	/**
	 * Tests updating post meta for non-yoast meta keys.
	 *
	 * @covers ::add_post_id
	 * @covers ::update_indexables
	 */
	public function test_adding_non_yoast_meta_key() {
		$this->post_watcher->expects( 'build_indexable' )->never();

		$this->instance->add_post_id( 0, 1, 'bad_key' );
		$this->instance->update_indexables();
	}

	/**
	 * Tests updating multiple post meta for yoast meta keys.
	 *
	 * @covers ::add_post_id
	 * @covers ::update_indexables
	 */
	public function test_adding_multiple_yoast_meta_key() {
		$this->post_watcher->expects( 'build_indexable' )->once()->with( 1 );

		$this->instance->add_post_id( 0, 1, WPSEO_Meta::$meta_prefix . 'key' );
		$this->instance->add_post_id( 5, 1, WPSEO_Meta::$meta_prefix . 'other_key' );
		$this->instance->update_indexables();
	}

	/**
	 * Tests updating post meta for yoast meta keys and then saving the post.
	 *
	 * @covers ::add_post_id
	 * @covers ::update_indexables
	 */
	public function test_adding_and_removing_yoast_meta_key() {
		$this->post_watcher->expects( 'build_indexable' )->never();

		$this->instance->add_post_id( 0, 1, WPSEO_Meta::$meta_prefix . 'key' );
		$this->instance->remove_post_id( 1 );

		$this->instance->update_indexables();
	}

	/**
	 * Tests updating post meta for yoast meta keys and then saving another post.
	 *
	 * @covers ::add_post_id
	 * @covers ::update_indexables
	 */
	public function test_adding_yoast_meta_key_and_removing_other_post() {
		$this->post_watcher->expects( 'build_indexable' )->once()->with( 1 );

		$this->instance->add_post_id( 0, 1, WPSEO_Meta::$meta_prefix . 'key' );
		$this->instance->remove_post_id( 2 );

		$this->instance->update_indexables();
	}
}
