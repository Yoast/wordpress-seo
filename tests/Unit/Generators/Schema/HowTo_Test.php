<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Generators\Schema\HowTo;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class HowTo_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\HowTo
 */
final class HowTo_Test extends TestCase {

	/**
	 * Holds the meta tags context mock.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Holds the how to instance under test.
	 *
	 * @var HowTo
	 */
	private $instance;

	/**
	 * Holds the html helper mock.
	 *
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * Holds the image helper mock.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * Holds the post helper mock.
	 *
	 * @var Post_Helper
	 */
	private $post;

	/**
	 * Holds the language helper mock.
	 *
	 * @var Language_Helper
	 */
	private $language;

	/**
	 * The base Gutenberg blocks.
	 *
	 * @var array
	 */
	private $base_blocks = [
		'yoast/how-to-block' => [
			[
				'blockName' => 'yoast/how-to-block',
				'attrs'     => [
					'jsonDescription' => 'An How To block description <em>with markup</em>.',
					'hasDuration'     => true,
					'days'            => '50',
					'hours'           => '23',
					'minutes'         => '27',
					'steps'           => [
						[
							'id'       => 'how-to-step-1583764039837',
							'name'     => [
								[
									'type'  => 'strong',
									'props' => [
										'children' => [
											'Step 1 title',
										],
									],
								],
							],
							'text'     => [
								'Step 1 description',
							],
							'jsonName' => '<strong>Step 1 title</strong>',
							'jsonText' => 'Step 1 description',
						],
					],
				],
			],
		],
	];

	/**
	 * The base expected schema.
	 *
	 * @var array
	 */
	private $base_schema = [
		[
			'@type'            => 'HowTo',
			'@id'              => '#howto-1',
			'name'             => 'post title',
			'mainEntityOfPage' => [
				'@id' => 'https://example.com/post-1#main-schema-id',
			],
			'description'      => 'An How To block description <em>with markup</em>.',
			'totalTime'        => 'P50DT23H27M',
			'step'             => [
				[
					'@type'           => 'HowToStep',
					'url'             => '#how-to-step-1583764039837',
					'name'            => '<strong>Step 1 title</strong>',
					'itemListElement' => [
						[
							'@type' => 'HowToDirection',
							'text'  => 'Step 1 description',
						],
					],
				],
			],
			'inLanguage'       => 'language',
		],
	];

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$id = 1234;

		$this->meta_tags_context = Mockery::mock( Meta_Tags_Context_Mock::class );

		$this->meta_tags_context->id             = $id;
		$this->meta_tags_context->main_schema_id = 'https://example.com/post-1#main-schema-id';

		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->image    = Mockery::mock( Image_Helper::class );
		$this->post     = Mockery::mock( Post_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );

		$this->html
			->shouldReceive( 'smart_strip_tags' )
			->andReturnArg( 0 );

		$this->html
			->shouldReceive( 'sanitize' )
			->andReturnArg( 0 );

		$this->language
			->shouldReceive( 'add_piece_language' )
			->andReturnUsing(
				static function ( $data ) {
					$data['inLanguage'] = 'language';

					return $data;
				}
			);

		$this->post
			->shouldReceive( 'get_post_title_with_fallback' )
			->with( $id )
			->andReturn( 'post title' );

		$this->instance = new HowTo();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'post'   => $this->post,
			'schema' => (object) [
				'language' => $this->language,
				'image'    => $this->image,
				'html'     => $this->html,
			],
		];
	}

	/**
	 * Tests whether the how to Schema piece is needed.
	 *
	 * @covers ::is_needed
	 *
	 * @return void
	 */
	public function test_is_needed() {
		$this->meta_tags_context->blocks = [
			'yoast/how-to-block' => [
				[
					'blockName' => 'yoast/how-to-block',
				],
			],
		];

		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Test the happy path: a HowTo with a duration, including a step with a title and a description.
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_steps
	 * @covers ::add_duration
	 * @covers ::add_step_description
	 *
	 * @return void
	 */
	public function test_generate_schema() {
		$this->meta_tags_context->blocks = $this->base_blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $this->base_schema, $actual_schema );
	}

	/**
	 * Tests that a condensed how-to step is generated, with the block's name as the text,
	 * when no text is available.
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_steps
	 *
	 * @return void
	 */
	public function test_schema_text_falls_back_to_block_name() {
		$blocks = $this->base_blocks;
		// Remove the json name from the base blocks.
		$blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['jsonName'] = '';

		$schema               = $this->base_schema;
		$schema[0]['step'][0] = [
			'@type' => 'HowToStep',
			'url'   => '#how-to-step-1583764039837',
			'text'  => 'Step 1 description',
		];

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}

	/**
	 * Tests that no Schema step is output when a step is empty
	 * (e.g. it does not contain a description, name and image).
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_steps
	 *
	 * @return void
	 */
	public function test_empty_step() {
		$blocks = $this->base_blocks;
		// Remove JSON text and -name attributes.
		unset(
			$blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['jsonText'],
			$blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['jsonName']
		);

		$schema = $this->base_schema;
		unset( $schema[0]['step'] );

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}

	/**
	 * Tests that no Schema step is output when no steps are set.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_empty_steps() {
		$blocks = $this->base_blocks;
		// Remove the steps attribute.
		unset(
			$blocks['yoast/how-to-block'][0]['attrs']['steps']
		);

		$schema = $this->base_schema;
		unset( $schema[0]['step'] );

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}

	/**
	 * Tests that an image Schema piece is output when a step has an image.
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_steps
	 * @covers ::add_step_image
	 * @covers ::get_image_schema
	 *
	 * @return void
	 */
	public function test_generate_step_with_image() {
		// Step with a text and an image.
		$blocks = $this->base_blocks;

		$blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['text'] = [
			'Step 1 description with an image:',
			[
				'type'  => 'img',
				'props' => [
					'alt'      => '',
					'src'      => 'https://example.com/wp-content/uploads/2020/02/download.jpeg',
					'children' => [],
				],
			],
		];

		$this->image
			->expects( 'generate_from_url' )
			->with(
				'#schema-image-94025919e8fe3836562573a84a14a305',
				'https://example.com/wp-content/uploads/2020/02/download.jpeg'
			)
			->andReturn(
				[
					'@type'      => 'ImageObject',
					'@id'        => 'https://example.com/post-1/#schema-image-72ed920b53178575afcdb59b932ad01b',
					'inLanguage' => 'en-US',
					'url'        => 'https://example.com/wp-content/uploads/2020/02/download.jpeg',
					'width'      => 474,
					'height'     => 474,
				]
			);

		$schema = $this->base_schema;

		$schema[0]['step'][0]['image'] = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/post-1/#schema-image-72ed920b53178575afcdb59b932ad01b',
			'inLanguage' => 'en-US',
			'url'        => 'https://example.com/wp-content/uploads/2020/02/download.jpeg',
			'width'      => 474,
			'height'     => 474,
		];

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}

	/**
	 * Tests that no duration is output in the How-to Schema
	 * when no duration information is available on the block.
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_duration
	 *
	 * @return void
	 */
	public function test_block_has_no_duration() {
		$blocks = $this->base_blocks;
		// This How-to has no duration.
		$blocks['yoast/how-to-block'][0]['attrs']['hasDuration'] = false;

		$schema = $this->base_schema;
		unset( $schema[0]['totalTime'] );

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}

	/**
	 * Tests that a condensed how-to step is generated, with the block's text as the text,
	 * when no name is available.
	 *
	 * @covers ::generate
	 * @covers ::add_how_to
	 * @covers ::add_steps
	 *
	 * @return void
	 */
	public function test_schema_text_falls_back_to_block_text() {
		$blocks = $this->base_blocks;
		// Remove JSON text and -name attributes.
		unset( $blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['jsonText'] );

		$schema = $this->base_schema;

		$schema[0]['step'][0]['text'] = '<strong>Step 1 title</strong>';
		unset( $schema[0]['step'][0]['itemListElement'], $schema[0]['step'][0]['name'] );

		$this->meta_tags_context->blocks = $blocks;
		$actual_schema                   = $this->instance->generate();
		$this->assertEquals( $schema, $actual_schema );
	}
}
