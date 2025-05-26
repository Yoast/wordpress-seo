<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Escaper;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Markdown Escaper tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Markdown_Escaper_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Markdown_Escaper
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Markdown_Escaper();
	}
}
