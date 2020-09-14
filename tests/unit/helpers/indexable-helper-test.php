<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use function Brain\Monkey\Functions\expect;

/**
 * Class Indexable_Helper_Test.
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
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->environment_helper = Mockery::mock( Environment_Helper::class );
		$this->instance           = new Indexable_Helper( $this->options, $this->repository, $this->environment_helper );
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Environment_Helper::class, 'environment_helper', $this->instance );
	}

	/**
	 * Retrieves the permalink for a post indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_post_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'post';

		expect( 'get_permalink' )
			->andReturn( 'https://example.org/permalink' );

		$this->assertEquals(
			'https://example.org/permalink',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for an attachment indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_attachment_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = 'attachment';

		expect( 'wp_get_attachment_url' )
			->andReturn( 'https://example.org/attachment' );

		$this->assertEquals(
			'https://example.org/attachment',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a home page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_homepage_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'home-page';

		expect( 'get_permalink' )
			->andReturn( 'https://example.org/homepage' );

		$this->assertEquals(
			'https://example.org/homepage',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		expect( 'is_wp_error' )
			->with( $term )
			->andReturn( false );

		expect( 'get_term_link' )
			->with( $term, 'category' )
			->andReturn( 'https://example.org/term' );

		$this->assertEquals(
			'https://example.org/term',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable and term not found.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable_term_not_found() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		expect( 'get_term' )
			->with( 2 )
			->andReturn( null );


		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a term indexable with term being wp_error.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_term_indexable_term_is_wp_error() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 2;
		$indexable->object_type = 'term';

		$term = (object) [
			'taxonomy' => 'category',
		];

		expect( 'get_term' )
			->with( 2 )
			->andReturn( $term );

		expect( 'is_wp_error' )
			->with( $term )
			->andReturn( true );

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_search_page_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'system-page';
		$indexable->object_sub_type = 'search-page';

		expect( 'get_search_link' )
			->andReturn( 'https://example.org/search' );

		$this->assertEquals(
			'https://example.org/search',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_post_type_archive_indexable() {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type     = 'post-type-archive';
		$indexable->object_sub_type = 'post-type';

		expect( 'get_post_type_archive_link' )
			->with( 'post-type' )
			->andReturn( 'https://example.org/post-type' );

		$this->assertEquals(
			'https://example.org/post-type',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_user_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'user';
		$indexable->object_id   = 1;

		expect( 'get_author_posts_url' )
			->with( 1 )
			->andReturn( 'https://example.org/user/1' );

		$this->assertEquals(
			'https://example.org/user/1',
			$this->instance->get_permalink_for_indexable( $indexable )
		);
	}

	/**
	 * Retrieves the permalink for a search page indexable.
	 *
	 * @covers ::get_permalink_for_indexable
	 */
	public function test_get_permalink_for_unknown_type_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'unknown';

		$this->assertNull(
			$this->instance->get_permalink_for_indexable( $indexable )
		);
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
}
