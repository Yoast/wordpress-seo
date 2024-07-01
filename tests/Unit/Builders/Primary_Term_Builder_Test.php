<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Primary_Term_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Models\Primary_Term;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Primary_Term_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Primary_Term_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Primary_Term_Builder_Test
 *
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Primary_Term_Builder
 * @covers \Yoast\WP\SEO\Builders\Primary_Term_Builder
 */
final class Primary_Term_Builder_Test extends TestCase {

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
	 * Holds the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Holds the primary term helper.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * Holds the meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	private $meta;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository       = Mockery::mock( Primary_Term_Repository::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->primary_term     = Mockery::mock( Primary_Term_Helper::class );
		$this->meta             = Mockery::mock( Meta_Helper::class );
		$this->instance         = Mockery::mock(
			Primary_Term_Builder_Double::class,
			[
				$this->repository,
				$this->indexable_helper,
				$this->primary_term,
				$this->meta,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests that the constructor successfully creates the primary term builder.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_successfully_creates_primary_term_builder() {
		$primary_term_builder = new Primary_Term_Builder(
			$this->repository,
			$this->indexable_helper,
			$this->primary_term,
			$this->meta
		);

		$this->assertInstanceOf(
			Primary_Term_Repository::class,
			$this->getPropertyValue( $primary_term_builder, 'repository' )
		);

		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $primary_term_builder, 'indexable_helper' )
		);

		$this->assertInstanceOf(
			Primary_Term_Helper::class,
			$this->getPropertyValue( $primary_term_builder, 'primary_term' )
		);

		$this->assertInstanceOf(
			Meta_Helper::class,
			$this->getPropertyValue( $primary_term_builder, 'meta' )
		);
	}

	/**
	 * Tests building of primary terms.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build() {
		$post_id = 123;

		$this->primary_term
			->expects( 'get_primary_term_taxonomies' )
			->with( $post_id )
			->andReturn(
				[
					(object) [
						'name'         => 'category',
						'hierarchical' => true,
					],
					(object) [
						'name'         => 'tag',
						'hierarchical' => true,
					],
				]
			);

		$this->instance
			->expects( 'save_primary_term' )
			->with( $post_id, 'category' );

		$this->instance
			->expects( 'save_primary_term' )
			->with( $post_id, 'tag' );

		$this->instance->build( $post_id );
	}

	/**
	 * Tests that no primary terms are built when no applicable taxonomies are available.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_empty_taxonomies() {
		$post_id = 123;

		$this->primary_term
			->expects( 'get_primary_term_taxonomies' )
			->with( $post_id )
			->andReturn( [] );

		$this->instance
			->expects( 'save_primary_term' )
			->never();

		$this->instance->build( $post_id );
	}

	/**
	 * Tests the saving of a primary term, the happy path.
	 *
	 * @covers ::save_primary_term
	 *
	 * @return void
	 */
	public function test_save_primary_term() {
		$primary_term = Mockery::mock( Primary_Term_Mock::class );

		Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 1, 'category', true )
			->andReturn( $primary_term );

		$this->meta
			->expects( 'get_value' )
			->with( 'primary_category', 1 )
			->andReturn( 1337 );

		$this->indexable_helper
			->expects( 'save_indexable' )
			->once();

		$this->instance->save_primary_term( 1, 'category' );

		$this->assertEquals( 1337, $primary_term->term_id );
		$this->assertEquals( 1, $primary_term->post_id );
		$this->assertEquals( 'category', $primary_term->taxonomy );
		$this->assertEquals( 1, $primary_term->blog_id );
	}

	/**
	 * Tests the saving of a primary term, the happy path.
	 *
	 * @covers ::save_primary_term
	 *
	 * @return void
	 */
	public function test_save_primary_term_of_custom_taxonomy() {
		$primary_term = Mockery::mock( Primary_Term_Mock::class );

		Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->once()
			->with( 1, 'custom', true )
			->andReturn( $primary_term );

		$this->meta
			->expects( 'get_value' )
			->with( 'primary_custom', 1 )
			->andReturn( 1337 );

		$this->indexable_helper
			->expects( 'save_indexable' )
			->once();

		$this->instance->save_primary_term( 1, 'custom' );

		$this->assertEquals( 1337, $primary_term->term_id );
		$this->assertEquals( 1, $primary_term->post_id );
		$this->assertEquals( 'custom', $primary_term->taxonomy );
		$this->assertEquals( 1, $primary_term->blog_id );
	}

	/**
	 * Tests the saving of a primary term when no term is selected.
	 *
	 * @covers ::save_primary_term
	 *
	 * @return void
	 */
	public function test_save_primary_term_with_no_term_selected() {
		$this->meta
			->expects( 'get_value' )
			->with( 'primary_category', 1 )
			->andReturn( false );

		$primary_term = Mockery::mock( Primary_Term::class );
		$primary_term->expects( 'delete' )->once();
		$primary_term->expects( 'save' )->never();

		$this->repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'category', false )
			->andReturn( $primary_term );

		$this->instance->save_primary_term( 1, 'category' );
	}
}
