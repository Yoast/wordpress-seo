import { orderBy, noop } from "lodash";

export const navigation = {};

/**
 * Creates a navigation API factory.
 *
 * @param {Object} config Configuration object.
 * @param {function} config.registerGroupCallback Callback to trigger when a navigation group is registered.
 * @param {function} config.registerItemCallback Callback to trigger when a navigation item is registered.
 *
 * @returns {{navigation: {registerItem, registerGroup}}} The navigation API.
 */
const createNavigationAPI = ( { registerGroupCallback = noop, registerItemCallback = noop } = {} ) => ( {
	navigation: {
		/**
			 * Registers a collapsible menu section.
			 *
			 * @param {string} key Unique identifier for this collapsible menu.
			 * @param {string} label The visible label for the menu group.
			 * @param {boolean} isDefaultOpen Determine whether the collapsible should start open or closed.
			 * @param {WPComponent} icon The icon next to the label.
			 * @param {Number} priority Determines how high in the menu the collapsible should be rendered. Higher means closer to the top.
			 * @param {Object[]} children The items, identical to the arguments for `registerItem`, minus the `groupKey`.
			 *
			 * @returns {void}
			 */
		registerGroup: ( { key, label, isDefaultOpen, icon, priority, children = [] } ) => {
			const group = {
				key,
				label,
				isDefaultOpen,
				icon,
				priority,
				children: orderBy( children, "priority", "desc" ),
			};
			navigation[ key ] = group;
			registerGroupCallback( group );
		},

		/**
			 * Registers a submenu item to a menu section.
			 *
			 * @param {string} key Unique identifier for this specific menu item.
			 * @param {string} groupKey Unique identifier of the collapsible menu group this item belongs to.
			 * @param {string} target The relative URL path the menu item should link to.
			 * @param {string} label The visible label for the menu group.
			 * @param {Number} priority Determines how high in the menu group the item should be rendered. Higher means closer to the top.
			 * @param {WPComponent} component The component that is rendered when the current page is the same as the target.
			 *
			 * @returns {void}
			 */
		registerItem: ( { key, groupKey, target, label, priority, component } ) => {
			const targetGroup = navigation[ groupKey ];

			if ( ! targetGroup ) {
				console.warn( `Target group with key ${ groupKey } does not exist.` );
				return;
			}

			const item = { key, groupKey, target, label, priority, component };
			navigation[ groupKey ].children = orderBy(
				[ ...targetGroup.children, item ],
				"priority",
				"desc",
			);
			registerItemCallback( item );
		},
	},
} );

export default createNavigationAPI;
