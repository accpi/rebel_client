import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Index from './artists/index';

import './App.css';

function App() {
	// 2 Wrapper divs because of React funniness with margins
	return (
		<Router>
			<div className="page-container">
				<div className='wrapper'>
					<Index />
				</div>
			</div>
		</Router>
	);
}
export default App;
