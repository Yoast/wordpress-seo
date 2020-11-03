<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Presenter class for the indexation list item.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Indexation_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * Indexation_List_Item_Presenter constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param int              $total_unindexed  The number of objects that need to be indexed.
	 * @param Indexable_Helper $indexable_helper The indexable helper.
	 */
	public function __construct(
		$total_unindexed,
		Indexable_Helper $indexable_helper
	) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Presents the list item for the tools menu.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return string The list item HTML.
	 */
	public function present() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return '';
	}
}
