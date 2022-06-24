import axios from 'axios';
import { useState } from 'react';
import {
  Badge,
  Container,
  Button,
  Form,
  Navbar,
  Nav,
  FormControl,
  Alert,
  ListGroup,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import './App.css';
import Lists from './components/Lists/Lists';

function App() {
  const [userName, setUserName] = useState();
  const [gists, setGists] = useState([]);
  const [forks, setforks] = useState({});
  const [gistsError, setGistsError] = useState();
  const [isGist, setIsGist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onReset = () => {
    setGistsError('');
    setGists([]);
    setforks({});
    setIsGist(false);
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    onReset();
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.github.com/users/${userName}/gists`
      );
      setIsLoading(false);
      setGists(res.data);
      if (!res.data.length) setIsGist(true);
    } catch (error) {
      setGistsError(error.response.data.message);
      setIsLoading(false);
      setIsGist(false);
    }
  };

  const onHandleFork = async (id) => {
    try {
      const res = await axios.get(`https://api.github.com/gists/${id}/forks`);
      setforks({ ...forks, [id]: res.data.slice(-3) });
    } catch (error) {
      console.log('error: ', error.response.data.message);
    }
  };

  const convertExtensionToBadge = (files) => {
    const filesKeys = Object.keys(files);

    const tag = filesKeys.map((item, index) => {
      if (
        files[item].language === 'JavaScript' ||
        files[item].language === 'Python'
      ) {
        return (
          <Badge className="me-2" key={`${index}-${item}`} bg="info">
            {files[item].language}
          </Badge>
        );
      }
      return (
        <Badge className="me-2" key={`${index}-${item}`} bg="warning">
          Others
        </Badge>
      );
    });
    return tag;
  };

  return (
    // Header view
    <div className="App">
      <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Search Github Users Gists </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
            ></Nav>
            <Form className="d-flex" onSubmit={(e) => onsubmit(e)}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button
                type="submit"
                variant="success"
                disabled={isLoading || !userName}
              >
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* List view */}
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md="10">
            {isLoading && (
              <>
                <Spinner animation="grow" variant="success" size="sm" />
                <Spinner animation="grow" variant="success" />
              </>
            )}
            {gistsError && <Alert variant="danger">{gistsError}</Alert>}
            {isGist && (
              <Alert variant="danger">
                No gists are available on this user.
              </Alert>
            )}
            <ListGroup variant="flush">
              {gists.length > 0 &&
                gists.map(({ id, owner, files }, index) => (
                  <Lists
                    key={id}
                    id={id}
                    owner={owner}
                    files={files}
                    forks={forks}
                    handler={convertExtensionToBadge}
                    onHandleFork={onHandleFork}
                  />
                ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
