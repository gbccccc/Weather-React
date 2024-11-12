import "src/styles/SearchingBlock.css"
import {stateMapping} from "src/scripts/mappings.ts"
import {Button, Col, Form, Row} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useRef, useState} from "react";

function SearchingBlock({submitCallback, clearCallback}: {
  submitCallback: (needAutodetect: boolean, formData: string) => void,
  clearCallback: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const autodetectRef = useRef<HTMLInputElement>(null)

  const [needAutodetect, setNeedAutodetect] = useState(false)
  const [entryValidated, setEntryValidated] = useState({
    "street": false,
    "city": false,
    "state": false
  })
  const [entryValue, setEntriesValue] = useState({
    "street": "",
    "city": "",
    "state": ""
  })

  const stateOptions = Object.entries(stateMapping).map(
      ([key, value]) => <option value={key} key={key}>{value}</option>
  )

  function submit() {
    if (needAutodetect) {
      submitCallback(needAutodetect, "")
      return
    }

    if (!formRef.current!.checkValidity()) {
      return
    }

    const formData = new FormData(formRef.current!)

    const addressArray = []
    const entries = Array.from(formData.entries());
    for (const entry of entries) {
      addressArray.push((entry[1] as string).replaceAll(" ", "+"))
    }
    const addressStr = addressArray.join()
    submitCallback(needAutodetect, addressStr)
  }

  function clear() {
    setEntryValidated({
      "street": false,
      "city": false,
      "state": false
    })
    formRef.current!.reset()
    setEntriesValue({
      "street": "",
      "city": "",
      "state": ""
    })
    autodetectRef.current!.checked = false
    setNeedAutodetect(false)
    clearCallback()
  }

  function onEntryChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const {name, value} = event.target
    setEntryValidated(prevState => ({
      ...prevState,
      [name]: true
    }))
    setEntriesValue(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  function onAutodetectChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEntryValidated({
      "street": false,
      "city": false,
      "state": false
    })
    console.log(e.target.checked)
    setNeedAutodetect(e.target.checked)
  }

  function isEntryInvalid(name: string) {
    return entryValue[name as keyof typeof entryValue].replace(/\s+/g, "") === ""
  }

  function isInvalidFeedbackShown(name: string) {
    return !needAutodetect && entryValidated[name as keyof typeof entryValidated] && isEntryInvalid(name)
  }

  function isSubmitDisabled() {
    return !needAutodetect && (isEntryInvalid("city") || isEntryInvalid("street") || isEntryInvalid("state"))
  }

  return (
      <div className="searching-block">
        <h2> Weather Search🌥️ </h2>
        <Form className="searching-form" ref={formRef}>
          <Form.Group as={Row} className="mb-3" controlId="street">
            <Col sm={2}/>
            <Form.Label className="address-label" column={true} sm={1}>Street</Form.Label>
            <Col sm={6}>
              <Form.Control className="form-input" type="input" required name="street"
                            onChange={onEntryChange} onBlur={onEntryChange}
                            disabled={needAutodetect} isInvalid={isInvalidFeedbackShown("street")}></Form.Control>
              <Form.Control.Feedback type="invalid">
                Please enter a valid street.
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="city">
            <Col sm={2}/>
            <Form.Label className="address-label" column={true} sm={1}>City</Form.Label>
            <Col sm={6}>
              <Form.Control className="form-input" type="input" required name="city"
                            onChange={onEntryChange} onBlur={onEntryChange}
                            disabled={needAutodetect} isInvalid={isInvalidFeedbackShown("city")}></Form.Control>
              <Form.Control.Feedback type="invalid">
                Please enter a valid city.
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="state">
            <Col sm={2}/>
            <Form.Label className="address-label" column={true} sm={1}>State</Form.Label>
            <Col sm={3}>
              <Form.Select required name="state"
                           onChange={onEntryChange} onBlur={onEntryChange}
                           disabled={needAutodetect} isInvalid={isInvalidFeedbackShown("state")}>
                <option value="" key="holder">Select Your State</option>
                {stateOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please choose a valid state.
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <hr/>
          <Form.Group as={Row} controlId="autodetect" className="checkbox-row">
            <Form.Label column={true} xs="auto">Autodetect Location</Form.Label>
            <Col xs="auto" className="checkbox-row">
              <Form.Check name="autodetect" ref={autodetectRef}
                          onChange={onAutodetectChange} label="Current Location"></Form.Check>
            </Col>
          </Form.Group>
          <Button className="form-button" variant="primary" disabled={isSubmitDisabled()} onClick={submit}><i
              className="bi bi-search"></i>Search</Button>
          <Button className="form-button" variant="outline-secondary" onClick={clear}><i
              className="bi bi-list-nested"></i>Clear</Button>
        </Form>
      </div>
  )
}

export default SearchingBlock;