<?php

namespace Yoast\WP\SEO\Services\Options;

use Yoast\WP\SEO\Exceptions\Option\Method_Unimplemented_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Term_Not_Found_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;

/**
 * The taxonomy metadata service class.
 *
 * BE AWARE!
 * This service is different from the other options services!
 * The option values are the term metadata. They are scoped within taxonomy (slug) and term (ID).
 * To make that happen the get/set require the term and taxonomy as input. Which is why the interface is different.
 */
class Taxonomy_Metadata_Service extends Abstract_Options_Service {

	/**
	 * Holds the WordPress options' option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_taxonomy_metadata';

	/**
	 * The option configurations.
	 *
	 * @var array
	 */
	protected $configurations = [
		'wpseo_bctitle'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_canonical'             => [
			'default' => '',
			'types'   => [ 'empty_string', 'url' ],
		],
		'wpseo_content_score'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_desc'                  => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_focuskeywords'         => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_focuskw'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_is_cornerstone'        => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_keywordsynonyms'       => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_linkdex'               => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_noindex'               => [
			'default' => '',
			'types'   => [ 'string' ],
		],
		'wpseo_opengraph-description' => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-image'       => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-image-id'    => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_opengraph-title'       => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_title'                 => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-description'   => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-image'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-image-id'      => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
		'wpseo_twitter-title'         => [
			'default' => '',
			'types'   => [ 'text_field' ],
		],
	];

	/**
	 * Magic getter to get the option value.
	 *
	 * @param string $key The option key.
	 *
	 * @throws Method_Unimplemented_Exception Always, use get instead.
	 *
	 * @return mixed The option value.
	 */
	public function __get( $key ) {
		throw Method_Unimplemented_Exception::for_method( __METHOD__, __CLASS__ );
	}

	/**
	 * Magic setter to set the option value.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @throws Method_Unimplemented_Exception Always, use set instead.
	 */
	public function __set( $key, $value ) {
		throw Method_Unimplemented_Exception::for_method( __METHOD__, __CLASS__ );
	}

	/**
	 * Retrieves the option/metadata value for a term.
	 *
	 * @param mixed       $term     The term name, (int) term id or (object) term.
	 * @param string      $taxonomy The taxonomy the term belongs to.
	 * @param string|null $key      Optional. Meta value to get (with or without prefix).
	 *
	 * @throws Term_Not_Found_Exception When the term is not found.
	 * @throws Unknown_Exception When the option does not exist.
	 *
	 * @return mixed The term metadata values or value if a key was provided.
	 */
	public function get( $term, $taxonomy, $key = null ) {
		$term_id = $this->get_term_id( $term, $taxonomy );
		if ( $term_id === null ) {
			throw Term_Not_Found_Exception::for_term( $term, $taxonomy );
		}

		$values = $this->get_term_values( $term_id, $taxonomy );
		if ( $key === null ) {
			return $values;
		}

		$prefixed_key = $this->get_prefixed_key( $key );
		if ( ! \array_key_exists( $prefixed_key, $values ) ) {
			throw Unknown_Exception::for_option( $prefixed_key );
		}

		return $values[ $prefixed_key ];
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Sets the option/metadata value for a term.
	 *
	 * @param mixed  $term     The term name, (int) term id or (object) term.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 * @param string $key      The option key.
	 * @param mixed  $value    The option value.
	 *
	 * @throws Term_Not_Found_Exception When the term is not found.
	 * @throws Unknown_Exception When the option does not exist.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When the value is invalid.
	 * @throws Save_Failed_Exception When the save failed.
	 */
	public function set( $term, $taxonomy, $key, $value ) {
		$term_id = $this->get_term_id( $term, $taxonomy );
		if ( $term_id === null ) {
			throw Term_Not_Found_Exception::for_term( $term, $taxonomy );
		}

		$prefixed_key = $this->get_prefixed_key( $key );
		if ( ! \array_key_exists( $prefixed_key, $this->get_configurations() ) ) {
			throw Unknown_Exception::for_option( $prefixed_key );
		}

		// Presuming the default is safe.
		if ( $value === $this->get_configurations()[ $prefixed_key ]['default'] ) {
			$this->set_term_option( $term_id, $taxonomy, $prefixed_key, $value );

			return;
		}
		// Only save when changed.
		if ( isset( $this->get_values()[ $taxonomy ][ $term_id ][ $prefixed_key ] ) && $value === $this->get_values()[ $taxonomy ][ $term_id ][ $prefixed_key ] ) {
			return;
		}

		// Validate, this can throw a Validation_Exception.
		$value = $this->validation_helper->validate_as( $value, $this->get_configurations()[ $prefixed_key ]['types'] );

		$this->set_term_option( $term_id, $taxonomy, $prefixed_key, $value );
	}

	/**
	 * Sets all option/metadata values for a term.
	 *
	 * @param mixed  $term     The term name, (int) term id or (object) term.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 * @param array  $values   The option values to set.
	 *
	 * @throws Term_Not_Found_Exception When the term is not found.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When a value is invalid.
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	public function set_options( $term, $taxonomy, $values ) {
		$term_id = $this->get_term_id( $term, $taxonomy );
		if ( $term_id === null ) {
			throw Term_Not_Found_Exception::for_term( $term, $taxonomy );
		}

		// Loop over the defaults. Resulting in unknown values being ignored.
		$new_term_values = $this->get_defaults();
		foreach ( $new_term_values as $key => $default_value ) {
			$prefixed_key = $this->get_prefixed_key( $key );
			if ( \array_key_exists( $prefixed_key, $values ) ) {
				// Validate, this can throw a Validation_Exception.
				$new_term_values[ $prefixed_key ] = $this->validation_helper->validate_as( $values[ $prefixed_key ], $this->get_configurations()[ $prefixed_key ]['types'] );
			}
		}

		$new_values = $this->get_values();
		if ( ! isset( $new_values[ $taxonomy ] ) ) {
			$new_values[ $taxonomy ] = [];
		}
		$new_values[ $taxonomy ][ $term_id ] = $new_term_values;

		/*
		 * Only update when changed.
		 * This might seem strange, but WP returns false if we try to save the same values.
		 * Which we can not differ from an actual database error.
		 */
		if ( $new_values === $this->get_values() ) {
			return;
		}

		// Update the cache.
		$this->cached_values = $new_values;

		// Save to the database.
		$this->update_wp_options( $this->cached_values );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Retrieves the options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get_options( array $keys = [] ) {
		return $this->get_values();
	}

	/**
	 * Deletes the options.
	 *
	 * As this services lazy saves, no data is saved in the reset.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception When the deletion failed.
	 *
	 * @return void
	 */
	public function reset_options() {
		$this->delete_wp_options();
	}

	/**
	 * Retrieves the default option value.
	 *
	 * @param string $key The option key.
	 *
	 * @throws Method_Unimplemented_Exception Always.
	 *
	 * @return mixed The default value.
	 */
	public function get_default( $key ) {
		throw Method_Unimplemented_Exception::for_method( __METHOD__, __CLASS__ );
	}

	/**
	 * Retrieves additional configurations.
	 *
	 * @param array $configurations The additional configurations to be validated.
	 *
	 * @return array Additional configurations.
	 */
	protected function get_additional_configurations( $configurations = [] ) {
		/**
		 * Filter 'wpseo_taxonomy_metadata_additional_configurations' - Allows developers to add option configurations.
		 *
		 * @see Abstract_Options_Service::$configurations
		 *
		 * @api array The option configurations.
		 */
		$additional_configurations = \apply_filters( 'wpseo_taxonomy_metadata_additional_configurations', $configurations );

		return parent::get_additional_configurations( $additional_configurations );
	}

	/**
	 * Retrieves the term option/metadata values.
	 *
	 * @param int    $term_id  The term ID.
	 * @param string $taxonomy The taxonomy.
	 *
	 * @return array The defaults for the term.
	 */
	protected function get_term_values( $term_id, $taxonomy ) {
		$values = $this->get_values();

		if ( isset( $values[ $taxonomy ][ $term_id ] ) ) {
			return \array_merge( $this->get_defaults(), $values[ $taxonomy ][ $term_id ] );
		}

		return $this->get_defaults();
	}

	/**
	 * Retrieves the term ID.
	 *
	 * @param mixed  $term     The term name, (int) term id or (object) term.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 *
	 * @return int|null The term ID or null.
	 */
	protected function get_term_id( $term, $taxonomy ) {
		if ( \is_int( $term ) ) {
			$term = \get_term_by( 'id', $term, $taxonomy );
		}
		elseif ( \is_string( $term ) ) {
			$term = \get_term_by( 'slug', $term, $taxonomy );
		}

		if ( \is_object( $term ) && isset( $term->term_id ) ) {
			return $term->term_id;
		}

		return null;
	}

	/**
	 * Retrieves the (cached) values.
	 *
	 * @return array The values.
	 */
	protected function get_values() {
		if ( $this->cached_values === null ) {
			$this->cached_values = \get_option( $this->option_name );
			// Database row does not exist. We need an array.
			if ( ! $this->cached_values ) {
				$this->cached_values = [];
			}
		}

		return $this->cached_values;
	}

	/**
	 * Updates an option.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @throws Method_Unimplemented_Exception Always, use set_term_option instead.
	 *
	 * @codeCoverageIgnore Not testable, because it is never called.
	 *
	 * @return void
	 */
	protected function update_option( $key, $value ) {
		throw Method_Unimplemented_Exception::for_method( __METHOD__, __CLASS__ );
	}

	/**
	 * Sets a term option/metadata value.
	 *
	 * @param int    $term_id  The term ID.
	 * @param string $taxonomy The taxonomy.
	 * @param string $key      The option key.
	 * @param mixed  $value    The value to set.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	protected function set_term_option( $term_id, $taxonomy, $key, $value ) {
		// Ensure the cache is filled.
		if ( $this->cached_values === null ) {
			$this->get_values();
		}

		// Only save when changed.
		if ( isset( $this->cached_values[ $taxonomy ][ $term_id ][ $key ] ) && $value === $this->cached_values[ $taxonomy ][ $term_id ][ $key ] ) {
			return;
		}

		// Update the cache.
		if ( ! isset( $this->cached_values[ $taxonomy ] ) ) {
			$this->cached_values[ $taxonomy ]             = [];
			$this->cached_values[ $taxonomy ][ $term_id ] = $this->get_defaults();
		}
		elseif ( ! isset( $this->cached_values[ $taxonomy ][ $term_id ] ) ) {
			$this->cached_values[ $taxonomy ][ $term_id ] = $this->get_defaults();
		}
		$this->cached_values[ $taxonomy ][ $term_id ][ $key ] = $value;

		// Save to the database.
		$this->update_wp_options( $this->cached_values );
	}

	/**
	 * Expands the post types & taxonomies "wildcards" in the configurations.
	 *
	 * @param array $configurations The configurations to expand.
	 *
	 * @return array The expanded configurations.
	 */
	protected function expand_configurations( array $configurations ) {
		return $configurations;
	}

	/**
	 * Ensures the key is prefixed with `wpseo_`.
	 *
	 * @param string $key The key.
	 *
	 * @return string The prefixed key.
	 */
	protected function get_prefixed_key( $key ) {
		if ( \substr( \strtolower( $key ), 0, 6 ) !== 'wpseo_' ) {
			return "wpseo_$key";
		}

		return $key;
	}
}
