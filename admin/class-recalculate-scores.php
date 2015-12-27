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
	 * Constructing the object by setting the AJAX hooks
	 */
	public function __construct() {
		// Loading the modal box.
		$this->modal_box();
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
			'<strong id="wpseo_count_total">' . $this->calculate_posts() . '</strong>'
		);

		?>
		<div id="wpseo_recalculate" style="display:none;">
			<p><?php esc_html_e( 'Recalculating SEO scores for all pieces of content with a focus keyword.', 'wordpress-seo' ); ?></p>

			<div id="wpseo_progressbar"></div>
			<p><?php echo $progress; ?></p>
		</div>
		<?php
	}

	/**
	 * Getting the total number of posts
	 *
	 * @return int
	 */
	private function calculate_posts() {
		global $wpdb;
		return $wpdb->get_var(
			"SELECT COUNT(1)
			FROM $wpdb->posts, $wpdb->postmeta
			WHERE $wpdb->posts.ID = $wpdb->postmeta.post_id
			AND $wpdb->postmeta.meta_key = '_yoast_wpseo_focuskw'"
		);
	}

}
