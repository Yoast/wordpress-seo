import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { Navigation, Notifications } from "@yoast/admin-ui-toolkit/components";
import { useNavigation, useRouteChanged } from "@yoast/admin-ui-toolkit/hooks";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";

import UnsavedChangesPrompt from "./components/unsaved-changes-prompt";
import { REDUX_STORE_KEY } from "./constants";
import { useFills } from "./hooks";

/**
 * The main App component.
 *
 * @params {Object} initialNavigation The initial navigation object.
 * @params {string} initialRoute The initial route.
 *
 * @returns {JSX.Element} The main App.
 */
export default function App( { initialNavigation, initialRoute = "" } ) {
	// Routing
	const { menu, routes, rootRoute } = useNavigation( initialNavigation, initialRoute );
	const { fills } = useFills();
	const { handleRouteChanged } = useDispatch( REDUX_STORE_KEY );
	useRouteChanged( handleRouteChanged );

	// General notifications
	const notifications = useSelect( ( select ) => select( REDUX_STORE_KEY ).getNotifications() );
	const { removeNotification } = useDispatch( REDUX_STORE_KEY );
	const preparedNotifications = useMemo( () => notifications.map( ( notification ) => ( {
		...notification,
		onDismiss: removeNotification,
	} ) ), [ notifications ] );

	return <>
		<div className="yst-p-4 md:yst-p-8">
			<Navigation menu={ menu } />
			<Switch>
				{ routes.map( ( { key, target, props, component: Component } ) => (
					<Route key={ key } path={ `/${ target }` }>
						<Component { ...props } />
						<UnsavedChangesPrompt />
					</Route>
				) ) }
				<Route path="/">
					<Redirect to={ rootRoute } />
				</Route>
			</Switch>
		</div>
		<Notifications notifications={ preparedNotifications } />
		{ fills }
	</>;
}

App.propTypes = {
	initialNavigation: PropTypes.object.isRequired,
	initialRoute: PropTypes.string,
};

App.defaultProps = {
	initialRoute: "",
};
