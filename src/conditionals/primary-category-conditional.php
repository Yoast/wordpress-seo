<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;

/**
 * Conditional that is only met when in frontend or page is a post overview or post add/edit form.
 */
class Primary_Category_Conditional implements Conditional {

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * Primary_Category_Conditional constructor.
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 */
	public function __construct( Current_Page_Helper $current_page ) {
		$this->current_page = $current_page;
	}

	/**
	 * Returns `true` when on the frontend,
	 * or when on the post overview, post edit or new post admin page.
	 *
	 * @return bool `true` when on the frontend, or when on the post overview,
	 *          post edit or new post admin page.
	 */
	public function is_met() {
		if ( ! \is_admin() ) {
			return true;
		}

		return \in_array( $this->current_page->get_current_admin_page(), [ 'edit.php', 'post.php', 'post-new.php' ], true );
	}
}
