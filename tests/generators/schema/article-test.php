<?php

namespace Yoast\WP\Free\Tests\Generators\Schema;

use Brain\Monkey;
use Mockery;
use stdClass;
use Yoast\WP\Free\Helpers\Article_Helper;
use Yoast\WP\Free\Helpers\Date_Helper;
use Yoast\WP\Free\Helpers\Schema\ID_Helper;
use Yoast\WP\Free\Presentations\Generators\Schema\Article;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Article_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Generators\Schema\Article
 * @covers ::<!public>
 *
 * @package Yoast\WP\Free\Tests\Generators\Schema
 */
class Article_Test extends TestCase {


	/**
	 * @var Mockery\MockInterface|Article_Helper
	 */
	private $article_helper_mock;

	/**
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date_helper_mock;

	/**
	 * @var Article
	 */
	private $instance;

	/**
	 * @var Meta_Tags_Context
	 */
	private $context_mock;

	/**
	 * @var Mockery\MockInterface|ID_Helper
	 */
	private $id_helper_mock;

	public function setUp() {
		$this->id_helper_mock                     = Mockery::mock( ID_Helper::class );
		$this->id_helper_mock->article_hash       = '#article-hash';
		$this->id_helper_mock->webpage_hash       = '#webpage-hash';
		$this->id_helper_mock->primary_image_hash = '#primary-image-hash';
		$this->article_helper_mock                = Mockery::mock( Article_Helper::class );
		$this->date_helper_mock                   = Mockery::mock( Date_Helper::class );
		$this->instance                           = new Article( $this->article_helper_mock, $this->date_helper_mock );
		$this->context_mock                       = new Meta_Tags_Context();
		$this->context_mock->indexable            = new Indexable();
		$this->context_mock->post                 = new stdClass();
		$this->instance->set_id_helper( $this->id_helper_mock );
		return parent::setUp();
	}

	/**
	 * Tests the if needed method
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->context_mock->indexable->object_type     = 'post';
		$this->context_mock->indexable->object_sub_type = 'article';
		$this->context_mock->site_represents            = 'person';
		$this->context_mock->canonical                  = 'https://permalink';

		$this->article_helper_mock->expects( 'is_article_post_type' )->with( 'article' )->andReturn( true );

		$this->assertTrue( $this->instance->is_needed( $this->context_mock ) );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#article-hash' );
	}

	/**
	 * Tests the if needed method
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_post() {
		$this->context_mock->indexable->object_type     = 'home-page';
		$this->context_mock->main_schema_id             = 'https://permalink#should-not-change';

		$this->assertFalse( $this->instance->is_needed( $this->context_mock ) );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the if needed method
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_article_post_type() {
		$this->context_mock->indexable->object_type     = 'post';
		$this->context_mock->indexable->object_sub_type = 'not-article';
		$this->context_mock->site_represents            = 'person';
		$this->context_mock->main_schema_id             = 'https://permalink#should-not-change';

		$this->article_helper_mock->expects( 'is_article_post_type' )->with( 'not-article' )->andReturn( false );

		$this->assertFalse( $this->instance->is_needed( $this->context_mock ) );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the if needed method
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_site_represents() {
		$this->context_mock->indexable->object_type     = 'post';
		$this->context_mock->site_represents            = false;
		$this->context_mock->main_schema_id             = 'https://permalink#should-not-change';

		$this->assertFalse( $this->instance->is_needed( $this->context_mock ) );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the generate function.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 */
	public function test_generate() {
		$this->context_mock->id                      = 5;
		$this->context_mock->title                   = 'the-title';
		$this->context_mock->canonical               = 'https://permalink';
		$this->context_mock->has_image               = true;
		$this->context_mock->post->post_author       = '3';
		$this->context_mock->post->post_date_gmt     = '2345-12-12 12:12:12';
		$this->context_mock->post->post_modified_gmt = '2345-12-12 23:23:23';

		$this->id_helper_mock->expects( 'get_user_schema_id' )
							 ->once()
							 ->with( '3', $this->context_mock )
							 ->andReturn( 'https://permalink#author-id-hash' );

		Monkey\Functions\expect( 'get_comment_count' )->once()->with( 5 )->andReturn( [ 'approved' => 7 ] );
		Monkey\Filters\expectApplied( 'wpseo_schema_article_keywords_taxonomy' )
			->once()
			->with( 'post_tag' )
			->andReturn( 'post_tag' );

		$terms = [
			(object) [ 'name' => 'Tag1' ],
			(object) [ 'name' => 'Tag2' ],
			(object) [ 'name' => 'Uncategorized' ],
		];
		Monkey\Functions\expect( 'get_the_terms' )->once()->with( 5, 'post_tag' )->andReturn( $terms );
		Monkey\Functions\expect( 'wp_list_pluck' )->once()->with( array_slice( $terms, 0, 2 ), 'name' )->andReturn( [ 'Tag1', 'Tag2' ] );

		Monkey\Filters\expectApplied( 'wpseo_schema_article_sections_taxonomy' )
			->once()
			->with( 'category' )
			->andReturn( 'category' );

		$categories = [ (object) [ 'name' => 'Category1' ] ];
		Monkey\Functions\expect( 'get_the_terms' )->with( 5, 'category' )->andReturn( $categories );
		Monkey\Functions\expect( 'wp_list_pluck' )->once()->with( $categories, 'name' )->andReturn( [ 'Category1' ] );

		$this->date_helper_mock
			->expects( 'mysql_date_to_w3c_format' )
			->once()
			->with( '2345-12-12 12:12:12' )
			->andReturn( '2345-12-12 12:12:12' );

		$this->date_helper_mock
			->expects( 'mysql_date_to_w3c_format' )
			->once()
			->with( '2345-12-12 23:23:23' )
			->andReturn( '2345-12-12 23:23:23' );

		$this->assertEquals(
			[
				'@type'            => 'Article',
				'@id'              => 'https://permalink#article-hash',
				'isPartOf'         => [ '@id' => 'https://permalink#webpage-hash' ],
				'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
				'image'            => [ '@id' => 'https://permalink#primary-image-hash' ],
				'headline'         => 'the-title',
				'datePublished'    => '2345-12-12 12:12:12',
				'dateModified'     => '2345-12-12 23:23:23',
				'commentCount'     => 7,
				'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage-hash' ],
				'keywords'         => 'Tag1,Tag2',
				'articleSection'   => 'Category1',
			],
			$this->instance->generate( $this->context_mock )
		);
	}
}
