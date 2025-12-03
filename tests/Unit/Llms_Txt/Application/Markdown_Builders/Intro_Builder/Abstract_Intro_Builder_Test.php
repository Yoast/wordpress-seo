<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Builders\Intro_Builder;

use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Intro_Builder;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Intro Builder tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Intro_Builder_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Intro_Builder
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Intro_Builder();
	}
}
