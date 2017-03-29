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
	 * @param bool   $navigation
	 */
	public function add_step( $identifier, $title, $fields, $navigation = true ) {
		return parent::add_step( $identifier, $title, $fields, $navigation );
	}
}

/**
 * Class WPSEO_Configuration_Structure_Test
 */
class WPSEO_Configuration_Structure_Test extends PHPUnit_Framework_TestCase {

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
	 * @covers WPSEO_Configuration_Structure::__construct()
	 */
	public function test_constructor() {
		$steps = $this->structure->retrieve();

		$expected = array(
			'intro',
			'environment_type',
			'siteType',
			'publishingEntity',
			'profileUrls',
			'postTypeVisibility',
			'multipleAuthors',
			'connectGoogleSearchConsole',
			'titleTemplate',
			'newsletter',
			'suggestions',
			'success',
		);

		$this->assertEquals( $expected, array_keys( $steps ) );
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
			array( 'title' => $title, 'fields' => $fields, 'hideNavigation' => false ),
			$steps[ $identifier ]
		);
	}

}
