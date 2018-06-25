<?php

/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

class Indexable {

	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var Object_Type
	 */
	private $type;

	/**
	 * @var Meta_Values
	 */
	private $meta_values;

	/**
	 * @var OpenGraph
	 */
	private $opengraph;

	/**
	 * @var Twitter
	 */
	private $twitter;

	/**
	 * @var string|null
	 */
	private $robots;

	/**
	 * @var string|null
	 */
	private $created_at;

	/**
	 * @var string|null
	 */
	private $updated_at;

	/**
	 * @var Link
	 */
	private $links;

	/**
	 * @var WPSEO_Keyword
	 */
	private $primary_keyword;

	/**
	 * Indexable constructor.
	 *
	 * @param int           $id              The indexable's ID.
	 * @param Object_Type   $type            The object type.
	 * @param Meta_Values   $meta_values     The meta values for the indexable.
	 * @param OpenGraph     $opengraph       The OpenGraph values for the indexable.
	 * @param Twitter       $twitter         The Twitter values for the indexable.
	 * @param Robots        $robots          The robots values for the indexable.
	 * @param WPSEO_Keyword $primary_keyword The primary keyword values for the indexable.
	 * @param Link          $links           The links values for the indexable.
	 * @param string        $created_at      The date the indexable was created on. Can be NULL.
	 * @param string        $updated_at      The date the indexable was updated on. Can be NULL.
	 */
	public function __construct( $id, Object_Type $type, Meta_Values $meta_values, OpenGraph $opengraph, Twitter $twitter, Robots $robots, WPSEO_Keyword $primary_keyword, Link $links, $created_at = null, $updated_at = null ) {
		if ( ! WPSEO_Validator::is_integer( $id ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_integer_parameter( $id, 'ID' );
		}

		$this->id 		   	   = $id;
		$this->type 	   	   = $type;
		$this->meta_values 	   = $meta_values;
		$this->opengraph   	   = $opengraph;
		$this->twitter 	   	   = $twitter;
		$this->robots 	   	   = $robots;
		$this->primary_keyword = $primary_keyword;
		$this->links	   	   = $links;
		$this->created_at  	   = $created_at;
		$this->updated_at  	   = $updated_at;
	}

	/**
	 * Returns an array representation of the Indexable object.
	 *
	 * @return array The object as an array.
	 */
	public function to_array() {
		return array_merge(
			array( 'object_id' => $this->id ),
			$this->type->to_array(),
			$this->meta_values->to_array(),
			$this->opengraph->to_array(),
			$this->twitter->to_array(),
			$this->robots->to_array(),
			$this->primary_keyword->to_array(),
			$this->links->to_array(),
			array(
				'created_at' => $this->created_at,
				'updated_at' => $this->updated_at,
			)
		);
	}

	/**
	 * Creates an instance of the Indexable based on the REST API request.
	 *
	 * @param WP_REST_Request $request The request to base the Indexable on.
	 *
	 * @return Indexable The Indexable instance.
	 * @throws Exception
	 */
	public static function from_request( WP_REST_Request $request ) {
		return new self(
			$request->get_param( 'object_id' ),
			new Object_Type(
				$request->get_param( 'object_type' ),
				$request->get_param( 'object_subtype' )
			),
			new Meta_Values(
				$request->get_param( 'title' ),
				$request->get_param( 'description' ),
				null,
				$request->get_param( 'readability_score' ),
				$request->get_param( 'is_cornerstone' ),
				$request->get_param( 'canonical' ),
				$request->get_param( 'breadcrumb_title' )
			),
			new OpenGraph(
				$request->get_param( 'og_title' ),
				$request->get_param( 'og_description' ),
				$request->get_param( 'og_image' )
			),
			new Twitter(
				$request->get_param( 'twitter_title' ),
				$request->get_param( 'twitter_description' ),
				$request->get_param( 'twitter_image' )
			),
			new Robots(
				$request->get_param( 'is_robots_nofollow' ),
				$request->get_param( 'is_robots_noarchive' ),
				$request->get_param( 'is_robots_noimageindex' ),
				$request->get_param( 'is_robots_nosnippet' ),
				$request->get_param( 'is_robots_noindex' )
			),
			new WPSEO_Keyword(
				$request->get_param( 'primary_focus_keyword' ),
				$request->get_param( 'primary_focus_keyword_score' )
			),
			new Link( 0, 0 )
		);
	}
}
