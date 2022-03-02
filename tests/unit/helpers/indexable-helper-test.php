<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_Helper
 * @covers \Yoast\WP\SEO\Helpers\Indexable_Helper
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
	 * Represents the indexable repository helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $repository;

	/**
	 * Represents the environment helper.
	 *
	 * @var Mockery\MockInterface|Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Represents the indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Sets up the class under test and mock objects.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->environment_helper = Mockery::mock( Environment_Helper::class );
		$this->indexing_helper    = Mockery::mock( Indexing_Helper::class );
		$this->instance           = new Indexable_Helper( $this->options, $this->environment_helper, $this->indexing_helper );
		$this->instance->set_indexable_repository( $this->repository );
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Environment_Helper::class,
			$this->getPropertyValue( $this->instance, 'environment_helper' )
		);
		$this->assertInstanceOf(
			Indexing_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexing_helper' )
		);
	}

	/**
	 * Tests the get_page_type_for_indexable_provider function.
	 *
	 * @dataProvider get_page_type_for_indexable_provider
	 * @covers       ::get_page_type_for_indexable
	 *
	 * @param int    $object_type        The object type.
	 * @param int    $object_sub_type    The object sub type.
	 * @param bool   $is_front_page      Whether or not the indexable is the front page.
	 * @param bool   $is_posts_page      Whether or not the indexable is the posts page.
	 * @param string $expected_page_type The expected page type.
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
	 * Tests should_index_indexables method.
	 *
	 * @dataProvider should_index_for_production_environment_provider
	 * @covers       ::should_index_indexables
	 *
	 * @param string $wp_environment  The WordPress environment to test for.
	 * @param bool   $expected_result Either true or false.
	 */
	public function test_should_index_for_production_environment(
		$wp_environment, $expected_result
	) {
		// Arrange.
		$this->environment_helper
			->shouldReceive( 'is_production_mode' )
			->passthru();
		$this->environment_helper
			->shouldReceive( 'get_wp_environment' )
			->andReturn( $wp_environment );

		// Act.
		$result = $this->instance->should_index_indexables();

		// Assert.
		$this->assertEquals( $result, $expected_result );
	}

	/**
	 * Tests setting the indexables completed flag after indexing the indexables has finished.
	 */
	public function test_finish_indexing() {
		$this->options
			->expects( 'set' )
			->once()
			->with( 'indexables_indexing_completed', true );

		$this->instance->finish_indexing();
	}

	/**
	 * DataProvider for test_should_index_for_production_environment.
	 *
	 * @return array[]
	 */
	public function should_index_for_production_environment_provider() {
		return [
			[ 'production', true ],
			[ 'staging', false ],
			[ 'test', false ],
			[ 'development', false ],
			[ 'random letters and 1234567890', false ],
			[ null, false ],
		];
	}

	/**
	 * Tests check_if_default_indexable method.
	 *
	 * @dataProvider provider_check_if_default_indexable
	 * @covers ::check_if_default_indexable
	 *
	 * @param array $indexable_fields The fields of the indexable that we're checking.
	 * @param bool  $expected_result  Either true or false.
	 */
	public function test_check_if_default_indexable( $indexable_fields, $expected_result ) {
		$indexable = Mockery::mock( Indexable_Mock::class );

		foreach ( $indexable_fields as $field ) {
			$field_name = $field['field_name'];

			$indexable->$field_name = $field['field_value'];

		}

		$fields_to_check = [
			'title',
			'description',
		];

		$result = $this->instance->check_if_default_indexable( $indexable, $fields_to_check );
		$this->assertSame( $expected_result, $result );
	}

	/**
	 * DataProvider for test_check_if_default_indexable.
	 *
	 * @return array[]
	 */
	public function provider_check_if_default_indexable() {
		$all_default_fields     = [
			[
				'field_name'  => 'title',
				'field_value' => null,
			],
			[
				'field_name'  => 'description',
				'field_value' => null,
			],
		];
		$one_non_default_field  = [
			[
				'field_name'  => 'title',
				'field_value' => null,
			],
			[
				'field_name'  => 'description',
				'field_value' => 'not_null',
			],
		];
		$all_non_default_fields = [
			[
				'field_name'  => 'title',
				'field_value' => 'not_null',
			],
			[
				'field_name'  => 'description',
				'field_value' => 'not_null',
			],
		];

		return [
			[ $all_default_fields, true ],
			[ $one_non_default_field, false ],
			[ $all_non_default_fields, false ],
		];
	}

	/**
	 * Tests check_if_default_field method.
	 *
	 * @dataProvider provider_check_if_default_field
	 * @covers ::check_if_default_field
	 *
	 * @param string $field_name      The indexable field we're checking.
	 * @param string $field_value     The indexable field's value.
	 * @param bool   $expected_result Either true or false.
	 */
	public function test_check_if_default_field( $field_name, $field_value, $expected_result ) {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->$field_name = $field_value;

		$result = $this->instance->check_if_default_field( $indexable, $field_name );
		$this->assertSame( $expected_result, $result );
	}

	/**
	 * DataProvider for test_check_if_default_field.
	 *
	 * @return array[]
	 */
	public function provider_check_if_default_field() {
		return [
			[ 'title', null, true ],
			[ 'title', 'not null', false ],
			[ 'description', null, true ],
			[ 'description', 'not null', false ],
			[ 'open_graph_title', null, true ],
			[ 'open_graph_title', 'not null', false ],
			[ 'open_graph_description', null, true ],
			[ 'open_graph_description', 'not null', false ],
			[ 'twitter_title', null, true ],
			[ 'twitter_title', 'not null', false ],
			[ 'twitter_description', null, true ],
			[ 'twitter_description', 'not null', false ],
			[ 'canonical', null, true ],
			[ 'canonical', 'not null', false ],
			[ 'primary_focus_keyword', null, true ],
			[ 'primary_focus_keyword', 'not null', false ],
			[ 'is_robots_noindex', null, true ],
			[ 'is_robots_noindex', 'not null', false ],
			[ 'is_robots_nofollow', false, true ],
			[ 'is_robots_nofollow', 'not false', false ],
			[ 'is_robots_noarchive', null, true ],
			[ 'is_robots_noarchive', 'not null', false ],
			[ 'is_robots_noimageindex', null, true ],
			[ 'is_robots_noimageindex', 'not null', false ],
			[ 'is_robots_nosnippet', null, true ],
			[ 'is_robots_nosnippet', 'not null', false ],
			[ 'schema_article_type', 'irrelevant', false ], // Checking for fields that don't have an explicit default will always return false.
		];
	}
}
