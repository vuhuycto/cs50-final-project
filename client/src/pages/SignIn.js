import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

import authService from "../services/authService";
import {
  Button,
  ButtonGroup,
  Form,
  FormContainer,
  Input,
} from "../components/form/authentication";
import { useRouting } from "../hooks/routing";

function SignIn() {
  const history = useHistory();
  const routing = useRouting(history.location.pathname);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async function (values) {
      try {
        setLoading(true);
        await authService.login(values.email, values.password);
        window.location = "/";
      } catch (error) {
        setLoading(false);
        toast.error("Your email or password is invalid. Please try again!");
      }
    },
  });

  useEffect(() => {
    if (authService.getCurrentUser()) routing.push("/documents");
  }, []);

  return (
    <FormContainer>
      <Form onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          autoFocus
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
            Sign In
          </Button>
        </ButtonGroup>
        <RegisterLink to="/register">
          Don't have an account? Create one
        </RegisterLink>
      </Form>
    </FormContainer>
  );
}

// Form Constraints
const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().min(5).label("Email"),
  password: Yup.string().required().min(6).max(100).label("Password"),
});

const RegisterLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: var(--tertiary-color);
  margin-top: 1rem;
`;

export default SignIn;
