<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links\Reindex
 */

/**
 * Handles the reindexing of links interface in the Dashboard.
 */
class WPSEO_Link_Reindex_Dashboard {

	/**
	 * Public post types to scan for unprocessed items.
	 *
	 * @var array
	 */
	protected $public_post_types = array();

	/**
	 * Number of unprocessed items.
	 *
	 * @var int
	 */
	protected $unprocessed = 0;

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'calculate_unprocessed' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ), 10 );

		add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );

		add_action( 'wpseo_tools_overview_list_items', array( $this, 'show_tools_overview_item' ), 10 );
	}

	/**
	 * Calculates the number of unprocessed items per post type.
	 *
	 * @return void
	 */
	public function calculate_unprocessed() {
		$this->public_post_types = apply_filters( 'wpseo_link_count_post_types', WPSEO_Post_Type::get_accessible_post_types() );

		if ( is_array( $this->public_post_types ) && $this->public_post_types !== array() ) {
			$this->unprocessed = WPSEO_Link_Query::get_unprocessed_count( $this->public_post_types );
		}
	}

	/**
	 * Adds an item to the tools page overview list.
	 *
	 * @return void
	 */
	public function show_tools_overview_item() {
		echo '<li>';
		echo '<strong>' . esc_html__( 'Text link counter', 'wordpress-seo' ) . '</strong><br/>';

		if ( ! $this->has_unprocessed() ) {
			echo $this->message_already_indexed();
		}

		if ( $this->has_unprocessed() ) {
			printf( '<span id="reindexLinks">%s</span>', $this->message_start_indexing() );
		}

		echo '</li>';
	}

	/**
	 * Generates the model box.
	 *
	 * @return void
	 */
	public function modal_box() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		// Adding the thickbox.
		add_thickbox();

		$blocks = array();

		if ( ! $this->has_unprocessed() ) {
			$inner_text = sprintf(
				'<p>%s</p>',
				esc_html__( 'All your texts are already counted, there is no need to count them again.', 'wordpress-seo' )
			);
		}

		if ( $this->has_unprocessed() ) {
			$progress = sprintf(
				/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
				__( 'Text %1$s of %2$s processed.', 'wordpress-seo' ),
				'<span id="wpseo_count_index_links">0</span>',
				sprintf( '<strong id="wpseo_count_total">%d</strong>', $this->get_unprocessed_count() )
			);

			$inner_text  = '<div id="wpseo_index_links_progressbar" class="wpseo-progressbar"></div>';
			$inner_text .= sprintf( '<p>%s</p>', $progress );
		}

		$blocks[] = sprintf(
			'<div><p>%s</p>%s</div>',
			esc_html__( 'Counting links in your texts', 'wordpress-seo' ),
			$inner_text
		);
		?>
		<div id="wpseo_index_links_wrapper" class="hidden">
			<?php echo implode( '<hr />', $blocks ); ?>
			<button onclick="tb_remove();" type="button"
					class="button"><?php esc_html_e( 'Stop counting', 'wordpress-seo' ); ?></button>
		</div>
		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 *
	 * @return void
	 */
	public function enqueue() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'reindex-links' );

		$data = array(
			'amount'  => $this->get_unprocessed_count(),
			'restApi' => array(
				'root'     => esc_url_raw( rest_url() ),
				'endpoint' => WPSEO_Link_Reindex_Post_Endpoint::REST_NAMESPACE . '/' . WPSEO_Link_Reindex_Post_Endpoint::ENDPOINT_QUERY,
				'nonce'    => wp_create_nonce( 'wp_rest' ),
			),
			'message' => array(
				'indexingCompleted' => $this->message_already_indexed(),
			),
			'l10n'    => array(
				'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => __( 'Calculation completed.', 'wordpress-seo' ),
			),
		);

		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'reindex-links', 'yoastReindexLinksData', array( 'data' => $data ) );
	}

	/**
	 * Checks if the current page is the dashboard page.
	 *
	 * @return bool True when current page is the dashboard page.
	 */
	protected function is_dashboard_page() {
		return ( filter_input( INPUT_GET, 'page' ) === 'wpseo_tools' );
	}

	/**
	 * Retrieves the string to display when everything has been indexed.
	 *
	 * @return string The message to show when everything has been indexed.
	 */
	public function message_already_indexed() {
		return '<span class="wpseo-checkmark-ok-icon"></span>' . esc_html__( 'Good job! All the links in your texts have been counted.', 'wordpress-seo' );
	}

	/**
	 * Returns if there are unprocessed items
	 *
	 * @return bool True if there are unprocessed items.
	 */
	public function has_unprocessed() {
		return $this->unprocessed > 0;
	}

	/**
	 * Returns the number of unprocessed items.
	 *
	 * @return int Number of unprocessed items.
	 */
	public function get_unprocessed_count() {
		return $this->unprocessed;
	}

	/**
	 * Retrieves the message to show starting indexation.
	 *
	 * @return string The message.
	 */
	public function message_start_indexing() {
		return sprintf(
			'<a id="openLinkIndexing" href="#TB_inline?width=600&height=%1$s&inlineId=wpseo_index_links_wrapper" title="%2$s" class="btn button yoast-js-index-links yoast-js-calculate-index-links--all thickbox">%2$s</a>',
			175,
			esc_attr__( 'Count links in your texts', 'wordpress-seo' )
		);
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Add the indexing interface for links to the dashboard.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function add_link_index_interface() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );

		$html  = '';
		$html .= '<h2>' . esc_html__( 'Text link counter', 'wordpress-seo' ) . '</h2>';
		$html .= '<p>' . sprintf(
			/* translators: 1: link to yoast.com post about internal linking suggestion. 4: is Yoast.com 3: is anchor closing. */
			__( 'The links in all your public texts need to be counted. This will provide insights of which texts need more links to them. If you want to know more about the why and how of internal linking, check out %1$sthe article about internal linking on %2$s%3$s.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15n' ) . '" target="_blank">',
			'Yoast.com',
			'</a>'
		) . '</p>';

		if ( ! $this->has_unprocessed() ) {
			$html .= '<p>' . $this->message_already_indexed() . '</p>';
		}

		if ( $this->has_unprocessed() ) {
			$html .= '<p id="reindexLinks">' . $this->message_start_indexing() . '</p>';
		}

		$html .= '<br />';

		echo $html;
	}
}
