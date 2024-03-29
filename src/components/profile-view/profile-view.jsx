import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { MoviesList } from "../movies-list/movies-list";

import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/reducers/user";
import { setToken } from "../../redux/reducers/user";

export const ProfileView = (favoriteMovies) => {
  const user = useSelector((state) => state.user.user) || JSON.parse(localStorage.getItem("user"));
  const token = useSelector((state) => state.user.token) || localStorage.getItem("token");
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [email, setEmail] = useState(user.email);
  const [birthday, setBirthday] = useState(() => {
    if (user.birthday == null) {
      return "";
    }
    else {
      const bday = new Date(user.birthday).toLocaleDateString();
      return bday;
    }
  });

  const dispatch = useDispatch();

  const updateUserWithChangedData = (updatedUsername) => {
    if (!token) return;

    fetch(`https://movie-api-zy6n.onrender.com/users/${updatedUsername}`, {

      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((user) => {
        dispatch(setUser(user));
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch(`https://movie-api-zy6n.onrender.com/users/${user.username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        updateUserWithChangedData(username);
        setBirthday(new Date(birthday).toLocaleDateString());
        alert("Update successful");
      } else {
        alert("Update failed");
      }
    });
  };

  const unregister = (event) => {
    event.preventDefault();

    fetch(`https://movie-api-zy6n.onrender.com/users/${user.username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        alert("Successful unregistered");
        window.location.replace('/login');
      } else {
        alert("Update failed");
      }
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBirthday">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="text"
            value={birthday}
            placeholder={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <>
        {<MoviesList movies={favoriteMovies.favoriteMovies} />}
      </>

      <Form onSubmit={unregister}>
        <Button variant="danger" type="submit">
          Unregister
        </Button>
      </Form>
    </>
  );
};