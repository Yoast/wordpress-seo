<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Handles storage keys for sitemaps caching and invalidation.
 */
class WPSEO_Sitemaps_Cache_Validator {

	/** Name of the option that holds the global validation value */
	const VALIDATION_GLOBAL_KEY = 'wpseo_sitemap_cache_validator_global';

	/** The format which creates the key of the option that holds the type validation value */
	const VALIDATION_TYPE_KEY_FORMAT = 'wpseo_sitemap_%s_cache_validator';

	/**
	 * Get the cache key for a certain type and page
	 *
	 * A type of cache would be something like 'page', 'post' or 'video'.
	 *
	 * Example key format for sitemap type "post", page 1: wpseo_sitemap_post_1:akfw3e_23azBa
	 *
	 * @param null|string $type The type to get the key for. Null or self::SITEMAP_INDEX_TYPE for index cache.
	 * @param int         $page The page of cache to get the key for.
	 *
	 * @return bool|string The key where the cache is stored on. False if the key could not be generated.
	 */
	public static function get_storage_key( $type = null, $page = 1 ) {

		// Using SITEMAP_INDEX_TYPE for sitemap index cache.
		$type = is_null( $type ) ? WPSEO_Sitemaps::SITEMAP_INDEX_TYPE : $type;

		$global_cache_validator = self::get_validator();
		$type_cache_validator   = self::get_validator( $type );

		$prefix  = WPSEO_Sitemaps_Cache::STORAGE_KEY_PREFIX;
		$postfix = sprintf( '_%d:%s_%s', $page, $global_cache_validator, $type_cache_validator );

		try {
			$type = WPSEO_Sitemaps_Cache::truncate_type( $type, $prefix, $postfix );
		}
		catch ( OutOfBoundsException $exception ) {
			// Maybe do something with the exception, for now just mark as invalid.
			return false;
		}

		// Build key.
		$full_key = $prefix . $type . $postfix;

		return $full_key;
	}

	/**
	 * Invalidate sitemap cache
	 *
	 * @param null|string $type The type to get the key for. Null for all caches.
	 *
	 * @return void
	 */
	public static function invalidate_storage( $type = null ) {

		// Global validator gets cleared when no type is provided.
		$old_validator = null;

		// Get the current type validator.
		if ( ! is_null( $type ) ) {
			$old_validator = self::get_validator( $type );
		}

		// Refresh validator.
		self::create_validator( $type );

		if ( ! wp_using_ext_object_cache() ) {
			// Clean up current cache from the database.
			WPSEO_Sitemaps_Cache::cleanup_database( $type, $old_validator );
		}

		// External object cache pushes old and unretrieved items out by itself so we don't have to do anything for that.
	}

	/**
	 * Get the current cache validator
	 *
	 * Without the type the global validator is returned.
	 *  This can invalidate -all- keys in cache at once
	 *
	 * With the type parameter the validator for that specific
	 *  type can be invalidated
	 *
	 * @param string $type Provide a type for a specific type validator, empty for global validator.
	 *
	 * @return null|string The validator for the supplied type.
	 */
	public static function get_validator( $type = '' ) {

		$key = self::get_validator_key( $type );

		$current = get_option( $key, null );
		if ( ! is_null( $current ) ) {
			return $current;
		}

		if ( self::create_validator( $type ) ) {
			return self::get_validator( $type );
		}

		return null;
	}

	/**
	 * Get the cache validator option key for the specified type
	 *
	 * @param string $type Provide a type for a specific type validator, empty for global validator.
	 *
	 * @return string Validator to be used to generate the cache key.
	 */
	public static function get_validator_key( $type = '' ) {

		if ( empty( $type ) ) {
			return self::VALIDATION_GLOBAL_KEY;
		}

		return sprintf( self::VALIDATION_TYPE_KEY_FORMAT, $type );
	}

	/**
	 * Refresh the cache validator value
	 *
	 * @param string $type Provide a type for a specific type validator, empty for global validator.
	 *
	 * @return bool True if validator key has been saved as option.
	 */
	public static function create_validator( $type = '' ) {

		$key = self::get_validator_key( $type );

		// Generate new validator.
		$microtime = microtime();

		// Remove space.
		list( $milliseconds, $seconds ) = explode( ' ', $microtime );

		// Transients are purged every 24h.
		$seconds      = ( $seconds % DAY_IN_SECONDS );
		$milliseconds = substr( $milliseconds, 2, 5 );

		// Combine seconds and milliseconds and convert to integer.
		$validator = intval( $seconds . '' . $milliseconds, 10 );

		// Apply base 61 encoding.
		$compressed = self::convert_base10_to_base61( $validator );

		return update_option( $key, $compressed );
	}

	/**
	 * Encode to base61 format.
	 *
	 * This is base64 (numeric + alpha + alpha upper case) without the 0.
	 *
	 * @param int $base10 The number that has to be converted to base 61.
	 *
	 * @return string Base 61 converted string.
	 *
	 * @throws InvalidArgumentException When the input is not an integer.
	 */
	public static function convert_base10_to_base61( $base10 ) {

		if ( ! is_int( $base10 ) ) {
			throw new InvalidArgumentException( __( 'Expected an integer as input.', 'wordpress-seo' ) );
		}

		// Characters that will be used in the conversion.
		$characters = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$length     = strlen( $characters );

		$remainder = $base10;
		$output    = '';

		do {
			// Building from right to left in the result.
			$index = ( $remainder % $length );

			// Prepend the character to the output.
			$output = $characters[ $index ] . $output;

			// Determine the remainder after removing the applied number.
			$remainder = floor( $remainder / $length );

			// Keep doing it until we have no remainder left.
		} while ( $remainder );

		return $output;
	}
}
