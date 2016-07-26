import React from 'react';

import Wizard from './js/wizard'
import Steps from  './js/steps';

class App extends React.Component {

	render() {
		return (
			<Wizard steps={Steps} />
		)
	}
}

export default App
