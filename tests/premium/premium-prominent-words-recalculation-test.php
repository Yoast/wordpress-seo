<?php
/**
 * @package WPSEO\Tests\Premium
 */

/**
 * Test class for the recalculation functionality.
 */
class WPSEO_Premium_Prominent_Words_Recalculation_Test extends WPSEO_UnitTestCase {

	/**
	 * Sets the instance of the class.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . '/premium/doubles/premium-prominent-words-recalculation-double.php';
	}

	/**
	 * Tests the formatting of the post type labels.
	 *
	 *
	 * @param string $expected    The expected value.
	 * @param mixed  $post_types  The post types to format.
	 * @param string $description Description of the assertion.
	 *
	 * @dataProvider post_type_labels_provider
	 *
	 * @covers       WPSEO_Premium_Prominent_Words_Recalculation::get_indexable_post_type_labels()
	 */
	public function test_get_indexable_post_type_labels( $expected, $post_types, $description = '' ) {
		$class_instance = new WPSEO_Premium_Prominent_Words_Recalculation_Double(
			new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query(),
			new WPSEO_Premium_Prominent_Words_Support()
		);

		$this->assertEquals( $expected, $class_instance->get_indexable_post_type_labels( $post_types ), $description );
	}

	/**
	 * Tests the retrieving of the post type label.
	 *
	 * @covers WPSEO_Premium_Prominent_Words_Recalculation::retrieve_post_type_label()
	 */
	public function test_retrieve_post_type_label() {
		$class_instance = new WPSEO_Premium_Prominent_Words_Recalculation_Double(
			new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query(),
			new WPSEO_Premium_Prominent_Words_Support()
		);

		$this->assertEquals( 'Posts', $class_instance->retrieve_post_type_label( 'post' ) );
		$this->assertEquals( 'test', $class_instance->retrieve_post_type_label( 'test' ) );
	}

	/**
	 * Provider for the post type labels.
	 *
	 * Format:
	 * [0] Expected value.
	 * [1] Post types to get the labels for.
	 * [2] Description of the tested value.
	 *
	 * @return array
	 */
	public function post_type_labels_provider() {
		return array(
			array(
				array(),
				false,
				'Always return an array.',
			),
			array(
				array( 'Posts' ),
				array( 'post' ),
				'Use post label.',
			),
			array(
				array( 'Posts', 'test' ),
				array( 'post', 'test' ),
				'Use post type as fallback for non-existing post type.',
			),
		);
	}
}
