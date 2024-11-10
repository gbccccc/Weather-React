import "styles/SearchingBlock.css"
import stateMappingJson from "assets/jsons/state-mapping.json"
import {Button, Form} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRef} from "react";

function SearchingBlock({submitCallback, clearCallback}: {
  submitCallback: (needAutodetect: boolean, formData: string) => void,
  clearCallback: () => void
}) {
  let formRef = useRef<HTMLFormElement>(null)
  let autodetectRef = useRef<HTMLInputElement>(null)

  const stateOptions = Object.entries(stateMappingJson).map(
      ([key, value]) => <option value={key} key={key}>{value}</option>
  )

  function onSubmit() {
    let formData = new FormData(formRef.current!)
    let addressArray = []
    let entries = Array.from(formData.entries());
    for (let entry of entries) {
      addressArray.push((entry[1] as string).replaceAll(" ", "+"))
    }
    let addressStr = addressArray.join()
    submitCallback(autodetectRef.current!["checked"], addressStr)
  }

  return (
      <div>
        <h2> Weather Search🌥️ </h2>
        <Form ref={formRef}>
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
                <option value="" key="holder">Select Your State</option>
                {stateOptions}
              </Form.Select>
            </Form.Group>
          </Form.Group>
          <hr/>
          <Form.Group controlId="autodetect">
            <Form.Label>Autodetect Location</Form.Label>
            <Form.Check name="autodetect" ref={autodetectRef}></Form.Check>
            <Form.Label>Current Location</Form.Label>
          </Form.Group>
          <Button variant="primary" onClick={onSubmit}><i className="bi bi-search"></i>Search</Button>
          <Button variant="outline-secondary"><i className="bi bi-list-nested"></i>Clear</Button>
        </Form>
      </div>
  )
}

export default SearchingBlock;