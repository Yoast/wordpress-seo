
let Component = ComponentType => class extends React.Component {
	constructor() {
		super();
		this.update = this.update.bind(this);
		this.state = { val: 0 }
	}
	update() {
		this.setState( { val : this.state.val + 1 } )
	}
	componentWillMount() {
		console.log( 'will mount' )
	}

	render() {
		return <ComponentType
			update={this.update}
			{...this.state}
			{...this.props} />
	}

	componentDidMount( prevProps, prevState ) {
		console.log( 'mounted' )
	}

}

export default Component;
