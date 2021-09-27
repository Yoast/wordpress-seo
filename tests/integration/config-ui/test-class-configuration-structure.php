<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Class WPSEO_Configuration_Structure_Test.
 */
class WPSEO_Configuration_Structure_Test extends TestCase {

	/**
	 * Mock holder.
	 *
	 * @var WPSEO_Configuration_Service_Mock
	 */
	protected $structure;

	/**
	 * Set up.
	 */
	public function set_up() {
		parent::set_up();

		$this->structure = new WPSEO_Configuration_Structure_Mock();
	}

	/**
	 * Tests if the construct sets the required things properly.
	 *
	 * @covers WPSEO_Configuration_Structure::initialize
	 */
	public function test_constructor() {
		$this->structure->initialize();

		$steps = $this->structure->retrieve();

		$expected = [
			'environment-type',
			'site-type',
			'publishing-entity',
			'post-type-visibility',
			'multiple-authors',
			'title-template',
			'tracking',
			'newsletter',
			'success',
		];

		$this->assertEquals( $expected, array_keys( $steps ) );
	}

	/**
	 * Tests the addition of a step.
	 *
	 * @covers WPSEO_Configuration_Structure::add_step
	 */
	public function test_add_step() {

		$this->structure->add_step_mock( 'i', 't', 'f' );

		$steps = $this->structure->retrieve();

		$this->assertTrue( ! empty( $steps['i'] ) );
	}

	/**
	 * Tests the retrieval of the structure.
	 *
	 * @covers WPSEO_Configuration_Structure::retrieve
	 */
	public function test_retrieve() {
		$identifier = 'i';
		$title      = 't';
		$fields     = 'f';

		$this->structure->add_step_mock( $identifier, $title, $fields );

		$steps = $this->structure->retrieve();

		$this->assertTrue( isset( $steps[ $identifier ] ) );
		$this->assertEquals(
			[
				'title'          => $title,
				'fields'         => $fields,
				'hideNavigation' => false,
				'fullWidth'      => false,
			],
			$steps[ $identifier ]
		);
	}
}
