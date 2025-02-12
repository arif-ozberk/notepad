import React, { useRef, useState } from 'react';

// Styles
import "./styles/globals.scss";


const App = () => {

	const [userInput, setUserInput] = useState("");
	const [users, setUsers] = useState([]);

	const inputRef = useRef();


	const handleAddButton = () => {
		const newUser = {
			id: Math.floor(Math.random() * 100000000000),
			name: userInput
		}

		setUsers(prev => [...prev, newUser]);
		setUserInput("");
		inputRef.current.focus();
	}


	const handleDeleteButton = (clickedId) => {
		const filteredList = users.filter(item => item.id !== clickedId);
		setUsers(filteredList);
	}


	return (
		<div className="container">
			<input ref={inputRef} type="text" onChange={(e) => setUserInput(e.target.value)} value={userInput} />
			<button onClick={handleAddButton}>Add</button>
			<button onClick={() => console.log(users)}>Show List in Console</button>
			<ul>
				{users.map((item) => (
					<li key={item.id}>
						{item.name}
						<button onClick={() => handleDeleteButton(item.id)}>X</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
