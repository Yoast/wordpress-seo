<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_FAQ_Block_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the FAQ structured data object format that is output by get_json_ld.
	 *
	 * @covers WPSEO_FAQ_Block::get_json_ld()
	 */
	public function test_get_json_ld() {
		$instance = new WPSEO_FAQ_Block_Double();

		$attributes = array(
			'questions' => array(
				array(
					'jsonQuestion' => 'What to do?',
					'jsonAnswer'   => 'All the things!',
					'jsonImageSrc' => 'https://www.images.com/image.jpg',
				),
				array(
					'jsonQuestion' => 'What to do again?',
					'jsonAnswer'   => 'All the things! (Again)',
				),
			),
		);

		$expected = array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array(
				array(
					'@type'          => 'Question',
					'name'           => 'What to do?',
					'answerCount'    => 1,
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'All the things!',
						'image' => array(
							'@type'      => 'ImageObject',
							'contentUrl' => 'https://www.images.com/image.jpg',
						),
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What to do again?',
					'answerCount'    => 1,
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'All the things! (Again)',
					),
				),
			),
		);

		$this->assertEquals( $expected, $instance->get_json_ld( $attributes ) );
	}
}
