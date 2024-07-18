import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Email est requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères")
    .required("Le mot de passe est requis"),
});

export const registrationValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères")
    .required("Le nom d'utilisateur est requis"),
  email: Yup.string().email("Email invalide").required("Email est requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("La confirmation du mot de passe est requise"),
});
