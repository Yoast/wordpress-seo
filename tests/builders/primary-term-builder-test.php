<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Mockery;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Doubles\Primary_Term_Builder_Double;
use Yoast\WP\SEO\Tests\Mocks\Primary_Term;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Primary_Term_Builder_Test
 *
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Primary_Term_Builder
 */
class Primary_Term_Builder_Test extends TestCase {

	/**
	 * Holds the primary term builder under test.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Builder_Double
	 */
	private $instance;

	/**
	 * Holds the mock primary term repository.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	private $repository;

	/**
	 * Holds the primary term helper.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->repository   = Mockery::mock( Primary_Term_Repository::class );
		$this->primary_term = Mockery::mock( Primary_Term_Helper::class );
		$this->instance     = Mockery::mock( Primary_Term_Builder_Double::class, [ $this->repository, $this->primary_term ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the saving of a primary term, the happy path.
	 *
	 * @covers ::save_primary_term
	 */
	public function test_save_primary_term() {
		$this->instance
			->expects( 'get_posted_term_id' )
			->once()
			->with( 'category' )
			->andReturn( 1337 );

		$this->instance
			->expects( 'is_referer_valid' )
			->once()
			->with( 'category' )
			->andReturnTrue();

		$primary_term = Mockery::mock( Primary_Term::class );
		$primary_term->expects( 'save' )->once();

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 1, 'category', true )
			->andReturn( $primary_term );

		$this->instance->save_primary_term( 1, 'category' );

		$this->assertEquals( 1337, $primary_term->term_id );
		$this->assertEquals( 1, $primary_term->post_id );
		$this->assertEquals( 'category', $primary_term->taxonomy );
	}

	/**
	 * Tests the saving of a primary term with having an invalid nonce.
	 *
	 * @covers ::save_primary_term
	 */
	public function test_save_primary_term_having_invalid_referer() {
		$this->instance
			->expects( 'get_posted_term_id' )
			->once()
			->with( 'category' )
			->andReturn( 1337 );

		$this->instance
			->expects( 'is_referer_valid' )
			->once()
			->with( 'category' )
			->andReturnFalse();

		$this->instance->save_primary_term( 1, 'category' );
	}

	/**
	 * @covers ::save_primary_term
	 */
	public function test_save_primary_term_with_no_term_selected() {
		$this->instance
			->expects( 'get_posted_term_id' )
			->once()
			->with( 'category' )
			->andReturnNull();

		$this->instance
			->expects( 'is_referer_valid' )
			->never();

		$primary_term = Mockery::mock();
		$primary_term->expects( 'delete' )->once();
		$primary_term->expects( 'save' )->never();

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'category', false )
			->andReturn( $primary_term );

		$this->instance->save_primary_term( 1, 'category' );
	}
}
