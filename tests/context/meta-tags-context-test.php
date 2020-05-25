<?php

namespace Yoast\WP\SEO\Tests\Context;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Meta_Tags_Context_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Context\Meta_Tags_Context
 *
 * @group context
 */
class Meta_Tags_Context_Test extends TestCase {

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @var ID_Helper
	 */
	private $id;

	/**
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * @var Site_Helper
	 */
	private $site;

	/**
	 * @var User_Helper
	 */
	private $user;

	/**
	 * @var Meta_Tags_Context
	 */
	private $instance;

	/**
	 * Set up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->options      = Mockery::mock( Options_Helper::class );
		$this->url          = Mockery::mock( Url_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );
		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->site         = Mockery::mock( Site_Helper::class );
		$this->user         = Mockery::mock( User_Helper::class );

		$this->instance = new Meta_Tags_Context(
			$this->options,
			$this->url,
			$this->image,
			$this->id,
			$this->replace_vars,
			$this->site,
			$this->user
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
			'object_id'   => 1337,
			'object_type' => 'post',
		];

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1337 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertSame( 'CollectionPage', $actual );
	}

	/**
	 * Tests the page type for a post.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_for_a_post() {
		$this->instance->indexable = (object) [
			'object_id'   => 1337,
			'object_type' => 'post',
		];

		Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->andReturn( 1338 );

		$actual = $this->instance->generate_schema_page_type();

		$this->assertSame( 'WebPage', $actual );
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
