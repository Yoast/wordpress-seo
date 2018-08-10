<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

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
	 * @covers WPSEO_Configuration_Structure::initialize()
	 */
	public function test_constructor() {
		$this->structure->initialize();

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

		$this->structure->add_step_mock( 'i', 't', 'f' );

		$steps = $this->structure->retrieve();

		$this->assertTrue( ! empty( $steps['i'] ) );
	}

	/**
	 * @covers WPSEO_Configuration_Structure::retrieve()
	 */
	public function test_retrieve() {
		$identifier = 'i';
		$title      = 't';
		$fields     = 'f';

		$this->structure->add_step_mock( $identifier, $title, $fields );

		$steps = $this->structure->retrieve();

		$this->assertTrue( isset( $steps[ $identifier ] ) );
		$this->assertEquals(
			array(
				'title'          => $title,
				'fields'         => $fields,
				'hideNavigation' => false,
				'fullWidth'      => false,
			),
			$steps[ $identifier ]
		);
	}
}
