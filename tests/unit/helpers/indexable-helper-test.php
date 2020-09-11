<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_Helper
 *
 * @group helpers
 */
class Indexable_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Indexable_Helper
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $repository;

	/**
	 * Represents the environment helper.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->environment_helper = Mockery::mock( Environment_Helper::class );
		$this->instance           = new Indexable_Helper( $this->options, $this->repository, $this->environment_helper );
	}

	/**
	 * Tests the get_page_type_for_indexable_provider function.
	 *
	 * @param int    $object_type        The object type.
	 * @param int    $object_sub_type    The object sub type.
	 * @param bool   $is_front_page      Whether or not the indexable is the front page.
	 * @param bool   $is_posts_page      Whether or not the indexable is the posts page.
	 * @param string $expected_page_type The expected page type.
	 *
	 * @covers ::get_page_type_for_indexable
	 * @dataProvider get_page_type_for_indexable_provider
	 */
	public function test_get_page_type_for_indexable( $object_type, $object_sub_type, $is_front_page, $is_posts_page, $expected_page_type ) {
		if ( $object_type === 'post' ) {
			Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'page_on_front' )
				->andReturn( ( $is_front_page ) ? 1 : 0 );

			if ( ! $is_front_page ) {
				Monkey\Functions\expect( 'get_option' )
					->once()
					->with( 'page_for_posts' )
					->andReturn( ( $is_posts_page ) ? 1 : 0 );
			}
		}

		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id       = 1;
		$indexable->object_type     = $object_type;
		$indexable->object_sub_type = $object_sub_type;

		$this->assertEquals( $expected_page_type, $this->instance->get_page_type_for_indexable( $indexable ) );
	}

	/**
	 * Data provider for the test_get_page_type_for_indexable_provider function.
	 *
	 * @return array The test data.
	 */
	public function get_page_type_for_indexable_provider() {
		return [
			[ 'post', 'page', true, false, 'Static_Home_Page' ],
			[ 'post', 'page', false, true, 'Static_Posts_Page' ],
			[ 'post', 'post', false, false, 'Post_Type' ],
			[ 'term', 'tag', false, false, 'Term_Archive' ],
			[ 'user', null, false, false, 'Author_Archive' ],
			[ 'home-page', null, false, false, 'Home_Page' ],
			[ 'post-type-archive', 'post', false, false, 'Post_Type_Archive' ],
			[ 'system-page', 'search-result', false, false, 'Search_Result_Page' ],
			[ 'system-page', '404', false, false, 'Error_Page' ],
		];
	}

	/**
	 * Test resetting the permalinks for categories.
	 *
	 * @covers ::reset_permalink_indexables
	 */
	public function test_reset_permalink_indexables() {
		$this->repository
			->expects( 'reset_permalink' )
			->once()
			->with( 'term', 'category' )
			->andReturn( 1 );

		$this->options
			->expects( 'set' )
			->with( 'indexables_indexation_reason', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'ignore_indexation_warning', false )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'indexation_warning_hide_until', false )
			->once();

		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY );

		$this->instance->reset_permalink_indexables( 'term', 'category', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX );
	}

	/**
	 * Tests should_index_indexables method
	 *
	 * @param string      $wp_environment    The WordPress environment to test for.
	 * @param string|null $yoast_environment The Yoast environment to test for.
	 * @param bool        $expected_result   Either true or false.
	 *
	 * @covers ::should_index_indexables
	 * @dataProvider should_index_for_production_environment_provider
	 */
	public function test_should_index_for_production_environment(
		$wp_environment, $yoast_environment, $expected_result
	) {
		// Arrange.
		$this->environment_helper
			->shouldReceive( 'is_production_mode' )
			->passthru();
		$this->environment_helper
			->shouldReceive( 'get_yoast_environment' )
			->andReturn( $yoast_environment );
		$this->environment_helper
			->shouldReceive( 'get_wp_environment' )
			->andReturn( $wp_environment );

		// Act.
		$result = $this->instance->should_index_indexables();

		// Assert.
		$this->assertEquals( $result, $expected_result );
	}

	/**
	 * Test resetting the permalinks for categories when there are no results.
	 *
	 * @covers ::reset_permalink_indexables
	 */
	public function test_no_reset_permalink_indexables() {
		$this->repository
			->expects( 'reset_permalink' )
			->once()
			->with( 'term', 'category' )
			->andReturn( 0 );

		$this->options
			->expects( 'set' )
			->with( 'indexables_indexation_reason', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX )
			->never();

		$this->options
			->expects( 'set' )
			->with( 'ignore_indexation_warning', false )
			->never();

		$this->options
			->expects( 'set' )
			->with( 'indexation_warning_hide_until', false )
			->never();

		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY )->never();
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY )->never();
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY )->never();

		$this->instance->reset_permalink_indexables( 'term', 'category', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX );
	}

	/**
	 * DataProvider for test_should_index_for_production_environment.
	 *
	 * @return array[]
	 */
	public function should_index_for_production_environment_provider() {
		return [
			[ 'production', 'production', true ],
			[ 'production', 'development', true ],
			[ 'production', null, true ],
			[ 'development', 'production', true ],
			[ 'development', 'anything will be accepted', true ],
			[ 'development', null, false ],
			[ null, null, false ],
		];
	}
}
