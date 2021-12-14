<?php

namespace Yoast\WP\SEO\Services\Importing;

use Yoast\WP\SEO\Actions\Importing\Importing_Action_Interface;

/**
 * Trait for filtering a set of importer actions based on plugin and type.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
trait Importer_Action_Filter_Trait {

	/**
	 * Filters all import actions from a list that do not match the given Plugin or Type.
	 *
	 * @param Importing_Action_Interface[] $all_actions The complete list of actions.
	 * @param string                       $plugin      The Plugin name whose actions to keep.
	 * @param string                       $type        The type of actions to keep.
	 *
	 * @return array
	 */
	public function filter_actions( $all_actions, $plugin = null, $type = null ) {
		return \array_filter(
			$all_actions,
			function( $action ) use ( $plugin, $type ) {
				return $action->is_compatible_with( $plugin, $type );
			}
		);
	}
}
