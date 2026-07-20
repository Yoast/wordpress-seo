/**
 * Pure helper that turns two zip-size maps (base vs. head) into a check-run title and a
 * markdown summary. Kept dependency-free and side-effect-free so it can be unit-tested and
 * called from a thin `github-script` step. See .github/workflows/zip-size-report.yml.
 *
 * A size map has the shape { total: <bytes>, entries: { "<path>": <bytes>, ... } } as
 * produced by the measure helper in zip-size-build.yml.
 */

// Most-changed entries and directories shown in the summary; the rest are collapsed into a
// logged "+N more" line so the report never silently hides truncated rows.
const MAX_ROWS = 20;

/**
 * Formats a byte count as a signed, human-readable string (e.g. "+23.4 kB", "-512 B").
 *
 * @param {number} bytes The (possibly negative) byte delta.
 * @param {boolean} [signed] Whether to prefix non-negative values with "+". Default true.
 * @returns {string} The formatted size.
 */
function formatBytes( bytes, signed = true ) {
	const sign = bytes > 0 && signed ? "+" : bytes < 0 ? "-" : signed ? "+" : "";
	const abs = Math.abs( bytes );
	if ( abs < 1024 ) {
		return `${ sign }${ abs } B`;
	}
	const units = [ "kB", "MB", "GB" ];
	let value = abs / 1024;
	let unit = 0;
	while ( value >= 1024 && unit < units.length - 1 ) {
		value /= 1024;
		unit++;
	}
	return `${ sign }${ value.toFixed( value < 10 ? 2 : 1 ) } ${ units[ unit ] }`;
}

/**
 * Formats a fraction as a signed percentage string (e.g. "+0.12%").
 *
 * @param {number} fraction The fraction (delta / base).
 * @returns {string} The formatted percentage, or "n/a" when the base was zero.
 */
function formatPercent( fraction ) {
	if ( ! isFinite( fraction ) ) {
		return "n/a";
	}
	const pct = fraction * 100;
	const sign = pct > 0 ? "+" : "";
	return `${ sign }${ pct.toFixed( 2 ) }%`;
}

/**
 * Rolls per-file sizes up into their top-level directory inside the plugin folder, so the
 * summary can show which area of the plugin moved (e.g. "js/dist", "vendor_prefixed").
 *
 * @param {Object<string, number>} entries Map of file path to size.
 * @returns {Object<string, number>} Map of directory to summed size.
 */
function rollUpDirectories( entries ) {
	const dirs = {};
	for ( const [ path, size ] of Object.entries( entries ) ) {
		// Drop the leading "<pluginSlug>/" wrapper, then key on the next two segments so
		// meaningful areas (e.g. "js/dist", "src/generated") stay distinct.
		const parts = path.split( "/" ).slice( 1 );
		const key = parts.length <= 1 ? "(root)" : parts.slice( 0, Math.min( 2, parts.length - 1 ) ).join( "/" );
		dirs[ key ] = ( dirs[ key ] || 0 ) + size;
	}
	return dirs;
}

/**
 * Computes per-key deltas between two size maps and returns them sorted by absolute change.
 *
 * @param {Object<string, number>} base Base size map.
 * @param {Object<string, number>} head Head size map.
 * @returns {Array<{key: string, base: number, head: number, delta: number}>} Sorted deltas.
 */
function diffMaps( base, head ) {
	const keys = new Set( [ ...Object.keys( base ), ...Object.keys( head ) ] );
	const rows = [];
	for ( const key of keys ) {
		const b = base[ key ] || 0;
		const h = head[ key ] || 0;
		if ( b !== h ) {
			rows.push( { key, base: b, head: h, delta: h - b } );
		}
	}
	rows.sort( ( a, b ) => Math.abs( b.delta ) - Math.abs( a.delta ) );
	return rows;
}

/**
 * Renders a markdown table for a set of delta rows, truncating to MAX_ROWS and appending a
 * "+N more" note (also returned via `truncated` so the caller can log it).
 *
 * @param {Array<{key: string, base: number, head: number, delta: number}>} rows Delta rows.
 * @param {string} label Column header for the first column.
 * @returns {{table: string, truncated: number}} The markdown table and truncated-row count.
 */
function renderTable( rows, label ) {
	if ( rows.length === 0 ) {
		return { table: "_No changes._", truncated: 0 };
	}
	const shown = rows.slice( 0, MAX_ROWS );
	const truncated = rows.length - shown.length;
	const lines = [
		`| ${ label } | Base | Head | Δ |`,
		"| --- | ---: | ---: | ---: |",
	];
	for ( const row of shown ) {
		const status = row.base === 0 ? " (new)" : row.head === 0 ? " (removed)" : "";
		lines.push(
			`| \`${ row.key }\`${ status } | ${ formatBytes( row.base, false ) } | ` +
			`${ formatBytes( row.head, false ) } | ${ formatBytes( row.delta ) } |`
		);
	}
	if ( truncated > 0 ) {
		lines.push( "", `_…and ${ truncated } more changed ${ label.toLowerCase() } (largest ${ MAX_ROWS } shown)._` );
	}
	return { table: lines.join( "\n" ), truncated };
}

/**
 * Builds the check-run title and markdown summary for a base→head zip-size comparison.
 *
 * @param {{total: number, entries: Object}} baseMap Base size map.
 * @param {{total: number, entries: Object}} headMap Head size map.
 * @returns {{title: string, summary: string, delta: number, truncated: number}} The report.
 */
function buildReport( baseMap, headMap ) {
	const delta = headMap.total - baseMap.total;
	const fraction = baseMap.total === 0 ? Infinity : delta / baseMap.total;

	const title = delta === 0
		? "No change to zip size"
		: `${ formatBytes( delta ) } (${ formatPercent( fraction ) })`;

	const fileRows = diffMaps( baseMap.entries, headMap.entries );
	const dirRows = diffMaps( rollUpDirectories( baseMap.entries ), rollUpDirectories( headMap.entries ) );

	const files = renderTable( fileRows, "File" );
	const dirs = renderTable( dirRows, "Directory" );

	const summary = [
		`**Total zip size:** ${ formatBytes( baseMap.total, false ) } → ${ formatBytes( headMap.total, false ) } ` +
			`(**${ formatBytes( delta ) }**, ${ formatPercent( fraction ) })`,
		"",
		"Sizes are the compressed (shipped) bytes of each entry in `artifact.zip`.",
		"",
		"### By directory",
		"",
		dirs.table,
		"",
		"### By file",
		"",
		files.table,
	].join( "\n" );

	return { title, summary, delta, truncated: files.truncated + dirs.truncated };
}

module.exports = {
	buildReport,
	// Exported for unit testing.
	formatBytes,
	formatPercent,
	rollUpDirectories,
	diffMaps,
};
