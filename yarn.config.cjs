/* eslint-disable no-unused-vars */
/**
 * Constraints allow enforcement of rules across workspace packages.
 *
 * @link https://yarnpkg.com/features/constraints
 *
 * Taken the code from the Yarn repository and adapted it to our needs.
 * @link https://github.com/yarnpkg/berry/blob/master/yarn.config.cjs
 */

/**
 * BSD 2-Clause License
 *
 * Copyright (c) 2016-present, Yarn Contributors.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/** @typedef {import("@yarnpkg/types")} */
const { defineConfig } = require( "@yarnpkg/types" );

/**
 * @typedef {import("@yarnpkg/types").Yarn.Constraints.Context} Context
 * @typedef {import("@yarnpkg/types").Yarn.Constraints.Workspace} Workspace
 * @typedef {import("@yarnpkg/types").Yarn.Constraints.Dependency} Dependency
 */

const IGNORE_CONSISTENT_DEPENDENCIES_FOR = new Set( [] );

/**
 * This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
 * We allow Docusaurus to have different dependencies for now; will be addressed later (when we remove Gatsby)
 * @param {Context} context The context.
 * @returns {void}
 */
function enforceConsistentDependenciesAcrossTheProject( { Yarn } ) {
	for ( const dependency of Yarn.dependencies() ) {
		if ( IGNORE_CONSISTENT_DEPENDENCIES_FOR.has( dependency.workspace.cwd ) ) {
			continue;
		}

		if ( dependency.type === "peerDependencies" ) {
			continue;
		}

		for ( const otherDependency of Yarn.dependencies( { ident: dependency.ident } ) ) {
			if ( IGNORE_CONSISTENT_DEPENDENCIES_FOR.has( otherDependency.workspace.cwd ) ) {
				continue;
			}

			if ( otherDependency.type === "peerDependencies" ) {
				continue;
			}

			if (
				( dependency.type === "devDependencies" || otherDependency.type === "devDependencies" ) &&
				Yarn.workspace( { ident: otherDependency.ident } )
			) {
				continue;
			}

			dependency.update( otherDependency.range );
		}
	}
}

/**
 * This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
 * We allow Docusaurus to have different dependencies for now; will be addressed later (when we remove Gatsby)
 * @param {Context} context The context.
 * @returns {void}
 */
function enforceWorkspaceDependenciesWhenPossible( { Yarn } ) {
	for ( const dependency of Yarn.dependencies() ) {
		if ( ! Yarn.workspace( { ident: dependency.ident } ) ) {
			continue;
		}

		dependency.update( "workspace:^" );
	}
}

/**
 * @param {Context} context The context.
 * @param {string} ident The dependency to forbid.
 * @param {string} explanation The explanation to provide.
 * @returns {void}
 */
function forbidDependency( { Yarn }, ident, explanation ) {
	for ( const dependency of Yarn.dependencies( { ident } ) ) {
		dependency.error( explanation );
	}
}

/**
 * @param {Context} context The context.
 * @param {Record<string,function|string>} fields The fields to enforce.
 * @returns {void}
 */
function enforceFieldsOnAllWorkspaces( { Yarn }, fields ) {
	for ( const workspace of Yarn.workspaces() ) {
		for ( const [ field, value ] of Object.entries( fields ) ) {
			workspace.set( field, typeof value === "function" ? value( workspace ) : value );
		}
	}
}

/**
 * @param {Context} context The context.
 * @param {string} ident The dependency to check the relationship for.
 * @param {string} otherIdent The related dependency to enforce.
 * @param {boolean} mustExist Whether the dependency must exist.
 * @returns {void}
 */
function enforceDependencyRelationship( { Yarn }, ident, otherIdent, mustExist ) {
	for ( const dependency of Yarn.dependencies( { ident } ) ) {
		if ( dependency.type === "peerDependencies" ) {
			continue;
		}

		const hasOtherDependency = Yarn.dependency( {
			workspace: dependency.workspace,
			ident: otherIdent,
		} );

		if ( mustExist ) {
			if ( hasOtherDependency ) {
				continue;
			}

			dependency.error( `The presence of ${ ident } in ${ dependency.type } mandates the presence of ${ otherIdent }` );
		} else {
			if ( ! hasOtherDependency ) {
				continue;
			}

			dependency.error( `The presence of ${ ident } in ${ dependency.type } forbids the presence of ${ otherIdent }` );
		}
	}
}

/**
 * Validate that all peer dependencies are provided. If one isn't, the
 * constraint will try to fix it by looking at what's used in the other
 * workspaces of the project. If it doesn't find any way to satisfy the
 * dependency, it will generate an error.
 *
 * @param {Context} context The context.
 * @returns {void}
 */
function enforcePeerDependencyPresence( { Yarn } ) { // eslint-disable-line complexity
	for ( const workspace of Yarn.workspaces() ) {
		for ( const dependency of Yarn.dependencies( { workspace } ) ) {
			if ( dependency.type === "peerDependencies" ) {
				continue;
			}

			if ( ! dependency.resolution ) {
				continue;
			}

			for ( const peerName of dependency.resolution.peerDependencies.keys() ) {
				// Webpack plugins have peer dependencies but don't often need it; weird
				if ( peerName === "webpack" ) {
					continue;
				}

				if ( dependency.resolution.dependencies.has( peerName ) ) {
					continue;
				}

				const otherDeps = Yarn.dependencies( { ident: peerName } )
					.filter( otherDep => otherDep.type !== "peerDependencies" );

				if ( otherDeps.length === 0 ) {
					workspace.error( `Missing dependency on ${ peerName } (required by ${ dependency.ident })` );
				}

				// If the workspace has itself a peer dependency of the same name, then
				// we assume that it'll be fulfilled by its ancestors in the dependency
				// tree, so we only need to add the dependency to devDependencies.
				const autofixTarget = Yarn.dependency( { workspace, ident: peerName, type: "peerDependencies" } )
					? "devDependencies"
					: "dependencies";

				for ( const otherDep of otherDeps ) {
					workspace.set( [ autofixTarget, peerName ], otherDep.range );
				}
			}
		}
	}
}

module.exports = defineConfig( {
	constraints: async( context ) => {
		enforceWorkspaceDependenciesWhenPossible( context );
		enforceFieldsOnAllWorkspaces( context, {
			[ "repository.type" ]: "git",
			[ "repository.url" ]: "git+https://github.com/Yoast/wordpress-seo.git",
			[ "repository.directory" ]: workspace => workspace.cwd,
		} );
	},
} );
