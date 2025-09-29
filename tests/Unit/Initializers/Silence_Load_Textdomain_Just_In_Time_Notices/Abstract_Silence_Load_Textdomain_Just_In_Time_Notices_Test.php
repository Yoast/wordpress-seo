<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices;

use Yoast\WP\SEO\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Silence_Load_Textdomain_Just_In_Time_Notices_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Silence_Load_Textdomain_Just_In_Time_Notices
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Silence_Load_Textdomain_Just_In_Time_Notices();
	}
}
