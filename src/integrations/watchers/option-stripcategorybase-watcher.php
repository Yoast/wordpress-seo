<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexable_Helper;

/**
 * Watches the stripcategorybase key in wpseo_titles, in order to clear the permalink of the category indexables.
 */
class Option_Stripcategorybase_Watcher extends Abstract_Option_Watcher {

	use no_conditionals;

	/**
	 * The Indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Option_Stripcategorybase_Watcher constructor.
	 *
	 * @param Indexable_Helper $indexable_helper The Indexable Helper.
	 */
	public function __construct( Indexable_Helper $indexable_helper )
	{
		$this->indexable_helper = $indexable_helper;
	}

	/**
	 * The option group to watch.
	 *
	 * @return string
	 */
	protected function get_option_group_name()
	{
		return 'wpseo_titles';
	}

	/**
	 * The sub field of the option to monitor.
	 *
	 * @return string
	 */
	protected function get_option_field_name()
	{
		return 'stripcategorybase';
	}

	/**
	 * Handle the changed value.
	 *
	 * @param array $old_value The old value of the option
	 * @param array $new_value The new value of the option
	 */
	protected function handle_changed_option( $old_value, $new_value )
	{
		// Flush the rewrite rules to immediately propagate the change through the site.
		\add_action( 'shutdown', 'flush_rewrite_rules' );

		// The permalinks of categories change so we need to reset indexables.
		$this->indexable_helper->reset_permalink_indexables( 'term', 'category', Indexing_Reasons::REASON_CATEGORY_BASE_PREFIX );
	}
}
