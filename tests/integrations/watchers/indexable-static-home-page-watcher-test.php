<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Static_Home_Page_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Author_Watcher;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;
use YoastSEO_Vendor\ORM;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Static_Home_Page_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Static_Home_Page_Watcher_Test extends TestCase {

	/**
	 * Indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

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

		$this->repository_mock = Mockery::mock( Indexable_Repository::class );
		$this->instance        = new Indexable_Static_Home_Page_Watcher( $this->repository_mock );
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

		$indexable_old                 = Mockery::mock( Indexable::class );
		$indexable_old->permalink      = 'https://example.com/';
		$indexable_old->permalink_hash = 'https://example.com/';

		$indexable_new                 = Mockery::mock( Indexable::class );
		$indexable_new->permalink      = 'https://example.com/old-permalink';
		$indexable_new->permalink_hash = 'https://example.com/old-permalink';

		$this->repository_mock->expects( 'find_by_id_and_type' )
			->with( 1, 'post', false )
			->once()
			->andReturn( $indexable_old );

		$this->repository_mock->expects( 'find_by_id_and_type' )
			->with( 2, 'post', false )
			->once()
			->andReturn( $indexable_new );

		$indexable_new
			->expects( 'save' )
			->once();

		$indexable_old
			->expects( 'save' )
			->once();

		$this->instance->update_static_homepage_permalink( "1", 2 );

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

		$indexable_old                 = Mockery::mock( Indexable::class );
		$indexable_old->permalink      = 'https://example.com/';
		$indexable_old->permalink_hash = 'https://example.com/';

		$this->repository_mock->expects( 'find_by_id_and_type' )
			->with( 1, 'post', false )
			->once()
			->andReturn( $indexable_old );

		$indexable_old
			->expects( 'save' )
			->once();

		$this->instance->update_static_homepage_permalink( "1", 0 );

		$this->assertEquals( 'https://example.com/permalink/', $indexable_old->permalink );
	}
}
