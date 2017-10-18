<?php
/**
 * @package WPSEO\Tests
 */

class WPSEO_Meta_Columns_Double extends WPSEO_Meta_Columns {
	public function determine_seo_filters( $seo_filter ) {
		return parent::determine_seo_filters( $seo_filter );
	}

	public function determine_readability_filters( $readability_filter ) {
		return parent::determine_readability_filters( $readability_filter );
	}

	public function is_valid_filter( $filter ) {
		return parent::is_valid_filter( $filter );
	}

	public function build_filter_query( $vars, $filter ) {
		return parent::build_filter_query( $vars, $filter );
	}
}


class WPSEO_Meta_Columns_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Meta_Columns_Double
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		self::$class_instance = new WPSEO_Meta_Columns_Double();
	}

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
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_score() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-score', $columns );
	}

	/**
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_focuskw() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-focuskw', $columns );
	}

	/**
	 * @covers WPSEO_Metabox::column_heading()
	 */
	public function test_column_heading_has_metadesc() {
		$columns = self::$class_instance->column_heading( array() );
		$this->assertArrayHasKey( 'wpseo-metadesc', $columns );
	}

	/**
	 * Tests that column_hidden returns the columns to hide so that WordPress hides them
	 *
	 * @covers WPSEO_Metabox::column_hidden()
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
	 * @covers WPSEO_Metabox::column_hidden()
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
	 * @covers WPSEO_Metabox::column_hidden()
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
	 * @param $filter
	 * @param $expected
	 *
	 * @dataProvider determine_seo_filters_dataprovider
	 * @covers WPSEO_Meta_Columns::determine_seo_filters()
	 */
	public function test_determine_seo_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_seo_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @param $filter
	 * @param $expected
	 *
	 * @dataProvider determine_readability_filters_dataprovider
	 * @covers WPSEO_Meta_Columns::determine_readability_filters()
	 */
	public function test_determine_readability_filters( $filter, $expected ) {
		$result = self::$class_instance->determine_readability_filters( $filter );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @param $vars
	 * @param $filters
	 * @param $expected
	 *
	 * @dataProvider build_filter_query_dataprovider
	 * @covers WPSEO_Meta_Columns::build_filter_query()
	 */
	public function test_build_filter_query( $vars, $filters, $expected ) {
		$result = self::$class_instance->build_filter_query( $vars, $filters );

		$this->assertEquals( $expected, $result );
	}
}
