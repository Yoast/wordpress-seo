import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { Notifications, Navigation } from "@yoast/admin-ui-toolkit/components";
import { useNavigation, useRouteChanged } from "@yoast/admin-ui-toolkit/hooks";
import PropTypes from "prop-types";
import { Redirect, Route, Switch } from "react-router-dom";

import ContentList from "./components/pages/content-list";
import DetailView from "./components/pages/detail-view";
import { OPTIMIZE_STORE_KEY } from "./constants";

/**
 * The main App component.
 *
 * @params {Object} initialNavigation The initial navigation object.
 * @params {Object} [initialRoute] The initial route.
 *
 * @returns {JSX.Element} The main App.
 */
export default function App( { initialNavigation, initialRoute = "" } ) {
	// Routing
	const { menu, routes, rootRoute } = useNavigation( initialNavigation, initialRoute );
	const { handleRouteChanged } = useDispatch( OPTIMIZE_STORE_KEY );
	useRouteChanged( handleRouteChanged );

	const routesWithDetails = useMemo( () => {
		return routes.reduce( ( acc, { key, target, props, component: Component = ContentList } ) => {
			const listTarget = `/${ target }`;
			const detailTarget = `/${ target }/:id`;
			acc.push( <Route key={ key + "_detail" } path={ detailTarget }>
				<DetailView { ...props } listTarget={ listTarget } />
			</Route> );
			acc.push( <Route key={ key } path={ listTarget }>
				<Navigation menu={ menu } />
				<Component { ...props } detailTarget={ detailTarget } />
			</Route> );
			return acc;
		}, [] );
	}, [ routes ] );

	// General messaging
	const notifications = useSelect( ( select ) => select( OPTIMIZE_STORE_KEY ).getNotifications() );
	const { removeNotification } = useDispatch( OPTIMIZE_STORE_KEY );
	const preparedNotifications = useMemo( () => notifications.map( ( notification ) => ( {
		...notification,
		onDismiss: removeNotification,
	} ) ), [ notifications ] );

	return <>
		<div className="yst-p-4 md:yst-p-8">
			<Switch>
				{ routesWithDetails }
				<Route path="/">
					<Redirect to={ rootRoute } />
				</Route>
			</Switch>
		</div>
		<Notifications notifications={ preparedNotifications } />
	</>;
}

App.propTypes = {
	initialNavigation: PropTypes.object.isRequired,
	initialRoute: PropTypes.string,
};

App.defaultProps = {
	initialRoute: "",
};
