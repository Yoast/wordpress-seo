<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Loadable_Interface;

/**
 * Test double: a command that opts in to conditional loading by also
 * implementing Loadable_Interface.
 */
final class Conditional_Command_Double implements Command_Interface, Loadable_Interface {

	/**
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return 'conditional_command_double';
	}

	/**
	 * Returns the conditionals the command should be gated on.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ 'Conditional_Class' ];
	}
}
