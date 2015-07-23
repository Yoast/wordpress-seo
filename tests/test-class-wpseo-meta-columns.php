<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Meta_Columns_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Metabox
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Meta_Columns;
	}

	public function test_column_heading_is_hooked() {

		self::$class_instance->setup_page_analysis();
		// @todo -> is this double ! correct ?
		$hooked = ! ! has_filter( 'manage_post_posts_columns', array( self::$class_instance, 'column_heading' ) );

		$this->assertTrue( $hooked );
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

}