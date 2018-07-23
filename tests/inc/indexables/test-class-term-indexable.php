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
class WPSEO_Term_Indexable_gb extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Indexable_Service_Term_Provider_Double
	 */
	protected $provider;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->provider = new WPSEO_Indexable_Service_Term_Provider_Double();
	}

	/**
	 * Tests the conversion of the robots noindex value.
	 *
	 * @param string    $robot_value The value to test with.
	 * @param bool|null $expected    The expected converted value.
	 * @param string    $description Description of the test.
	 *
	 * @covers       WPSEO_Term_Indexable::get_robots_noindex_value()
	 *
	 * @dataProvider robots_noindex_provider
	 * @throws Exception
	 */
	public function test_get_robots_noindex_value( $robot_value, $expected, $description ) {
		$term = $this
			->factory()
			->term
			->create_and_get(
				array(
					'name'     => 'robot',
					'taxonomy' => 'category',
				)
			);

		WPSEO_Taxonomy_Meta::set_value( $term->term_id, $term->taxonomy, 'wpseo_noindex', $robot_value );

		$data = $this->provider->get( $term->term_id );

		$this->assertEquals( $expected, $data['is_robots_noindex'], $description );
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
