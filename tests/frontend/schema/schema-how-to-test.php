<?php

namespace Yoast\WP\SEO\Tests\Frontend\Schema;

use Brain\Monkey;
use Mockery;
use WPSEO_Schema_Context;
use WPSEO_Schema_IDs;
use Yoast\WP\SEO\Tests\Doubles\Frontend\Schema\Schema_HowTo_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class WPSEO_Schema_HowTo_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class Schema_HowTo_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var \Yoast\WP\SEO\Tests\Doubles\Frontend\Schema\Schema_HowTo_Double
	 */
	private $instance;

	/**
	 * The schema context.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\stubs(
			[
				'get_post_type' => function() {
					return 'post';
				},
				'get_the_title' => 'title',
			]
		);

		$this->context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();

		$this->context->canonical = 'example.com/';

		$this->instance = $this->getMockBuilder( Schema_HowTo_Double::class )
			->setMethods( [ 'get_image_schema' ] )
			->setConstructorArgs( [ $this->context ] )
			->getMock();

		$this->instance->method( 'get_image_schema' )->willReturn( 'https://example.com/image.png' );
	}

	/**
	 * Tests the main schema id output without site representation.
	 *
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 */
	public function test_get_main_schema_id_without_site_representation() {
		$this->context->site_represents = false;

		$this->assertEquals( $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH, $this->instance->get_main_schema_id() );
	}

	/**
	 * Tests the HowTo schema output without any steps.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 */
	public function test_schema_output_no_steps() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with steps without json name and text.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_steps_without_json_name_and_text() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonText' => '',
							'jsonName' => '',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with steps.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_steps() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with steps and images.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 * @covers WPSEO_Schema_HowTo::add_step_image
	 */
	public function test_schema_output_with_steps_and_image() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [
								'How to step 1 text line',
								[
									'type'   => 'img',
									'key'    => 1,
									'ref'    => null,
									'_owner' => null,
									'props'  => [
										'alt' => 'alt text',
										'src' => 'https://example.com/image.png',
									],
								],
							],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'image'           => 'https://example.com/image.png',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output when an empty jsonText (description) is provided in the step data.
	 *
	 * In case an empty description is provided, the HowToStep schema output should have a text attribute containing the description text,
	 * instead of a name and itemListElement attribute.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 */
	public function test_schema_output_step_with_no_description() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => '',
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type' => 'HowToStep',
						'url'   => 'example.com/#step-id-1',
						'text'  => 'How to step 1',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema step output when an empty jsonName (title) is provided in the step data.
	 *
	 * In case an empty description is provided, the HowToStep schema output should have a text attribute containing the title
	 * text, instead of a name and itemListElement attribute.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_step_with_no_title() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonText' => 'How to step 1 description.',
							'jsonName' => '',
							'text'     => [
								'How to step 1 description.',
							],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type' => 'HowToStep',
						'url'   => 'example.com/#step-id-1',
						'text'  => 'How to step 1 description.',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema step output when an empty jsonName (title) is provided in the step data and an image is added
	 * in the description.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_image
	 */
	public function test_schema_output_step_with_no_title_and_with_an_image() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonText' => '',
							'jsonName' => '',
							'text'     => [
								[
									'type'   => 'img',
									'key'    => 1,
									'ref'    => null,
									'_owner' => null,
									'props'  => [
										'alt' => 'alt text',
										'src' => 'https://example.com/image.png',
									],
								],
							],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type' => 'HowToStep',
						'url'   => 'example.com/#step-id-1',
						'image' => 'https://example.com/image.png',
						'text'  => '',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema step output when an empty jsonName (title) and jsonText (description), and no image are provided.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_image
	 */
	public function test_schema_output_step_with_no_content() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'jsonText' => '',
							'jsonName' => '',
							'id'       => 'step-id-1',
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema step output when no jsonName (title), jsonText (description) and image are provided.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 * @covers WPSEO_Schema_HowTo::add_duration
	 */
	public function test_schema_output_step_with_duration() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'hasDuration'     => true,
					'days'            => 1,
					'hours'           => 12,
					'minutes'         => 30,
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [
								'How to step 1 description',
							],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'totalTime'        => 'P1DT12H30M',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with allowed HTML tags in the jsonText.
	 *
	 * <h1> is one of the tags that is allowed in the HowToDirection text output. Therefore, it shouldn't be stripped.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_allowed_tags_in_jsontext() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => '<h1>How to step 1 description</h1>',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => '<h1>How to step 1 description</h1>',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with disallowed HTML tags in the jsonText.
	 *
	 * <div> is not allowed in the HowToDirection text output. Therefore, it should be stripped.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_disallowed_tags_in_jsontext() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => '<div>How to step 1 description</div>',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with allowed and disallowed HTML tags in the jsonText.
	 *
	 * <h1> is one of the tags that is allowed in the HowToDirection text output. <div> is not allowed. Therefore, <h1> shouldn't be stripped, but <div> should.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_allowed_and_disallowed_tags_in_jsontext() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => '<h1><div>How to step 1 description</div></h1>',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => '<h1>How to step 1 description</h1>',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with HTML tags in the jsonName.
	 *
	 * No HTML tags are allowed in the step name output. Therefore, they should be stripped.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_tags_in_jsonname() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => '<h1><div>How to step 1</div></h1>',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with allowed HTML tags in the jsonDescription.
	 *
	 * <h1> is one of the tags that is allowed in the HowTo description output. Therefore, it shouldn't be stripped.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_allowed_tags_in_jsondescription() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => '<h1>description</h1>',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => '<h1>description</h1>',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with disallowed HTML tags in the jsonDescription.
	 *
	 * <div> is not allowed in the HowTo description output. Therefore, it should be stripped.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_disallowed_tags_in_jsondescription() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => '<div>description</div>',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with allowed and disallowed HTML tags in the jsonDescription.
	 *
	 * <h1> is one of the tags that is allowed in the HowTo description output. <div> is not allowed. Therefore, <h1> shouldn't be stripped, but <div> should.
	 *
	 * @covers \WPSEO_Schema_HowTo::render
	 * @covers \WPSEO_Schema_HowTo::add_steps
	 * @covers \WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_allowed_and_disallowed_tags_in_jsondescription() {
		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => '<h1><div>description</div></h1>',
					'name'            => 'title',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'title',
				'inLanguage'       => 'language',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => '<h1>description</h1>',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the HowTo schema output with no name and with steps.
	 *
	 * @covers WPSEO_Schema_HowTo::render
	 * @covers WPSEO_Schema_HowTo::get_main_schema_id
	 * @covers WPSEO_Schema_HowTo::add_steps
	 * @covers WPSEO_Schema_HowTo::add_step_description
	 */
	public function test_schema_output_with_no_name_and_with_steps() {
		Monkey\Functions\stubs(
			[
				'get_the_title' => '',
			]
		);

		$actual = $this->instance->render(
			[
				[ '@id' => 'OtherGraphPiece' ],
			],
			[
				'attrs' => [
					'jsonDescription' => 'description',
					'name'            => '',
					'steps'           => [
						[
							'id'       => 'step-id-1',
							'jsonName' => 'How to step 1',
							'jsonText' => 'How to step 1 description',
							'text'     => [ 'How to step 1 text line' ],
						],
					],
				],
			]
		);

		$expected = [
			[
				'@id' => 'OtherGraphPiece',
			],
			[
				'@type'            => 'HowTo',
				'@id'              => 'example.com/#howto-1',
				'name'             => 'No title',
				'mainEntityOfPage' => [ '@id' => 'example.com/#article' ],
				'description'      => 'description',
				'step'             => [
					[
						'@type'           => 'HowToStep',
						'url'             => 'example.com/#step-id-1',
						'name'            => 'How to step 1',
						'itemListElement' => [
							[
								'@type' => 'HowToDirection',
								'text'  => 'How to step 1 description',
							],
						],
					],
				],
				'inLanguage' => 'language',
			],
		];

		$this->assertEquals( $expected, $actual );
	}


	/**
	 * Tests the is_needed function.
	 *
	 * @covers WPSEO_Schema_HowTo::is_needed
	 */
	public function test_is_needed() {
		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests the generate function.
	 *
	 * @covers WPSEO_Schema_HowTo::generate
	 */
	public function test_generate() {
		$this->assertEquals( $this->instance->generate(), [] );
	}
}
