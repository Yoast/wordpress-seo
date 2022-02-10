<?php

namespace Yoast\WP\SEO\Config;

/**
 * Holds the separator options.
 */
class Separator_Options {

	/**
	 * Gets the keys of the separator options.
	 *
	 * Used to validate the separator option.
	 *
	 * @return string[] The separator keys.
	 */
	public function get_separator_keys() {
		return \array_keys( $this->get_separator_options() );
	}

	/**
	 * Get the available separator options.
	 *
	 * @return array
	 */
	public function get_separator_options() {
		$separators = \wp_list_pluck( $this->get_separator_option_list(), 'option' );

		/**
		 * Allow altering the array with separator options.
		 *
		 * @api array $separator_options Array with the separator options.
		 */
		$filtered_separators = \apply_filters( 'wpseo_separator_options', $separators );

		if ( \is_array( $filtered_separators ) && $filtered_separators !== [] ) {
			$separators = \array_merge( $separators, $filtered_separators );
		}

		return $separators;
	}

	/**
	 * Gets the available separator options aria-labels.
	 *
	 * @return array Array with the separator options aria-labels.
	 */
	public function get_separator_options_for_display() {
		$separators     = $this->get_separator_options();
		$separator_list = $this->get_separator_option_list();

		$separator_options = [];

		foreach ( $separators as $key => $label ) {
			$aria_label = isset( $separator_list[ $key ]['label'] ) ? $separator_list[ $key ]['label'] : '';

			$separator_options[ $key ] = [
				'label'      => $label,
				'aria_label' => $aria_label,
			];
		}

		return $separator_options;
	}

	/**
	 * Retrieves a list of separator options.
	 *
	 * @return array An array of the separator options.
	 */
	protected function get_separator_option_list() {
		$separators = [
			'sc-dash'   => [
				'option' => '-',
				'label'  => __( 'Dash', 'wordpress-seo' ),
			],
			'sc-ndash'  => [
				'option' => '&ndash;',
				'label'  => __( 'En dash', 'wordpress-seo' ),
			],
			'sc-mdash'  => [
				'option' => '&mdash;',
				'label'  => __( 'Em dash', 'wordpress-seo' ),
			],
			'sc-colon'  => [
				'option' => ':',
				'label'  => __( 'Colon', 'wordpress-seo' ),
			],
			'sc-middot' => [
				'option' => '&middot;',
				'label'  => __( 'Middle dot', 'wordpress-seo' ),
			],
			'sc-bull'   => [
				'option' => '&bull;',
				'label'  => __( 'Bullet', 'wordpress-seo' ),
			],
			'sc-star'   => [
				'option' => '*',
				'label'  => __( 'Asterisk', 'wordpress-seo' ),
			],
			'sc-smstar' => [
				'option' => '&#8902;',
				'label'  => __( 'Low asterisk', 'wordpress-seo' ),
			],
			'sc-pipe'   => [
				'option' => '|',
				'label'  => __( 'Vertical bar', 'wordpress-seo' ),
			],
			'sc-tilde'  => [
				'option' => '~',
				'label'  => __( 'Small tilde', 'wordpress-seo' ),
			],
			'sc-laquo'  => [
				'option' => '&laquo;',
				'label'  => __( 'Left angle quotation mark', 'wordpress-seo' ),
			],
			'sc-raquo'  => [
				'option' => '&raquo;',
				'label'  => __( 'Right angle quotation mark', 'wordpress-seo' ),
			],
			'sc-lt'     => [
				'option' => '&lt;',
				'label'  => __( 'Less than sign', 'wordpress-seo' ),
			],
			'sc-gt'     => [
				'option' => '&gt;',
				'label'  => __( 'Greater than sign', 'wordpress-seo' ),
			],
		];

		/**
		 * Allows altering the separator options array.
		 *
		 * @api array $separators Array with the separator options.
		 */
		$separator_list = \apply_filters( 'wpseo_separator_option_list', $separators );

		if ( ! \is_array( $separator_list ) ) {
			return $separators;
		}

		return $separator_list;
	}
}
