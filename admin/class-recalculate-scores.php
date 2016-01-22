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
	 * Constructing the object by modalbox, the localization and the totals.
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'init' ), 20 );
	}

	/**
	 * Initialize the recalculate class by setting the needed values.
	 */
	public function init() {
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
	}

	/**
	 * Initialize the modal box to be displayed when needed.
	 */
	private function modal_box() {
		// Adding the thickbox.
		add_thickbox();

		$progress = sprintf(
			/* translators: 1: expands to a <span> containing the number of posts recalculated. 2: expands to a <strong> containing the total number of posts. */
			__( '%1$s of %2$s done.', 'wordpress-seo' ),
			'<span id="wpseo_count">0</span>',
			'<strong id="wpseo_count_total">0</strong>'
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
