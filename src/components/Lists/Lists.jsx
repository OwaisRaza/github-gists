import { ListGroup, Image, Button } from 'react-bootstrap';
import './List.css';

export default function Lists({
  id,
  owner,
  files,
  forks,
  handler,
  onHandleFork,
}) {
  return (
    <ListGroup.Item className="main-list d-flex justify-content-between align-items-center">
      <Image
        thumbnail
        className="m-2"
        width={'15%'}
        src={owner.avatar_url}
        alt={owner.avatar_url}
      />
      <div className="ms-2 me-auto">
        <div className="fw-bold">{owner.login}</div>
        <span className="fw-bold small">File Type:</span> {handler(files)}
      </div>
      <div>
        {!forks[id] && (
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => onHandleFork(id)}
          >
            View Forks
          </Button>
        )}

        {forks[id] ? (
          forks[id].length ? (
            forks[id].map(({ id, owner, git_pull_url }) => (
              <ListGroup className="fork-list" variant="flush" key={id}>
                <ListGroup.Item>
                  <Image
                    className="me-3"
                    roundedCircle
                    width={'20%'}
                    src={owner.avatar_url}
                    alt={owner.avatar_url}
                  />
                  <a
                    href={git_pull_url}
                    alt={git_pull_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <small>{owner.login}</small>
                  </a>
                </ListGroup.Item>
              </ListGroup>
            ))
          ) : (
            <p className="text-danger">No fork in this gist</p>
          )
        ) : null}
      </div>
    </ListGroup.Item>
  );
}
