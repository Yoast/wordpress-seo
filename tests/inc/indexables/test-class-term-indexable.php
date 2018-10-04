<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Term_Indexable_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the conversion of the robots noindex value.
	 *
	 * @param string    $noindex_value The value to test with.
	 * @param bool|null $expected      The expected converted value.
	 * @param string    $description   Description of the test.
	 *
	 * @covers WPSEO_Term_Indexable::get_robots_noindex_value()
	 *
	 * @dataProvider robots_noindex_provider
	 */
	public function test_get_robots_noindex_value( $noindex_value, $expected, $description ) {
		$data = WPSEO_Term_Indexable_Double::get_robots_noindex_value( $noindex_value );

		$this->assertEquals( $expected, $data, $description );
	}

	/**
	 * Tests the creation of a new Term Indexable object.
	 *
	 * @covers WPSEO_Term_Indexable::from_object()
	 */
	public function test_from_object() {
		$term = $this
			->factory()
			->term
			->create_and_get(
				array(
					'name'     => 'robot',
					'taxonomy' => 'category',
				)
			);

		$instance = WPSEO_Term_Indexable_Double::from_object( $term->term_id );
		$this->assertInstanceOf( 'WPSEO_Term_Indexable', $instance );
	}

	/**
	 * Tests the creation of an invalid Term Indexable object.
	 *
	 * @covers WPSEO_Term_Indexable::from_object()
	 * @expectedException WPSEO_Invalid_Argument_Exception
	 */
	public function test_from_object_invalid_term() {
		$invalid_instance = WPSEO_Term_Indexable_Double::from_object( -1 );
	}

	/**
	 * Tests the updating of an existing Term Indexable object.
	 *
	 * @covers WPSEO_Term_Indexable::update()
	 */
	public function test_update() {
		$term = $this
			->factory()
			->term
			->create_and_get(
				array(
					'name'     => 'robot',
					'taxonomy' => 'category',
				)
			);

		$instance     = WPSEO_Term_Indexable_Double::from_object( $term->term_id );
		$new_instance = $instance->update(
			array( 'is_robots_noindex' => true )
		);

		$this->assertInstanceOf( 'WPSEO_Term_Indexable', $new_instance );

		$new_instance_array = $new_instance->to_array();

		$this->assertEquals( true, $new_instance_array['is_robots_noindex'] );
	}

	/**
	 * Returns an array with test data.
	 *
	 * @return array The test data.
	 */
	public function robots_noindex_provider() {
		return array(
			array( 'noindex', true, 'With value set to noindex' ),
			array( 'index', false, 'With value set to index' ),
			array( 'default', null, 'With default value' ),
		);
	}
}
