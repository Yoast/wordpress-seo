<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use WPSEO_Meta;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Conditionals\Admin\Doing_Post_Quick_Edit_Save_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Primary_Category_Quick_Edit_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Admin_Columns_Cache_Integration_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Primary_Category_Quick_Edit_Watcher
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.
 */
class Primary_Category_Quick_Edit_Watcher_Test extends TestCase {

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the primary term repository.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	protected $primary_term_repository;

	/**
	 * The mocked indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The mocked indexable hierarchy builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Builder
	 */
	protected $indexable_hierarchy_builder;

	/**
	 * The mocked post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Primary_Category_Quick_Edit_Watcher
	 */
	protected $instance;

	/**
	 * Setup.
	 */
	public function set_up() {
		parent::set_up();

		$this->options_helper              = Mockery::mock( Options_Helper::class );
		$this->primary_term_repository     = Mockery::mock( Primary_Term_Repository::class );
		$this->post_type_helper            = Mockery::mock( Post_Type_Helper::class );
		$this->indexable_repository        = Mockery::mock( Indexable_Repository::class );
		$this->indexable_hierarchy_builder = Mockery::mock( Indexable_Hierarchy_Builder::class );


		$this->instance = new Primary_Category_Quick_Edit_Watcher(
			$this->options_helper,
			$this->primary_term_repository,
			$this->post_type_helper,
			$this->indexable_repository,
			$this->indexable_hierarchy_builder
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		self::assertInstanceOf( Options_Helper::class, self::getPropertyValue( $this->instance, 'options_helper' ) );
		self::assertInstanceOf( Primary_Term_Repository::class, self::getPropertyValue( $this->instance, 'primary_term_repository' ) );
	}

	/**
	 * Tests the registration of the hooks
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		self::assertNotFalse( \has_action( 'set_object_terms', [ $this->instance, 'validate_primary_category' ] ) );
	}

	/**
	 * Tests the retrieval of the conditionals
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		self::assertSame(
			[
				Migrations_Conditional::class,
				Doing_Post_Quick_Edit_Save_Conditional::class,
			],
			Primary_Category_Quick_Edit_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 */
	public function test_validate_primary_category_no_post_found() {
		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( null );

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 */
	public function test_validate_primary_category_no_main_taxonomy_set() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturnNull();

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 */
	public function test_validate_primary_category_and_main_taxonomy_set_to_zero() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 0 );

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 */
	public function test_validate_primary_category_and_main_taxonomy_is_not_the_saved_taxonomy() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 'post_tag' );

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 * @covers ::get_primary_term_id
	 */
	public function test_validate_primary_category_and_primary_not_set() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 'category' );

		Monkey\Functions\expect( 'get_post_meta' )
			->once()
			->with( 1337, WPSEO_Meta::$meta_prefix . 'primary_category', true )
			->andReturn( false );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1337, 'category', false )
			->andReturnNull();

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 * @covers ::get_primary_term_id
	 */
	public function test_validate_primary_category_and_primary_set_in_post_meta() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 'category' );

		Monkey\Functions\expect( 'get_post_meta' )
			->once()
			->with( 1337, WPSEO_Meta::$meta_prefix . 'primary_category', true )
			->andReturn( 2 );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1337, 'category', false )
			->andReturnNull();

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 * @covers ::get_primary_term_id
	 */
	public function test_validate_primary_category_and_primary_set_in_repository() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 'category' );

		Monkey\Functions\expect( 'get_post_meta' )
			->never()
			->with( 1337, WPSEO_Meta::$meta_prefix . 'primary_category', true );

		$primary_term          = Mockery::mock();
		$primary_term->term_id = 2;

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1337, 'category', false )
			->andReturn( $primary_term );

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}

	/**
	 * Tests the validation of the primary category where the post isn't found.
	 *
	 * @covers ::validate_primary_category
	 * @covers ::remove_primary_term
	 */
	public function test_validate_primary_category_and_primary_removed_as_category() {
		$post = (object) [
			'post_type' => 'post',
			'ID'        => 1337,
		];

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1337 )
			->andReturn( $post );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'post_types-post-maintax' )
			->andReturn( 'category' );

		Monkey\Functions\expect( 'get_post_meta' )
			->never()
			->with( 1337, WPSEO_Meta::$meta_prefix . 'primary_category', true );

		$primary_term          = Mockery::mock();
		$primary_term->term_id = 3;

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->twice()
			->with( 1337, 'category', false )
			->andReturn( $primary_term );

		// Primary term is deleted for this post.
		$primary_term->expects( 'delete' )->once();

		Monkey\Functions\expect( 'delete_post_meta' )
			->once()
			->with( 1337, WPSEO_Meta::$meta_prefix . 'primary_category' );

		$this->post_type_helper
			->expects( 'is_excluded' )
			->with( 'post' )
			->andReturn( false );

		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 1337, 'post' )
			->andReturn( $indexable );

		// Indexable hierarchy should be rebuilt now the primary term has been deleted.
		$this->indexable_hierarchy_builder
			->expects( 'build' )
			->with( $indexable );

		$this->instance->validate_primary_category( 1337, [], [ '1', '2' ], 'category' );
	}
}
