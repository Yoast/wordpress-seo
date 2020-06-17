<?php
/**
 * Watcher for the stripcategorybase key in wpseo_titles, in order to clear the permalink of the category indexables.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\WordPress\Wrapper;

/**
 * Watches the stripcategorybase key in wpseo_titles, in order to clear the permalink of the category indexables.
 */
class Indexable_Category_Permalink_Watcher implements Integration_Interface {

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Permalink_Watcher constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options_helper = $options;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo_titles', [ $this, 'check_option' ], 10, 2 );
	}

	/**
	 * Checks if the stripcategorybase key in wpseo_titles has a change in value, and if so,
	 * clears the permalink for category indexables.
	 *
	 * @param array $old_value The old value of the wpseo_titles option.
	 * @param array $new_value The new value of the wpseo_titles option.
	 *
	 * @return void
	 */
	public function check_option( $old_value, $new_value ) {
		// If this is the first time saving the option, in which case its value would be false.
		if ( $old_value === false ) {
			$old_value = [];
		}

		// If either value is not an array, return.
		if ( ! \is_array( $old_value ) || ! \is_array( $new_value ) ) {
			return;
		}

		// If both values aren't set, they haven't changed.
		if ( ! isset( $old_value['stripcategorybase'] ) && ! isset( $new_value['stripcategorybase'] ) ) {
			return;
		}

		// If a new value has been set for 'stripcategorybase', clear the category permalinks.
		if ( $old_value['stripcategorybase'] !== $new_value['stripcategorybase'] ) {
			$this->clear_category_permalinks();

			return;
		}
	}

	/**
	 * Clears the permalinks for category indexables.
	 *
	 * @return void
	 */
	protected function clear_category_permalinks() {
		$result = Wrapper::get_wpdb()->update(
			Model::get_table_name( 'Indexable' ),
			[
				'permalink'      => null,
				'permalink_hash' => null,
			],
			[ 'object_type' => 'term', 'object_sub_type' => 'category' ]
		);

		if ( $result > 0 ) {
			$this->options_helper->set( 'indexables_indexation_reason', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX );
		}
	}
}
