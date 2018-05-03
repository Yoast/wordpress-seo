<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Meta_Columns_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Meta_Columns_Double
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = new WPSEO_Meta_Columns_Double();
	}

	/**
	 * Test setup
	 */
	public function setUp() {
		parent::setUp();

		WPSEO_Options::set( 'keyword_analysis_active', true );
	}

	/**
	 * Determines what dataprovider to use for SEO filters.
	 *
	 * @return array The SEO filters dataprovider.
	 */
	public function determine_seo_filters_dataprovider() {
		return array(
			array(
				'bad',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'ok',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 41, 70 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'good',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 71, 100 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'na',
				array(
					array(
						'key'     => '_yoast_wpseo_meta-robots-noindex',
						'value'   => 'needs-a-value-anyway',
						'compare' => 'NOT EXISTS',
					),
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => 'needs-a-value-anyway',
						'compare' => 'NOT EXISTS',
					),
				),
			),
			array(
				'',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'noindex',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'value'   => '1',
						'compare' => '=',
					),
				),
			),
		);
	}

	public function determine_readability_filters_dataprovider() {
		return array(
			array(
				'bad',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'ok',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 41, 70 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
			array(
				'good',
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 71, 100 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
			),
		);
	}

	/**
	 * Determines what dataprovider to use for Readability filters.
	 *
	 * @return array The Readability filters dataprovider.
	 */
	public function build_filter_query_dataprovider() {
		return array(
			array(
				array(),
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
				array(
					'meta_query' => array(
						array(
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => array( 1, 40 ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							),
						),
					),
				),
			),

			array(
				array(),
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
				array(
					'meta_query' => array(
						array(
							'relation' => 'AND',
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => array( 1, 40 ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							),
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
								'value'   => array( 1, 40 ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							),
						),
					),
				),
			),

			array(
				array(),
				array(),
				array(),
			),

			array(
				array(
					'm'   => 0,
					'cat' => 0,
				),
				array(
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => array( 1, 40 ),
						'type'    => 'numeric',
						'compare' => 'BETWEEN',
					),
				),
				array(
					'm'          => 0,
					'cat'        => 0,
					'meta_query' => array(
						array(
							'relation' => 'AND',
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'content_score',
								'value'   => array( 1, 40 ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							),
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
								'value'   => array( 1, 40 ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN',
							),
						),
					),
				),
			),
		);
	}

	/**
	 * @covers WPSEO_Meta_Columns::column_heading()
	 */
	public function test_column_heading_has_score() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	 * @covers WPSEO_Meta_Columns::column_heading()
	 */
	public function test_column_heading_has_focuskw() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	 * @covers WPSEO_Meta_Columns::column_heading()
	 */
	public function test_column_heading_has_metadesc() {
		self::$class_instance->set_current_post_type( 'post' );

		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	 * Tests that column_hidden returns the columns to hide so that WordPress hides them
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden()
	 */
	public function test_column_hidden_HIDE_COLUMNS() {
		$user = $this->getMockBuilder( 'WP_User' )
			->getMock();

		// Option may be filled if the user has not set it.
		$user->expects( $this->any() )
			->method( 'has_prop' )
			->will( $this->returnValue( false ) );

		$expected = array( 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' );
		$received = self::$class_instance->column_hidden( array(), 'option-name', $user );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests that column_hidden returns the value WordPress has saved in the database
	 *
	 * This is so the user can still set the columns they want to hide.
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden()
	 */
	public function test_column_hidden_KEEP_OPTION() {
		// Option shouldn't be touched if the user has set it already.
		$user = $this->getMockBuilder( 'WP_User' )
			->getMock();

		$user->expects( $this->any() )
			->method( 'has_prop' )
			->will( $this->returnValue( true ) );

		$expected = array( 'wpseo-title' );
		$received = self::$class_instance->column_hidden( $expected, 'option-name', $user );

		$this->assertEquals( $expected, $received );
	}

	/**
	 * Tests if column_hidden can deal with non array values returned from WordPress
	 *
	 * @covers WPSEO_Meta_Columns::column_hidden()
	 */
	public function test_column_hidden_UNEXPECTED_VALUE() {
		$user = $this->getMockBuilder( 'WP_User' )
			->getMock();

		$user->expects( $this->any() )
			->method( 'has_prop' )
			->will( $this->returnValue( false ) );

		$expected = array( 'wpseo-title', 'wpseo-metadesc', 'wpseo-focuskw' );

		$received = self::$class_instance->column_hidden( false, 'option-name', $user );
		$this->assertEquals( $expected, $received );

		$received = self::$class_instance->column_hidden( 'bad-value', 'option-name', $user );
		$this->assertEquals( $expected, $received );
	}

	/**
	 * @covers WPSEO_Meta_Columns::is_valid_filter()
	 */
	public function test_is_valid_filter() {
		$this->assertTrue( self::$class_instance->is_valid_filter( 'needs improvement' ) );
	}

	/**
	 * @covers WPSEO_Meta_Columns::is_valid_filter()
	 */
	public function test_is_invalid_filter() {
		$this->assertFalse( self::$class_instance->is_valid_filter( '' ) );
		$this->assertFalse( self::$class_instance->is_valid_filter( null ) );
		$this->assertFalse( self::$class_instance->is_valid_filter( 0 ) );
	}

	/**
	 * @param string $filter   SEO filter.
	 * @param array  $expected The resulting SEO score filter.
	 *
	 * @dataProvider determine_seo_filters_dataprovider
	 * @covers WPSEO_Meta_Columns::determine_seo_filters()
	 */
	public function test_determine_seo_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_seo_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @param string $filter   The Readability filter to use to determine what further filter to apply.
	 * @param array  $expected The Readability score filter.
	 *
	 * @dataProvider determine_readability_filters_dataprovider
	 * @covers WPSEO_Meta_Columns::determine_readability_filters()
	 */
	public function test_determine_readability_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_readability_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @param array $vars     Array containing the variables that will be used in the meta query.
	 * @param array $filters  Array containing the filters that we need to apply in the meta query.
	 * @param array $expected Array containing the complete filter query.
	 *
	 * @dataProvider build_filter_query_dataprovider
	 * @covers WPSEO_Meta_Columns::build_filter_query()
	 */
	public function test_build_filter_query( $vars, $filters, $expected ) {
		$result = self::$class_instance->build_filter_query( $vars, $filters );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Tests whether the default indexing is being used.
	 *
	 * @covers WPSEO_Meta_Columns::uses_default_indexing()
	 */
	public function test_is_using_default_indexing() {
		$post = $this->factory()->post->create_and_get( array() );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );

		$uses_default_indexing = self::$class_instance->uses_default_indexing( $post->ID );

		$this->assertTrue( $uses_default_indexing );
	}

	/**
	 * Tests whether the default indexing is not being used.
	 *
	 * @covers WPSEO_Meta_Columns::uses_default_indexing()
	 */
	public function test_is_not_using_default_indexing() {
		$post = $this->factory()->post->create_and_get( array() );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post->ID );

		$uses_default_indexing = self::$class_instance->uses_default_indexing( $post->ID );

		$this->assertFalse( $uses_default_indexing );
	}

	/**
	 * Tests whether a hard set indexing value on a post, is considered indexable.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable()
	 */
	public function test_is_indexable_when_set_on_post() {
		$post = $this->factory()->post->create_and_get( array() );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post->ID );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertTrue( $is_indexable );
	}

	/**
	 * Tests whether a not hard set indexing value on a post, is considered indexable based on the default setting.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable()
	 */
	public function test_is_indexable_when_using_default() {
		$post = $this->factory()->post->create_and_get( array( 'post_type' => 'post' ) );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );
		WPSEO_Options::set( 'noindex-post', false );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertTrue( $is_indexable );
	}

	/**
	 * Tests whether a not hard set indexing value on a post, is considered not indexable based on the default setting.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable()
	 */
	public function test_is_not_indexable_when_using_default() {
		$post = $this->factory()->post->create_and_get( array( 'post_type' => 'post' ) );

		// Set metavalue.
		WPSEO_Meta::set_value( 'meta-robots-noindex', '0', $post->ID );
		WPSEO_Options::set( 'noindex-post', true );

		$is_indexable = self::$class_instance->is_indexable( $post->ID );

		$this->assertFalse( $is_indexable );
	}

	/**
	 * Tests whether a malformed post object defaults to true.
	 *
	 * @covers WPSEO_Meta_Columns::is_indexable()
	 */
	public function test_is_indexable_when_using_malformed_post_object() {
		$post         = '';
		$is_indexable = self::$class_instance->is_indexable( $post );

		$this->assertTrue( $is_indexable );
	}
}
