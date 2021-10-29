<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;
use Yoast\WP\SEO\Actions\Indexing\Limited_Indexing_Action_Interface;

interface Importing_Action_Interface extends Indexation_Action_Interface, Limited_Indexing_Action_Interface {

	/**
	 * Returns the name of the plugin we import from.
	 *
	 * @return string The plugin name.
	 */
	public function get_plugin();

	/**
	 * Returns the type of data we import.
	 *
	 * @return string The type of data.
	 */
	public function get_type();
}
