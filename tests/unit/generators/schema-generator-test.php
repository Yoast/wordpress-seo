<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Generators\Schema\FAQ;
use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Generator_Test.
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
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
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
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->id           = Mockery::mock( ID_Helper::class );
		$this->current_page = Mockery::mock( Current_Page_Helper::class );

		$this->html = Mockery::mock( HTML_Helper::class )->makePartial();

		$helpers = Mockery::mock( Helpers_Surface::class );

		$helpers->current_page = $this->current_page;
		$helpers->options      = Mockery::mock( Options_Helper::class )->makePartial();
		$helpers->schema       = (object) [
			'id'       => $this->id,
			'html'     => $this->html,
			'language' => Mockery::mock( Language_Helper::class )->makePartial(),
		];

		$this->instance = Mockery::mock(
			Schema_Generator::class,
			[ $helpers ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->context = Mockery::mock(
			Meta_Tags_Context_Mock::class,
			[
				$helpers->options,
				Mockery::mock( Url_Helper::class ),
				Mockery::mock( Image_Helper::class ),
				Mockery::mock( ID_Helper::class ),
				Mockery::mock( WPSEO_Replace_Vars::class ),
				Mockery::mock( Site_Helper::class ),
				Mockery::mock( User_Helper::class ),
			]
		)->shouldAllowMockingProtectedMethods();

		$this->context->blocks = [
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

		$this->context->shouldReceive( 'is_prototype' )->andReturnFalse();
		$this->context->shouldReceive( 'generate_schema_page_type' )->andReturn( 'WebPage' );

		$this->context->indexable = Mockery::mock( Indexable_Mock::class );
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
		$this->context->indexable->object_sub_type = 'super-custom-post-type';

		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
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
						'@type'           => 'WebSite',
						'@id'             => '#website',
						'url'             => null,
						'name'            => '',
						'description'     => 'description',
						'potentialAction' => [
							[
								'@type'       => 'SearchAction',
								'target'      => '?s={search_term_string}',
								'query-input' => 'required name=search_term_string',
							],
						],
						'inLanguage'      => 'English',
					],
					[
						'@type'           => null,
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
									null,
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
	 * Tests with the generate with having blocks in the context.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_blocks() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
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

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq' )
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
		$piece             = new FAQ();
		$piece->identifier = 'faq_block';
		$this->instance
			->expects( 'get_graph_pieces' )
			->with( $this->context )
			->andReturn( [ $piece ] );

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq_block' )
			->with( true );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the generate with FAQ block not having a generated output.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_generate_with_block_not_having_generated_output() {
		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		$this->assertEquals(
			$this->get_expected_schema(),
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests that a type array with 1 entry gets put without the array.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 * @covers ::validate_type
	 */
	public function test_validate_type_singular_array() {
		$this->context->blocks = [];

		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		Monkey\Filters\expectApplied( 'wpseo_schema_website' )
			->once()
			->andReturn(
				[
					'@type'           => [ 'WebSite' ],
					'@id'             => '#website',
					'url'             => null,
					'name'            => '',
					'description'     => 'description',
					'potentialAction' => [
						[
							'@type'       => 'SearchAction',
							'target'      => '?s={search_term_string}',
							'query-input' => 'required name=search_term_string',
						],
					],
					'inLanguage'      => 'English',
				]
			);

		$this->assertEquals(
			[
				'@type'           => 'WebSite',
				'@id'             => '#website',
				'url'             => null,
				'name'            => '',
				'description'     => 'description',
				'potentialAction' => [
					[
						'@type'       => 'SearchAction',
						'target'      => '?s={search_term_string}',
						'query-input' => 'required name=search_term_string',
					],
				],
				'inLanguage'      => 'English',
			],
			$this->instance->generate( $this->context )['@graph'][0]
		);
	}

	/**
	 * Tests that a type array duplicates get squashed.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 * @covers ::validate_type
	 */
	public function test_validate_type_unique_array() {
		$this->context->blocks = [];

		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		Monkey\Filters\expectApplied( 'wpseo_schema_website' )
			->once()
			->andReturn(
				[
					'@type'           => [ 'WebSite', 'WebSite', 'Something', 'Something', 'Something' ],
					'@id'             => '#website',
					'url'             => null,
					'name'            => '',
					'description'     => 'description',
					'potentialAction' => [
						[
							'@type'       => 'SearchAction',
							'target'      => '?s={search_term_string}',
							'query-input' => 'required name=search_term_string',
						],
					],
					'inLanguage'      => 'English',
				]
			);

		$this->assertEquals(
			[
				'@type'           => [ 'WebSite', 'Something' ],
				'@id'             => '#website',
				'url'             => null,
				'name'            => '',
				'description'     => 'description',
				'potentialAction' => [
					[
						'@type'       => 'SearchAction',
						'target'      => '?s={search_term_string}',
						'query-input' => 'required name=search_term_string',
					],
				],
				'inLanguage'      => 'English',
			],
			$this->instance->generate( $this->context )['@graph'][0]
		);
	}

	/**
	 * Tests getting the graph pieces for a password-protected post.
	 *
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 */
	public function test_get_graph_pieces_on_single_post_with_password_required() {
		Monkey\Functions\expect( 'is_single' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->andReturnFalse();

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnFalse();

		$filtered_webpage_schema = [
			'@type'      => 'WebPage',
			'@id'        => '#webpage',
			'url'        => null,
			'name'       => '',
			'isPartOf'   => [
				'@id' => '#website',
			],
			'inLanguage' => 'English',
		];

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage' )
			->once()
			->andReturn( $filtered_webpage_schema );

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
							[
								'@type'       => 'SearchAction',
								'target'      => '?s={search_term_string}',
								'query-input' => 'required name=search_term_string',
							],
						],
						'inLanguage'      => 'English',
					],
					$filtered_webpage_schema,
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests filtering the WebPage schema for password-protected posts.
	 *
	 * @covers ::protected_webpage_schema
	 */
	public function test_filtering_the_webpage_schema() {
		$graph_piece = [
			'@type'      => 'NULL',
			'@id'        => 'http://basic.wordpress.test/faq-howto/#webpage',
			'url'        => 'http://basic.wordpress.test/faq-howto/',
			'name'       => 'FAQ + HowTo - Basic',
			'author'     => [
				'@id' => 'the_id',
			],
			'inLanguage' => 'en-US',
		];

		$expected = [
			'@type'      => 'WebPage',
			'@id'        => 'http://basic.wordpress.test/faq-howto/#webpage',
			'url'        => 'http://basic.wordpress.test/faq-howto/',
			'name'       => 'FAQ + HowTo - Basic',
			'inLanguage' => 'en-US',
		];

		$this->assertEquals( $expected, $this->instance->protected_webpage_schema( $graph_piece ) );
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
						[
							'@type'       => 'SearchAction',
							'target'      => '?s={search_term_string}',
							'query-input' => 'required name=search_term_string',
						],
					],
					'inLanguage'      => 'English',
				],
				[
					'@type'           => [ null, 'FAQPage' ],
					'@id'             => '#webpage',
					'url'             => null,
					'name'            => null,
					'isPartOf'        => [
						'@id' => '#website',
					],
					'inLanguage'      => 'English',
					'potentialAction' => [
						[
							'@type'  => 'ReadAction',
							'target' => [
								null,
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
					'position'       => 1,
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
