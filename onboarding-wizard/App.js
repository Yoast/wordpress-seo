import React from "react";

import Wizard from "./wizard";
import Config from "./config/config";

class App extends React.Component {

	render() {
		return (
			<Wizard {...Config} />
		);
	}
}

export default App;
