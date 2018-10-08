<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable service.
 */
class WPSEO_Indexable_Service {

	/**
	 * Retrieves an indexable.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_indexable( WP_REST_Request $request ) {
		$object_type = $request->get_param( 'object_type' );
		$object_id   = $request->get_param( 'object_id' );

		try {
			$provider  = $this->get_provider( $object_type );
			$indexable = $provider->get( $object_id );

			return new WP_REST_Response( $indexable );
		}
		catch ( Exception $exception ) {
			return new WP_REST_Response( $exception->getMessage(), 500 );
		}
	}

	/**
	 * Patches an indexable with the request parameters.
	 *
	 * @param WP_REST_Request $request The REST API request to process.
	 *
	 * @return WP_REST_Response The REST response.
	 */
	public function patch_indexable( WP_REST_Request $request ) {
		$object_type = $request->get_param( 'object_type' );
		$object_id   = $request->get_param( 'object_id' );

		try {
			$provider       = $this->get_provider( $object_type );
			$patched_result = $provider->patch( $object_id, $request->get_params() );

			return new WP_REST_Response( $patched_result );
		}
		catch ( Exception $exception ) {
			return new WP_REST_Response( $exception->getMessage(), 500 );
		}
	}

	/**
	 * Returns a provider based on the given object type.
	 *
	 * @param string $object_type The object type to get the provider for.
	 *
	 * @return WPSEO_Indexable_Service_Provider Instance of the service provider.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	protected function get_provider( $object_type ) {
		$object_type = strtolower( $object_type );

		if ( $object_type === 'post' ) {
			return new WPSEO_Indexable_Service_Post_Provider();
		}

		if ( $object_type === 'term' ) {
			return new WPSEO_Indexable_Service_Term_Provider();

		}

		throw WPSEO_Invalid_Argument_Exception::invalid_callable_parameter( $object_type, 'provider' );
	}

	/**
	 * Handles the situation when the object type is unknown.
	 *
	 * @param string $object_type The unknown object type.
	 *
	 * @return WP_REST_Response The response.
	 */
	protected function handle_unknown_object_type( $object_type ) {
		return new WP_REST_Response(
			sprintf(
				/* translators: %1$s expands to the requested indexable type  */
				__( 'Unknown type %1$s', 'wordpress-seo' ),
				$object_type
			),
			400
		);
	}
}
