<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Type DTO.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Type
 */
final class Content_Type_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Type
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Content_Type( 'post', 'Posts', 'Post' );
	}

	/**
	 * Tests getting the name.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'post', $this->instance->get_name() );
	}

	/**
	 * Tests getting the label.
	 *
	 * @return void
	 */
	public function test_get_label() {
		$this->assertSame( 'Posts', $this->instance->get_label() );
	}

	/**
	 * Tests getting the singular label.
	 *
	 * @return void
	 */
	public function test_get_singular_label() {
		$this->assertSame( 'Post', $this->instance->get_singular_label() );
	}
}
