<?php
/**
 * @package WPSEO\Tests/Premium
 */

/**
 * Test class for the table presenter
 *
 * @covers WPSEO_Redirect_Table
 */
class WPSEO_Redirect_Table_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Redirect_Table
	 */
	private $class_instance;

	/**
	 * Loading the instance of the table class.
	 */
	public function setUp() {
		$this->class_instance = new WPSEO_Redirect_Table(
			'url',
			'Old URL',
			array(
				new WPSEO_Redirect( 'origin', 'target', 301 )
			)
		);
	}

	/**
	 * Test the result of the columns
	 *
	 * @covers WPSEO_Redirect_Table::get_columns
	 */
	public function test_get_columns() {
		$this->assertEquals(
			array(
				'cb'   => '<input type="checkbox" />',
				'old'  => 'Old URL',
				'new'  => 'New URL',
				'type' => 'Type',
			),
			$this->class_instance->get_columns()
		);
	}

	/**
	 * Test the filter for setting the primary table column
	 *
	 * @covers WPSEO_Redirect_Table::redirect_list_table_primary_column
	 */
	public function test_redirect_list_table_primary_column() {
		$this->assertEquals( 'test', $this->class_instance->redirect_list_table_primary_column( 'test', 'screen' ) );
		$this->assertEquals( 'old', $this->class_instance->redirect_list_table_primary_column( 'test', 'seo_page_wpseo_redirects' ) );
	}

	/**
	 * Test the preparing of the items
	 *
	 * @covers WPSEO_Redirect_Table::prepare_items
	 */
	public function test_prepare_items() {
		$this->class_instance->items = array();
		for ( $i = 0; $i < 30; $i++ ) {
			$this->class_instance->items[] = $i;
		}

		$this->assertEquals( count( $this->class_instance->items ), 30 );

		$this->class_instance->prepare_items();

		$this->assertEquals( count( $this->class_instance->items ), 25 );

	}

	/**
	 * Test return the columns that are sortable
	 *
	 * @covers WPSEO_Redirect_Table::get_sortable_columns
	 */
	public function test_get_sortable_columns() {
		$this->assertEquals(
			array(
				'old' => array( 'old', false ),
				'new' => array( 'new', false ),
				'type' => array( 'type', false ),
			),
			$this->class_instance->get_sortable_columns()
		);
	}

	/**
	 * Test the old column actions
	 *
	 * @covers WPSEO_Redirect_Table::column_old
	 */
	public function test_column_old() {
		$this->assertEquals(
			'<div class="val">origin</div> <div class="row-actions"><span class=\'edit\'><a href="javascript:;">Edit</a> | </span><span class=\'trash\'><a href="javascript:;" >Delete</a></span></div><button type="button" class="toggle-row"><span class="screen-reader-text">Show more details</span></button>',
			$this->class_instance->column_old( array( 'old' => 'origin', 'new' => 'target', 'type' => 301 ) )
		);
	}

	/**
	 * Test the old column actions
	 *
	 * @covers WPSEO_Redirect_Table::column_cb
	 */
	public function test_column_cb() {
		$this->assertEquals(
			'<input type="checkbox" name="wpseo_redirects_bulk_delete[]" value="origin" />',
			$this->class_instance->column_cb( array( 'old' => 'origin', 'new' => 'target', 'type' => 301 ) )
		);
	}

	/**
	 * Test default method to display a column
	 *
	 * @covers WPSEO_Redirect_Table::column_default
	 */
	public function test_columns_default() {
		$item = array( 'old' => 'origin', 'new' => 'target', 'type' => 301 );

		$this->assertEquals( "<div class='val'>target</div>", $this->class_instance->column_default( $item, 'new' ) );
		$this->assertEquals( "<div class='val type'>301</div>", $this->class_instance->column_default( $item, 'type' ) );
		$this->assertEquals( 'origin', $this->class_instance->column_default( $item, 'old' ) );
	}

	/**
	 * Test return available bulk actions
	 *
	 * @covers WPSEO_Redirect_Table::get_bulk_actions
	 */
	public function test_get_bulk_actions() {
		$this->assertEquals( array( 'delete' => 'Delete' ), $this->class_instance->get_bulk_actions() );
	}


}
