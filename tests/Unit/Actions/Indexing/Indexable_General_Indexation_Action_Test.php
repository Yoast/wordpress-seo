<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Indexable_Post_Indexation_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action
 */
final class Indexable_General_Indexation_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance             = new Indexable_General_Indexation_Action( $this->indexable_repository );
	}

	/**
	 * Tests the calculation of the unindexed general pages.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_get_total_unindexed() {
		$this->set_query();

		Monkey\Functions\expect( 'get_transient' )
			->with( 'wpseo_total_unindexed_general_items' )
			->andReturn( false );
		Monkey\Functions\expect( 'set_transient' )
			->with( 'wpseo_total_unindexed_general_items', 4, \DAY_IN_SECONDS );

		$this->assertEquals( 4, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the calculation of the unindexed general pages.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::query
	 *
	 * @return void
	 */
	public function test_get_total_unindexed_transient_set() {
		Monkey\Functions\expect( 'get_transient' )
			->with( 'wpseo_total_unindexed_general_items' )
			->andReturn( 9 );

		$this->assertEquals( 9, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the retrieval of the limit
	 *
	 * @covers ::get_limit
	 *
	 * @return void
	 */
	public function test_get_limit() {
		$this->assertEquals( 4, $this->instance->get_limit() );
	}

	/**
	 * Tests the indexing of the general indexables.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::query
	 * @covers ::get_limit
	 *
	 * @return void
	 */
	public function test_index() {
		$this->set_query();

		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->with( '404' )
			->andReturn( '404' );

		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->with( 'search-result' )
			->andReturn( 'search' );

		$this->indexable_repository
			->expects( 'find_for_date_archive' )
			->andReturn( 'date archive' );

		$this->indexable_repository
			->expects( 'find_for_home_page' )
			->andReturn( 'home page' );

		Monkey\Functions\expect( 'set_transient' )
			->with( 'wpseo_total_unindexed_general_items', 0, \DAY_IN_SECONDS );

		$this->assertEquals( [ '404', 'search', 'date archive', 'home page' ], $this->instance->index() );
	}

	/**
	 * Sets the expectations for the query method.
	 *
	 * @return void
	 */
	private function set_query() {
		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->once()
			->with( '404', false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->once()
			->with( 'search-result', false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_date_archive' )
			->once()
			->with( false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( 0 );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'posts' );
	}
}
