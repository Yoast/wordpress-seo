<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Commands\Command_Interface;

/**
 * Test double: a command that does not implement Loadable_Interface and
 * should therefore load unconditionally through the loader.
 */
final class Unconditional_Command_Double implements Command_Interface {

	/**
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return 'unconditional_command_double';
	}
}
