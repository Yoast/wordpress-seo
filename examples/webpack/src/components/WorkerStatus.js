import { connect } from "react-redux";

function WorkerStatus( { status } ) {
	return status;
}

export default connect(
	( state ) => {
		return {
			status: state.worker.status,
		};
	},
)( WorkerStatus );
