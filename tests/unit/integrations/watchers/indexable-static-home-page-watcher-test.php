<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Watchers
 */

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Static_Home_Page_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Static_Home_Page_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Static_Home_Page_Watcher
 * @covers ::<!public>
 */
class Indexable_Static_Home_Page_Watcher_Test extends TestCase {

	/**
	 * Indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * The class instance.
	 *
	 * @var Indexable_Static_Home_Page_Watcher
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->instance   = new Indexable_Static_Home_Page_Watcher( $this->repository );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Admin_Conditional::class ],
			Indexable_Static_Home_Page_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'update_option_page_on_front', [ $this->instance, 'update_static_homepage_permalink' ] ) );
	}

	/**
	 * Tests if both permalinks are updated.
	 *
	 * @covers ::update_static_homepage_permalink
	 * @covers ::update_permalink_for_page
	 */
	public function test_update_page_on_front() {
		Monkey\Functions\expect( 'get_permalink' )
			->once()
			->with( 1 )
			->andReturn( 'https://example.com/permalink/' );

		Monkey\Functions\expect( 'get_permalink' )
			->once()
			->with( 2 )
			->andReturn( 'https://example.com/' );

		$indexable_old                 = Mockery::mock( Indexable_Mock::class );
		$indexable_old->permalink      = 'https://example.com/';
		$indexable_old->permalink_hash = 'https://example.com/';

		$indexable_new                 = Mockery::mock( Indexable_Mock::class );
		$indexable_new->permalink      = 'https://example.com/old-permalink';
		$indexable_new->permalink_hash = 'https://example.com/old-permalink';

		$this->repository
			->expects( 'find_by_id_and_type' )
			->with( 1, 'post', false )
			->once()
			->andReturn( $indexable_old );

		$this->repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'post', false )
			->once()
			->andReturn( $indexable_new );

		$indexable_new
			->expects( 'save' )
			->once();

		$indexable_old
			->expects( 'save' )
			->once();

		$this->instance->update_static_homepage_permalink( '1', 2 );

		$this->assertEquals( 'https://example.com/', $indexable_new->permalink );
		$this->assertEquals( 'https://example.com/permalink/', $indexable_old->permalink );
	}

	/**
	 * Tests if only the old homepage indexable is updated.
	 *
	 * @covers ::update_static_homepage_permalink
	 * @covers ::update_permalink_for_page
	 */
	public function test_update_page_on_front_to_0() {
		Monkey\Functions\expect( 'get_permalink' )
			->once()
			->with( 1 )
			->andReturn( 'https://example.com/permalink/' );

		$indexable_old                 = Mockery::mock( Indexable_Mock::class );
		$indexable_old->permalink      = 'https://example.com/';
		$indexable_old->permalink_hash = 'https://example.com/';

		$this->repository
			->expects( 'find_by_id_and_type' )
			->with( 1, 'post', false )
			->once()
			->andReturn( $indexable_old );

		$indexable_old
			->expects( 'save' )
			->once();

		$this->instance->update_static_homepage_permalink( '1', 0 );

		$this->assertEquals( 'https://example.com/permalink/', $indexable_old->permalink );
	}

	/**
	 * Tests the routine with having the same value for the old and the new value.
	 *
	 * @covers ::update_static_homepage_permalink
	 */
	public function test_update_page_on_front_no_value_change() {
		$this->repository
			->expects( 'find_by_id_and_type' )
			->never();

		$this->instance->update_static_homepage_permalink( '1', 1 );
	}

	/**
	 * Tests the routine with having the same value for the old and the new value.
	 *
	 * @covers ::update_static_homepage_permalink
	 */
	public function test_update_page_on_front_with_no_indexable_found() {
		$this->repository
			->expects( 'find_by_id_and_type' )
			->with( 1, 'post', false )
			->once()
			->andReturnFalse();

		$this->instance->update_static_homepage_permalink( '1', 0 );
	}
}
