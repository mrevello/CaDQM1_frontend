import * as yup from "yup";

export const LoginValidate = yup.object().shape({
  username: yup.string().trim().required("This field is mandatory"),
  password: yup.string().trim().required("This field is mandatory"),
});

export const RegisterValidate = yup.object().shape({
  username: yup.string().trim().required("This field is mandatory"),
  password: yup.string().trim().required("This field is mandatory"),
  email: yup.string().trim().email("Please enter a valid email").optional(),
  description: yup.string().trim().optional(),
});

export const ProjectValidate = yup.object().shape({
  name: yup.string().trim().required("This field is mandatory"),
});

export const ProblemValidate = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  description: yup.string().trim().required("Description is required"),
});

export const a01Validate = yup.object().shape({
  name: yup.string().trim().required("This field is mandatory"),
  description: yup.string().trim().required("This field is mandatory"),
  url: yup.string().trim().required("This field is mandatory"),
  user: yup.string().trim().required("This field is mandatory"),
  password: yup.string().trim().required("This field is mandatory"),
});
