<?php
/**
 * @package WPSEO\Admin\Links\Reindex
 */

/**
 * Handles the reindexing of links interface in the Dashboard.
 */
class WPSEO_Link_Reindex_Dashboard {
	/** @var array Public post types to scan for unprocessed items */
	protected $public_post_types = array();
	/** @var array Number of unprocessed items per post type */
	protected $unprocessed = array();

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, 'calculate_unprocessed' ), 9 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ), 10 );

		add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );
		add_action( 'wpseo_internal_linking', array( $this, 'add_link_index_interface' ) );
	}

	/**
	 * Calculates the number of unprocessed items per post type.
	 *
	 * @return void
	 */
	public function calculate_unprocessed() {
		$this->public_post_types = WPSEO_Link_Utils::get_public_post_types();

		if ( is_array( $this->public_post_types ) && $this->public_post_types !== array() ) {
			$this->unprocessed = WPSEO_Link_Query::get_unprocessed_count( $this->public_post_types );
		}
	}

	/**
	 * Add the indexing interface for links to the dashboard.
	 */
	public function add_link_index_interface() {
		$total_unprocessed = array_sum( $this->unprocessed );

		$html = '';

		$html .= '<h2>' . esc_html__( 'Text link counter', 'wordpress-seo' ) . '</h2>';
		$html .= '<p>' . sprintf(
			/* translators: 1: link to yoast.com post about internal linking suggestion. 4: is Yoast.com 3: is anchor closing. */
			__( 'The links in all your public texts need to be counted. This will provide insights of which texts need more links to them. If you want to know more about the why and how of internal linking, check out %1$sthe article about internal linking on %2$s%3$s.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15n' ). '" target="_blank">',
				'Yoast.com',
				'</a>'
		) . '</p>';

		if ( $total_unprocessed === 0 ) {
			$html .= '<p>' . $this->message_already_indexed() . '</p>';
		}
		else {
			$height = ( 160 * count( $this->unprocessed ) + 2 );

			$html .= '<p id="reindexLinks">';
			$html .= sprintf(
				'<a id="openLinkIndexing" href="#TB_inline?width=600&height=%1$s&inlineId=wpseo_index_links_wrapper" title="%2$s" class="btn button yoast-js-index-links yoast-js-calculate-index-links--all thickbox">%2$s</a>',
				$height,
				esc_attr( __( 'Counting links in your texts', 'wordpress-seo' ) )
			);
			$html .= '</p>';
		}

		$html .= '<br />';

		echo $html;
	}

	/**
	 * Generates the model box.
	 */
	public function modal_box() {
		if ( ! $this->is_dashboard_page() ) {
			return;
		}

		// Adding the thickbox.
		add_thickbox();

		$blocks = array();

		foreach ( $this->public_post_types as $post_type ) {

			$post_type_labels = get_post_type_labels( get_post_type_object( $post_type ) );
			$post_type_label  = $post_type_labels->name;

			if ( ! isset( $this->unprocessed[ $post_type ] ) || $this->unprocessed[ $post_type ] === 0 ) {
				$inner_text = sprintf( '<p>%s</p>',
					/* Translators: %s resolves to the post type label. */
					esc_html( sprintf( __( 'All your %s are already counted, there is no need to count them again.', 'wordpress-seo' ), $post_type_label ) )
				);
			}
			else {
				$progress = sprintf(
				/* translators: 1: expands to the singular label name. 2: expands to a <span> containing the number of items recalculated. 3: expands to a <strong> containing the total number of items. */
					__( '%1$s %2$s of %3$s processed.', 'wordpress-seo' ),
					$post_type_labels->singular_name,
					sprintf( '<span id="wpseo_count_index_links_%s">0</span>', esc_attr( $post_type ) ),
					sprintf( '<strong id="wpseo_count_%s_total">%d</strong>', esc_attr( $post_type ), $this->unprocessed[ $post_type ] )
				);

				$inner_text = sprintf( '<div id="wpseo_index_links_%s_progressbar" class="wpseo-progressbar"></div>', esc_attr( $post_type ) );
				$inner_text .= sprintf( '<p>%s</p>', $progress );
			}

			$blocks[] = sprintf( '<div><p>%s</p>%s</div>',
				/* Translators: %s resolves to the post type label. */
				esc_html( sprintf( __( 'Counting links in %s', 'wordpress-seo' ), $post_type_label ) ),
				$inner_text
			);
		}

		?>
		<div id="wpseo_index_links_wrapper" class="hidden">
			<?php echo implode( '<hr />', $blocks ); ?>
			<button onclick="tb_remove();" type="button"
					class="button"><?php _e( 'Stop counting', 'wordpress-seo' ); ?></button>
		</div>
		<?php
	}

	/**
	 * Enqueues site wide analysis script
	 */
	public function enqueue() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'reindex-links' );

		$data = array(
			'amount'  => $this->unprocessed,
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
		return ( filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' );
	}

	/**
	 * When everything has been indexed already.
	 *
	 * @return string
	 */
	protected function message_already_indexed() {
		return '<span class="wpseo-checkmark-ok-icon"></span>' . esc_html__( 'Good job! All the links in your texts have been counted.', 'wordpress-seo' );
	}
}
