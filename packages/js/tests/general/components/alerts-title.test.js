import { render } from "../../test-utils";
import { AlertsTitle } from "../../../src/general/components/alerts-title";
import { AlertsContext } from "../../../src/general/contexts/alerts-context";
import { BellIcon } from "@heroicons/react/outline";

const notificationsTheme = {
	Icon: BellIcon,
	bulletClass: "yst-fill-blue-500",
	iconClass: "yst-text-blue-500",
};

describe( "AlertsTitle", () => {
	it( "should match snapshot", () => {
		const title = "Test Title";
		const counts = 5;
		const { container } = render( <AlertsContext.Provider value={ notificationsTheme }>
			<AlertsTitle title={ title } counts={ counts } />
		</AlertsContext.Provider> );
		expect( container ).toMatchSnapshot();
	} );

	it( "renders the children correctly", () => {
		const children = <div>Test Children</div>;

		const { getByText } = render(
			<AlertsContext.Provider value={ notificationsTheme }>
				<AlertsTitle title="Test Title" counts={ 0 }>
					{ children }
				</AlertsTitle>
			</AlertsContext.Provider>
		);

		const childrenElement = getByText( "Test Children" );
		expect( childrenElement ).toBeInTheDocument();
	} );
} );
