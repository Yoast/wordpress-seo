<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Tests\Generators
 */

namespace Yoast\WP\SEO\Tests\Generators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Generators\Schema\Website;
use Yoast\WP\SEO\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Generators\Schema\WebPage;
use Yoast\WP\SEO\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Generators\Schema\Author;
use Yoast\WP\SEO\Generators\Schema\FAQ;
use Yoast\WP\SEO\Generators\Schema\HowTo;

/**
 * Class Schema_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema_Generator
 *
 * @group generators
 * @group schema
 */
class Schema_Generator_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Schema_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * The meta tags context.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The schema id helper.
	 *
	 * @var ID_Helper|Mockery\MockInterface|ID_Helper
	 */
	protected $id;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page;

	/**
	 * The organisation scheme generator.
	 *
	 * @var Organization|Mockery\MockInterface
	 */
	protected $organization_generator;

	/**
	 * Represents the html helper.
	 *
	 * @var Mockery\Mock|HTML_Helper
	 */
	protected $html;

	/**
	 * Represents the faq block generator.
	 *
	 * @var Mockery\Mock|FAQ
	 */
	protected $faq;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->id                     = Mockery::mock( ID_Helper::class );
		$this->current_page           = Mockery::mock( Current_Page_Helper::class )->makePartial();
		$this->organization_generator = Mockery::mock( Organization::class )->makePartial();

		$this->html = Mockery::mock( HTML_Helper::class )->makePartial();
		$language   = Mockery::mock( Language_Helper::class )->makePartial();

		$website = Mockery::mock( Website::class, [
			Mockery::mock( Options_Helper::class )->makePartial(),
			$this->html,
			$language,
		] )->makePartial();
		$website->set_id_helper( $this->id );

		$webpage = Mockery::mock( WebPage::class, [
			$this->current_page,
			$this->html,
			Mockery::mock( Date_Helper::class )->makePartial(),
			$language,

		] )->makePartial();
		$webpage->set_id_helper( $this->id );

		$this->faq = Mockery::mock( FAQ::class, [ $this->html, $language ] )->makePartial();

		$this->instance = Mockery::mock(
			Schema_Generator::class,
			[
				$this->id,
				$this->current_page,
				$this->organization_generator,
				Mockery::mock( Person::class )->makePartial(),
				$website,
				Mockery::mock( Main_Image::class )->makePartial(),
				$webpage,
				Mockery::mock( Breadcrumb::class, [ $this->current_page ] )->makePartial(),
				Mockery::mock( Article::class )->makePartial(),
				Mockery::mock( Author::class )->makePartial(),
				$this->faq,
				Mockery::mock( HowTo::class )->makePartial(),
			]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->context            = Mockery::mock( Meta_Tags_Context::class )->makePartial();
		$this->context->blocks    = [
			'yoast/faq-block' => [
				[
					'blockName' => 'FAQ Block',
					'attrs'     => [
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
		$this->context->indexable = Mockery::mock( Indexable::class );
	}

	/**
	 * Tests that the @context schema variable is set.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 */
	public function test_generate_with_no_graph() {
		$this->instance
			->expects( 'get_graph_pieces' )
			->once()
			->andReturn( [] );

		$expected = [
			'@context' => 'https://schema.org',
			'@graph'   => [],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests the generate method with having no blocks in the context.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_no_blocks() {
		$this->current_page
			->expects( 'is_home_static_page' )
			->twice()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->context->blocks = [];

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					[
						'@type' => 'WebSite',
						'@id'   => '#website',
						'url'   => null,
						'name' => '',
						'description' => 'description',
						'potentialAction' => [
							'@type' => 'SearchAction',
							'target' => '?s={search_term_string}',
							'query-input' => 'required name=search_term_string',
						],
						'inLanguage' => 'English',
					],
					[
						'@id'   => '#website',
					],
					[
						[
							'@type' => 'ReadAction',
							'target' => [
								null
							],
						],
					],
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests with the generate with having blocks in the context.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_blocks() {
		$this->current_page
			->expects( 'is_home_static_page' )
			->twice()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_' . strtolower( get_class( $this->faq ) ) )
			->with( true );

		$this->assertEquals(
			$this->get_expected_schema(),
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests the generate with having an identifier for the FAQ block.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_generator_have_identifier() {
		$this->current_page
			->expects( 'is_home_static_page' )
			->twice()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		$this->faq->identifier = 'faq_block';

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq_block' )
			->with( true );

		$this->assertEquals(
			$this->get_expected_schema(),
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests the generate with FAQ block not having a generated output.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_block_not_having_generated_output() {
		$this->current_page
			->expects( 'is_home_static_page' )
			->twice()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 2 )
			->andReturnArg( 0 );

		$this->faq
			->expects( 'generate' )
			->with( $this->context )
			->andReturn( 'schema' );

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					[
						'@type'           => 'WebSite',
						'@id'             => '#website',
						'url'             => null,
						'name'            => '',
						'description'     => 'description',
						'potentialAction' => [
							'@type'       => 'SearchAction',
							'target'      => '?s={search_term_string}',
							'query-input' => 'required name=search_term_string',
						],
						'inLanguage'      => 'English',
					],
					[
						'@type'           => [ null, 'FAQPage' ],
						'@id'             => '#webpage',
						'url'             => null,
						'name'            => '',
						'isPartOf'        => [
							'@id' => '#website',
						],
						'inLanguage'      => 'English',
						'potentialAction' => [
							[
								'@type'  => 'ReadAction',
								'target' => [
									null
								],
							],
						],
					],
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * The generated schema that is applicable for almost every test scenario in this file.
	 *
	 * @return array The schema.
	 */
	public function get_expected_schema() {
		return [
			'@context' => 'https://schema.org',
			'@graph'   => [
				[
					'@type'           => 'WebSite',
					'@id'             => '#website',
					'url'             => null,
					'name'            => '',
					'description'     => 'description',
					'potentialAction' => [
						'@type'       => 'SearchAction',
						'target'      => '?s={search_term_string}',
						'query-input' => 'required name=search_term_string',
					],
					'inLanguage'      => 'English',
				],
				[
					'@type'           => [ null, 'FAQPage' ],
					'@id'             => '#webpage',
					'url'             => null,
					'name'            => '',
					'isPartOf'        => [
						'@id' => '#website',
					],
					'inLanguage'      => 'English',
					'potentialAction' => [
						[
							'@type'  => 'ReadAction',
							'target' => [
								null
							],
						],
					],
				],
				[
					'@type'            => 'ItemList',
					'mainEntityOfPage' => [
						'@id' => null,
					],
					'numberOfItems'    => 1,
					'itemListElement'  => [
						[
							'@id' => '#id-1',
						],
					],
				],
				[
					'@type'          => 'Question',
					'@id'            => '#id-1',
					'position'       => 0,
					'url'            => '#id-1',
					'name'           => 'This is a question',
					'answerCount'    => 1,
					'acceptedAnswer' => [
						'@type'      => 'Answer',
						'text'       => 'This is an answer',
						'inLanguage' => 'English',
					],
					'inLanguage'     => 'English',
				],
			],
		];
	}
}
