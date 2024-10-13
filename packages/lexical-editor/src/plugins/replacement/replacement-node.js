import { $applyNodeReplacement, DecoratorNode } from "lexical";
import React from "react";

/** @typedef {import("lexical").EditorConfig} EditorConfig */

/** @typedef {import("lexical").LexicalEditor} LexicalEditor */

/** @typedef {import("lexical").LexicalNode} LexicalNode */

/** @typedef {import("lexical").NodeKey} NodeKey */

/** @typedef {import("lexical").SerializedLexicalNode} SerializedLexicalNode */

/**
 * @typedef SerializedReplacementNode Combining ReplacementItem and SerializedLexicalNode.
 * Because JSDoc does not like Object<ReplacementItem & SerializedLexicalNode>.
 * @property {string} name The name of the node.
 * @property {string} label The label of the node.
 * @property {Object} [data] Optional extra data of the node.
 * @property {Object} [__metadata] Metadata for internal purposes.
 * @property {string} [type] The type of the node.
 * @property {number} [version] The version of the node.
 */

/**
 * A node that represents a picker.
 */
export class ReplacementNode extends DecoratorNode {
	#name;
	#label;
	#data;
	#__metadata;

	/**
	 * @param {ReplacementItem} item The item.
	 */
	constructor( item ) {
		super( item?.__key );
		this.#name = item.name;
		this.#label = item.label;
		this.#data = item.data || {};
		this.#__metadata = item.__metadata || {};
	}

	/**
	 * @returns {string} The type of the node.
	 */
	static getType() {
		return "yst-replacement-node";
	}

	/**
	 * @param {ReplacementNode} node The node to clone.
	 * @returns {ReplacementNode} The cloned node.
	 */
	static clone( node ) {
		return new ReplacementNode( {
			__key: node.__key,
			name: node.#name,
			label: node.#label,
			data: node.#data,
			__metadata: node.#__metadata,
		} );
	}

	/**
	 * @param {EditorConfig} _config The editor configuration.
	 * @param {LexicalEditor} _editor The editor instance.
	 * @returns {HTMLSpanElement} The DOM element.
	 */
	createDOM( _config, _editor ) { // eslint-disable-line no-unused-vars
		const el = document.createElement( "span" );
		el.classList.add( ReplacementNode.getType() );
		return el;
	}

	/**
	 * @param {NodeKey} _prevNode The previous node key.
	 * @param {HTMLElement} _dom The DOM element.
	 * @param {EditorConfig} _config The editor configuration.
	 * @returns {boolean} Whether to update the DOM.
	 */
	updateDOM( _prevNode, _dom, _config ) { // eslint-disable-line no-unused-vars
		return false;
	}

	/**
	 * @param {SerializedReplacementNode} serializedNode The serialized node.
	 * @returns {ReplacementNode} The node.
	 */
	static importJSON( serializedNode ) {
		// eslint-disable-next-line no-use-before-define
		return $createReplacementNode( serializedNode );
	}

	/**
	 * @returns {SerializedReplacementNode} The serialized node.
	 */
	exportJSON() {
		const self = this.getLatest();
		return {
			name: self.#name,
			label: self.#label,
			data: self.#data,
			__metadata: self.#__metadata,
			type: ReplacementNode.getType(),
			version: 1,
		};
	}

	/**
	 * @returns {string} The name.
	 */
	getName() {
		const self = this.getLatest();
		return self.#name;
	}

	/**
	 * @returns {string} The label.
	 */
	getLabel() {
		const self = this.getLatest();
		return self.#label;
	}

	/**
	 * @returns {Object} The data.
	 */
	getData() {
		const self = this.getLatest();
		return self.#data;
	}

	/**
	 * @returns {string} The text content.
	 */
	getTextContent() {
		const self = this.getLatest();
		if ( typeof self.#__metadata?.getTextContent === "function" ) {
			return self.#__metadata.getTextContent( self );
		}
		return self.#name;
	}

	/**
	 * @param {LexicalEditor} editor The editor instance.
	 * @param {EditorConfig} config The editor configuration.
	 * @returns {JSX.Element} The element.
	 */
	decorate( editor, config ) { // eslint-disable-line no-unused-vars
		const self = this.getLatest();
		if ( typeof self.#__metadata?.getEditorContent === "function" ) {
			return self.#__metadata.getEditorContent( self );
		}
		return <>{ self.#label }</>;
	}
}

/**
 * @param {SerializedReplacementNode} item The item.
 * @returns {ReplacementNode} The created node.
 */
export const $createReplacementNode = ( item ) => $applyNodeReplacement( new ReplacementNode( item ) );

/**
 * @param {LexicalNode} node The node to check.
 * @returns {boolean} Whether the node is a replacement node.
 */
export const $isReplacementNode = ( node ) => node instanceof ReplacementNode;
