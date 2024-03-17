import React, { useReducer, useEffect, useState } from "react";
import "./App.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_USERS_DATA":
      return {
        ...state,
        userData: action.payload,
        isLoading: false,
        isError: { status: false, msg: "" },
      };
    case "LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        isLoading: false,
        isError: {
          status: true,
          msg: action.payload.message || "Something went wrong...",
        },
      };
    case "DELETE_USER":
      const newUsers = state.userData.filter(
        (user) => user.id !== action.payload
      );
      return {
        ...state,
        userData: newUsers,
      };
    case "UPDATE_USER":
      return {
        ...state,
        isEditing: { status: true, id: action.payload.id, name: action.payload.name, email: action.payload.email }
      };
    case "UPDATED_USER":
      const newUpdatedUsers = state.userData.map((user) => {
        if (user.id === action.payload.id) {
          return {
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
          };
        } else {
          return user;
        }
      });
      return {
        ...state,
        userData: newUpdatedUsers,
        isEditing: { status: false, id: "", name: "", email: "" },
      };
    default:
      return state;
  }
};

const MethodOfUseReducer = () => {
  const URL = "https://jsonplaceholder.typicode.com/users";

  const fetchUsersData = async (url) => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const response = await fetch(url);
      const data = await response.json();
      dispatch({ type: "UPDATE_USERS_DATA", payload: data });
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR", payload: error });
    }
  };

  useEffect(() => {
    fetchUsersData(URL);
  }, []);

  const initialState = {
    userData: [],
    isLoading: false,
    isError: { status: false, msg: "" },
    isEditing: { status: false, id: "", name: "", email: "" },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_USER", payload: id });
  };

  const handleUpdate = (id, name, email) => {
    dispatch({ type: "UPDATE_USER", payload: { id, name, email } });
  };

  const changeData = (id, name, email) => {
    dispatch({ type: "UPDATED_USER", payload: { id, name, email } });
  };

  if (state.isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (state.isError.status) {
    return (
      <div>
        <h4 className="error-message">Something went wrong...</h4>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users Information</h1>
      </div>
      <h5 className="total-users">Total Users: {state.userData.length}</h5>
      {state.isEditing.status && (
        <EditFormContainer
          id={state.isEditing.id}
          name={state.isEditing.name}
          email={state.isEditing.email}
          updateData={changeData}
        />
      )}
      {state.userData.length === 0 ? (
        <h3 className="no-records">No Records Found</h3>
      ) : (
        state.userData.map((user) => {
          const { id, name, email } = user;
          return (
            <div className="user-card" key={id}>
              <div  className="user-info">
                <h3>Name: {name}</h3>
                <h4>Email: {email}</h4>
              </div>
              <div className="btn-group">
                <button className="button update" onClick={() => handleUpdate(id, name, email)}>
                  Update
                </button>
                <button className="button delete" onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const EditFormContainer = ({ id, name: initialName, email: initialEmail, updateData }) => {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");

  const changeData = () => {
    updateData(id, name, email);
  };

  return (
<div className="form-container">
  <input
    type="text"
    name="name"
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="input-field"
    placeholder=''
  />
  <input
    type="text"
    name="email"
    id="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="input-field"
    placeholder=''
  />
  <button onClick={changeData} className="buttonEdit">Edit Data</button>
</div>

  );
};

export default MethodOfUseReducer;
