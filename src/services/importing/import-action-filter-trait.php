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
	 * @param $all_actions Importing_Action_Interface[] The complete list of actions.
	 * @param $plugin      string                       The Plugin name whose actions to keep.
	 * @param $type        string                       The type of actions to keep.
	 *
	 * @return array
	 */
	public function filter_actions( $all_actions, $plugin = null, $type = null ){
		$actions = $all_actions;

		if ( $plugin ) {
			$actions = array_filter( $actions, function( $action, $plugin ) {
				return $action->plugin === $plugin;
			} );
		}

		if ( $type ) {
			$actions = array_filter( $actions, function( $action, $type ) {
				return $action->plugin === $type;
			} );
		}

		return $actions;
	}
}
