<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use WP_User;
use WPSEO_Meta;
use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Meta_Columns_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Meta_Columns_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Meta_Columns_Double
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();

		self::$class_instance = new Meta_Columns_Double();
	}

	/**
	 * Test setup.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		WPSEO_Options::set( 'keyword_analysis_active', true );
	}

	/**
	 * Determines what dataprovider to use for SEO filters.
	 *
	 * @return array The SEO filters dataprovider.
	 */
	public static function determine_seo_filters_dataprovider() {
		return [
			[
				'bad',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'ok',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 41, 70 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'good',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 71, 100 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'na',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => 'needs-a-value-anyway',
						'compare' => 'NOT EXISTS',
					],
				],
			],
			[
				'',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'noindex',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'value'   => '1',
						'compare' => '=',
					],
				],
			],
		];
	}

	/**
	 * Determines what dataprovider to use for readability filters.
	 *
	 * @return array The readability filters dataprovider.
	 */
	public static function determine_readability_filters_dataprovider() {
		return [
			[
				'bad',
				[
					'relation' => 'OR',
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
					[
						[
							'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
							'value'   => 'needs-a-value-anyway',
							'compare' => 'NOT EXISTS',
						],
						[
							'key'     => WPSEO_Meta::$meta_prefix . 'estimated-reading-time-minutes',
							'compare' => 'EXISTS',
						],
					],
				],
			],
			[
				'ok',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 41, 70 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'good',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 71, 100 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
			],
			[
				'na',
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'estimated-reading-time-minutes',
						'value'   => 'needs-a-value-anyway',
						'compare' => 'NOT EXISTS',
					],
					[
						'relation' => 'OR',
						[
							'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
							'value'   => 1,
							'type'    => 'numeric',
							'compare' => '<',
						],
						[
							'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
							'value'   => 'needs-a-value-anyway',
							'compare' => 'NOT EXISTS',
						],
					],
				],
			],
		];
	}

	/**
	 * Determines what dataprovider to use for Readability filters.
	 *
	 * @return array The Readability filters dataprovider.
	 */
	public static function build_filter_query_dataprovider() {
		return [
			[
				[],
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
				[
					'meta_query' => [
						[
							[
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => [ 1, 40 ],
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							],
						],
					],
				],
			],

			[
				[],
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
				[
					'meta_query' => [
						[
							'relation' => 'AND',
							[
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => [ 1, 40 ],
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							],
							[
								'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
								'value'   => [ 1, 40 ],
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							],
						],
					],
				],
			],

			[
				[],
				[],
				[],
			],

			[
				[
					'm'   => 0,
					'cat' => 0,
				],
				[
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
					[
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => [ 1, 40 ],
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					],
				],
				[
					'm'          => 0,
					'cat'        => 0,
					'meta_query' => [
						[
							'relation' => 'AND',
							[
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => [ 1, 40 ],
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							],
							[
								'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
								'value'   => [ 1, 40 ],
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Tests whether the column heading contains the score.
	 *
	 * @covers WPSEO_Meta_Columns::column_heading
	 *
	 * @return void
	 */
	public function test_column_heading_has_score() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( [] );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	 * Tests whether the column heading contains the focus keyphrase.
	 *
	 * @covers WPSEO_Meta_Columns::column_heading
	 *
	 * @return void
	 */
	public function test_column_heading_has_focuskw() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( [] );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	 * Tests whether the column heading contains the metadescription.
	 *
	 * @covers WPSEO_Meta_Columns::column_heading
	 *
	 * @return void
	 */
	public function test_column_heading_has_metadesc() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( [] );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	 * Tests that column_hidden returns the columns to hide so that WordPress hides them.
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden
	 *
	 * @return void
	 */
	public function test_column_hidden_HIDE_COLUMNS() {
		$user = $this->getMockBuilder( WP_User::class )
			->getMock();

		// Option may be filled if the user has not set it.
		$user->expects( $this->any() )
			->method( 'has_prop' )
			->willReturn( false );

		$expected = [ 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' ];
		$received = self::$class_instance->column_hidden( [] );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests that column_hidden returns the value WordPress has saved in the database.
	 *
	 * This is so the user can still set the columns they want to hide.
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden
	 *
	 * @return void
	 */
	public function test_column_hidden_KEEP_OPTION() {
		// Option shouldn't be touched if the user has set it already.
		$user = $this->getMockBuilder( WP_User::class )
			->getMock();

		$user->expects( $this->any() )
			->method( 'has_prop' )
			->willReturn( true );

		$expected = [
			'wpseo-title',
			'wpseo-metadesc',
			'wpseo-focuskw',
		];
		$received = self::$class_instance->column_hidden( [] );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests if column_hidden can deal with non array values returned from WordPress.
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden
	 *
	 * @return void
	 */
	public function test_column_hidden_UNEXPECTED_VALUE() {
		$user = $this->getMockBuilder( WP_User::class )
			->getMock();

		$user->expects( $this->any() )
			->method( 'has_prop' )
			->willReturn( false );

		$expected = [ 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' ];

		$received = self::$class_instance->column_hidden( false );
		$this->assertEquals( $expected, $received );

		$received = self::$class_instance->column_hidden( 'bad-value' );
		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests the is_valid_filter function for a string.
	 *
	 * @covers WPSEO_Meta_Columns::is_valid_filter
	 *
	 * @return void
	 */
	public function test_is_valid_filter() {
		$this->assertTrue( self::$class_instance->is_valid_filter( 'needs improvement' ) );
	}

	/**
	 * Tests the is_valid_filter function for invalid functions.
	 *
	 * @covers WPSEO_Meta_Columns::is_valid_filter
	 *
	 * @return void
	 */
	public function test_is_invalid_filter() {
		$this->assertFalse( self::$class_instance->is_valid_filter( '' ) );
		$this->assertFalse( self::$class_instance->is_valid_filter( null ) );
		$this->assertFalse( self::$class_instance->is_valid_filter( 0 ) );
	}

	/**
	 * Tests the determine_seo_filters with a dataset.
	 *
	 * @dataProvider determine_seo_filters_dataprovider
	 * @covers       WPSEO_Meta_Columns::determine_seo_filters
	 *
	 * @param string $filter   SEO filter.
	 * @param array  $expected The resulting SEO score filter.
	 *
	 * @return void
	 */
	public function test_determine_seo_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_seo_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests the determine_readability_filters with a dataset.
	 *
	 * @dataProvider determine_readability_filters_dataprovider
	 * @covers       WPSEO_Meta_Columns::determine_readability_filters
	 *
	 * @param string $filter   The Readability filter to use to determine what further filter to apply.
	 * @param array  $expected The Readability score filter.
	 *
	 * @return void
	 */
	public function test_determine_readability_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_readability_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests the build_filter_query with a dataset.
	 *
	 * @dataProvider build_filter_query_dataprovider
	 * @covers       WPSEO_Meta_Columns::build_filter_query
	 *
	 * @param array $vars     Array containing the variables that will be used in the meta query.
	 * @param array $filters  Array containing the filters that we need to apply in the meta query.
	 * @param array $expected Array containing the complete filter query.
	 *
	 * @return void
	 */
	public function test_build_filter_query( $vars, $filters, $expected ) {
		$result = self::$class_instance->build_filter_query( $vars, $filters );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests whether the default indexing is being used.
	 *
	 * @covers WPSEO_Meta_Columns::uses_default_indexing
	 *
	 * @return void
	 */
	public function test_is_using_default_indexing() {
		$post = $this->factory()->post->create_and_get( [] );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );

		$uses_default_indexing = self::$class_instance->uses_default_indexing( $post->ID );

		$this->assertTrue( $uses_default_indexing );
	}

	/**
	 * Tests whether the default indexing is not being used.
	 *
	 * @covers WPSEO_Meta_Columns::uses_default_indexing
	 *
	 * @return void
	 */
	public function test_is_not_using_default_indexing() {
		$post = $this->factory()->post->create_and_get( [] );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post->ID );

		$uses_default_indexing = self::$class_instance->uses_default_indexing( $post->ID );

		$this->assertFalse( $uses_default_indexing );
	}

	/**
	 * Tests whether a hard set indexing value on a post, is considered indexable.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_when_set_on_post() {
		$post = $this->factory()->post->create_and_get( [] );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post->ID );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertTrue( $is_indexable );
	}

	/**
	 * Tests whether a not hard set indexing value on a post, is considered indexable based on the default setting.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_when_using_default() {
		$post = $this->factory()->post->create_and_get( [ 'post_type' => 'post' ] );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );
		WPSEO_Options::set( 'noindex-post', false );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertTrue( $is_indexable );
	}

	/**
	 * Tests whether a not hard set indexing value on a post, is considered not indexable based on the default setting.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable
	 *
	 * @return void
	 */
	public function test_is_not_indexable_when_using_default() {
		$post = $this->factory()->post->create_and_get( [ 'post_type' => 'post' ] );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );
		WPSEO_Options::set( 'noindex-post', true );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertFalse( $is_indexable );
	}

	/**
	 * Tests whether a malformed post object defaults to true.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_when_using_malformed_post_object() {
		$post         = '';
		$is_indexable = self::$class_instance->is_indexable( $post );

		$this->assertTrue( $is_indexable );
	}

	/**
	 * Test get_current_post_type function.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_post_type
	 *
	 * @return void
	 */
	public function test_get_current_post_type() {
		$_GET['post_type'] = 'test-post-type';
		self::$class_instance->set_current_post_type( null );
		$this->assertEquals( 'test-post-type', self::$class_instance->get_current_post_type() );
	}

	/**
	 * Test get_current_post_type function when the post type is not set.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_post_type
	 *
	 * @return void
	 */
	public function test_get_current_post_type_not_set() {
		self::$class_instance->set_current_post_type( null );
		$this->assertEquals( null, self::$class_instance->get_current_post_type() );
	}

	/**
	 * Test get_current_post_type function when the post type is set to something else than a string.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_post_type
	 *
	 * @return void
	 */
	public function test_get_current_post_type_not_a_string() {
		$_GET['post_type'] = 13;
		self::$class_instance->set_current_post_type( null );
		$this->assertEquals( null, self::$class_instance->get_current_post_type() );
	}

	/**
	 * Test get_current_seo_filter function.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_seo_filter
	 *
	 * @return void
	 */
	public function test_get_current_seo_filter() {
		$_GET['seo_filter'] = 'test-filter';
		$this->assertEquals( 'test-filter', self::$class_instance->get_current_seo_filter() );
	}

	/**
	 * Test get_current_seo_filter function when the post type is not set.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_seo_filter
	 *
	 * @return void
	 */
	public function test_get_current_seo_filter_not_set() {
		$this->assertEquals( null, self::$class_instance->get_current_seo_filter() );
	}

	/**
	 * Test get_current_seo_filter function when the post type is set to something else than a string.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_seo_filter
	 *
	 * @return void
	 */
	public function test_get_current_seo_filter_not_a_string() {
		$_GET['seo_filter'] = 13;
		$this->assertEquals( null, self::$class_instance->get_current_seo_filter() );
	}

	/**
	 * Test get_current_readability_filter function.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_readability_filter
	 *
	 * @return void
	 */
	public function test_get_current_readability_filter() {
		$_GET['readability_filter'] = 'test-readability-filter';
		$this->assertEquals( 'test-readability-filter', self::$class_instance->get_current_readability_filter() );
	}

	/**
	 * Test get_current_readability_filter function when the post type is not set.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_readability_filter
	 *
	 * @return void
	 */
	public function test_get_current_readability_filter_not_set() {
		$this->assertEquals( null, self::$class_instance->get_current_readability_filter() );
	}

	/**
	 * Test get_current_readability_filter function when the post type is set to something else than a string.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_readability_filter
	 *
	 * @return void
	 */
	public function test_get_current_readability_filter_not_a_string() {
		$_GET['readability_filter'] = 13;
		$this->assertEquals( null, self::$class_instance->get_current_readability_filter() );
	}

	/**
	 * Test get_current_keyword_filter function.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_keyword_filter
	 *
	 * @return void
	 */
	public function test_get_current_keyword_filter() {
		$_GET['seo_kw_filter'] = 'test-kw-filter';
		$this->assertEquals( 'test-kw-filter', self::$class_instance->get_current_keyword_filter() );
	}

	/**
	 * Test get_current_keyword_filter function when the post type is not set.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_keyword_filter
	 *
	 * @return void
	 */
	public function test_get_current_keyword_filter_not_set() {
		$this->assertEquals( null, self::$class_instance->get_current_keyword_filter() );
	}

	/**
	 * Test get_current_keyword_filter function when the post type is set to something else than a string.
	 *
	 * @covers WPSEO_Meta_Columns::get_current_keyword_filter
	 *
	 * @return void
	 */
	public function test_get_current_keyword_filter_not_a_string() {
		$_GET['seo_kw_filter'] = 13;
		$this->assertEquals( null, self::$class_instance->get_current_keyword_filter() );
	}
}
