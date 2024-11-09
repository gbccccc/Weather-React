import "styles/SearchingBlock.css"
import stateMappingJson from "assets/jsons/state-mapping.json"
import {Button, Form} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function SearchingBlock() {
  const stateOptions = Object.entries(stateMappingJson).map(
      ([key, value]) => <option value={key}>{value}</option>
  )
  return (
      <div>
        <h2> Weather Search🌥️ </h2>
        <Form>
          <Form.Group>
            <Form.Group>
              <Form.Label>Street</Form.Label>
              <Form.Control type="input" required name="street"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control type="input" required name="city"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Select required name="state">
                <option>Select Your State</option>
                {stateOptions}
              </Form.Select>
            </Form.Group>
          </Form.Group>
          <hr/>
          <Button><i className="bi bi-search"></i>Search</Button>
          <Button><i className="bi bi-list-nested"></i>Clear</Button>
        </Form>
      </div>
  )
}

export default SearchingBlock;