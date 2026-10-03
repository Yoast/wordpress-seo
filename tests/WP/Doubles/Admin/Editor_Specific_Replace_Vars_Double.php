<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Admin_Editor_Specific_Replace_Vars;

/**
 * Test Helper Class.
 */
final class Editor_Specific_Replace_Vars_Double extends WPSEO_Admin_Editor_Specific_Replace_Vars {

	/**
	 * Adds the replavement variables for the given page types.
	 *
	 * @param array $page_types                   Page types to add variables for.
	 * @param array $replacement_variables_to_add The variables to add.
	 *
	 * @return void
	 */
	public function add_for_page_types( array $page_types, array $replacement_variables_to_add ) {
		parent::add_for_page_types( $page_types, $replacement_variables_to_add );
	}

	/**
	 * Returns whether the given page type has editor specific replace vars.
	 *
	 * @param string $page_type The page type to check.
	 *
	 * @return bool True if there are associated editor specific replace vars.
	 */
	public function has_for_page_type( $page_type ) {
		return parent::has_for_page_type( $page_type );
	}
}
