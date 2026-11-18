<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Generators\Schema\FAQ;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class FAQ_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass Yoast\WP\SEO\Generators\Schema\FAQ
 */
final class FAQ_Test extends TestCase {

	/**
	 * Holds the HTML helper.
	 *
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * Holds the language helper.
	 *
	 * @var Language_Helper
	 */
	private $language;

	/**
	 * Holds the FAQ helper.
	 *
	 * @var FAQ
	 */
	private $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );

		$this->instance = new FAQ();

		$this->instance->helpers = (object) [
			'schema' => (object) [
				'language' => $this->language,
				'html'     => $this->html,
			],
		];
	}

	/**
	 * Test the generation of the FAQ schema piece.
	 *
	 * @covers ::generate
	 * @covers ::generate_question_block
	 * @covers ::add_accepted_answer_property
	 *
	 * @return void
	 */
	public function test_generate() {
		$this->stubEscapeFunctions();

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

		$meta_tags_context                 = new Meta_Tags_Context_Mock();
		$meta_tags_context->blocks         = $blocks;
		$meta_tags_context->main_schema_id = 'https://example.org/page/';
		$meta_tags_context->canonical      = 'https://example.org/page/';

		$this->instance->context = $meta_tags_context;

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
			->times( 4 )
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			[
				'@id'            => 'https://example.org/page/#id-1',
				'@type'          => 'Question',
				'position'       => 1,
				'url'            => 'https://example.org/page/#id-1',
				'name'           => 'This is a question',
				'answerCount'    => 1,
				'acceptedAnswer' => [
					'@type'      => 'Answer',
					'text'       => 'This is an answer',
					'inLanguage' => 'language',
				],
				'inLanguage'     => 'language',
			],
			[
				'@id'            => 'https://example.org/page/#id-2',
				'@type'          => 'Question',
				'position'       => 2,
				'url'            => 'https://example.org/page/#id-2',
				'name'           => 'This is the second question',
				'answerCount'    => 1,
				'acceptedAnswer' => [
					'@type'      => 'Answer',
					'text'       => 'This is the second answer',
					'inLanguage' => 'language',
				],
				'inLanguage'     => 'language',
			],
		];

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that questions with no answers are not generated in the schema.
	 *
	 * @covers ::generate
	 * @covers ::generate_question_block
	 * @covers ::add_accepted_answer_property
	 *
	 * @return void
	 */
	public function test_generate_does_not_output_questions_with_no_answer() {
		$this->stubEscapeFunctions();

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
								'jsonQuestion' => 'This is a question with no answer',
							],
						],
					],
				],
			],
		];

		$meta_tags_context                 = new Meta_Tags_Context_Mock();
		$meta_tags_context->blocks         = $blocks;
		$meta_tags_context->main_schema_id = 'https://example.org/page/';
		$meta_tags_context->canonical      = 'https://example.org/page/';

		$this->instance->context = $meta_tags_context;

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->andReturnArg( 0 );

		$this->html
			->expects( 'sanitize' )
			->once()
			->andReturnArg( 0 );

		$this->language
			->expects( 'add_piece_language' )
			->twice()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			[
				'@id'            => 'https://example.org/page/#id-1',
				'@type'          => 'Question',
				'position'       => 1,
				'url'            => 'https://example.org/page/#id-1',
				'name'           => 'This is a question',
				'answerCount'    => 1,
				'acceptedAnswer' => [
					'@type'      => 'Answer',
					'text'       => 'This is an answer',
					'inLanguage' => 'language',
				],
				'inLanguage'     => 'language',
			],
		];

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that an empty attrs block does not block the schema generation.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_generate_empty_attrs() {
		$this->stubEscapeFunctions();

		$blocks = [
			'yoast/faq-block' => [
				[
					'attrs' => [],
				],
			],
		];

		$meta_tags_context                 = new Meta_Tags_Context_Mock();
		$meta_tags_context->blocks         = $blocks;
		$meta_tags_context->main_schema_id = 'https://example.org/page/';
		$meta_tags_context->canonical      = 'https://example.org/page/';

		$this->instance->context = $meta_tags_context;

		$expected = [];

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that no FAQ Schema pieces are needed when no
	 * FAQ blocks are on the page.
	 *
	 * @covers ::is_needed
	 *
	 * @return void
	 */
	public function test_is_not_needed_when_no_faq_blocks() {
		$meta_tags_context         = new Meta_Tags_Context_Mock();
		$meta_tags_context->blocks = [];

		$this->instance->context = $meta_tags_context;

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that FAQ Schema pieces are needed when there are FAQ blocks
	 * on the page.
	 *
	 * @covers ::is_needed
	 * @covers ::generate_ids
	 *
	 * @return void
	 */
	public function test_is_needed() {
		$this->stubEscapeFunctions();

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
								'jsonQuestion' => 'This is a question with no answer',
							],
						],
					],
				],
			],
		];

		$meta_tags_context                   = new Meta_Tags_Context_Mock();
		$meta_tags_context->blocks           = $blocks;
		$meta_tags_context->schema_page_type = 'WebPage';

		$this->instance->context = $meta_tags_context;

		$this->assertTrue( $this->instance->is_needed() );
		$this->assertEquals( [ 'WebPage', 'FAQPage' ], $meta_tags_context->schema_page_type );
	}

	/**
	 * Sets the language.
	 *
	 * @param array $data The data to extend.
	 *
	 * @return array The altered data.
	 */
	public function set_language( $data ) {
		$data['inLanguage'] = 'language';

		return $data;
	}
}
