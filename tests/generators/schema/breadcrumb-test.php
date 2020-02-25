<?php


use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Breadcrumb_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb
 */
class Breadcrumb_Test extends TestCase {

	/**
	 * @var Breadcrumb
	 */
	private $instance;

	/**
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page;

	/**
	 * @var Mockery\MockInterface|ID_Helper
	 */
	private $id;

	private $meta_tags_context;

	/**
	 * Set up tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );

		$this->id->breadcrumb_hash = '#breadcrumbs';

		$this->meta_tags_context               = Mockery::mock( Meta_Tags_Context::class );
		$this->meta_tags_context->presentation = Mockery::mock( Indexable_Presentation::class );
		$this->meta_tags_context->canonical    = 'https://wordpress.example.com/canonical';

		$this->instance = new Breadcrumb( $this->current_page );
		$this->instance->set_id_helper( $this->id );
	}

	/**
	 * Tests the generation of the breadcrumbs.
	 *
	 * @covers \Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb::generate
	 */
	public function test_generate() {
		$breadcrumb_data = [
			[
				'url'  => 'http://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => 'http://basic.wordpress.test/test_post/',
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page
			->expects( 'is_paged' )
			->andReturn( false );

		$actual = $this->instance->generate( $this->meta_tags_context );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumbs',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'http://wordpress.example.com/',
						'url'   => 'http://wordpress.example.com/',
						'name'  => 'Home',
					],
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'http://basic.wordpress.test/test_post/',
						'url'   => 'http://basic.wordpress.test/test_post/',
						'name'  => 'Test post',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether a breadcrumb is hidden when it has a `hide_in_schema` property set to `true`.
	 *
	 * @covers \Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb::generate
	 */
	public function test_do_not_generate_when_hide_in_schema_is_true() {
		$breadcrumb_data = [
			[
				'url'  => 'http://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				// This item should be hidden in the breadcrumbs schema output.
				'url'            => 'http://basic.wordpress.test/test_post/',
				'text'           => 'Test post',
				'id'             => '123',
				'hide_in_schema' => true,
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page
			->expects( 'is_paged' )
			->andReturn( false );

		$actual = $this->instance->generate( $this->meta_tags_context );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumbs',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'http://wordpress.example.com/',
						'url'   => 'http://wordpress.example.com/',
						'name'  => 'Home',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should break on broken breadcrumbs.
	 *
	 * @covers \Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb::generate
	 */
	public function test_generate_break_on_broken_breadcrumbs() {
		$breadcrumb_data = [
			[
				'url'  => 'http://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				// Invalid breadcrumb: no URL.
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$actual = $this->instance->generate( $this->meta_tags_context );

		$this->assertEquals( false, $actual );
	}
}
