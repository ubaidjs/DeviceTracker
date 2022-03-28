import React, {useState, useEffect} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';
import Modal from 'react-native-modal';
import {Formik} from 'formik';
import * as yup from 'yup';
import Button from '../../components/Button';
import makeId from '../../constants/makeId';
import Toast from 'react-native-simple-toast';

const deviceSchema = yup.object().shape({
  deviceName: yup.string().required('Device name is required'),
  deviceType: yup.string().required('Device type is required'),
  serialNo: yup.string().required('Serial No is required'),
  manageBy: yup.string().required('Please select user'),
  issueDate: yup
    .string()
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
      'Invalid date format',
    )
    .required('Please select issue date'),
});

const AddDevice = ({navigation}: any) => {
  const [deviceTypeM, setDeviceTypeM] = useState(false);
  const [manageByM, setManageByM] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const closeDeviceTypeM = () => setDeviceTypeM(false);

  const closeManageByM = () => setManageByM(false);

  const fetchUsers = async () => {
    const fetchedUsers = await firestore()
      .collection('Users')
      .get()
      .then(snap => {
        let temp: any = [];
        snap.forEach(item => {
          temp.push(item.data());
        });
        return temp;
      });
    setUsers(fetchedUsers);
  };

  const addDevice = (values: any) => {
    setLoading(true);
    const id = makeId(20);
    firestore()
      .collection('Devices')
      .doc(id)
      .set({
        ...values,
        deviceId: id,
      });
    setLoading(false);
    Toast.show('Device successfully added');
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, paddingTop: 0}}>
          <View style={styles.header}>
            <Text style={styles.h1}>Add Device</Text>
          </View>
        </View>

        <View style={{padding: 20}}>
          <Formik
            validationSchema={deviceSchema}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              deviceName: '',
              deviceType: '',
              serialNo: '',
              manageBy: '',
              manageById: '',
              issueDate: '',
            }}
            onSubmit={values => {
              console.log(values);
              addDevice(values);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              setFieldValue,
            }) => (
              <>
                <TextInput
                  placeholder="Device Name"
                  style={styles.input}
                  onChangeText={handleChange('deviceName')}
                  onBlur={handleBlur('deviceName')}
                  value={values.deviceName}
                  placeholderTextColor="gray"
                />
                <View style={{marginBottom: 20}}>
                  {errors.deviceName && (
                    <Text style={styles.error}>{errors.deviceName}</Text>
                  )}
                </View>

                <Pressable
                  onPress={() => setDeviceTypeM(true)}
                  style={styles.pressInput}>
                  {values.deviceType === '' ? (
                    <Text style={styles.placeholder}>Device Type</Text>
                  ) : (
                    <Text>{values.deviceType}</Text>
                  )}
                </Pressable>
                <View style={{marginBottom: 20}}>
                  {errors.deviceType && (
                    <Text style={styles.error}>{errors.deviceType}</Text>
                  )}
                </View>

                <TextInput
                  placeholder="Serial No."
                  style={styles.input}
                  onChangeText={handleChange('serialNo')}
                  onBlur={handleBlur('serialNo')}
                  value={values.serialNo}
                  placeholderTextColor="gray"
                />
                <View style={{marginBottom: 20}}>
                  {errors.serialNo && (
                    <Text style={styles.error}>{errors.serialNo}</Text>
                  )}
                </View>

                <Pressable
                  onPress={() => setManageByM(true)}
                  style={styles.pressInput}>
                  {values.manageBy === '' ? (
                    <Text style={styles.placeholder}>Manage By</Text>
                  ) : (
                    <Text>{values.manageBy}</Text>
                  )}
                </Pressable>
                <View style={{marginBottom: 20}}>
                  {errors.manageBy && (
                    <Text style={styles.error}>{errors.manageBy}</Text>
                  )}
                </View>

                <TextInput
                  placeholder="Issue Date DD/MM/YYYY"
                  style={styles.input}
                  onChangeText={handleChange('issueDate')}
                  onBlur={handleBlur('issueDate')}
                  value={values.issueDate}
                  placeholderTextColor="gray"
                />
                <View style={{marginBottom: 20}}>
                  {errors.issueDate && (
                    <Text style={styles.error}>{errors.issueDate}</Text>
                  )}
                </View>

                <Button
                  label="Submit"
                  onPress={handleSubmit}
                  loading={loading}
                />

                <Modal
                  isVisible={deviceTypeM}
                  onBackdropPress={closeDeviceTypeM}
                  onBackButtonPress={closeDeviceTypeM}>
                  <View style={styles.modalView}>
                    <ScrollView>
                      <View>
                        {[
                          'iPhone',
                          'iPad',
                          'MacBook',
                          'Android Phone',
                          'Android Tablet',
                          'Windows PC',
                          'Windows Laptop',
                        ].map(item => {
                          return (
                            <Pressable
                              onPress={() => {
                                setFieldValue('deviceType', item);
                                closeDeviceTypeM();
                              }}
                              key={item}
                              style={styles.modalItem}>
                              <Text>{item}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                </Modal>

                <Modal
                  isVisible={manageByM}
                  onBackdropPress={closeManageByM}
                  onBackButtonPress={closeManageByM}>
                  <View style={styles.modalView}>
                    <ScrollView>
                      <View>
                        {users.map((item: any) => {
                          return (
                            <Pressable
                              onPress={() => {
                                setFieldValue('manageBy', item.name);
                                setFieldValue('manageById', item.id);
                                closeManageByM();
                              }}
                              key={item.id}
                              style={styles.modalItem}>
                              <Text>{item.name}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.lightBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
  },

  pressInput: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
    justifyContent: 'center',
  },
  placeholder: {
    color: 'gray',
  },
  error: {
    // marginBottom: 20,
    marginTop: 5,
    marginLeft: 10,
    fontSize: 12,
    color: 'red',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  modalItem: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
});
