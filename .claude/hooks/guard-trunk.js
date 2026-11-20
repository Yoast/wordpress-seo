/**
 * Claude Code PreToolUse hook (Bash matcher) that forces an explicit approval prompt before
 * any git command that could put commits on trunk. GitHub branch protection stays the real
 * gate; this stops an agent from creating or pushing unapproved trunk commits on its own.
 *
 * Reads the hook payload from stdin. Prints an "ask" decision when the command needs approval
 * and prints nothing otherwise. It never blocks on its own errors.
 */

const { execFileSync } = require( "child_process" );
const os = require( "os" );
const path = require( "path" );

const PROTECTED_BRANCH = "trunk";

// Options between `git` and the subcommand (e.g. `git -C dir -c k=v --no-pager commit`) are skipped.
const GIT_WRITE = /\bgit((?:\s+-[Cc]\s+\S+|\s+--?[\w-]+(?:=\S+)?)*)\s+(commit|merge|cherry-pick|revert|am|rebase|reset|push)\b/;
const GIT_DIR_OPTION = /\s-C\s+("[^"]*"|'[^']*'|\S+)/g;
const CD_COMMAND = /(?:^|[\s;&|(])cd\s+("[^"]*"|'[^']*'|[^\s;&|)]+)/g;
// A trunk destination in a push refspec, e.g. `origin trunk`, `HEAD:trunk` or `+trunk`; not `origin/trunk`.
const PUSH_TO_TRUNK = new RegExp( `(?:^|[\\s:+])(?:refs/heads/)?${ PROTECTED_BRANCH }(?=$|\\s)` );
const PUSH_EVERYTHING = /\s--(?:all|mirror)\b/;

/**
 * Strips surrounding quotes and expands a leading `~` in a shell path argument.
 *
 * @param {string} argument The raw path argument.
 * @returns {string} The unquoted path.
 */
function unquote( argument ) {
	const value = argument.replace( /^(["'])(.*)\1$/, "$2" );
	return value.replace( /^~(?=$|\/)/, os.homedir() );
}

/**
 * Runs a read-only git query in a directory.
 *
 * @param {string} dir The directory to run git in.
 * @param {string[]} args The git arguments.
 * @returns {string|null} The trimmed output, or null when git fails (not a repo, detached HEAD, no upstream).
 */
function gitQuery( dir, args ) {
	try {
		return execFileSync( "git", [ "-C", dir, ...args ], { stdio: [ "ignore", "pipe", "ignore" ] } ).toString().trim();
	} catch ( error ) {
		return null;
	}
}

/**
 * Collects every directory the command may run git in: the session cwd plus any `cd` and `git -C` targets.
 *
 * @param {string} command The Bash command.
 * @param {string} cwd The working directory of the tool call.
 * @returns {string[]} The absolute directories.
 */
function candidateDirs( command, cwd ) {
	const dirs = new Set( [ cwd ] );
	for ( const pattern of [ CD_COMMAND, GIT_DIR_OPTION ] ) {
		for ( const match of command.matchAll( pattern ) ) {
			dirs.add( path.resolve( cwd, unquote( match[ 1 ] ) ) );
		}
	}
	return [ ...dirs ];
}

/**
 * Decides whether a Bash command needs explicit approval because it may write to trunk.
 *
 * @param {string} command The Bash command.
 * @param {string} cwd The working directory of the tool call.
 * @returns {string|null} The reason to ask for approval, or null when the command may run.
 */
function approvalReason( command, cwd ) {
	// Split on shell separators so a trunk mention elsewhere (e.g. `git rebase origin/trunk && git push`) is not attributed to the push.
	const writes = command.split( /&&|\|\||[;|\n]/ )
		.map( ( segment ) => segment.match( GIT_WRITE ) )
		.filter( Boolean );
	if ( writes.length === 0 ) {
		return null;
	}

	const dirs = candidateDirs( command, cwd );
	if ( dirs.some( ( dir ) => gitQuery( dir, [ "symbolic-ref", "--short", "-q", "HEAD" ] ) === PROTECTED_BRANCH ) ) {
		return `This runs git ${ writes[ 0 ][ 2 ] } while ${ PROTECTED_BRANCH } is checked out. ` +
			`Commits to ${ PROTECTED_BRANCH } need explicit approval.`;
	}

	for ( const write of writes ) {
		if ( write[ 2 ] !== "push" ) {
			continue;
		}
		const pushArgs = write.input.slice( write.index + write[ 0 ].length );
		const pushesUpstreamToTrunk = dirs.some( ( dir ) => {
			const target = gitQuery( dir, [ "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{push}" ] );
			return target !== null && target.endsWith( `/${ PROTECTED_BRANCH }` );
		} );
		if ( PUSH_TO_TRUNK.test( pushArgs ) || PUSH_EVERYTHING.test( pushArgs ) || pushesUpstreamToTrunk ) {
			return `This push may update ${ PROTECTED_BRANCH }. Pushing to ${ PROTECTED_BRANCH } needs explicit approval.`;
		}
	}

	return null;
}

let input = "";
process.stdin.on( "data", ( chunk ) => {
	input += chunk;
} );
process.stdin.on( "end", () => {
	let payload;
	try {
		payload = JSON.parse( input );
	} catch ( error ) {
		return;
	}

	const command = payload.tool_input && payload.tool_input.command;
	if ( typeof command !== "string" ) {
		return;
	}

	const reason = approvalReason( command, payload.cwd || process.cwd() );
	if ( reason ) {
		process.stdout.write( JSON.stringify( {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "ask",
				permissionDecisionReason: reason,
			},
		} ) );
	}
} );
