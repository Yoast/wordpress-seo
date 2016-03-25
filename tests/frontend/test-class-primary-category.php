<?php


class WPSEO_Frontend_Primary_Category_Test extends PHPUnit_Framework_TestCase {
	/**
	 * @type WPSEO_Frontend_Primary_Category
	 */
	protected $subject;

	public function setUp() {
		$this->subject = $this->getMock( 'WPSEO_Frontend_Primary_Category', array(
			'get_category',
			'get_primary_category',
		) );
	}

	/**
	 * When the primary term id is not equal to the category id, the id should get updated.
	 *
	 * @covers WPSEO_Primary_Term_Admin::post_link_category
	 */
	public function test_post_link_category_primary_term_IS_NOT_category_id() {
		$this->subject
			->expects ( $this->once() )
			->method( 'get_primary_category' )
			->will ( $this->returnValue( '54' ) );

		$expect = ( object ) array(
			'term_id' => 54
		);

		$this->subject
			->expects( $this->once() )
			->method( 'get_category' )
			->will( $this->returnValue( $expect ) );

		$category = ( object ) array(
			'cat_ID' => 52,
		);

		$this->assertEquals( $expect, $this->subject->post_link_category( $category ) );
	}

	/**
	 * When the primary term is equal to the category id, return the category
	 *
	 * @covers WPSEO_Primary_Term_Admin::post_link_category
	 */
	public function test_post_link_category_primary_term_IS_category_id() {
		$this->subject
			->expects ( $this->once() )
			->method( 'get_primary_category' )
			->will ( $this->returnValue( 1 ) );

		$this->subject
			->expects( $this->never() )
			->method( 'get_category' );

		$category = ( object ) array(
			'term_id' => 1,
			'name' => 'test',
			'term_taxonomy_id' => 1,
			'cat_ID' => 1,
		);

		$this->assertEquals( $category, $this->subject->post_link_category( $category ) );
	}

}
