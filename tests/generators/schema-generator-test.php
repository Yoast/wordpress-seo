<?php

namespace Yoast\WP\SEO\Tests\Generators;

use Mockery;
use Yoast\WP\SEO\Presentations\Generators\Schema_Generator;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
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
	 * @var Indexable
	 */
	protected $indexable;

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

		$this->organization_generator = $this->mock_generator( Organization::class );
		$this->person_generator = $this->mock_generator( Person::class );
		$this->website_generator = $this->mock_generator( Website::class );
		$this->main_image_generator = $this->mock_generator( Main_Image::class );
		$this->web_page_generator = $this->mock_generator( WebPage::class );
		$this->breadcrumb_generator = $this->mock_generator( Breadcrumb::class );
		$this->article_generator = $this->mock_generator( Article::class );
		$this->author_generator = $this->mock_generator( Author::class );
		$this->faq_generator = $this->mock_generator( FAQ::class );
		$this->how_to_generator = $this->mock_generator( HowTo::class );

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

		$this->indexable          = new Indexable();
		$this->context            = Mockery::mock( Meta_Tags_Context::class );
		$this->context->indexable = $this->indexable;
		$this->context->blocks    = [];
	}

	private function mock_generator( $class ) {
		$mock = Mockery::mock( $class );
		$mock->expects( 'is_needed' )
			->andReturn( false );
		return $mock;
	}

	/**
	 * Tests that the @context schema variable is set.
	 *
	 * @covers ::generate
	 */
	public function test_generate_with_no_graph() {
		$expected = [
			'@context' => 'https://schema.org',
			'@graph'   => [],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}
}
