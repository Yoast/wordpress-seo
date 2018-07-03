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
		$provider    = $this->get_provider( strtolower( $object_type ) );

		if ( $provider === null ) {
			return $this->handle_unknown_object_type( $object_type );
		}

		$object_id = $request->get_param( 'object_id' );

		if ( ! $provider->is_indexable( $object_id ) ) {
			return new WP_REST_Response(
				sprintf(
					/* translators: %1$s expands to the requested indexable type. %2$s expands to the request id */
					__( 'Object %1$s with id %2$s not found', 'wordpress-seo' ),
					$object_type,
					$object_id
				),
				404
			);
		}

		try {
			$indexable = $provider->get( $object_id );

			return new WP_REST_Response( $indexable->to_array() );
		} catch ( \Exception $exception ) {
			return new WP_REST_Response( $exception->getMessage(), 500 );
		}
	}

	/**
	 * Save an indexable.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response.
	 * @throws Exception
	 */
	public function save_indexable( WP_REST_Request $request ) {
		$object_type = $request->get_param( 'object_type' );
		$provider    = $this->get_provider( strtolower( $object_type ) );

		if ( $provider === null ) {
			return $this->handle_unknown_object_type( $object_type );
		}

		try{
			$indexable = Indexable::from_request( $request );
		} catch ( \InvalidArgumentException $exception ) {
			return new WP_REST_Response( $exception->getMessage(), 500 );
		}

		return new WP_REST_Response( $provider->post( $indexable ) );
	}

	/**
	 * Returns a provider based on the given object type.
	 *
	 * @param string $object_type The object type to get the provider for.
	 *
	 * @return null|WPSEO_Indexable_Service_Provider Instance of the service provider.
	 */
	protected function get_provider( $object_type ) {
		if ( $object_type === 'post' ) {
			return new WPSEO_Indexable_Service_Post_Provider();
		}

		if ( $object_type === 'term' ) {
			return new WPSEO_Indexable_Service_Term_Provider();

		}

		return null;
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
