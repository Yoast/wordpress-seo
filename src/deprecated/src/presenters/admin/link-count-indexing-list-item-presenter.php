<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Presenter class for the link count indexing tool.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Link_Count_Indexing_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * Link_Count_Indexing_List_Item_Presenter constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param int $total_unindexed The number of objects that need to be indexed.
	 */
	public function __construct( $total_unindexed ) {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Returns the output as string.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function present() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return '';
	}
}
