import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';

import Header from '../common/header';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBase = 'https://rebel-server.herokuapp.com/';

// Base JavaScript number formatting
// If I was taking this project further, I'd create a little utility function that could take these paramaters for different currency types, etc
// Another thing I was thinking about was to slice off the currency symbol off the string and display that all the way right on the column for a better look
var currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 0
});

// Our React-Table object
function Table({ columns, data, filterInput, setFilterInput }) {
	const {
		// Standard React Table
		getTableProps,
		getTableBodyProps,
		headerGroups,
		// For accessing pagination + rows within a page
		page,
		prepareRow,
		// Pagination tools for navigation
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
		setHiddenColumns,
		setFilter,
	} = useTable({
		columns, data,
		initialState: {
			pageSize: 20,
			pageIndex: 0,
		},
		autoResetPage: false,
	}, useFilters, useSortBy, usePagination);

	// Hiding the ID column, needed it to pass to the axios request to update the artist row
	React.useEffect(() => {
		setHiddenColumns(
			columns.filter(column => !column.isVisible).map(column => column.accessor)
		);
	}, [setHiddenColumns, columns]);

	// When the filter box changes, update state variable and set the table filter to look for that value
	const handleFilterChange = e => {
		const value = e.target.value || undefined;
		setFilter("artist", value);
		setFilterInput(value);
	};

	return (
		<>
			<div className="filter">
				<input
					type="text"
					value={filterInput}
					onChange={handleFilterChange}
					placeholder={"Search Artist"}
				/>
			</div>
			<table {...getTableProps()} >
				<thead>
					{/* Just displaying the different headers + adding the sorting component to them*/}
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th	{...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render('Header')}
									<span>
										{column.isSorted
											? column.isSortedDesc
												? ' ▲'
												: ' ▼'
											: ''}
									</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{
						/* 
						Based on the page, display the rows that would fit
						If the table has been paid, add a class to change the font for visual feedback
						*/
						page.map((row, i) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()} >
									{row.cells.map(cell => {
										return (
											<td
												{...cell.getCellProps()}
												className={cell.row.values.Paid ? 'paid' : null}
											>
												<p>{cell.render('Cell')}</p>

											</td>
										);
									})}
								</tr>
							);
						})
					}
				</tbody>
			</table>

			{/* Just a row of buttons that use built in page finders to navigate the table */}
			<div className="pagination">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{'<<'}
				</button>{' '}
				<button onClick={() => previousPage()} disabled={!canPreviousPage}>
					{'<'}
				</button>{' '}
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					{'>'}
				</button>{' '}
				<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
					{'>>'}
				</button>{' '}
				<span>
					Page{' '}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>{' '}
				</span>

				{/* 
					Created a pageSize state value that we can manipulate to display loads of things!
					This could be something like a input box to set a custom display amount, but didn't seem necessary
				*/}
				<select
					value={pageSize}
					onChange={e => {
						setPageSize(Number(e.target.value));
					}}
				>
					{[10, 20, 30, 40, 50].map(pageSize => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
		</>
	);
}


function App() {
	const [artists, setArtists] = useState([]);
	const [updatedArtist, setUpdatedArtist] = useState({});
	const [filterInput, setFilterInput] = useState("");
	const [artist, setArtist] = useState({
		'artist': '',
		'rate': "0.0001",
		'streams': "0"
	});


	// When a checkbox is changed, using the event and artist, make a put request to edit the artist paid status
	const handleCheckboxChange = (event, artist) => {
		axios.put(apiBase + 'artists/' + artist.id,
			{
				'artist': artist.artist,
				'rate': artist.rate,
				'streams': artist.streams,
				'paid': event.target.checked
			})
			.then(response => {
				if (response.data.paid) {
					toast.success("Artist paid");
				}
				else {
					toast.warn("Artist payment revoked");
				}
				setUpdatedArtist(response.data);
			})
			.catch(error => {
				console.log(error);
				toast.error("Error updating artist payment");
			});
		// I tried to write a function here that I could call to update the Artists list, directly made a GET request here, took the response (updated artist) and modified this artist list, etc
		// None of them worked, there was no re-render even though the call was made
		// I ended up using a "trigger variable" to get the re-render and state update when I wanted
	};

	// On page load and when the "trigger variable" updates, grab and store the full list of artists
	useEffect(() => {
		try {
			axios.get(apiBase + 'artists')
				.then(response => {
					setArtists(response.data);
				});
		}
		catch (error) {
			console.log(error);
		}
	}, [updatedArtist]); // Using the updatedArtist state object to trigger another request


	// Simple form handler that does basic form input valdiation then POSTs to the REST API
	function createArtist(event) {
		event.preventDefault();
		if (artist.artist.length > 0 && artist.rate > 0 && artist.streams) {
			console.log(artist + ' ' + rate + ' ' + streams);
			try {
				axios.post(apiBase + 'artists', {
					'artist': artist.artist,
					'rate': artist.rate,
					'streams': artist.streams
				})
					.then(response => {
						setUpdatedArtist(response.data);
						toast.success("Artist created");
						setArtist({
							'artist': '',
							'rate': "0.0001",
							'streams': "0"
						});
					});
			}
			catch (error) {
				toast.error("Artist unable to be created");
				console.log(error);
			}
		}
	}

	function handleChange(event) {
		const value = event.target.value;
		setArtist({
			...artist,
			[event.target.name]: value
		});
	}

	// Creating memos for React Table (per requirements of the module)
	const data = React.useMemo(
		() => artists
	);
	const columns = React.useMemo(
		() => [
			{
				Header: 'ID',
				accessor: 'id',
				isVisible: false
			},
			{
				Header: 'Artist',
				accessor: 'artist', // accessor is the "key" in the data
				isVisible: true
			},
			{
				Header: 'Rate',
				accessor: 'rate',
				isVisible: true
			},
			{
				Header: 'Streams',
				accessor: 'streams',
				isVisible: true
			},
			{
				Header: 'Payout',
				accessor: row => currencyFormatter.format(row.rate * row.streams),
				isVisible: true
			},
			{
				Header: 'Paid',
				accessor: row => row.paid ? 1 : 0, // Had to cast booleans to numbers for react-table sorting; without this React-Table doesn't know how to sort booleans
				isVisible: true,
				// Rendering a custom element instead of just the words "True or False"
				// Could make this into a little function but that wouldn't really do much for me
				// Would only change if I was to make a different checkbox to select and perform other actions on em
				// Using the 1/0 from the accessor to cast back into HTML booleans
				Cell: props => {
					return <input type='checkbox' checked={props.row.values.Paid == 1 ? true : false} onChange={(e) => handleCheckboxChange(e, props.row.values)} />;
				}
			}
		],
		[]
	);

	return (
		<>
			{/* Just using the simplest header component in case I was to build out other pages */}
			<Header title={"Rebel - Artists Index"} />
			<ToastContainer autoClose={2000} />
			{
				// Checking we have artists with a simple ternary, find myself doing that a lot with React!
				artists.length > 0
					?
					<Table
						columns={columns}
						data={data}
						filterInput={filterInput}
						setFilterInput={setFilterInput}
					/>
					: null
			}
			<div className="input-form">
				<form onSubmit={createArtist}>
					<label htmlFor="artist">Artist:</label>
					<input required type="text" id="artist" name="artist" value={artist.artist} onChange={handleChange} />
					<label htmlFor="rate">Rate:</label>
					<input required type="number" id="rate" name="rate" min="0.0001" step="0.0001" value={artist.rate} onChange={handleChange} />
					<label htmlFor="streams">Streams:</label>
					<input required type="number" id="streams" name="streams" value={artist.streams} onChange={handleChange} />
					<input type="submit" value="Add Artist" />
				</form>
			</div>
		</>
	);
}

export default App;