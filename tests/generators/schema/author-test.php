<?php

use Yoast\WP\SEO\Helpers\Article_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Helpers\User_Helper;

use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Tests\Mocks\Author;

/**
 * Class Author_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Author
 */
class Author_Test extends TestCase {
	/**
	 * @var Schema\ID_Helper
	 */
	private $id;

	/**
	 * @var Article_Helper
	 */
	private $article;

	/**
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @var Schema\Image_Helper
	 */
	private $schema_image;

	/**
	 * @var Schema\HTML_Helper
	 */
	private $html;

	/**
	 * @var User_Helper
	 */
	private $user;

	/**
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * @var Author
	 */
	private $instance;

	/**
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->article      = Mockery::mock( Article_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->html         = Mockery::mock( Schema\HTML_Helper::class );

		$constructor_args = [
			$this->article,
			$this->image,
			$this->schema_image,
			$this->html
		];

		$this->instance = Mockery::mock( Author::class, $constructor_args )->makePartial();

		$this->id = Mockery::mock( Schema\ID_Helper::class );

		$this->instance->set_id_helper( $this->id );

		$this->meta_tags_context = new Meta_Tags_Context();
	}

	/**
	 * Tests that the author gets a 'mainEntityOfPage' property pointing to the webpage Schema piece on the same page.
	 *
	 * @covers Yoast\WP\SEO\Presentations\Generators\Schema\Author::generate
	 */
	public function test_generate() {
		$user_id = 123;
		$person_data = [
			'@type' => [
				'Person',
			],
      		'@id'   => 'http://basic.wordpress.test/#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
      		'name'  => 'Ad Minnie',
      		'image' => [
				'@type' => 'ImageObject',
        		'@id'   => 'http://basic.wordpress.test/#personlogo',
        		'url'   => 'http://2.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=96&d=mm&r=g',
        		'caption' => 'Ad Minnie',
      		],
      		'sameAs' => [
				'https://facebook.example.org/admin',
				'https://instagram.example.org/admin',
				'https://linkedin.example.org/admin',
			],
		];

		$this->instance->expects( 'build_person_data' )
					   ->once()
					   ->with( $user_id, $this->meta_tags_context )
			           ->andReturn( $person_data );

		$this->id->webpage_hash = '#webpage';

		// Set up the context with values.
		$this->meta_tags_context->post = (Object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (Object) [
			'object_type' => 'user',
			'object_id'   => $user_id,
		];

		$this->meta_tags_context->canonical = 'http://basic.wordpress.test/author/admin/';

		$actual = $this->instance->generate( $this->meta_tags_context );

		$this->assertArrayHasKey( 'mainEntityOfPage', $actual );
		$this->assertEquals( [ '@id' => 'http://basic.wordpress.test/author/admin/#webpage' ], $actual['mainEntityOfPage'] );
	}

}
