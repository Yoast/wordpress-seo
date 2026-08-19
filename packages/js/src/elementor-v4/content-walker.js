/**
 * @file Reads rendered widget HTML from the Elementor V4 preview DOM and builds the
 *       analyzer content plus a per-widget position map in a single pass.
 *
 *       This approach is used instead of reconstructing JSON because this approach includes every widget's
 *       rendered HTML (classes intact) and leaves the decision of what to exclude to
 *       yoastseo package's `alwaysFilterElements`. Because the analyzer computes mark positions
 *       against the original (pre-filter) HTML, the offsets recorded here stay aligned
 *       with the marks even after the parser strips unwanted widgets.
 */

/**
 * @typedef {Object} WidgetEntry
 * @property {string} id         Widget node ID (matches `data-id` / `data-interaction-id`).
 * @property {string} widgetType The widget type (e.g. "e-heading", "table-of-contents").
 * @property {number} start      Start offset in the normalized concatenated content string.
 * @property {number} end        End offset (exclusive) in the normalized concatenated content string.
 */

// Editor-only chrome rendered inside classic widget wrappers; never part of the content.
const CHROME_SELECTOR = ".elementor-element-overlay, .elementor-background-overlay, .ui-resizable-handle";

/**
 * Converts a Backbone Collection to a plain array via its toJSON() method. model.toJSON()
 * does a shallow clone, so nested `elements` stay as Backbone Collections; this is called at
 * every level, so `Array.isArray` always passes for the level being walked.
 *
 * @param {*} nodes The value to normalize.
 * @returns {*} A plain array if nodes had toJSON(), otherwise the original value unchanged.
 */
function toPlainNodes( nodes ) {
	return typeof nodes?.toJSON === "function" ? nodes.toJSON() : nodes;
}

/**
 * Finds the rendered DOM element for a widget node in the live preview. Widgets are matched by
 * either `data-id` (on the `.elementor-element` wrapper) or `data-interaction-id` (set by atomic
 * widgets); both are matched in one selector and the outermost match wins.
 *
 * @param {Object} node     A document tree node with an `id`.
 * @param {Object} $element The current document's preview jQuery element.
 * @returns {Element|null} The widget element, or null if not found.
 */
function findWidgetElement( node, $element ) {
	return $element?.find( `[data-id="${ node.id }"], [data-interaction-id="${ node.id }"]` ).get( 0 ) ?? null;
}

/**
 * Returns the rendered HTML for a single widget element. When the matched element is an
 * `.elementor-element` wrapper it carries editor chrome (overlays, resize handles), which is
 * stripped from a clone before serializing so it never reaches the analysis. An element that is
 * not a wrapper (e.g. an atomic widget's bare tag matched by `data-interaction-id`) is returned
 * as-is.
 *
 * @param {Element} el The widget DOM element.
 * @returns {string} The widget's content HTML.
 */
function readWidgetHtml( el ) {
	if ( ! el.classList.contains( "elementor-element" ) ) {
		return el.outerHTML;
	}
	const clone = el.cloneNode( true );
	clone.querySelectorAll( CHROME_SELECTOR ).forEach( ( node ) => node.remove() );
	return clone.outerHTML;
}

/**
 * Builds the content and relative widget map contributed by a single widget node. Returns an
 * empty result when the widget has no id, is not yet rendered in the preview, or contributes
 * no HTML. Offsets are relative to the widget's own content; the caller shifts them.
 *
 * @param {Object} node     A widget tree node.
 * @param {Object} $element The current document's preview jQuery element.
 * @returns {{ content: string, widgets: WidgetEntry[] }} The widget's content and map entry.
 */
function readWidgetNode( node, $element ) {
	if ( ! node.id ) {
		return { content: "", widgets: [] };
	}
	const el = findWidgetElement( node, $element );
	if ( ! el ) {
		return { content: "", widgets: [] };
	}
	const html = readWidgetHtml( el ).replace( /[\n\t]/g, "" );
	if ( ! html ) {
		return { content: "", widgets: [] };
	}
	return { content: html, widgets: [ { id: node.id, widgetType: node.widgetType, start: 0, end: html.length } ] };
}

/**
 * Walks the document tree in order, reads each widget's rendered HTML from the preview DOM,
 * and builds the concatenated content string plus a per-widget position map in a single pass.
 * Container nodes (flexbox, div-block, …) hold no content of their own, so only their children
 * are walked; widget nodes are leaves because their rendered HTML already contains any nested
 * widgets. `\n` and `\t` are stripped per widget so offsets match the dispatched content.
 *
 * @param {Object[]|Object} nodes    The document tree array (or a Backbone Collection of it).
 * @param {Object}          $element The current document's preview jQuery element.
 * @returns {{ content: string, widgets: WidgetEntry[] }} The content and widget map.
 */
export function buildContentAndMap( nodes, $element ) {
	nodes = toPlainNodes( nodes );
	if ( ! Array.isArray( nodes ) ) {
		return { content: "", widgets: [] };
	}

	let content = "";
	const widgets = [];

	for ( const node of nodes ) {
		if ( ! node || typeof node !== "object" ) {
			continue;
		}
		const part = node.elType === "widget" ? readWidgetNode( node, $element ) : buildContentAndMap( node.elements, $element );
		const offset = content.length;
		widgets.push( ...part.widgets.map( ( w ) => ( { ...w, start: w.start + offset, end: w.end + offset } ) ) );
		content += part.content;
	}

	return { content, widgets };
}
