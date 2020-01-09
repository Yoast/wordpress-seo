<?php

namespace Yoast\WP\SEO\Tests\Generators;

use Mockery;
use Yoast\WP\SEO\Presentations\Generators\Schema_Generator;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Organization;
use Yoast\WP\SEO\Presentations\Generators\Schema\Person;
use Yoast\WP\SEO\Presentations\Generators\Schema\Website;
use Yoast\WP\SEO\Presentations\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Presentations\Generators\Schema\WebPage;
use Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Presentations\Generators\Schema\Article;
use Yoast\WP\SEO\Presentations\Generators\Schema\Author;
use Yoast\WP\SEO\Presentations\Generators\Schema\FAQ;
use Yoast\WP\SEO\Presentations\Generators\Schema\HowTo;

/**
 * Class Schema_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema_Generator
 *
 * @group generators
 * @group schema
 */
class Schema_Generator_Test extends TestCase {

	/**
	 * @var Schema_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Mockery\MockInterface|Meta_Tags_Context
	 */
	protected $context;

	/**
	 * @var ID_Helper|Mockery\MockInterface
	 */
	protected $id_helper;

	/**
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page_helper;

	/**
	 * @var Organization|Mockery\MockInterface
	 */
	protected $organization_generator;

	/**
	 * @var Person|Mockery\MockInterface
	 */
	protected $person_generator;

	/**
	 * @var Website|Mockery\MockInterface
	 */
	protected $website_generator;

	/**
	 * @var Main_Image|Mockery\MockInterface
	 */
	protected $main_image_generator;

	/**
	 * @var WebPage|Mockery\MockInterface
	 */
	protected $web_page_generator;

	/**
	 * @var Breadcrumb|Mockery\MockInterface
	 */
	protected $breadcrumb_generator;

	/**
	 * @var Article|Mockery\MockInterface
	 */
	protected $article_generator;

	/**
	 * @var Author|Mockery\MockInterface
	 */
	protected $author_generator;

	/**
	 * @var FAQ|Mockery\MockInterface
	 */
	protected $faq_generator;

	/**
	 * @var HowTo|Mockery\MockInterface
	 */
	protected $how_to_generator;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->id_helper = Mockery::mock( ID_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->organization_generator = Mockery::mock( Organization::class );
		$this->person_generator = Mockery::mock( Person::class );
		$this->website_generator = Mockery::mock( Website::class );
		$this->main_image_generator = Mockery::mock( Main_Image::class );
		$this->web_page_generator = Mockery::mock( WebPage::class );
		$this->breadcrumb_generator = Mockery::mock( Breadcrumb::class );
		$this->article_generator = Mockery::mock( Article::class );
		$this->author_generator = Mockery::mock( Author::class );
		$this->faq_generator = Mockery::mock( FAQ::class );
		$this->how_to_generator = Mockery::mock( HowTo::class );

		$this->instance = Mockery::mock(
			Schema_Generator::class,
			[
				$this->id_helper,
				$this->current_page_helper,
				$this->organization_generator,
				$this->person_generator,
				$this->website_generator,
				$this->main_image_generator,
				$this->web_page_generator,
				$this->breadcrumb_generator,
				$this->article_generator,
				$this->author_generator,
				$this->faq_generator,
				$this->how_to_generator,
			]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->context            = Mockery::mock( Meta_Tags_Context::class );
		$this->context->blocks    = [];
	}

	/**
	 * Tests that the @context schema variable is set.
	 *
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
}
