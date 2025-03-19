<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Generators\Schema\FAQ;
use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Presentations\Indexable_Presentation_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Generator_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema_Generator
 * @covers             \Yoast\WP\SEO\Generators\Schema_Generator
 *
 * @group generators
 * @group schema
 */
final class Schema_Generator_Test extends TestCase {

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
	 * The current page helper.
	 *
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page;

	/**
	 * The article helper.
	 *
	 * @var Article_Helper|Mockery\MockInterface
	 */
	protected $article;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper|Mockery\MockInterface
	 */
	protected $date;

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
	 * Represents the replace vars.
	 *
	 * @var Mockery\Mock|Replace_Vars_Helper
	 */
	protected $replace_vars_helper;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page        = Mockery::mock( Current_Page_Helper::class );
		$this->html                = Mockery::mock( HTML_Helper::class )->makePartial();
		$this->article             = Mockery::mock( Article_Helper::class );
		$this->date                = Mockery::mock( Date_Helper::class );
		$this->replace_vars_helper = Mockery::mock( Replace_Vars_Helper::class );

		$container = $this->create_container_with(
			[
				Current_Page_Helper::class => $this->current_page,
				HTML_Helper::class         => $this->html,
				Article_Helper::class      => $this->article,
				Date_Helper::class         => $this->date,
				Language_Helper::class     => new Language_Helper(),
			]
		);
		$helpers   = $this->create_helper_surface( $container );

		$this->instance = Mockery::mock(
			Schema_Generator::class,
			[ $helpers, $this->replace_vars_helper ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->context = Mockery::mock(
			Meta_Tags_Context_Mock::class,
			[
				Mockery::mock( Options_Helper::class ),
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

		$this->context->main_schema_id            = 'https://example.com/the-post/';
		$this->context->indexable                 = Mockery::mock( Indexable_Mock::class );
		$this->context->presentation              = Mockery::mock( Indexable_Presentation_Mock::class );
		$this->context->presentation->source      = Mockery::mock();
		$this->context->presentation->breadcrumbs = [
			'item' => [
				'@type' => 'WebPage',
				'@id'   => 'https://example.com/the-post/#breadcrumb',
				'url'   => 'https://example.com/the-post/#breadcrumb',
				'name'  => 'The post',
			],
		];
	}

	/**
	 * Tests that the @context schema variable is set.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_generate_with_no_graph() {
		$this->instance
			->expects( 'get_graph_pieces' )
			->once()
			->andReturn( [] );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

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
	 * @covers ::finalize_graph
	 * @covers ::remove_empty_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_with_no_blocks() {
		$this->context->indexable->object_sub_type = 'super-custom-post-type';
		$this->context->has_image                  = false;
		$this->context->alternate_site_name        = '';
		$this->context->schema_page_type           = [ 'WebPage' ];
		$this->context->presentation->breadcrumbs  = [
			[
				'url'  => 'https://example.com',
				'text' => 'Home',
			],
			[
				'url'  => 'https://example.com/post1',
				'text' => 'Post 1',
			],
		];
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->current_page->expects( 'is_home_static_page' )->twice()->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->context->blocks = [];

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					[
						'@type'           => 'WebPage',
						'@id'             => 'https://example.com/the-post/',
						'url'             => null,
						'name'            => '',
						'isPartOf'        => [
							'@id' => '#website',
						],
						'inLanguage'      => 'English',
						'breadcrumb'      => [ '@id' => '#breadcrumb' ],
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
						'@type'           => 'BreadcrumbList',
						'@id'             => '#breadcrumb',
						'itemListElement' => [
							[
								'@type'    => 'ListItem',
								'position' => 1,
								'name'     => 'Home',
								'item'     => 'https://example.com',
							],
							[
								'@type'    => 'ListItem',
								'position' => 2,
								'name'     => 'Post 1',
							],
						],
					],
					[
						'@type'           => 'WebSite',
						'@id'             => '#website',
						'url'             => null,
						'name'            => '',
						'description'     => 'description',
						'potentialAction' => [
							[
								'@type'       => 'SearchAction',
								'target'      => [
									'@type'       => 'EntryPoint',
									'urlTemplate' => '?s={search_term_string}',
								],
								'query-input' => [
									'@type'          => 'PropertyValueSpecification',
									'valueRequired'  => true,
									'valueName'      => 'search_term_string',
								],
							],
						],
						'inLanguage'      => 'English',
					],
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests the generate method with having an empty breadcrumb.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 * @covers ::finalize_graph
	 * @covers ::remove_empty_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_with_empty_breadcrumb() {
		$this->context->indexable->object_sub_type = 'super-custom-post-type';
		$this->context->has_image                  = false;
		$this->context->alternate_site_name        = 'Alt Name';
		$this->context->schema_page_type           = [ 'WebPage' ];
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->current_page->expects( 'is_home_static_page' )->twice()->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->context->blocks = [];

		$this->context->presentation->breadcrumbs = [
			[
				'url'  => 'https://example.com',
				'text' => 'Home',
			],
		];

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					[
						'@type'           => 'WebPage',
						'@id'             => 'https://example.com/the-post/',
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
					[
						'@type'           => 'WebSite',
						'@id'             => '#website',
						'url'             => null,
						'name'            => '',
						'alternateName'   => 'Alt Name',
						'description'     => 'description',
						'potentialAction' => [
							[
								'@type'       => 'SearchAction',
								'target'      => [
									'@type'       => 'EntryPoint',
									'urlTemplate' => '?s={search_term_string}',
								],
								'query-input' => [
									'@type'          => 'PropertyValueSpecification',
									'valueRequired'  => true,
									'valueName'      => 'search_term_string',
								],
							],
						],
						'inLanguage'      => 'English',
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
	 *
	 * @return void
	 */
	public function test_generate_with_blocks() {
		$this->stubEscapeFunctions();
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:09',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnFalse();

		$this->article
			->expects( 'is_author_supported' )
			->twice()
			->with( 'post' )
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:09' )
			->andReturn( '2024-12-13 09:58:09' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq' )
			->with( true );

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->assertEquals(
			$this->get_expected_schema(),
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests the generate method with having a yoast-schema block.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_generate_with_yoast_schema_block() {
		$this->stubEscapeFunctions();

		$this->instance
			->expects( 'get_graph_pieces' )
			->once()
			->andReturn( [] );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$yoast_schema = [
			'@id'              => 'http://example.com/#/schema/yoast-recipe',
			'@type'            => 'Recipe',
			'author'           => [
				'@id' => '%%author_id%%',
			],
			'mainEntityOfPage' => [
				'@id' => '%%main_schema_id%%',
			],
			'name'             => 'Recipe',
			'recipeIngredient' => [
				'Ingredient One',
				'Ingredient Two',
			],
		];

		$yoast_schema_replaced = [
			'@id'              => 'http://example.com/#/schema/yoast-recipe',
			'@type'            => 'Recipe',
			'author'           => [
				'@id' => '#author-1337',
			],
			'mainEntityOfPage' => [
				'@id' => '#main',
			],
			'name'             => 'Recipe',
			'recipeIngredient' => [
				'Ingredient One',
				'Ingredient Two',
			],
		];

		$this->context->blocks = [
			'yoast/recipe' => [
				[
					'blockName' => 'Recipe Block',
					'attrs'     => [
						'yoast-schema' => $yoast_schema,
					],
				],
			],
		];

		$this->replace_vars_helper
			->expects( 'replace' )
			->with( $yoast_schema, $this->context->presentation )
			->andReturn( $yoast_schema_replaced );

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$expected = [
			'@context' => 'https://schema.org',
			'@graph'   => [
				[
					'@id'              => 'http://example.com/#/schema/yoast-recipe',
					'@type'            => 'Recipe',
					'author'           => [
						'@id' => '#author-1337',
					],
					'mainEntityOfPage' => [
						'@id' => '#main',
					],
					'name'             => 'Recipe',
					'recipeIngredient' => [
						'Ingredient One',
						'Ingredient Two',
					],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests the generate with having an identifier for the FAQ block.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_generate_with_generator_have_identifier() {
		$this->stubEscapeFunctions();

		$piece             = new FAQ();
		$piece->identifier = 'faq_block';
		$this->instance
			->expects( 'get_graph_pieces' )
			->with( $this->context )
			->andReturn( [ $piece ] );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq_block' )
			->with( true );

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the generate with FAQ block not having a generated output.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_generate_with_block_not_having_generated_output() {
		$this->stubEscapeFunctions();
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:09',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnFalse();

		$this->article
			->expects( 'is_author_supported' )
			->twice()
			->with( 'post' )
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:09' )
			->andReturn( '2024-12-13 09:58:09' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

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
	 *
	 * @return void
	 */
	public function test_validate_type_singular_array() {
		$this->context->blocks = [];
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:09',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnFalse();

		$this->article
			->expects( 'is_author_supported' )
			->twice()
			->with( 'post' )
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:09' )
			->andReturn( '2024-12-13 09:58:09' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

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
							'target'      => [
								'@type'       => 'EntryPoint',
								'urlTemplate' => '?s={search_term_string}',
							],
							'query-input' => [
								'@type'          => 'PropertyValueSpecification',
								'valueRequired'  => true,
								'valueName'      => 'search_term_string',
							],
						],
					],
					'inLanguage'      => 'English',
				]
			);

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

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
						'target'      => [
							'@type'       => 'EntryPoint',
							'urlTemplate' => '?s={search_term_string}',
						],
						'query-input' => [
							'@type'          => 'PropertyValueSpecification',
							'valueRequired'  => true,
							'valueName'      => 'search_term_string',
						],
					],
				],
				'inLanguage'      => 'English',
			],
			$this->instance->generate( $this->context )['@graph'][1]
		);
	}

	/**
	 * Tests that a type array duplicates get squashed.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 * @covers ::validate_type
	 *
	 * @return void
	 */
	public function test_validate_type_unique_array() {
		$this->context->blocks = [];
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:09',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnFalse();

		$this->article
			->expects( 'is_author_supported' )
			->twice()
			->with( 'post' )
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:09' )
			->andReturn( '2024-12-13 09:58:09' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

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
							'target'      => [
								'@type'       => 'EntryPoint',
								'urlTemplate' => '?s={search_term_string}',
							],
							'query-input' => [
								'@type'          => 'PropertyValueSpecification',
								'valueRequired'  => true,
								'valueName'      => 'search_term_string',
							],
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
						'target'      => [
							'@type'       => 'EntryPoint',
							'urlTemplate' => '?s={search_term_string}',
						],
						'query-input' => [
							'@type'          => 'PropertyValueSpecification',
							'valueRequired'  => true,
							'valueName'      => 'search_term_string',
						],
					],
				],
				'inLanguage'      => 'English',
			],
			$this->instance->generate( $this->context )['@graph'][1]
		);
	}

	/**
	 * Tests getting the graph pieces for a password-protected post.
	 *
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_get_graph_pieces_on_single_post_with_password_required() {
		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:09',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnTrue();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:09' )
			->andReturn( '2024-12-13 09:58:09' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnFalse();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$filtered_webpage_schema = [
			'@type'      => 'WebPage',
			'@id'        => 'https://example.com/the-post/',
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

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					$filtered_webpage_schema,
					[
						'@type'           => 'WebSite',
						'@id'             => '#website',
						'url'             => null,
						'name'            => '',
						'description'     => 'description',
						'potentialAction' => [
							[
								'@type'       => 'SearchAction',
								'target'      => [
									'@type'       => 'EntryPoint',
									'urlTemplate' => '?s={search_term_string}',
								],
								'query-input' => [
									'@type'          => 'PropertyValueSpecification',
									'valueRequired'  => true,
									'valueName'      => 'search_term_string',
								],
							],
						],
						'inLanguage'      => 'English',
					],
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests filtering the WebPage schema for password-protected posts.
	 *
	 * @covers ::protected_webpage_schema
	 *
	 * @return void
	 */
	public function test_filtering_the_webpage_schema() {
		$graph_piece = [
			'@type'      => 'NULL',
			'@id'        => 'http://basic.wordpress.test/faq-howto/',
			'url'        => 'http://basic.wordpress.test/faq-howto/',
			'name'       => 'FAQ + HowTo - Basic',
			'author'     => [
				'@id' => 'the_id',
			],
			'inLanguage' => 'en-US',
		];

		$expected = [
			'@type'      => 'WebPage',
			'@id'        => 'http://basic.wordpress.test/faq-howto/',
			'url'        => 'http://basic.wordpress.test/faq-howto/',
			'name'       => 'FAQ + HowTo - Basic',
			'inLanguage' => 'en-US',
		];

		$this->assertEquals( $expected, $this->instance->protected_webpage_schema( $graph_piece ) );
	}

	/**
	 * Tests with the generate with a search page.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_generate_with_search_page() {
		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_sub_type = 'super-custom-post-type';
		$this->context->has_image                  = false;
		$this->context->site_url                   = 'https://fake.url/';
		$this->context->main_schema_id             = 'https://fake.url/?s=searchterm';

		$this->context->schema_page_type = [
			'CollectionPage',
			'SearchResultsPage',
		];
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( true );

		Monkey\Functions\expect( 'get_search_query' )
			->andReturn( 'searchterm' );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		$this->context->blocks = [];

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$this->assertEquals(
			[
				'@context' => 'https://schema.org',
				'@graph'   => [
					[
						'@type'      => [
							'CollectionPage',
							'SearchResultsPage',
						],
						'@id'        => 'https://fake.url/?s=searchterm',
						'url'        => 'https://fake.url/?s=searchterm',
						'name'       => '',
						'isPartOf'   => [
							'@id' => 'https://fake.url/#website',
						],
						'inLanguage' => 'English',
						'breadcrumb' => [ '@id' => '#breadcrumb' ],
					],
					[
						'@type'           => 'WebSite',
						'@id'             => 'https://fake.url/#website',
						'url'             => 'https://fake.url/',
						'name'            => '',
						'description'     => 'description',
						'potentialAction' => [
							[
								'@type'       => 'SearchAction',
								'target'      => [
									'@type'       => 'EntryPoint',
									'urlTemplate' => 'https://fake.url/?s={search_term_string}',
								],
								'query-input' => [
									'@type'          => 'PropertyValueSpecification',
									'valueRequired'  => true,
									'valueName'      => 'search_term_string',
								],
							],
						],
						'inLanguage'      => 'English',
					],
				],
			],
			$this->instance->generate( $this->context )
		);
	}

	/**
	 * Tests with the generate with a post page that was published with schedule (aka, has a modified date earlier than a published date).
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::get_graph_pieces
	 *
	 * @return void
	 */
	public function test_get_graph_pieces_on_scheduled_post() {
		$this->stubEscapeFunctions();
		$this->current_page->expects( 'is_paged' )->andReturns( false );

		$this->context->alternate_site_name        = '';
		$this->context->indexable->object_type     = 'post';
		$this->context->indexable->object_sub_type = 'post';
		$this->context->post                       = (object) [
			'post_date_gmt'     => '2024-12-13 09:58:08',
			'post_modified_gmt' => '2024-12-13 09:58:07',
		];
		$this->context->has_image                  = false;

		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->with( $this->context->post )
			->andReturnFalse();

		$this->article
			->expects( 'is_author_supported' )
			->twice()
			->with( 'post' )
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->once()
			->with( '2024-12-13 09:58:08' )
			->andReturn( '2024-12-13 09:58:08' );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( false );

		$this->current_page
			->expects( 'is_front_page' )
			->andReturnTrue();

		$this->html
			->expects( 'smart_strip_tags' )
			->times( 3 )
			->andReturnArg( 0 );

		$this->replace_vars_helper
			->expects( 'register_replace_vars' )
			->once();

		Monkey\Actions\expectDone( 'wpseo_pre_schema_block_type_yoast/faq-block' )
			->with( $this->context->blocks['yoast/faq-block'], $this->context );

		Monkey\Filters\expectApplied( 'wpseo_schema_needs_faq' )
			->with( true );

		$this->current_page->expects( 'is_home_static_page' )->andReturns( false );
		$this->current_page->expects( 'is_home_posts_page' )->andReturns( false );

		$expected_schema = $this->get_expected_schema();
		unset( $expected_schema['@graph'][0]['dateModified'] );

		$this->assertEquals(
			$expected_schema,
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
					'@type'           => [ null, 'FAQPage' ],
					'@id'             => 'https://example.com/the-post/',
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
					'breadcrumb'      => [ '@id' => '#breadcrumb' ],
					'mainEntity'      => [
						[
							'@id' => '#id-1',
						],
					],
					'datePublished'   => '2024-12-13 09:58:08',
					'dateModified'    => '2024-12-13 09:58:09',
				],
				[
					'@type'           => 'WebSite',
					'@id'             => '#website',
					'url'             => null,
					'name'            => '',
					'description'     => 'description',
					'potentialAction' => [
						[
							'@type'       => 'SearchAction',
							'target'      => [
								'@type'       => 'EntryPoint',
								'urlTemplate' => '?s={search_term_string}',
							],
							'query-input' => [
								'@type'          => 'PropertyValueSpecification',
								'valueRequired'  => true,
								'valueName'      => 'search_term_string',
							],
						],
					],
					'inLanguage'      => 'English',
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
