import React, { useRef, useState, useEffect, use } from 'react';

// Styles
import "./styles/globals.scss";

// Supabase
import supabase from './config/supabaseClient';


const App = () => {


	const [nameInput, setNameInput] = useState("");
	const [jobInput, setJobInput] = useState("");
	const [ageInput, setAgeInput] = useState("");

	const [users, setUsers] = useState(null);

	const [fetchError, setFetchError] = useState(null);
	const [addError, setAddError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);


	const fetchUsers = async () => {
		const { data, error } = await supabase
			.from("users")
			.select()
		
		if (error) {
			setFetchError(error);
			setUsers(null);
			console.log(error);
		}
		if (data) {
			setUsers(data);
			setFetchError(null);
		}
	}


	const handleAddButton = async (e) => {
		e.preventDefault();

		if (!nameInput || !jobInput || !ageInput) {
			setAddError("Please fill all inputs");
			return;
		}

		const name = nameInput;
		const job = jobInput;
		const age = ageInput;

		const { data, error } = await supabase
			.from("users")
			.insert([{ name, job, age }]);
		
			if (error) {
				console.log(error);
				setAddError(error);
			}

			if (data) {
				console.log(data);
				setAddError(null);
			}

		setNameInput("");
		setJobInput("");
		setAgeInput("");
		setAddError(null);
	}


	const handleDeleteButton = async (clickedId) => {
		const { data, error } = await supabase
			.from("users")
			.delete()
			.eq("id", clickedId);
		
		if (error) {
			setDeleteError("Delete incomplete!");
			console.log(error);
			return;
		}

		if (data) {
			setUsers(data);
			setDeleteError(null);
		}
	}


	useEffect(() => {
		fetchUsers()
	}, [handleAddButton, handleDeleteButton]);


	return (
		<div className="container">
			<div>
				Name:
				<input type="text" onChange={(e) => setNameInput(e.target.value)} value={nameInput} />
			</div>
			<div>
				Job:
				<input type="text" onChange={(e) => setJobInput(e.target.value)} value={jobInput} />
			</div>
			<div>
				Age:
				<input type="text" onChange={(e) => setAgeInput(e.target.value)} value={ageInput} />
			</div>
			
			<button onClick={handleAddButton}>Add New User</button>
			<button onClick={() => console.log(users)}>Show List in Console</button>
			<ul>
				{fetchError && <p>{fetchError.message}</p>}
				{addError && <p>{addError}</p>}
				{deleteError && <p>{deleteError}</p>}

				{!fetchError && !addError && !deleteError && users && users.map((item) => (
					<li key={item.id}>
						<div>Name: {item.name} | Job: {item.job} | Age: {item.age}<button onClick={() => handleDeleteButton(item.id)}>X</button></div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
