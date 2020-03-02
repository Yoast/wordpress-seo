<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\FAQ;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class FAQ_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass FAQ;
 */
class FAQ_Test extends TestCase {

	/**
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * @var Language_Helper
	 */
	private $language;

	/**
	 * @var FAQ
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		$this->html     = \Mockery::mock( HTML_Helper::class );
		$this->language = \Mockery::mock( Language_Helper::class );

		$this->instance = new FAQ( $this->html, $this->language );
		parent::setUp();
	}

	/**
	 * Test the generation of the FAQ schema piece.
	 *
	 * @covers ::generate
	 */
	public function test_generate() {
		$blocks = [
			'yoast/faq-block' => [
				[
					'attrs' => [
						'questions' => [
							[
								'id'           => 'id-1',
								'jsonQuestion' => 'This is a question',
								'jsonAnswer'   => 'This is an answer',
							],
							[
								'id'           => 'id-2',
								'jsonQuestion' => 'This is the second question',
								'jsonAnswer'   => 'This is the second answer',
							],
						],
					],
				],
			],
		];

		$meta_tags_context                 = new Meta_Tags_Context();
		$meta_tags_context->blocks         = $blocks;
		$meta_tags_context->main_schema_id = 'https://example.org/page/';
		$meta_tags_context->canonical      = 'https://example.org/page/';

		$this->html
			->expects( 'smart_strip_tags' )
			->twice()
			->andReturnArg( 0 );

		$this->html
			->expects( 'sanitize' )
			->twice()
			->andReturnArg( 0 );

		$this->language
			->expects( 'add_piece_language' )
			->twice()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			[
				'@type'            => 'ItemList',
				'mainEntityOfPage' => [
					'@id' => 'https://example.org/page/',
				],
				'numberOfItems'    => 2,
				'itemListElement'  => [
					[ '@id' => 'https://example.org/page/#id-1' ],
					[ '@id' => 'https://example.org/page/#id-2' ],
				],
			],
			[
				'@id'            => 'https://example.org/page/#id-1',
				'@type'          => 'Question',
				'position'       => 0,
				'url'            => 'https://example.org/page/#id-1',
				'name'           => 'This is a question',
				'answerCount'    => 1,
				'acceptedAnswer' => [
					'@type'      => 'Answer',
					'text'       => 'This is an answer',
					'inLanguage' => 'language',
				],
			],
			[
				'@id'            => 'https://example.org/page/#id-2',
				'@type'          => 'Question',
				'position'       => 1,
				'url'            => 'https://example.org/page/#id-2',
				'name'           => 'This is the second question',
				'answerCount'    => 1,
				'acceptedAnswer' => [
					'@type'      => 'Answer',
					'text'       => 'This is the second answer',
					'inLanguage' => 'language',
				],
			],
		];

		$actual = $this->instance->generate( $meta_tags_context );

		$this->assertEquals( $expected, $actual );
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
