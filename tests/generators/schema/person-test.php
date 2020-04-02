<?php

use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;

use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Person_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Person
 */
class Person_Test extends TestCase {
	/**
	 * @var Schema\ID_Helper
	 */
	private $id;

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
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * @var Person
	 */
	private $instance;

	/**
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->html         = Mockery::mock( Schema\HTML_Helper::class );
		$this->id           = Mockery::mock( Schema\ID_Helper::class );

		$this->instance = Mockery::mock( Person::class )->makePartial();

		$this->meta_tags_context = new Meta_Tags_Context();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'image'  => $this->image,
			'schema' => (object) [
				'id'      => $this->id,
				'image'   => $this->schema_image,
				'html'    => $this->html,
			]
		];
	}

	/**
	 * Tests whether the person Schema piece is shown when the site represents a person.
	 * @covers Person::is_needed
	 */
	public function test_is_shown_when_site_represents_person() {
		$this->meta_tags_context->site_represents = 'person';
		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests whether the person Schema piece is shown on author archive pages.
	 * @covers Person::is_needed
	 */
	public function test_is_shown_on_author_archive_pages() {
		$this->meta_tags_context->indexable = (Object) [
			'object_type' => 'user'
		];
		$this->assertTrue( $this->instance->is_needed() );
	}
}
