<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Delete_Hello_World;

use Yoast\WP\SEO\Task_List\Application\Tasks\Delete_Hello_World;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Delete Hello World task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Delete_Hello_World_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Delete_Hello_World
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new Delete_Hello_World();
		$this->instance->set_enhanced_call_to_action( $this->instance->get_call_to_action() );
	}
}
