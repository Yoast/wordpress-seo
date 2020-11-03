<?php

namespace Yoast\WP\SEO\Tests\Unit\Context;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Tags_Context_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Context\Meta_Tags_Context
 *
 * @group context
 */
class Meta_Tags_Context_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The site helper.
	 *
	 * @var Site_Helper
	 */
	private $site;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user;

	/**
	 * The permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	private $permalink_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	private $instance;

	/**
	 * Set up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->options              = Mockery::mock( Options_Helper::class );
		$this->url                  = Mockery::mock( Url_Helper::class );
		$this->image                = Mockery::mock( Image_Helper::class );
		$this->id_helper            = Mockery::mock( ID_Helper::class );
		$this->replace_vars         = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->site                 = Mockery::mock( Site_Helper::class );
		$this->user                 = Mockery::mock( User_Helper::class );
		$this->permalink_helper     = Mockery::mock( Permalink_Helper::class );
		$this->indexable_helper     = Mockery::mock( Indexable_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Meta_Tags_Context(
			$this->options,
			$this->url,
			$this->image,
			$this->id_helper,
			$this->replace_vars,
			$this->site,
			$this->user,
			$this->permalink_helper,
			$this->indexable_helper,
			$this->indexable_repository
		);
	}

	/**
	 * Tests the generation of the schema page type.
	 *
	 * @param array        $indexable The indexable data.
	 * @param string|array $expected  The expected value.
	 * @param string       $message   Message to show when test fails.
	 *
	 * @dataProvider generate_schema_page_type_provider
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_type( array $indexable, $expected, $message ) {
		$this->instance->indexable = (object) $indexable;

		Filters\expectApplied( 'wpseo_schema_webpage_type' )->with( $expected );

		$this->assertSame( $expected, $this->instance->generate_schema_page_type(), $message );
	}

	/**
	 * Provides data for the generate schema page type test.
	 *
	 * @return array Test data to use.
	 */
	public function generate_schema_page_type_provider() {
		return [
			[
				'indexable' => [
					'object_type'     => 'system-page',
					'object_sub_type' => 'search-result',
				],
				'expected'  => [ 'CollectionPage', 'SearchResultsPage' ],
				'message'   => 'Tests with an indexable for the search results page.',
			],
			[
				'indexable' => [
					'object_type'     => 'system-page',
					'object_sub_type' => '404',
				],
				'expected'  => 'WebPage',
				'message'   => 'Tests with an indexable for the 404 page.',
			],
			[
				'indexable' => [
					'object_type' => 'user',
				],
				'expected'  => 'ProfilePage',
				'message'   => 'Tests with an indexable for the author page.',
			],
			[
				'indexable' => [
					'object_type' => 'home-page',
				],
				'expected'  => 'CollectionPage',
				'message'   => 'Tests with an indexable for the home page.',
			],
			[
				'indexable' => [
					'object_type' => 'date-archive',
				],
				'expected'  => 'CollectionPage',
				'message'   => 'Tests with an indexable for a date archive.',
			],
			[
				'indexable' => [
					'object_type' => 'term',
				],
				'expected'  => 'CollectionPage',
				'message'   => 'Tests with an indexable for a term archive.',
			],
			[
				'indexable' => [
					'object_type' => 'post-type-archive',
				],
				'expected'  => 'CollectionPage',
				'message'   => 'Tests with an indexable for a post type archive.',
			],
		];
	}

	/**
	 * Tests the page type for a page set as the post page.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_type_with_page_for_posts() {
		$this->instance->indexable = (object) [
			'object_id'        => 1337,
			'object_type'      => 'post',
			'schema_page_type' => 'WebPage',
		];

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1337 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertEquals( [ 'WebPage', 'CollectionPage' ], $actual );
	}

	/**
	 * Tests the schema page type with an additional type.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_type_with_additional_type() {
		$this->instance->indexable = (object) [
			'object_id'        => 1337,
			'object_type'      => 'post',
			'schema_page_type' => 'QAPage',
		];

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1338 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertEquals( [ 'WebPage', 'QAPage' ], $actual );
	}

	/**
	 * Tests the schema page type with an additional type through the site-wide default.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_type_with_additional_type_site_wide_default() {
		$this->instance->indexable = (object) [
			'object_id'        => 1337,
			'object_type'      => 'post',
			'object_sub_type'  => 'super-custom-post',
			'schema_page_type' => null,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'schema-page-type-super-custom-post' )
			->andReturn( 'QAPage' );

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1338 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertEquals( [ 'WebPage', 'QAPage' ], $actual );
	}

	/**
	 * Tests the page type for a post.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_for_a_post() {
		$this->instance->indexable = (object) [
			'object_id'        => 1337,
			'object_type'      => 'post',
			'schema_page_type' => 'WebPage',
		];

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1338 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertEquals( [ 'WebPage' ], $actual );
	}

	/**
	 * Tests the generate site represents without representation.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_without_representation() {
		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturnFalse();

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company without a name.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_without_name() {
		$this->instance->company_name = '';

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company without a logo.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_without_logo() {
		$this->instance->company_name    = 'Company';
		$this->instance->company_logo_id = 0;

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company with name and logo.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_with_name_and_logo() {
		$this->instance->company_name    = 'Company';
		$this->instance->company_logo_id = 12;

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertEquals( 'company', $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a person without a user id.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_person_without_user() {
		$this->instance->site_user_id = 1;

		Functions\expect( 'get_user_by' )->once()->with( 'id', 1 )->andReturn( false );

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'person' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a person without a user id.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_person() {
		$this->instance->site_user_id = 1;

		Functions\expect( 'get_user_by' )->once()->with( 'id', 1 )->andReturn( true );

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'person' );

		$this->assertEquals( 'person', $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the debug info method.
	 *
	 * @covers ::__debugInfo
	 */
	public function test_debug_info() {
		$this->instance->indexable    = 'indexable';
		$this->instance->presentation = 'presentation';

		$expected = [
			'indexable'    => 'indexable',
			'presentation' => 'presentation',
		];

		$this->assertEquals( $expected, $this->instance->__debugInfo() );
	}
}
