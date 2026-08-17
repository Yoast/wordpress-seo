<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Editor_Specific_Replace_Vars;
use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Myyoast_Connection_Data_Presenter;

/**
 * Adds the bulk editor page to the Yoast admin menu.
 */
class Bulk_Editor_Integration implements Integration_Interface {

	/**
	 * The page name.
	 */
	public const PAGE = 'wpseo_page_bulk_edit';

	/**
	 * The assets name.
	 */
	public const ASSETS_NAME = 'bulk-editor-page';

	/**
	 * The URL parameter carrying the content type to preselect.
	 */
	public const CONTENT_TYPE_PARAM = 'content_type';

	/**
	 * The URL parameter carrying the post IDs to preselect, comma-separated.
	 */
	public const POST_IDS_PARAM = 'post_ids';

	/**
	 * The URL parameter carrying how many posts were selected on the overview the user came from.
	 */
	public const SELECTED_COUNT_PARAM = 'selected_count';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the Content_Types_Repository.
	 *
	 * @var Content_Types_Repository
	 */
	private $content_types_repository;

	/**
	 * Holds the Nonce_Repository.
	 *
	 * @var Nonce_Repository
	 */
	private $nonce_repository;

	/**
	 * Holds the Endpoints_Repository.
	 *
	 * @var Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * Holds the Options_Helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Holds the User_Helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Builds the MyYoast connection payload for script data.
	 *
	 * @var Myyoast_Connection_Data_Presenter
	 */
	private $myyoast_connection_data_presenter;

	/**
	 * The replace vars handler, used to build the replacement variable list for the editor.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * Constructs the instance.
	 *
	 * @param WPSEO_Admin_Asset_Manager         $asset_manager                     The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper               $current_page_helper               The Current_Page_Helper.
	 * @param Product_Helper                    $product_helper                    The Product_Helper.
	 * @param Short_Link_Helper                 $short_link_helper                 The Short_Link_Helper.
	 * @param Content_Types_Repository          $content_types_repository          The Content_Types_Repository.
	 * @param Nonce_Repository                  $nonce_repository                  The Nonce_Repository.
	 * @param Endpoints_Repository              $endpoints_repository              The Endpoints_Repository.
	 * @param Options_Helper                    $options_helper                    The Options_Helper.
	 * @param User_Helper                       $user_helper                       The User_Helper.
	 * @param Myyoast_Connection_Data_Presenter $myyoast_connection_data_presenter The MyYoast connection data presenter.
	 * @param WPSEO_Replace_Vars                $replace_vars                      The replace vars handler.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Product_Helper $product_helper,
		Short_Link_Helper $short_link_helper,
		Content_Types_Repository $content_types_repository,
		Nonce_Repository $nonce_repository,
		Endpoints_Repository $endpoints_repository,
		Options_Helper $options_helper,
		User_Helper $user_helper,
		Myyoast_Connection_Data_Presenter $myyoast_connection_data_presenter,
		WPSEO_Replace_Vars $replace_vars
	) {
		$this->asset_manager                     = $asset_manager;
		$this->current_page_helper               = $current_page_helper;
		$this->product_helper                    = $product_helper;
		$this->short_link_helper                 = $short_link_helper;
		$this->content_types_repository          = $content_types_repository;
		$this->nonce_repository                  = $nonce_repository;
		$this->endpoints_repository              = $endpoints_repository;
		$this->options_helper                    = $options_helper;
		$this->user_helper                       = $user_helper;
		$this->myyoast_connection_data_presenter = $myyoast_connection_data_presenter;
		$this->replace_vars                      = $replace_vars;
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
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ] );

		// Hide the menu item without losing the page. See remove_menu_item() for why this runs on admin_head.
		\add_action( 'admin_head', [ $this, 'remove_menu_item' ] );

		// Are we on our page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );
			\add_filter( 'removable_query_args', [ $this, 'add_removable_query_args' ] );
		}
	}

	/**
	 * Removes the bulk editor's submenu item from the Yoast SEO menu while keeping the page reachable by URL.
	 *
	 * Runs on admin_head rather than admin_menu on purpose: by then WordPress has already resolved the page's
	 * parent and capability (so the page stays accessible and keeps its `seo_page_wpseo_page_bulk_edit` body
	 * class, which its styles depend on), but the menu HTML has not been rendered yet, so the item is hidden.
	 * The page is opened from the Tools page instead of its own menu item.
	 *
	 * @return void
	 */
	public function remove_menu_item() {
		\remove_submenu_page( 'wpseo_dashboard', self::PAGE );
	}

	/**
	 * Adds the page to the (currently) last position in the array.
	 *
	 * @param array<array<string|callable|null>> $pages The pages.
	 *
	 * @return array<array<string|callable|null>> The pages.
	 */
	public function add_page( $pages ) {
		$pages[] = [
			'wpseo_dashboard',
			'',
			\__( 'Bulk editor', 'wordpress-seo' ),
			'wpseo_manage_options',
			self::PAGE,
			[ $this, 'display_page' ],
		];

		return $pages;
	}

	/**
	 * Displays the page.
	 *
	 * @return void
	 */
	public function display_page() {
		echo '<div id="yoast-seo-bulk-editor"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		$this->asset_manager->enqueue_script( self::ASSETS_NAME );
		$this->asset_manager->enqueue_style( self::ASSETS_NAME );
		$this->asset_manager->localize_script( self::ASSETS_NAME, 'wpseoBulkEditorData', $this->get_script_data() );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array<string, string|array<string, string|bool>|array<array<string, string>>> The script data.
	 */
	public function get_script_data() {
		$content_types        = $this->content_types_repository->get_content_types();
		$is_premium           = $this->product_helper->is_premium();
		$is_version_supported = $this->is_premium_version_supported( $is_premium );

		return [
			'contentTypes'          => $content_types,
			'endpoints'             => $this->endpoints_repository->get_all_endpoints()->to_array(),
			// These must stay server-generated URLs: the bulk editor assigns them to window.location.href for its
			// "Back to Tools" / logo navigation. If a link ever derives from request input, validate it with
			// wp_validate_redirect() here before exposing it, to avoid an open redirect on the front-end.
			'links'                 => [
				'dashboard' => \admin_url( 'admin.php?page=' . General_Page_Integration::PAGE ),
				'tools'     => \admin_url( 'admin.php?page=wpseo_tools' ),
			],
			'nonce'                 => $this->nonce_repository->get_rest_nonce(),
			'restRoot'              => \esc_url_raw( \rest_url() ),
			'preferences'           => [
				'isPremium'                 => $is_premium,
				'isPremiumVersionSupported' => $is_version_supported,
				'isAiEnabled'               => $this->options_helper->get( 'enable_ai_generator' ) === true,
				'isRtl'                     => \is_rtl(),
				'pluginUrl'                 => \plugins_url( '', \WPSEO_FILE ),
				'premiumUpdateUrl'          => $this->get_premium_update_url(),
			],
			'linkParams'            => $this->short_link_helper->get_query_params(),
			'analysis'              => [
				'contentLocale'         => \get_locale(),
				// Re-scoring only runs when SEO analysis is enabled, matching the post editor.
				'keywordAnalysisActive' => $this->options_helper->get( 'keyword_analysis_active' ) === true,
				// Used when collecting the AI prompt content, so shortcode delimiters are stripped from the
				// text while the content they enclose is kept. Not gated on SEO analysis being enabled: the
				// prompt content is collected for AI suggestions, which do not depend on the analysis.
				'shortcodes'            => $this->get_valid_shortcode_tags(),
			],
			'optInNotificationSeen' => [
				'bulk_editor_tour' => $this->is_tour_opt_in_notification_seen(),
			],
			'initialSelection'      => $this->get_initial_selection( $content_types ),
			'myyoastConnection'     => $this->myyoast_connection_data_presenter->present(),
			'replacementVariables'  => $this->get_replacement_variables(),
		];
	}

	/**
	 * Builds the replacement variable data passed to the JS editor.
	 *
	 * Mirrors Settings_Integration::get_replacement_variables() so the bulk editor's
	 * ReplacementVariableEditor receives the same variable metadata as the settings page.
	 *
	 * @return array{variables: array<int, array<string, string|bool>>, recommended: array<string, string[]>, specific: array<string, string[]>, shared: string[]} The replacement variable data.
	 */
	private function get_replacement_variables(): array {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
		$specific_replace_vars    = new WPSEO_Admin_Editor_Specific_Replace_Vars();
		$replacement_variables    = $this->replace_vars->get_replacement_variables_with_labels();

		return [
			'variables'   => $replacement_variables,
			'recommended' => $recommended_replace_vars->get_recommended_replacevars(),
			'specific'    => $specific_replace_vars->get(),
			'shared'      => $specific_replace_vars->get_generic( $replacement_variables ),
		];
	}

	/**
	 * Checks whether the installed Premium version is compatible with the current Free plugin.
	 *
	 * @param bool $is_premium Whether Premium is the currently active plugin.
	 *
	 * @return bool False when Premium needs upgrading or not active.
	 */
	private function is_premium_version_supported( bool $is_premium ): bool {
		if ( ! $is_premium ) {
			return false;
		}

		$premium_version = $this->product_helper->get_premium_version();

		if ( $premium_version === null ) {
			return false;
		}

		return \version_compare( $premium_version, '28.1-RC0', '>' );
	}

	/**
	 * Returns the one-click Premium update URL for the current user, or an empty string when the user
	 * lacks the `update_plugins` capability (and would hit a wp_die permission error on update.php).
	 *
	 * @return string The nonce-protected update URL, or an empty string.
	 */
	private function get_premium_update_url(): string {
		if ( ! \current_user_can( 'update_plugins' ) ) {
			return '';
		}

		return \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=upgrade-plugin&plugin=wordpress-seo-premium%2Fwp-seo-premium.php' ),
				'upgrade-plugin_wordpress-seo-premium/wp-seo-premium.php',
			),
			\ENT_COMPAT,
		);
	}

	/**
	 * Returns the selection carried over from a post overview bulk action, if any.
	 *
	 * The parameters only decide which rows start out selected in the app; the REST endpoints
	 * enforce the actual per-post edit access when anything is saved.
	 *
	 * @param array<array<string, string>> $content_types The available content types.
	 *
	 * @return array<string, string|int|array<int>> The content type, post IDs and overview selection count.
	 */
	private function get_initial_selection( array $content_types ): array {
		$initial_selection = [
			'contentType'   => '',
			'postIds'       => [],
			'selectedCount' => 0,
		];

		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Reason: read-only display state, no action is taken.
		if ( ! isset( $_GET[ self::CONTENT_TYPE_PARAM ] ) || ! \is_string( $_GET[ self::CONTENT_TYPE_PARAM ] ) ) {
			return $initial_selection;
		}

		$content_type = \sanitize_text_field( \wp_unslash( $_GET[ self::CONTENT_TYPE_PARAM ] ) );
		if ( ! \in_array( $content_type, \array_column( $content_types, 'name' ), true ) ) {
			return $initial_selection;
		}
		$initial_selection['contentType'] = $content_type;

		if ( isset( $_GET[ self::POST_IDS_PARAM ] ) && \is_string( $_GET[ self::POST_IDS_PARAM ] ) ) {
			$post_ids = \explode( ',', \sanitize_text_field( \wp_unslash( $_GET[ self::POST_IDS_PARAM ] ) ) );
			$post_ids = \array_values(
				\array_unique(
					\array_filter(
						\array_map( 'intval', $post_ids ),
						static function ( $id ) {
							return $id > 0;
						},
					),
				),
			);
			$post_ids = \array_slice( $post_ids, 0, Batch_Limit::MAX_ITEMS );

			$initial_selection['postIds']       = $post_ids;
			$initial_selection['selectedCount'] = \count( $post_ids );
		}

		if (
			$initial_selection['postIds'] !== []
			&& isset( $_GET[ self::SELECTED_COUNT_PARAM ] )
			&& \is_string( $_GET[ self::SELECTED_COUNT_PARAM ] )
		) {
			// The count can only grow beyond the carried IDs, never shrink below them.
			$initial_selection['selectedCount'] = \max(
				$initial_selection['selectedCount'],
				\absint( \wp_unslash( $_GET[ self::SELECTED_COUNT_PARAM ] ) ),
			);
		}
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		return $initial_selection;
	}

	/**
	 * Registers the carried-over selection parameters as removable, so WordPress cleans them from the
	 * address bar once the page has picked them up.
	 *
	 * @param array<string> $removable_query_args The removable query args.
	 *
	 * @return array<string> The removable query args.
	 */
	public function add_removable_query_args( $removable_query_args ) {
		$removable_query_args[] = self::POST_IDS_PARAM;
		$removable_query_args[] = self::SELECTED_COUNT_PARAM;

		return $removable_query_args;
	}

	/**
	 * Gets whether the bulk editor guided tour has been seen by the current user.
	 *
	 * @return bool True when the tour has been seen, false otherwise.
	 */
	private function is_tour_opt_in_notification_seen(): bool {
		$current_user_id = $this->user_helper->get_current_user_id();

		return (bool) $this->user_helper->get_meta( $current_user_id, '_yoast_wpseo_bulk_editor_tour_opt_in_notification_seen', true );
	}

	/**
	 * Returns the tags of all registered shortcodes.
	 *
	 * Mirrors what the post editor passes to the analysis (see WPSEO_Metabox::get_valid_shortcode_tags()), so the
	 * parse tree treats shortcodes the same on both pages: the delimiters are removed and the text an enclosing
	 * shortcode wraps is kept. Without this list the raw brackets stay in the text and consume prompt tokens.
	 *
	 * @return array<string> The registered shortcode tags.
	 */
	private function get_valid_shortcode_tags(): array {
		// The global is always set by WordPress, but stay defensive: an empty list only costs shortcode parity.
		if ( ! isset( $GLOBALS['shortcode_tags'] ) || ! \is_array( $GLOBALS['shortcode_tags'] ) ) {
			return [];
		}

		return \array_keys( $GLOBALS['shortcode_tags'] );
	}

	/**
	 * Removes all current WP notices.
	 *
	 * @return void
	 */
	public function remove_notices() {
		\remove_all_actions( 'admin_notices' );
		\remove_all_actions( 'user_admin_notices' );
		\remove_all_actions( 'network_admin_notices' );
		\remove_all_actions( 'all_admin_notices' );
	}
}
