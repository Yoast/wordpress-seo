<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types\Content_Type_Access_Checker;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Content_Type_Access_Checker tests.
 *
 * @group bulk-editor
 */
abstract class Abstract_Content_Type_Access_Checker_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Type_Access_Checker
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Content_Type_Access_Checker();
	}
}
