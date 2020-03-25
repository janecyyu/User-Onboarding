import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email()
    .required("Must include an email"),
  password: yup
    .string()
    .required()
    .min(6, "At least 6 characters"),
  terms: yup.boolean().oneOf([true], "please agree to terms of use")
});

export default function Form() {
  //set states
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });
  // state for our errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });
  //sate fot post
  const [post, setPost] = useState([]);

  //make submit button disable if the form not finish
  const [buttonOn, setButtonOn] = useState(false);

  //user list
  const [users, setUser] = useState([]);

  //check if the form valid or not
  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      console.log("valid?", valid);
      setButtonOn(!valid);
    });
  }, [formState]);

  const ifValid = e => {
    // yup.reach will allow us to "reach" into the schema and test only one part.
    // We give reach the schema as the first argument, and the key we want to test as the second.
    yup
      .reach(formSchema, e.target.name)
      //we can then run validate using the value
      .validate(e.target.value)
      // if the validation is successful, we can clear the error message
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      /* if the validation is unsuccessful, we can set the error message to the message 
      returned from yup (that we created in our schema) */
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        });
      });

    // Wether or not our validation was successful, we will still set the state to the new value as the user is typing
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  //once user submit
  const formSubmit = event => {
    event.preventDefault();
    console.log("form submitted!");
    axios
      .post("https://reqres.in/api/users", formState) //<--new data
      .then(response => {
        //console.log(response.data);
        setPost(response.data);
        const newUser = {
          name: formState.name,
          email: formState.email,
          password: formState.password,
          terms: formState.terms
        };
        setUser([...users, newUser]);

        setFormState({
          name: "",
          email: "",
          terms: "",
          password: ""
        });
      })
      .catch(err => {
        console.log(err.res);
      });
  };

  //once input coming
  const inputChange = e => {
    e.persist(); //<--!!!!!!
    ifValid(e);
    //to get what part change ex:fname or lname...
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    setFormState(newFormData);
  };

  return (
    // Name
    //  Email
    //  Password
    //  Terms of Service (checkbox)
    //  A Submit button to send our form data to the server.
    <div>
      <form onSubmit={formSubmit}>
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange}
          />
          {errors.name.length > 0 ? errors.name : null}
        </label>
        <br />
        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email}
            onChange={inputChange}
          />
          {errors.email.length > 0 ? errors.email : null}
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            name="password"
            onChange={inputChange}
          />
          {errors.password.length > 0 ? errors.password : null}
        </label>
        <br />
        <label htmlFor="terms">
          <input
            type="checkbox"
            name="terms"
            checked={formState.terms}
            onChange={inputChange}
          />
          Terms of Service
        </label>
        <br />
        <pre>{JSON.stringify(users, null, 2)}</pre>
        <button disabled={buttonOn}>Submit</button>
      </form>
    </div>
  );
}
