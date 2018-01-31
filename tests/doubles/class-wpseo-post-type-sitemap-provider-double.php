<?php

class WPSEO_Post_Type_Sitemap_Provider_Double extends WPSEO_Post_Type_Sitemap_Provider {
	/**
	 * @inheritdoc
	 */
	public function get_url( $post ) {
		return parent::get_url( $post );
	}

	/**
	 * Sets the classifier
	 */
	public function set_classifier( $classifier) {
		self::$classifier = $classifier;
	}

	/**
	 * @inheritdoc
	 */
	public function get_excluded_posts() {
		return parent::get_excluded_posts();
	}

	/**
	 * @inheritdoc
	 */
	public function filter_invalid_ids( array $ids ) {
		return parent::filter_invalid_ids( $ids );
	}
}
