<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\HowTo;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class HowToTest
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 *
 * @group   generators
 * @group   schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\HowTo
 */
class HowToTest extends TestCase {

	/**
	 * Holds the meta tags context mock.
	 *
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * Holds the how to instance under test.
	 *
	 * @var HowTo
	 */
	private $instance;

	/**
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @var Post_Helper
	 */
	private $post;

	/**
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
	private $base_expected_schema = [
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
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$id = 1234;

		$this->meta_tags_context = \Mockery::mock( Meta_Tags_Context::class );

		$this->meta_tags_context->id             = $id;
		$this->meta_tags_context->main_schema_id = 'https://example.com/post-1#main-schema-id';

		$this->html     = \Mockery::mock( HTML_Helper::class );
		$this->image    = \Mockery::mock( Image_Helper::class );
		$this->post     = \Mockery::mock( Post_Helper::class );
		$this->language = \Mockery::mock( Language_Helper::class );

		$this->html
			->shouldReceive( 'smart_strip_tags' )
			->andReturnArg( 0 );

		$this->html
			->shouldReceive( 'sanitize' )
			->andReturnArg( 0 );

		$this->language
			->shouldReceive( 'add_piece_language' )
			->andReturnUsing( [ $this, 'set_language' ] );

		$this->post
			->shouldReceive( 'get_post_title_with_fallback' )
			->with( $id )
			->andReturn( 'post title' );

		$this->instance = new HowTo( $this->html, $this->image, $this->post, $this->language );
	}

	/**
	 * Tests whether the how to Schema piece is needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->meta_tags_context->blocks = [
			'yoast/how-to-block' => [
				[
					'blockName' => 'yoast/how-to-block',
				],
			],
		];

		$this->assertTrue( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests the generation of HowTo Schema pieces.
	 *
	 * @param array $blocks          The blocks in the post's content.
	 * @param array $expected_schema The expected schema.
	 *
	 * @dataProvider generate_test_provider
	 */
	public function test_generate( $blocks, $expected_schema ) {
		$this->meta_tags_context->blocks = $blocks;

		$actual_schema = $this->instance->generate( $this->meta_tags_context );

		$this->assertEquals( $expected_schema, $actual_schema );
	}

	/**
	 * Provides the test_generate method with test data.
	 *
	 * @return array The provided test data.
	 */
	public function generate_test_provider() {
		$no_name_blocks = $this->base_blocks;
		// Remove the name.
		$no_name_blocks['yoast/how-to-block'][0]['attrs']['steps'][0]['jsonName'] = '';

		$no_name_expected_schema               = $this->base_expected_schema;
		$no_name_expected_schema[0]['step'][0] = [
			'@type' => 'HowToStep',
			'url'   => '#how-to-step-1583764039837',
			'text'  => 'Step 1 description',
		];

		return [
			'happy path'         => [
				$this->base_blocks,
				$this->base_expected_schema,
			],
			'with an empty name' => [
				$no_name_blocks,
				$no_name_expected_schema,
			],
		];
	}

	/**
	 * Sets the language.
	 *
	 * @param array $data The data to extend.
	 *
	 * @return array The altered data
	 */
	public function set_language( $data ) {
		$data['inLanguage'] = 'language';

		return $data;
	}
}
