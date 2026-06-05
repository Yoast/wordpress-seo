<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Types_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Types_List.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Types_List
 */
final class Content_Types_List_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Types_List
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Content_Types_List();
	}

	/**
	 * Tests adding and getting content types.
	 *
	 * @return void
	 */
	public function test_add_and_get() {
		$content_type = new Content_Type( 'post', 'Posts' );

		$this->instance->add( $content_type );

		$this->assertSame( [ 'post' => $content_type ], $this->instance->get() );
	}

	/**
	 * Tests that adding a content type with the same name overwrites the previous one.
	 *
	 * @return void
	 */
	public function test_add_overwrites_same_name() {
		$this->instance->add( new Content_Type( 'post', 'Posts' ) );

		$overwriting_content_type = new Content_Type( 'post', 'Articles' );
		$this->instance->add( $overwriting_content_type );

		$this->assertSame( [ 'post' => $overwriting_content_type ], $this->instance->get() );
	}

	/**
	 * Tests parsing the list to an array.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->instance->add( new Content_Type( 'post', 'Posts' ) );
		$this->instance->add( new Content_Type( 'page', 'Pages' ) );

		$this->assertSame(
			[
				[
					'name'  => 'post',
					'label' => 'Posts',
				],
				[
					'name'  => 'page',
					'label' => 'Pages',
				],
			],
			$this->instance->to_array(),
		);
	}

	/**
	 * Tests parsing an empty list to an array.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame( [], $this->instance->to_array() );
	}
}
