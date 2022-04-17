/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
/* eslint-disable consistent-return */

const express = require('express');
const async = require('async');
const _ = require('lodash');
const axios = require('axios');
const fs = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const serviceAccount = require('../../config/java-game-service-account.json');

const config = require('../../config/serverConfig.json');
const isAuthenticated = require('../middleware/auth');
const user = require('../model/user');
const mongo = require('../../config/connection');

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

const db = fs.firestore();

const router = express.Router();

router.get('/apiCheck', (req, res) => {
  console.log('============= apiCheck =============');

  try {
    const userObj = {
      username: 'udara',
      firstName: 'Udara',
      lastName: 'Jayawardena',
      age: 25,
      password: 'HASH',
    }
    res.status(200).json(userObj);
  } catch (error) {
    return res.status(200).json({ message: 'Failed' });
  }
});

router.get('/getUserByUserName/:username', (req, res) => {
  console.log('============= getUserByUserName =============');

  const { username } = req.params
  console.log('username =>', username);

  try {
    const directMessage = '';
    // data.message = 'User Already Exists';
    // data.messsage = 'User Not Exists';

    // res.status(200).json(data);
  } catch (error) {
    console.log('=============== error ==============');
    console.error(error);

    return res.status(500).json({ message: 'Unexpected Error Occured' });
  }
});

router.post('/createUser', async (req, res) => {
  console.log('============= createUser =============');

  try {
    const reqBody = JSON.parse(JSON.stringify(req.body));

    console.log('============= reqBody =============');
    console.log(reqBody);

    const {
      username, firstName, lastName, age, password,
    } = req.body;

    const userId = uuidv4();
    console.log('userId => ', userId);

    const userToken = await jwt.sign({ userId }, 'java-game');

    const userObj = {
      username,
      firstName,
      lastName,
      age,
      password,
      userToken,
    }

    console.log('============ userObj ==================');
    console.log(userObj);

    const firestoreRef = fs.firestore().collection('users');
    const usersDb = db.collection('users');

    const queryRef = firestoreRef.where('username', '==', username);

    // console.log('=============== queryRef =====================');
    // console.log(queryRef);

    queryRef.get().then((querySnapshot) => {
      const matchedDocs = querySnapshot.size
      console.log('============ matchedDocs =============');
      console.log(matchedDocs);

      if (matchedDocs) {
        // User Already There //

        // querySnapshot.docs.forEach((doc) => {
        //   const userObj = doc.data();
        //   userObj.userId = doc.id;

        //   console.log('================= userObj ============');
        //   console.log(userObj);
        // })

        return res.status(200).json({ message: 'User_Already_Exists' });
      }

      // Create New User //
      usersDb.doc(userId).set(userObj);

      res.status(200).json({ message: 'User_Successfully_Created' });
    })
  } catch (error) {
    return res.status(500).json({ message: 'Unexpected_Error_Occured' });
  }
});

router.get('/getUserById', async (req, res) => {
  console.log('============= getUserById =============');

  try {
    axios.get('https://firestore.googleapis.com/v1/projects/java-game-ccb75/databases/(default)/documents/users/98a16f3f-1064-48df-88a6-7fc402dbf950')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    return res.status(500).json({ message: 'Unexpected_Error_Occured' });
  }
});

(async () => {

})();

module.exports = router;
