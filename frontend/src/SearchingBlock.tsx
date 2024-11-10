import "styles/SearchingBlock.css"
import stateMappingJson from "assets/jsons/state-mapping.json"
import {Button, Col, Form, Row} from "react-bootstrap";
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
      <div className="searching-block">
        <h2> Weather Search🌥️ </h2>
        <Form className="searching-form" ref={formRef}>
          <Form.Group as={Row} className="mb-3" controlId="street">
            <Col sm={2}/>
            <Form.Label className="address-label" column sm={1}>Street</Form.Label>
            <Col sm={6}>
              <Form.Control className="form-input" type="input" required name="street"></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="city">
            <Col sm={2}/>
            <Form.Label className="address-label" column sm={1}>City</Form.Label>
            <Col sm={6}>
              <Form.Control className="form-input" type="input" required name="city"></Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="state">
            <Col sm={2}/>
            <Form.Label className="address-label" column sm={1}>State</Form.Label>
            <Col sm={3}>
              <Form.Select required name="state">
                <option value="" key="holder">Select Your State</option>
                {stateOptions}
              </Form.Select>
            </Col>
          </Form.Group>
          <hr/>
          <Form.Group as={Row} controlId="autodetect" className="checkbox-row">
            <Form.Label column xs="auto">Autodetect Location</Form.Label>
            <Col xs="auto" className="checkbox-row">
              <Form.Check name="autodetect" ref={autodetectRef} label="Current Location"></Form.Check>
            </Col>
          </Form.Group>
          <Button className="form-button" variant="primary" onClick={onSubmit}><i className="bi bi-search"></i>Search</Button>
          <Button className="form-button" variant="outline-secondary"><i className="bi bi-list-nested"></i>Clear</Button>
        </Form>
      </div>
  )
}

export default SearchingBlock;