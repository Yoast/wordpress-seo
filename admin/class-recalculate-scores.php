<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Recalculate_Scores
 *
 * This class handles the SEO score recalculation for all posts with a filled focus keyword
 */
class WPSEO_Recalculate_Scores {

	/**
	 * @var array The totals for the terms and posts
	 */
	private $recalculate_totals = array();

	/**
	 * Constructing the object by modalbox, the localization and the totals.
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'init' ), 20 );
	}

	/**
	 * Initialize the recalculate class by setting the needed values.
	 */
	public function init() {
		$this->recalculate_totals = $this->get_totals();

		add_action( 'admin_enqueue_scripts', array( $this, 'recalculate_assets' ) );

		// Loading the modal box.
		$this->modal_box();
	}

	/**
	 * Run the localize script.
	 */
	public function recalculate_assets() {
		wp_enqueue_script( 'wpseo-recalculate-script', plugins_url( 'js/wp-seo-recalculate-' . '306' . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ), array(
			'jquery',
			'jquery-ui-core',
			'jquery-ui-progressbar',
		), WPSEO_VERSION, true );
		wp_localize_script( 'wpseo-recalculate-script', 'wpseoRecalculateL10n', $this->recalculate_totals );
	}

	/**
	 * Gets the totals for the posts and terms.
	 *
	 * @return array
	 */
	private function get_totals() {
		return array(
			'posts' => $this->calculate_posts(),
			'terms' => $this->calculate_terms(),
		);
	}

	/**
	 * Getting the total number of posts
	 *
	 * @return int
	 */
	private function calculate_posts() {
		$count_posts_query = new WP_Query(
			array(
				'post_type'      => 'any',
				'meta_key'       => '_yoast_wpseo_focuskw',
				'posts_per_page' => -1,
			)
		);

		return $count_posts_query->found_posts;
	}

	/**
	 * Get the total number of terms
	 *
	 * @return int
	 */
	private function calculate_terms() {
		$total = 0;
		foreach ( get_taxonomies( array(), 'objects' ) as $taxonomy ) {
			$total += wp_count_terms( $taxonomy->name );
		}

		return $total;
	}

	/**
	 * Initializing the modal box to be displayed when needed.
	 */
	private function modal_box() {
		// Adding the thickbox.
		add_thickbox();

		$progress = sprintf(
			/* translators: 1: expands to a <span> containing the number of posts recalculated. 2: expands to a <strong> containing the total number of posts. */
			__( '%1$s of %2$s done.', 'wordpress-seo' ),
			'<span id="wpseo_count">0</span>',
			'<strong id="wpseo_count_total">' . ( $this->recalculate_totals['posts'] + $this->recalculate_totals['terms'] ) . '</strong>'
		);

		?>
		<div id="wpseo_recalculate" style="display:none;">
			<p><?php esc_html_e( 'Recalculating SEO scores for all pieces of content with a focus keyword.', 'wordpress-seo' ); ?></p>

			<div id="wpseo_progressbar"></div>
			<p><?php echo $progress; ?></p>
		</div>
		<?php
	}

}
