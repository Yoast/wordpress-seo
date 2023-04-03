import { createSelector, createSlice } from "@reduxjs/toolkit";
import { __ } from "@wordpress/i18n";
import { get, map, sortBy, toArray } from "lodash";

const NAME = "menu";

/**
 * @param {string} id The ID.
 * @param {string} route The route.
 * @param {string} text The text.
 * @returns {{children, id: string, to}} The link.
 */
const transformMenuItemToLink = ( { id, route, text } ) => ( { id: `link-nav-${ id }`, to: route, children: text } );

/**
 * @returns {Object} The initial state.
 */
export const createInitialState = () => ( {
	insights: { id: "insights", priority: 0, route: "/insights", text: __( "Insights", "wordpress-seo" ) },
	workouts: { id: "workouts", priority: 2, route: "/workouts", text: __( "Workouts", "wordpress-seo" ) },
	features: { id: "features", priority: 4, route: "/features", text: __( "Features", "wordpress-seo" ) },
	tools: { id: "tools", priority: 8, route: "/tools", text: __( "Tools", "wordpress-seo" ) },
	support: { id: "support", priority: 10, route: "/support", text: __( "Support", "wordpress-seo" ) },
	...get( window, "wpseoScriptData.menu", {} ),
} );

const slice = createSlice( {
	name: NAME,
	initialState: createInitialState(),
	reducers: {
		addMenu: ( state, { payload } ) => {
			if ( ! payload.route ) {
				console.warn( "Trying to add an invalid menu item:", payload );
				return state;
			}
			const id = payload.id || payload.route.replace( "/", "" );
			state[ id ] = {
				id,
				priority: payload.priority || Number.MAX_VALUE,
				route: payload.route,
				text: payload.text || payload.id || payload.route,
			};
		},
		removeMenu: ( state, { payload } ) => {
			if ( state[ payload ] ) {
				delete state[ payload ];
			}
		},
	},
} );

export const selectors = {
	selectMenuItem: ( state, name, defaultValue = {} ) => get( state, `${ NAME }.${ name }`, defaultValue ),
	selectMenu: state => get( state, NAME, {} ),
};
selectors.selectMenuArray = createSelector(
	[ selectors.selectMenu ],
	menu => sortBy( toArray( menu ), [ "priority", "text", "id", "route", "element" ] )
);
selectors.selectLinksFromMenu = createSelector(
	[ selectors.selectMenuArray ],
	menuArray => map( menuArray, transformMenuItemToLink )
);

export const actions = slice.actions;

export const reducer = slice.reducer;
