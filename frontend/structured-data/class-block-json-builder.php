<?php
/**
 * @package WPSEO\Structured_Data
 */

class WPSEO_Structured_Data_JSON_Builder {

	private $all_block_configuration;

	public function __construct( array $graph, WPSEO_Structured_Data_Page $page ) {
		$this->graph = $graph;
		$this->page = $page;
	}

	/**
	 * Creates a context that can be used during the building of the JSON.
	 *
	 * @return array
	 */
	public function create_context() {
		$post = get_post();

		$context = array();
		$context['post_title'] = $post->post_title;
		$context['post_content'] = $post->post_content;

		// The add_query_arg function called without arguments will return the current URL path.
		$context['current_url'] = home_url() . add_query_arg();

		return $context;
	}

	public function build_json() {
		if ( ! has_blocks() ) {
			return;
		}

		$context = $this->create_context();
		$root_blocks = parse_blocks( $context['post_content'] );

		$path = __DIR__ . '/../../scripts/plop-code-generation/configuration-how-to.json';
		$configuration = file_get_contents( $path );
		$configuration = json_decode( $configuration, true );

		$path = __DIR__ . '/../../scripts/plop-code-generation/configuration-faq.json';
		$configuration2 = file_get_contents( $path );
		$configuration2 = json_decode( $configuration2, true );


		$configuration = array_merge( $configuration, $configuration2 );

		$this->all_block_configuration = $configuration;

		foreach ( $root_blocks as $block ) {
			$blockDefinition = $this->find_definition( $this->all_block_configuration, $block['blockName'] );

			if ( ! $blockDefinition ) {
				continue;
			}

			$this->graph = array_merge( $this->graph, $this->create_new_graph_items( $blockDefinition, $block, $context ) );
		}

		return $this->graph;
	}

	public function param_case( $identifier ) {
		// TODO: Write a param_case version that deals with this camelCase pattern:
		if ( $identifier === 'FAQPage' ) {
			return 'faq-page';
		}

		$identifier[0] = strtolower( $identifier[ 0 ] );

		$replace_with_dash = create_function( '$matches', 'return "-" . strtolower( $matches[1] );' );

		return preg_replace_callback( '/([A-Z]+)/', $replace_with_dash, $identifier );
	}

	public function create_block_identifier( $entity_name ) {
		$PREFIX = 'yoast/';

		return $PREFIX . $this->param_case( $entity_name );
	}

	public function find_definition( $configuration, $blockName ) {
		foreach ( $configuration as $definition ) {
			$type   = $definition['@type'];

			if ( $this->create_block_identifier( $type ) === $blockName ) {
				return $definition;
			}
		}

	}

	public function render_block_json( $block, $context, $position = 0 ) {
		$blockDefinition = $this->find_definition( $this->all_block_configuration, $block['blockName'] );

		$json = array();

		foreach ( $blockDefinition['attributes'] as $attribute ) {
			$key = $attribute['key'];
			$type = $attribute['type'];

			switch ( $attribute['source'] ) {

				case 'value':
					$value = $attribute['value'];

					$json[ $key ] = $value;
					break;

				case 'identifier':

					break;

				case 'context':
					$context_key = $attribute['context'];

					if ( array_key_exists( $context_key, $context ) ) {
						$json[ $key ] = $context[ $context_key ];
					}
					break;

				case 'position':
					if ( $type === "string" ) {
						$position = (string) $position;
					}

					$json[ $key ] = $position;
					break;

				case 'area':
					$children_types = $attribute['childrenTypes'];

					switch ( $type ) {
						case "string":
							foreach ( $children_types as $child_type ) {
								// Find this child_type in the innerBlocks

								$inner_blocks = $block['innerBlocks'];

								foreach ( $inner_blocks as $inner_block ) {
									if ( $this->create_block_identifier( $child_type ) === $inner_block['blockName'] ) {
										if ( ! array_key_exists( $key, $json ) ) {
											$json[ $key ] = render_block( $inner_block );
										}
									}
								}
							}
							break;

						case "array":
							$collection = $attribute['collection'];

							if ( $collection === false ) {
								foreach ( $children_types as $child_type ) {
									// Find this child_type in the innerBlocks

									$inner_blocks = $block['innerBlocks'];

									$child_block_position = 1;
									foreach ( $inner_blocks as $index => $inner_block ) {
										if ( $this->create_block_identifier( $child_type ) === $inner_block['blockName'] ) {
											if ( ! array_key_exists( $key, $json ) ) {
												$json[ $key ] = array();
											}

											$json[ $key ][] = $this->render_block_json( $inner_block, $context, $child_block_position );
											$child_block_position++;
										}
									}
								}
							} else {
								$collection_name = $collection['name'];
								$inner_blocks = $block['innerBlocks'];
								foreach ( $inner_blocks as $inner_block ) {
									if ( $this->create_block_identifier( $collection_name ) === $inner_block['blockName'] ) {
										$json[ $key ] = array();
										foreach ( $attribute['childrenTypes'] as $collection_child_type ) {
											$collection_inner_blocks = $inner_block['innerBlocks'];

											$child_block_position = 1;
											foreach ( $collection_inner_blocks as $index => $collection_inner_block ) {
												if ( $this->create_block_identifier( $collection_child_type ) === $collection_inner_block['blockName'] ) {
													// do same function for found howtosection.
													$json[ $key ][] = $this->render_block_json( $collection_inner_block, $context, $child_block_position );
													$child_block_position++;
//													$json[ $key ][] = $this->create_new_graph_items( $defintion, $collection_inner_block, $context );
												}
											}
										}
									}
								}
							}

							break;
					}
					break;
			}
		}

		return $json;
	}

	public function create_new_graph_items( $blockConfig, $block, $context ) {
		return array( $this->render_block_json( $block, $context ) );
	}
}
