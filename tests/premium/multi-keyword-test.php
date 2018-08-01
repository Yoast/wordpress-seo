<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Multi_Keyword_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests adding focus keywords.
	 */
	public function test_add_focus_keywords_input() {
		$multi_keyword = new WPSEO_Multi_Keyword();

		$this->assertEquals(
			array(
				'key'           => 'value',
				'focuskeywords' => array(
					'type'  => 'hidden',
					'title' => 'focuskeywords',
				),
			),
			$multi_keyword->add_focus_keywords_input( array( 'key' => 'value' ) )
		);
	}

	/**
	 * Tests adding focus keywords when provided with incorrect input type.
	 */
	public function test_add_focus_keywords_input_WITH_wrong_type_given() {
		$multi_keyword = new WPSEO_Multi_Keyword();

		$this->assertEquals( 'wrong_type', $multi_keyword->add_focus_keywords_input( 'wrong_type' ) );
	}

	/**
	 * Tests adding focus keywords when provided with an empty array.
	 */
	public function test_add_focus_keywords_input_WITH_empty_array_given() {
		$multi_keyword = new WPSEO_Multi_Keyword();

		$this->assertEquals(
			array(
				'focuskeywords' => array(
					'type'  => 'hidden',
					'title' => 'focuskeywords',
				),
			),
			$multi_keyword->add_focus_keywords_input( array() )
		);
	}
}
