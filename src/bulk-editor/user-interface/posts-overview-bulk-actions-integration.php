<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds a "Bulk edit" entry to the bulk-actions dropdown on the post overview screens,
 * which sends the user to the bulk editor page with their selection carried over.
 */
class Posts_Overview_Bulk_Actions_Integration implements Integration_Interface {

	/**
	 * The value of the bulk action in the dropdown.
	 */
	public const BULK_ACTION = 'yoast_bulk_editor';

	/**
	 * Holds the Content_Types_Repository.
	 *
	 * @var Content_Types_Repository
	 */
	private $content_types_repository;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Constructs the instance.
	 *
	 * @param Content_Types_Repository $content_types_repository The Content_Types_Repository.
	 * @param Current_Page_Helper      $current_page_helper      The Current_Page_Helper.
	 */
	public function __construct(
		Content_Types_Repository $content_types_repository,
		Current_Page_Helper $current_page_helper
	) {
		$this->content_types_repository = $content_types_repository;
		$this->current_page_helper      = $current_page_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// The supported post types are only known once post types are registered, so defer collecting them.
		\add_action( 'admin_init', [ $this, 'register_bulk_actions' ] );
	}

	/**
	 * Registers the bulk action on the overviews of the post types the bulk editor supports.
	 *
	 * @return void
	 */
	public function register_bulk_actions() {
		// The same capability that gates access to the bulk editor page itself.
		if ( ! \current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		foreach ( $this->content_types_repository->get_content_types() as $content_type ) {
			\add_filter( 'bulk_actions-edit-' . $content_type['name'], [ $this, 'add_bulk_action' ] );
			\add_filter( 'handle_bulk_actions-edit-' . $content_type['name'], [ $this, 'handle_bulk_action' ], 10, 3 );
		}
	}

	/**
	 * Adds the bulk editor entry to the bulk-actions dropdown.
	 *
	 * @param array<string, string|array<string, string>> $actions The bulk actions.
	 *
	 * @return array<string, string|array<string, string>> The bulk actions.
	 */
	public function add_bulk_action( $actions ) {
		// Trashed posts are not listed in the bulk editor, so the trash view does not get the entry.
		if ( $this->current_page_helper->is_trash_overview() ) {
			return $actions;
		}

		// The arrow signals that this action navigates to another page instead of processing in place.
		// VS15 (U+FE0E) forces text presentation, so wp-admin's emoji script leaves the glyph alone;
		// RTL admins get the mirrored glyph.
		$arrow = ( \is_rtl() ) ? "\u{2196}\u{FE0E}" : "\u{2197}\u{FE0E}";

		// A nested array renders as an optgroup (since WP 5.6): the default actions stay first, followed
		// by a visually separated "Yoast SEO" group holding the entry.
		$actions['Yoast SEO'] = [
			self::BULK_ACTION => \__( 'Bulk edit', 'wordpress-seo' ) . ' ' . $arrow,
		];

		return $actions;
	}

	/**
	 * Handles the bulk action by sending the user to the bulk editor page with the selection carried over.
	 *
	 * @param string     $redirect_url The URL the overview would redirect to.
	 * @param string     $action       The bulk action being handled.
	 * @param array<int> $post_ids     The selected post IDs.
	 *
	 * @return string The URL to redirect to.
	 */
	public function handle_bulk_action( $redirect_url, $action, $post_ids ) {
		if ( $action !== self::BULK_ACTION ) {
			return $redirect_url;
		}

		// The filter only fires on the overview of the post type it was registered for, so the
		// current screen carries the content type to preselect.
		$screen = \get_current_screen();
		if ( $screen === null || $screen->post_type === '' ) {
			return $redirect_url;
		}

		$args = [
			'page'                                      => Bulk_Editor_Integration::PAGE,
			Bulk_Editor_Integration::CONTENT_TYPE_PARAM => $screen->post_type,
		];

		$ids = \array_values(
			\array_unique(
				\array_filter(
					\array_map( 'intval', (array) $post_ids ),
					static function ( $id ) {
						return $id > 0;
					},
				),
			),
		);

		if ( $ids !== [] ) {
			// Only the first batch can end up selected; carrying more would only risk hitting URL length limits.
			$args[ Bulk_Editor_Integration::POST_IDS_PARAM ]       = \implode( ',', \array_slice( $ids, 0, Batch_Limit::MAX_ITEMS ) );
			$args[ Bulk_Editor_Integration::SELECTED_COUNT_PARAM ] = \count( $ids );
		}

		return \add_query_arg( $args, \admin_url( 'admin.php' ) );
	}
}
