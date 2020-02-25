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

	/**
	 * Set up tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );

		$this->id->breadcrumb_hash = '#breadcrumbs';

		$this->instance = new Breadcrumb( $this->current_page );
		$this->instance->set_id_helper( $this->id );
	}

	/**
	 * Tests the generation of the breadcrumbs.
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

		$meta_context = Mockery::mock( Meta_Tags_Context::class );

		$meta_context->presentation = Mockery::mock( Indexable_Presentation::class );
		$meta_context->presentation->breadcrumbs = $breadcrumb_data;

		$meta_context->canonical = 'https://wordpress.example.com/canonical';

		$this->current_page
			->expects( 'is_paged' )
			->andReturn( false );

		$actual = $this->instance->generate( $meta_context );

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
						'url'   => 'http://wordpress.example.com/', // For future proofing, we're trying to change the standard for this.
						'name'  => 'Home',
					],
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'http://basic.wordpress.test/test_post/',
						'url'   => 'http://basic.wordpress.test/test_post/', // For future proofing, we're trying to change the standard for this.
						'name'  => 'Test post',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

}
