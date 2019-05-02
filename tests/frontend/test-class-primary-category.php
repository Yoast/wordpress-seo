<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Frontend_Primary_Category_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Frontend_Primary_Category
	 */
	protected $subject;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->subject =
			$this
				->getMockBuilder( 'WPSEO_Frontend_Primary_Category' )
				->setMethods( array( 'get_category', 'get_primary_category' ) )
				->getMock();
	}

	/**
	 * When the primary term id is not equal to the category id, the id should get updated.
	 *
	 * @covers WPSEO_Frontend_Primary_Category::post_link_category
	 */
	public function test_post_link_category_primary_term_IS_NOT_category_id() {
		$this->subject
			->expects( $this->once() )
			->method( 'get_primary_category' )
			->will( $this->returnValue( '54' ) );

		$expect = (object) array(
			'term_id' => 54,
		);

		$this->subject
			->expects( $this->once() )
			->method( 'get_category' )
			->will( $this->returnValue( $expect ) );

		$category = (object) array(
			'cat_ID' => 52,
		);

		$this->assertEquals( $expect, $this->subject->post_link_category( $category ) );
	}

	/**
	 * When the primary term is equal to the category id, return the category.
	 *
	 * @covers WPSEO_Frontend_Primary_Category::post_link_category
	 */
	public function test_post_link_category_primary_term_IS_category_id() {
		$this->subject
			->expects( $this->once() )
			->method( 'get_primary_category' )
			->will( $this->returnValue( 1 ) );

		$this->subject
			->expects( $this->never() )
			->method( 'get_category' );

		$category = (object) array(
			'term_id'          => 1,
			'name'             => 'test',
			'term_taxonomy_id' => 1,
			'cat_ID'           => 1,
		);

		$this->assertEquals( $category, $this->subject->post_link_category( $category ) );
	}

	/**
	 * When the primary term returns false.
	 *
	 * @covers WPSEO_Frontend_Primary_Category::post_link_category
	 */
	public function test_post_link_category_primary_term_IS_false() {
		$this->subject
			->expects( $this->once() )
			->method( 'get_primary_category' )
			->will( $this->returnValue( false ) );

		$this->subject
			->expects( $this->never() )
			->method( 'get_category' );

		$category = (object) array(
			'term_id'          => 1,
			'name'             => 'test',
			'term_taxonomy_id' => 1,
			'cat_ID'           => 1,
		);

		$this->assertEquals( $category, $this->subject->post_link_category( $category ) );
	}

	/**
	 * When there is a post passed into the function.
	 *
	 * @covers WPSEO_Frontend_Primary_Category::post_link_category
	 */
	public function test_post_link_category_primary_term_with_post() {
		$post     = $this->factory->post->create_and_get();
		$category = (object) array(
			'term_id'          => 1,
			'name'             => 'test',
			'term_taxonomy_id' => 1,
			'cat_ID'           => 1,
		);

		$this->subject
			->expects( $this->once() )
			->method( 'get_primary_category' )
			->will( $this->returnValue( 1 ) );

		$this->assertEquals( $category, $this->subject->post_link_category( $category, null, $post ) );
	}

	/**
	 * When there is no post passed into the function.
	 *
	 * @covers WPSEO_Frontend_Primary_Category::post_link_category
	 */
	public function test_post_link_category_primary_term_with_invalid_post_ID() {
		$post     = 99;
		$category = (object) array(
			'term_id'          => 1,
			'name'             => 'test',
			'term_taxonomy_id' => 1,
			'cat_ID'           => 1,
		);

		$this->subject
			->expects( $this->once() )
			->method( 'get_primary_category' )
			->will( $this->returnValue( false ) );

		$this->subject
			->expects( $this->never() )
			->method( 'get_category' );

		$this->assertEquals( $category, $this->subject->post_link_category( $category, null, $post ) );
	}
}
