import React from 'react';
import { Button, Input, Box, Text } from 'native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';

const FormExample = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <Box>
          <Input
            placeholder="Name"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          />
          {touched.name && errors.name && <Text color="red.500">{errors.name}</Text>}
          <Input
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            mt={4}
          />
          {touched.email && errors.email && <Text color="red.500">{errors.email}</Text>}
          <Button onPress={handleSubmit} mt={4}>
            Submit
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default FormExample;
