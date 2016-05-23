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
		add_action( 'admin_enqueue_scripts', array( $this, 'recalculate_assets' ) );
		add_action( 'admin_footer', array( $this, 'modal_box' ), 20 );
	}

	/**
	 * Run the localize script.
	 */
	public function recalculate_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'recalculate' );
	}

	/**
	 * Initialize the modal box to be displayed when needed.
	 */
	public function modal_box() {
		// Adding the thickbox.
		add_thickbox();
		wp_enqueue_script( 'wp-a11y' );

		$progress = sprintf(
			/* translators: 1: expands to a <span> containing the number of posts recalculated. 2: expands to a <strong> containing the total number of posts. */
			__( '%1$s of %2$s done.', 'wordpress-seo' ),
			'<span id="wpseo_count">0</span>',
			'<strong id="wpseo_count_total">0</strong>'
		);

		?>
		<div id="wpseo_recalculate" style="display:none;">
			<p><?php esc_html_e( 'Recalculate SEO scores for all pieces of content with a focus keyword.', 'wordpress-seo' ); ?></p>

			<div id="wpseo_progressbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
			<p><?php echo $progress; ?></p>
			<button type="button" id="wpseo-recalculate-close" class="button"><?php esc_html_e( 'Close', 'wordpress-seo' ); ?></button>
		</div>
		<?php
	}
}
