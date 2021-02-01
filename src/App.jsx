import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Index from './artists/index';

import './App.css';

function App() {
	return (
		// There's a router here because I originally planned on making multiple page types
		<Router>
			{/* CSS for keeping the Header up top */}
			<div className="page-container">
				<div className='wrapper'>
					<Index />
				</div>
			</div>
		</Router>
	);
}
export default App;
