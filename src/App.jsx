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
	const [editError, setEditError] = useState(null);

	const [editedNameInput, setEditedNameInput] = useState("");
	const [editedJobInput, setEditedJobInput] = useState("");
	const [editedAgeInput, setEditedAgeInput] = useState("");
	const [clickedEditId, setClickedEditId] = useState("");


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

		if (!nameInput || !jobInput || !ageInput) {
			setAddError("Please fill all inputs");
			return;
		}

		const name = nameInput;
		const job = jobInput;
		const age = ageInput;

		const { data, error } = await supabase
			.from("users")
			.insert([{ name, job, age }])
			.select()
		
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
			.select()
			.eq("id", clickedId)
			
		
		if (error) {
			setDeleteError("Delete incomplete!");
			console.log(error);
			return;
		}

		if (data) {
			console.log(data)
			setUsers(data);
			setDeleteError(null);
		}
	}


	const handleEditButton = async (clickedId) => {
		const { data, error } = await supabase
			.from("users")
			.select()
			.eq("id", clickedId)
			.single()

		if (error) {
			console.log(error);
			return
		}

		if (data) {
			console.log(data);
			setEditedNameInput(data.name);
			setEditedJobInput(data.job);
			setEditedAgeInput(data.age);
			setClickedEditId(clickedId);
		}
	}


	const handleSubmitChangesButton = async () => {

		if (!editedNameInput || !editedJobInput || !editedAgeInput) {
			setEditError("Please fill all the blanks before submit changes");
			return;
		}

		const name = editedNameInput;
		const job = editedJobInput;
		const age = editedAgeInput;

		const { data, error } = await supabase
			.from("users")
			.update({ name, job, age })
			.select()
			.eq("id", clickedEditId)
			
			if (error) {
				console.log(error);
				setEditError(error.message);
				return;
			}

			if (data) {
				console.log(data);
				setEditedNameInput("");
				setEditedJobInput("");
				setEditedAgeInput("");
				setEditError(null);
			}
	}


	const handleDiscardChangesButton = () => {
		setEditedNameInput("");
		setEditedJobInput("");
		setEditedAgeInput("");
		setClickedEditId("");
		setEditError(null);
	}


	useEffect(() => {
		fetchUsers()
	}, [handleAddButton, handleDeleteButton, handleSubmitChangesButton]);


	return (
		<div className="container">
			<h3 style={{ margin: "1rem 0" }}>Users</h3>
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
			
			<button style={{ margin: "0.5rem 0" }} onClick={handleAddButton}>Add New User</button>
			<button onClick={() => console.log(users)}>Show List in Console</button>
			<ul>
				{fetchError && <p>{fetchError.message}</p>}
				{addError && <p>{addError}</p>}
				{deleteError && <p>{deleteError}</p>}

				{!fetchError && !addError && !deleteError && users && users.map((item) => (
					<li key={item.id}>
						<div>
							Name: {item.name} | Job: {item.job} | Age: {item.age}
							<button onClick={() => handleDeleteButton(item.id)}>X</button>
							<button onClick={() => handleEditButton(item.id)}>Edit</button>
						</div>
					</li>
				))}
			</ul>
			<hr />
			<h3 style={{ margin: "1rem 0" }}>Edit User {editedNameInput}</h3>
			<div>
				Name: <input type="text" value={editedNameInput} onChange={(e) => setEditedNameInput(e.target.value)} />
			</div>
			<div>
				Job: <input type="text" value={editedJobInput} onChange={(e) => setEditedJobInput(e.target.value)} />
			</div>
			<div>
				Age: <input type="text" value={editedAgeInput} onChange={(e) => setEditedAgeInput(e.target.value)} />
			</div>
			<button onClick={handleSubmitChangesButton}>Submit Changes</button>
			<button onClick={handleDiscardChangesButton}>Discard Changes</button>
			{editError && <p>{editError}</p>}
		</div>
	);
}

export default App;
