<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Indexable_Helper;

/**
 * Conditional that is only met when the site's indexables are being built.
 */
class Should_Index_Indexables_Conditional implements Conditional {

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Should_Index_Indexables_Conditional constructor.
	 *
	 * @param Indexable_Helper $indexable_helper The indexable helper.
	 */
	public function __construct( Indexable_Helper $indexable_helper ) {
		$this->indexable_helper = $indexable_helper;
	}

	/**
	 * Returns `true` when the site's indexables are being built.
	 *
	 * @return bool `true` when the site's indexables are being built.
	 */
	public function is_met() {
		return $this->indexable_helper->should_index_indexables();
	}
}
