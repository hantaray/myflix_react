import { useEffect, useState } from "react";
import { Button, Card, Col, Form } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ username, token, movies }) => {
  const [updatedUsername, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [user, setUser] = useState({});
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`https://movie-api-zy6n.onrender.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
        setUsername(user.username);
        setPassword(user.password);
        setEmail(user.email);
        setBirthday(user.birthday);
        setFavoriteMovies(movies.filter(m => user.favoriteMovies.includes(m.id)));
      });
  }, [token]);

  const updateUser = () => {
    if (!token) return;

    fetch(`https://movie-api-zy6n.onrender.com/users/${updatedUsername}`, {

      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setFavoriteMovies(movies.filter(m => user.favoriteMovies.includes(m.id)));
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: updatedUsername,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch(`https://movie-api-zy6n.onrender.com/users/${username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        updateUser();
        alert("Update successful");
        window.location.reload();
      } else {
        alert("Update failed");
      }
    });
  };

  const unregister = (event) => {
    event.preventDefault();

    fetch(`https://movie-api-zy6n.onrender.com/users/${updatedUsername}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        setUser(null);
        localStorage.clear();
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
            value={updatedUsername}
            placeholder={updatedUsername}
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
        {favoriteMovies.map((movie) => (
          <Col className="mb-4" key={movie.id} md={3}>
            <MovieCard user={user} token={token} movie={movie} />
          </Col>
        ))}
      </>

      <Form onSubmit={unregister}>
        <Button variant="danger" type="submit">
          Unregister
        </Button>
      </Form>

    </>
  );
};