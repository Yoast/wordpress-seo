<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Configuration_Structure_Mock
 */
class WPSEO_Configuration_Structure_Mock extends WPSEO_Configuration_Structure {
	/**
	 * Make add_step public
	 *
	 * @param string $identifier
	 * @param string $title
	 * @param array  $fields
	 */
	public function add_step( $identifier, $title, $fields ) {
		return parent::add_step( $identifier, $title, $fields );
	}
}

/**
 * Class WPSEO_Configuration_Structure_Test
 */
class WPSEO_Configuration_Structure_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Configuration_Service_Mock Mock holder */
	protected $structure;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->structure = new WPSEO_Configuration_Structure_Mock();
	}

	/**
	 * @covers WPSEO_Configuration_Structure::add_step()
	 */
	public function test_add_step() {
		$this->assertNull( $this->structure->add_step( 'i', 't', 'f' ) );
	}

	/**
	 * @covers WPSEO_Configuration_Structure::retrieve()
	 */
	public function test_retrieve() {
		$identifier = 'i';
		$title      = 't';
		$fields     = 'f';

		$this->structure->add_step( $identifier, $title, $fields );

		$steps = $this->structure->retrieve();

		$this->assertTrue( isset( $steps[ $identifier ] ) );
		$this->assertEquals(
			array( 'title' => $title, 'fields' => $fields ),
			$steps[ $identifier ]
		);
	}

}
