<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Primary_Term_Watcher;
use Yoast\WP\SEO\Models\Primary_Term;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Primary_Term_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Primary_Term_Watcher
 */
final class Primary_Term_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Watcher
	 */
	private $instance;

	/**
	 * Represents the primary term repository.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	private $repository;

	/**
	 * Represents the site helper.
	 *
	 * @var Mockery\MockInterface|Site_Helper
	 */
	private $site;

	/**
	 * Represents the primary term helper.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * Represents the primary term builder.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Primary_Term_Builder
	 */
	private $primary_term_builder;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository           = Mockery::mock( Primary_Term_Repository::class );
		$this->site                 = Mockery::mock( Site_Helper::class );
		$this->primary_term         = Mockery::mock( Primary_Term_Helper::class );
		$this->primary_term_builder = Mockery::mock( Primary_Term_Builder::class );
		$this->instance             = Mockery::mock(
			Primary_Term_Watcher::class,
			[
				$this->repository,
				$this->site,
				$this->primary_term,
				$this->primary_term_builder,
			]
		)
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
			Primary_Term_Watcher::get_conditionals()
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

		self::assertNotFalse( Monkey\Actions\has( 'save_post', [ $this->instance, 'save_primary_terms' ] ) );
		self::assertNotFalse( Monkey\Actions\has( 'delete_post', [ $this->instance, 'delete_primary_terms' ] ) );
	}

	/**
	 * Tests the removal of the primary terms for a post.
	 *
	 * @covers ::delete_primary_terms
	 *
	 * @return void
	 */
	public function test_delete_primary_terms() {
		$this->primary_term
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

		$primary_term = Mockery::mock( Primary_Term::class );
		$primary_term->expects( 'delete' )->once();

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'category', false )
			->andReturn( $primary_term );

		$this->instance->delete_primary_terms( 1 );
	}

	/**
	 * Tests the removal of the primary terms for a post, with having no primary term.
	 *
	 * @covers ::delete_primary_terms
	 *
	 * @return void
	 */
	public function test_delete_primary_terms_no_primary_term_found() {
		$this->primary_term
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'category', false )
			->andReturnNull();

		$this->instance->delete_primary_terms( 1 );
	}

	/**
	 * Tests the saving of the primary terms on a switched multisite.
	 *
	 * @covers ::save_primary_terms
	 *
	 * @return void
	 */
	public function test_save_primary_terms_on_switched_multisite() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnTrue();

		$this->instance
			->expects( 'is_post_request' )
			->never();

		$this->instance->save_primary_terms( 2 );
	}

	/**
	 * Tests the saving of the primary terms.
	 *
	 * @covers ::save_primary_terms
	 * @covers ::save_primary_term
	 *
	 * @return void
	 */
	public function test_save_primary_terms() {
		$post_id = 2;

		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$this->primary_term
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( $post_id )
			->andReturn( [ (object) [ 'name' => 'category' ] ] );

		$this->primary_term_builder
			->expects( 'build' )
			->with( $post_id );

		$this->instance->save_primary_terms( $post_id );
	}
}
