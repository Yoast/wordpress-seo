<?php
/**
 * @package WPSEO\Admin\Filters
 */

/**
 * Class WPSEO_Abstract_Post_Filter
 */
abstract class WPSEO_Abstract_Post_Filter implements WPSEO_WordPress_Integration {

	const FILTER_QUERY_ARG = 'yoast_filter';

	/**
	 * Modify the query based on the FILTER_QUERY_ARG variable in $_GET
	 *
	 * @param string $where Query variables.
	 *
	 * @return string The modified query.
	 */
	abstract public function filter_posts( $where );

	/**
	 * Returns the query value this filter uses.
	 *
	 * @return string The query value this filter uses.
	 */
	abstract public function get_query_val();

	/**
	 * Returns the total number of posts that match this filter.
	 *
	 * @return int The total number of posts that match this filter.
	 */
	abstract protected function get_post_total();

	/**
	 * Returns the label for this filter.
	 *
	 * @return string The label for this filter.
	 */
	abstract protected function get_label();

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		foreach ( $this->get_post_types() as $post_type ) {
			add_filter( 'views_edit-' . $post_type, array( $this, 'add_filter_link' ) );
		}

		add_filter( 'posts_where', array( $this, 'filter_posts' ) );

		if ( $this->is_filter_active() ) {
			add_action( 'restrict_manage_posts', array( $this, 'render_hidden_input' ) );
		}

		if ( $this->is_filter_active() && $this->get_explanation() !== null ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_explanation_assets' ) );
		}
	}

	/**
	 * Enqueues the necessary assets to display a filter explanation.
	 *
	 * @return void
	 */
	public function enqueue_explanation_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'filter-explanation' );
		$asset_manager->enqueue_style( 'filter-explanation' );
		wp_localize_script(
			WPSEO_Admin_Asset_Manager::PREFIX . 'filter-explanation',
			'yoastFilterExplanation',
			array( 'text' => $this->get_explanation() )
		);
	}

	/**
	 * Adds a filter link to the views.
	 *
	 * @param array $views Array with the views.
	 *
	 * @return array Array of views including the added view.
	 */
	public function add_filter_link( array $views ) {
		$views[ 'yoast_' . $this->get_query_val() ] = sprintf(
			'<a href="%1$s"%2$s>%3$s</a> (%4$s)',
			esc_url( $this->get_filter_url() ),
			( $this->is_filter_active() ) ? ' class="current" aria-current="page"' : '',
			$this->get_label(),
			$this->get_post_total()
		);

		return $views;
	}

	/**
	 * Returns a text explaining this filter. Null if no explanation is necessary.
	 *
	 * @return string|null The explanation or null.
	 */
	protected function get_explanation() {
		return null;
	}

	/**
	 * Renders a hidden input to preserve this filter's state when using sub-filters.
	 *
	 * @return void
	 */
	public function render_hidden_input() {
		echo '<input type="hidden" name="' . esc_attr( self::FILTER_QUERY_ARG ) . '" value="' . esc_attr( $this->get_query_val() ) . '">';
	}

	/**
	 * Returns an url to edit.php with post_type and this filter as the query arguments.
	 *
	 * @return string The url to activate this filter.
	 */
	protected function get_filter_url() {
		return add_query_arg( array(
			self::FILTER_QUERY_ARG => $this->get_query_val(),
			'post_type'            => $this->get_current_post_type(),
		), 'edit.php' );
	}

	/**
	 * Returns true when the filter is active.
	 *
	 * @return bool Whether or not the filter is active.
	 */
	protected function is_filter_active() {
		return ( $this->is_supported_post_type( $this->get_current_post_type() )
			&& filter_input( INPUT_GET, self::FILTER_QUERY_ARG ) === $this->get_query_val() );
	}

	/**
	 * Returns the current post type.
	 *
	 * @return string The current post type.
	 */
	protected function get_current_post_type() {
		return filter_input(
			INPUT_GET, 'post_type', FILTER_DEFAULT, array(
				'options' => array( 'default' => 'post' ),
			)
		);
	}

	/**
	 * Returns the post types to which this filter should be added.
	 *
	 * @return array The post types to which this filter should be added.
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}

	/**
	 * Checks if the post type is supported.
	 *
	 * @param string $post_type Post type to check against.
	 *
	 * @return bool True when it is supported.
	 */
	protected function is_supported_post_type( $post_type ) {
		return in_array( $post_type, $this->get_post_types(), true );
	}
}
