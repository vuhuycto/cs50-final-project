import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import userService from "./../services/userService";
import authService from "../services/authService";
import {
  Button,
  ButtonGroup,
  Form,
  FormContainer,
  Input,
} from "../components/form/authentication";
import { useRouting } from "../hooks/routing";

function Register() {
  const history = useHistory();
  const routing = useRouting(history.location.pathname);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async function (values) {
      setLoading(true);
      await userService.register(values);
      window.location = "/";
    },
  });

  useEffect(() => {
    if (authService.getCurrentUser()) routing.push("/documents");
  }, [routing]);

  return (
    <FormContainer>
      <Form onSubmit={formik.handleSubmit}>
        <Input
          label="Name"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.errors.name}
        />
        <Input
          label="Email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.errors.email}
        />
        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.errors.password}
        />
        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            Register
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}

// Form Constraints
const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2).label("Name"),
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().min(6).max(100).label("Password"),
});

export default Register;
