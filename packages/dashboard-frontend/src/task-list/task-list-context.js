import { createContext, useContext } from "@wordpress/element";

/**
 * @typedef {Object} TaskListContextValue
 * @property {string} locale The locale to use for formatting (e.g., "en-US", "de-DE").
 */

/**
 * Context for the TaskList to share locale across all task list components.
 */
const TaskListContext = createContext( {
	locale: "en-US",
} );

/**
 * Provider component for TaskList context.
 *
 * @param {Object} props Component props.
 * @param {string} props.locale The locale to use for formatting durations and other locale-specific content.
 * @param {import("react").ReactNode} props.children Child components.
 * @returns {JSX.Element} The TaskListProvider component.
 */
export const TaskListProvider = ( { locale = "en-US", children } ) => {
	return (
		<TaskListContext.Provider value={ { locale } }>
			{ children }
		</TaskListContext.Provider>
	);
};

/**
 * Hook to access the TaskList context.
 *
 * @returns {TaskListContextValue} The TaskList context value.
 */
export const useTaskListContext = () => {
	const context = useContext( TaskListContext );
	if ( ! context ) {
		throw new Error( "useTaskListContext must be used within a TaskListProvider" );
	}
	return context;
};
