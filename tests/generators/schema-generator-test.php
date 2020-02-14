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
	 * The instance to test.
	 *
	 * @var Schema_Generator|Mockery\MockInterface|Schema_Generator
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
	 * @var Current_Page_Helper|Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * The organisation scheme generator.
	 *
	 * @var Organization|Mockery\MockInterface|Organization
	 */
	protected $organization_generator;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->id                     = Mockery::mock( ID_Helper::class );
		$this->current_page           = Mockery::mock( Current_Page_Helper::class );
		$this->organization_generator = Mockery::mock( Organization::class );

		$this->instance = Mockery::mock(
			Schema_Generator::class,
			[
				$this->id,
				$this->current_page,
				$this->organization_generator,
				Mockery::mock( Person::class ),
				Mockery::mock( Website::class ),
				Mockery::mock( Main_Image::class ),
				Mockery::mock( WebPage::class ),
				Mockery::mock( Breadcrumb::class ),
				Mockery::mock( Article::class ),
				Mockery::mock( Author::class ),
				Mockery::mock( FAQ::class ),
				Mockery::mock( HowTo::class ),
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
