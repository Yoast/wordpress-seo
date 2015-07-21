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
	 * @var array The fields which should be always queries, can be extended by array_merge
	 */
	private $query_fields   = array(
		'post_type'      => 'any',
		'meta_key'       => '_yoast_wpseo_focuskw',
		'posts_per_page' => -1,
	);

	/**
	 * Constructing the object by setting the AJAX hooks
	 */
	public function __construct() {

		// Loading the modal box.
		$this->modal_box();
	}

	/**
	 * Initializing the
	 */
	private function modal_box() {
		// Adding the thickbox.
		add_thickbox();

		?>
		<div id='wpseo_recalculate' style='display:none;'>
			<p><?php _e( 'Recalculating the SEO scores of all the posts:', 'wordpress-seo' ); ?></p>

			<div id='wpseo_progressbar'></div>
			<p><?php printf(
					__( 'Currently %1$s of %2$s posts recalculated.', 'wordpress-seo' ),
					'<span id="wpseo_count">0</span>',
					'<strong id="wpseo_count_total">' . $this->calculate_posts() . '</strong>'
				);
				?></p>
		</div>
		<?php
	}

	/**
	 * Getting the total number of posts
	 *
	 * @return int
	 */
	private function calculate_posts() {
		$count_posts_query = new WP_Query( $this->query_fields );

		return $count_posts_query->found_posts;
	}



}
