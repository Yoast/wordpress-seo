<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Recalculate_Terms_Test extends WPSEO_UnitTestCase {

	/**
	 * @var array
	 */
	private $terms;

	/**
	 * @var WPSEO_Recalculate_Terms
	 */
	private $instance;

	/**
	 * Setup the class instance and create some posts
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Recalculate_Terms();

		$this->terms = array(
			1 => $this->factory->term->create( array( 'name' => 'Term with focus keyword', 'taxonomy' => 'category' ) ),
			2 => $this->factory->term->create( array( 'name' => '2nd Term', 'taxonomy' => 'category' ) ),
			3 => $this->factory->term->create( array( 'name' => 'Term 3', 'taxonomy' => 'category' ) ),
		);
	}

	/**
	 * Test the saving of the scores
	 *
	 * @covers WPSEO_Recalculate_Posts::save_scores
	 */
	public function test_save_scores_with_focus_kw() {

		$this->assertEquals( WPSEO_Taxonomy_Meta::get_term_meta( 'linkdex', 'category', $this->terms[1] ), 0 );

		$this->instance->save_scores(
			array(
				array(
					'item_id'  => $this->terms[1],
					'taxonomy' => 'category',
					'score'    => 10,
				),
			)
		);
	}

	/**
	 * Test getting the response for calculating the score for the terms
	 *
	 * @covers WPSEO_Recalculate_Posts::get_items_to_recalculate
	 */
	public function test_get_items_to_recalculate() {
		$response = $this->instance->get_items_to_recalculate(1);

		$this->assertEquals( 4, $response['total_items'] );
		$this->assertTrue( is_array( $response['items'] ) );

	}

}
