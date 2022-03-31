import React, {useState, useContext} from 'react';
import {StyleSheet, Text, TextInput, View, ScrollView} from 'react-native';
import BackBtn from '../components/BackBtn';
import Button from '../components/Button';
import colors from '../constants/colors';
import {Formik} from 'formik';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import makeId from '../constants/makeId';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AppNavigation';

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email address is required'),
  phone: yup
    .string()
    .min(10, 'Invalid phone number')
    .required('Phone nummber is required'),
  password: yup.string().required('Password is required'),
});

const SignUp = () => {
  const {signIn} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values: any) => {
    const id = makeId(20);
    try {
      setLoading(true);
      auth()
        .createUserWithEmailAndPassword(values.email.trim(), values.password)
        .then(() => {
          console.log('User account created & signed in!');
          firestore()
            .collection('Users')
            .doc(id)
            .set({
              id: id,
              name: values.name,
              phone: values.phone,
              email: values.email.trim(),
              password: values.password,
              role: 'employee',
              createdAt: firestore.Timestamp.now(),
            })
            .then(() => {
              console.log('User added!');
            });
          setLoading(false);
          signIn();
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          Toast.show(error.code);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, paddingTop: 0}}>
          <Text
            style={{
              fontSize: 30,
              color: colors.lightBlack,
              fontWeight: 'bold',
            }}>
            Create Account
          </Text>

          <Formik
            validationSchema={signupSchema}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              name: '',
              phone: '',
              email: '',
              password: '',
            }}
            onSubmit={values => {
              console.log(values);
              handleSignUp(values);
            }}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <View style={{marginTop: 40}}>
                  <TextInput
                    placeholder="Name"
                    style={styles.input}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholderTextColor="gray"
                  />
                  <View style={{marginBottom: 20}}>
                    {errors.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}
                  </View>
                  <TextInput
                    placeholder="Phone"
                    style={styles.input}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    keyboardType="number-pad"
                    maxLength={10}
                    placeholderTextColor="gray"
                  />
                  <View style={{marginBottom: 20}}>
                    {errors.phone && (
                      <Text style={styles.error}>{errors.phone}</Text>
                    )}
                  </View>
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholderTextColor="gray"
                  />
                  <View style={{marginBottom: 20}}>
                    {errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                  </View>
                  <TextInput
                    placeholder="Password"
                    style={styles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={true}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    placeholderTextColor="gray"
                  />
                  <View style={{marginBottom: 20}}>
                    {errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}
                  </View>
                  <Button
                    containerStyle={{marginTop: 20}}
                    label="Sign Up"
                    onPress={handleSubmit}
                    loading={loading}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
  },
  error: {
    // marginBottom: 20,
    marginTop: 5,
    marginLeft: 10,
    fontSize: 12,
    color: 'red',
  },
});
