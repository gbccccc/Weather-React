import "styles/SearchingBlock.css"
import stateMappingJson from "assets/jsons/state-mapping.json"
import {Button, Form} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchingBlock() {
  const stateOptions = Object.entries(stateMappingJson).map(
      ([key, value]) => <option value={key}>{value}</option>
  )

  return (
      <div>
        <h2> Weather Search🌥️ </h2>
        <Form>
          <Form.Group>
            <Form.Group className="mb-3" controlId="street">
              <Form.Label>Street</Form.Label>
              <Form.Control type="input" required name="street"></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control type="input" required name="city"></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Select required name="state">
                <option>Select Your State</option>
                {stateOptions}
              </Form.Select>
            </Form.Group>
          </Form.Group>
          <hr/>
          <Form.Group controlId="autodetect">
            <Form.Label>Autodetect Location</Form.Label>
            <Form.Control type="checkbox" name="autodetect"></Form.Control>
            <Form.Label>Current Location</Form.Label>
          </Form.Group>
          <Button variant="primary"><i className="bi bi-search"></i>Search</Button>
          <Button variant="outline-secondary"><i className="bi bi-list-nested"></i>Clear</Button>
        </Form>
      </div>
  )
}

export default SearchingBlock;