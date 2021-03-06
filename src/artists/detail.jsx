import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'


// Started working on the detail page for artists but didn't have time

function App() {
	const [artist, setArtist] = useState();
	let { id } = useParams()
	console.log(id)

	// Load artist data on page load
	useEffect(() => {
		try {
			axios.get('http://localhost:3001/artists/' + id)
				.then(response => {
					setArtist(response.data);
				});
		}
		catch (error) {
			console.log(error);
		}
	}, []);

	return artist
		? (<Table />)
		: null

}

export default App