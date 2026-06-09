import { render, screen, fireEvent } from "../../test-utils";
import { TaskListOptInNotification } from "../../../src/general/components/task-list-opt-in-notification";

const mockNavigate = jest.fn();
const mockHideOptInNotification = jest.fn();
const mockSetOptInNotificationSeen = jest.fn();

// Only override useNavigate; the rest of react-router-dom stays real.
jest.mock( "react-router-dom", () => ( {
	...jest.requireActual( "react-router-dom" ),
	useNavigate: () => mockNavigate,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useDispatch: () => ( {
		hideOptInNotification: mockHideOptInNotification,
		setOptInNotificationSeen: mockSetOptInNotificationSeen,
	} ),
	useSelect: jest.fn( () => false ),
	registerStore: jest.fn(),
	withSelect: jest.fn( () => ( component ) => component ),
	withDispatch: jest.fn( () => ( component ) => component ),
} ) );

describe( "TaskListOptInNotification", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "navigates to the task list with the highlight signal when 'Show me' is clicked", () => {
		render( <TaskListOptInNotification isOpen={ true } onClose={ jest.fn() } /> );

		fireEvent.click( screen.getByRole( "button", { name: /show me/i } ) );

		expect( mockHideOptInNotification ).toHaveBeenCalledWith( "task_list" );
		expect( mockNavigate ).toHaveBeenCalledWith( "/task-list", { state: { highlight: "task-list" } } );
	} );
} );
