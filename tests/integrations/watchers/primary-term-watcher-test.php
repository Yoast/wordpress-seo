<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Watchers
 */

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Primary_Term_Watcher;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Doubles\Integrations\Watchers\Primary_Term_Watcher_Double;
use Yoast\WP\SEO\Tests\Mocks\Primary_Term;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Primary_Term_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Primary_Term_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Primary_Term_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Watcher|Primary_Term_Watcher_Double
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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->repository = Mockery::mock( Primary_Term_Repository::class );
		$this->site       = Mockery::mock( Site_Helper::class );
		$this->instance   = Mockery::mock( Primary_Term_Watcher_Double::class, [ $this->repository, $this->site ] )
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
			Primary_Term_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( Monkey\Actions\has( 'save_post', [ $this->instance, 'save_primary_terms' ] ) );
		$this->assertTrue( Monkey\Actions\has( 'delete_post', [ $this->instance, 'delete_primary_terms' ] ) );
	}

	/**
	 * Tests the removal of the primary terms for a post.
	 *
	 * @covers ::delete_primary_terms
	 */
	public function test_delete_primary_terms() {
		$this->instance
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn(  [
				(object) [
					'name' => 'category',
				],
			] );

		$primary_term = Mockery::mock();
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
	 */
	public function test_delete_primary_terms_no_primary_term_found() {
		$this->instance
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn(  [
				(object) [
					'name' => 'category',
				],
			] );

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
	 * Tests the saving of the primary terms where the current request isn't a post request..
	 *
	 * @covers ::save_primary_terms
	 */
	public function test_save_primary_terms_where_request_is_not_post_request() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$this->instance
			->expects( 'is_post_request' )
			->andReturnFalse();

		$this->instance
			->expects( 'get_primary_term_taxonomies' )
			->never();

		$this->instance
			->expects( 'save_primary_term' )
			->never();

		$this->instance->save_primary_terms( 2 );
	}

	/**
	 * Tests the saving of the primary terms.
	 *
	 * @covers ::save_primary_terms
	 */
	public function test_save_primary_terms() {
		$this->site
			->expects( 'is_multisite_and_switched' )
			->andReturnFalse();

		$this->instance
			->expects( 'is_post_request' )
			->andReturnTrue();

		$this->instance
			->expects( 'get_primary_term_taxonomies' )
			->once()
			->with( 2 )
			->andReturn(  [
				(object) [
					'name' => 'category',
				],
			] );

		$this->instance
			->expects( 'save_primary_term' )
			->once()
			->with( 2, 'category' );

		$this->instance->save_primary_terms( 2 );
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

	/**
	 * Tests the retrieval of the primary term taxonomies.
	 *
	 * @covers ::get_primary_term_taxonomies
	 */
	public function test_get_primary_term_taxonomies() {
		$taxonomies = [
			(object) [
				'name' => 'category',
			],
		];

		$this->instance
			->expects( 'generate_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( $taxonomies );

		$this->assertEquals( $taxonomies, $this->instance->get_primary_term_taxonomies( 1 ) );
	}

	/**
	 * Tests the retrieval of the primary term taxonomies with no post id passed.
	 *
	 * @covers ::get_primary_term_taxonomies
	 */
	public function test_get_primary_term_taxonomies_with_no_post_id_given() {
		Monkey\Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 1 );

		$taxonomies = [
			(object) [
				'name' => 'category',
			],
		];

		$this->instance
			->expects( 'generate_primary_term_taxonomies' )
			->once()
			->with( 1 )
			->andReturn( $taxonomies );

		$this->assertEquals( $taxonomies, $this->instance->get_primary_term_taxonomies() );
	}

	/**
	 * Tests the generations of the primary term taxonomies.
	 *
	 * @covers ::generate_primary_term_taxonomies
	 * @covers ::filter_hierarchical_taxonomies
	 */
	public function test_generate_primary_term_taxonomies() {
		Monkey\Functions\expect( 'get_object_taxonomies' )
			->once()
			->with( 'post', 'objects' )
			->andReturn( [
				(object) [
					'name' => 'category',
					'hierarchical' => true
				],
				(object) [
					'name'         => 'tag',
					'hierarchical' => false
				],
			] );

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 1 )
			->andReturn( 'post' );

		$this->assertEquals(
			[
				(object) [
					'name' => 'category',
					'hierarchical' => true
				]
			],
			$this->instance->generate_primary_term_taxonomies( 1 )
		);
	}





}
