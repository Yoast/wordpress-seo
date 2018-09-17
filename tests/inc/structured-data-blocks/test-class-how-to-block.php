<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */
/**
 * Unit Test Class.
 */
class WPSEO_How_To_Block_Test extends WPSEO_UnitTestCase {
	/**
	 * Tests the HowTo structured data object format that is output by get_json_ld.
	 *
	 * @covers WPSEO_How_To_Block::get_json_ld()
	 */
	public function test_get_json_ld() {
		$instance = new WPSEO_How_To_Block_Double();

		$attributes = array(
			'hasDuration'     => true,
			'days'            => 1,
			'hours'           => 12,
			'minutes'         => 30,
			'jsonDescription' => 'How to description!',
			'steps'           => array(
				array(
					'jsonName'     => 'Step 1',
					'jsonText'     => 'Step 1 text',
					'jsonImageSrc' => 'https://www.image.com/image.jpg',
				),
				array(
					'jsonName'     => 'Step 2',
					'jsonText'     => 'Step 2 text',
				),
			),
		);

		$expected = array(
			'@context'    => 'https://schema.org',
			'@type'       => 'HowTo',
			'totalTime'   => 'P1DT12H30M',
			'description' => 'How to description!',
			'step'        => array(
				array(
					'@type'           => 'HowToSection',
					'itemListElement' => array(
						'@type'    => 'HowToStep',
						'text'     => 'Step 1 text',
					),
					'name' => 'Step 1',
					'image' => array(
						'@type'      => 'ImageObject',
						'contentUrl' => 'https://www.image.com/image.jpg',
					),
				),
				array(
					'@type'           => 'HowToSection',
					'itemListElement' => array(
						'@type'    => 'HowToStep',
						'text'     => 'Step 2 text',
					),
					'name' => 'Step 2',
				),
			),
		);

		$this->assertEquals( $expected, $instance->get_json_ld( $attributes ) );
	}
}
