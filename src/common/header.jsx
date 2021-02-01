import React from 'react';

// The smallest component you ever did see (with the tiniest bit of error handling in case the correct props aren't sent)
function Header(props) {
	return (
		<header>
			<h1>{props.title ? props.title : "Rebel!"}</h1>
		</header>

	);
}

export default Header;