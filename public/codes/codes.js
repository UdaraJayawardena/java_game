/* eslint-disable max-len */

// router.get('/getAll', isAuthenticated, (req, res) => {
//   console.log('============= Get All Users =============');
//   try {
//     user.find({}, (err, userResult) =>
//       // console.log()
//       res.status(200).json({ message: 'Success', data: userResult }));
//   } catch (error) {
//     return res.status(200).json({ message: 'Failed' });
//   }
// });

// router.get('/getChatRoomsById/:userId', isAuthenticated, async (req, res, next) => {
//   console.log('============= getUserChatRooms =============');

//   const chatRoomIdArr = [];
//   const finalChatRoomsArr = [];

//   const { userId } = req.params;

//   try {
//     console.log('userId =>', userId);

//     if (!userId) {
//       return res
//         .status(400)
//         .json({ messsage: 'Required Field Missing', status: 400 });
//     }

//     const chatRoomDetailsRecords = await userChatRoomDetails.find({
//       userId,
//       createdBy: 'dashboard',
//     });

//     console.log('============== chatRoomDetailsRecords ==============');
//     console.log(chatRoomDetailsRecords);

//     async.eachOf(
//       chatRoomDetailsRecords,
//       (item, index, cbChatRoom) => {
//         chatRoomIdArr.push(item.roomId);
//         cbChatRoom();
//       },
//       (err1) => {
//         console.log('========== err1 ============');
//         console.log(err1);
//         if (err1) {
//           return res.status(500).json({ message: 'Unexpected Error Occured' });
//         }
//       },
//     );

//     console.log('================= chatRoomIdArr =================');
//     console.log(chatRoomIdArr);

//     const chatRoomRecords = await chatRoom
//       .find()
//       .where('roomId')
//       .in(chatRoomIdArr);

//     console.log('=========== chatRoomRecords ===============');
//     console.log(chatRoomRecords);

//     async.eachOf(
//       chatRoomRecords,
//       (roomItem, roomIndex, cbChatRoom) => {
//         const roomObj = roomItem;
//         const newRoomObj = roomObj.toObject();

//         // console.log('================ newRoomObj Before ================');
//         console.log(newRoomObj);

//         delete newRoomObj.messages;

//         // console.log('================ newRoomObj After ================');
//         console.log(newRoomObj);

//         finalChatRoomsArr.push(newRoomObj);
//         cbChatRoom();
//       },
//       (error1) => {
//         console.log(error1);
//         if (error1) {
//           res
//             .status(500)
//             .json({ message: 'Unexpected Error Occured', status: 500 });
//         }
//       },
//     );

//     return res
//       .status(200)
//       .json({ message: 'Success', status: 200, data: finalChatRoomsArr });
//   } catch (error) {
//     console.log('============ error ===========');
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: 'Unexpected Error Occured', status: 500 });
//   }
// });

// router.post('/createChatRoom', isAuthenticated, async (req, res) => {
//   console.log('============= createChatRoom =============');

//   const chatUsersArr = [];
//   const userChatRoomDetailsArr = [];

//   const {
//     users, roomName, roomId, mobileAppUserId, userId, createdBy,
//   } = req.body;

//   try {
//     console.log(
//       'users =>', users,
//       '\nroomName =>', roomName,
//       '\nroomId =>', roomId,
//       '\nmobileAppUserId =>', mobileAppUserId,
//       '\nuserId =>', userId,
//       '\ncreatedBy =>', createdBy,
//     );

//     if (users.length !== 2 || !roomName || !roomId || !mobileAppUserId || !userId || !createdBy) {
//       return res.status(400).json({ messsage: 'Required Fields or Values Missing', status: 400 });
//     }

//     const fetchChatSessionObj = {
//       mobileAppUserId, userId,
//     }

//     const createChatSessionObj = {
//       mobileAppUserId, userId, roomId,
//     }

//     const chatSessionResult = await chatSession.find(fetchChatSessionObj);

//     console.log(' ================= chatSessionResult =================');
//     console.log(chatSessionResult);

//     if (chatSessionResult.length === 0) {
//       console.log(' ================= New Chat Session =================');

//       async.eachOf(
//         users,
//         (item, index, cbChat) => {
//           chatUsersArr.push(item);

//           userChatRoomDetailsArr.push({
//             roomId,
//             roomName,
//             userId: item._id,
//             createdBy,
//           });

//           cbChat();
//         },
//         (err1) => {
//           console.log('========== err1 ============');
//           console.log(err1);
//           if (err1) {
//             return res.status(500).json({ message: 'Unexpected Error Occured' });
//           }
//         },
//       );

//       const chatRoomObj = {
//         roomId,
//         roomName,
//         users: chatUsersArr,
//         createdBy,
//       };

//       // ToDo : Create Chat Room in Dashboard

//       const createDashboardChatRoom = new Promise(async (resolve, reject) => {
//         axios.post(`${config.baseUrl}/programs/createChatRoom`, {
//           mobileAppUserId,
//           userId,
//           roomId,
//           roomName,
//           programId: 0,
//         }).then((creatChatRoomResult) => {
//           console.log('============== creatChatRoomResult =============');
//           console.table(creatChatRoomResult.data);
//           resolve('success');
//         }).catch((error) => {
//           console.log('================= Error in Chat Room Create ================');
//           console.error(error);
//           resolve('failed');
//         })
//       });

//       /**  Create Chat Room */

//       const createChatRoom = new Promise(async (resolve, reject) => {
//         console.log('========== chatRoomObj ==========');
//         console.log(chatRoomObj);

//         chatRoom.create(chatRoomObj, (err, result) => {
//           console.log('============= result =============');
//           console.log(result);

//           if (result) {
//             resolve('success');
//           } else {
//             resolve('failed');
//           }
//         });
//       });

//       /**  Create Chat Room Details */

//       const createChatRoomDetails = new Promise(async (resolve, reject) => {
//         userChatRoomDetails.collection.insert(
//           userChatRoomDetailsArr,
//           (err, result) => {
//             if (err) {
//               resolve('failed');
//             } else {
//               resolve('success');
//             }
//           },
//         );
//       });

//       /**  Create Chat Session */

//       const createChatSession = new Promise(async (resolve, reject) => {
//         console.log('========== createChatSessionObj ==========');
//         console.log(createChatSessionObj);

//         chatSession.create(createChatSessionObj, (err, result) => {
//           console.log('============= result =============');
//           console.log(result);

//           if (result) {
//             resolve('success');
//           } else {
//             resolve('failed');
//           }
//         });
//       });

//       const updateResult = await Promise.all([
//         createChatRoom,
//         createChatRoomDetails,
//         createChatSession,
//         createDashboardChatRoom,
//       ]);

//       console.log('=================== updateResult ==================');
//       console.log(updateResult);

//       const checkResults = updateResult.includes('failed');

//       if (checkResults) {
//         return res.status(400).json({ message: ' Failed', status: 400 });
//       }

//       return res
//         .status(200)
//         .json({
//           message: ' Success', status: 200, remarks: 'New Chat Session Created', data: [chatRoomObj],
//         });
//     } else if (chatSessionResult.length !== 0) {
//       console.log(' ================= Chat Session Already Exist =================');

//       const { roomId } = chatSessionResult[0];
//       console.log('Previous Chat Room Id =>', roomId);

//       const chatRoomRecord = await chatRoom.find({
//         roomId,
//       });

//       console.log('============== chatRoomRecord ==============');
//       console.log(chatRoomRecord);

//       return res
//         .status(200)
//         .json({
//           message: 'Success', status: 200, remarks: 'Details of Previous Chat Session', data: chatRoomRecord,
//         });
//     }
//   } catch (error) {
//     console.log('============ error ===========');
//     console.error(error);
//     res.status(500).json({ message: 'Unexpected Error Occured', status: 500 });
//   }
// });

// router.post('/chatSessionCheck', isAuthenticated, async (req, res) => {
//   console.log('============= chatSessionCheck =============');

//   const {
//     mobileAppUserId, userId,
//   } = req.body;

//   try {
//     if (!mobileAppUserId || !userId) {
//       return res.status(400).json({ messsage: 'Required Fields or Values Missing', status: 400 });
//     }

//     const chatSessionObj = {
//       mobileAppUserId, userId,
//     }

//     const chatSessionResult = await chatSession.find(chatSessionObj);

//     console.log(' ================= chatSessionResult =================');
//     console.log(chatSessionResult);

//     if (chatSessionResult.length === 0) {
//       return res.status(200).json({ message: 'Chat Session Doesnt Exist', status: 200 });
//     } else {
//       return res.status(200).json({ message: 'Chat Session Already Exist', status: 200 });
//     }
//   } catch (error) {
//     console.log('============ error ===========');
//     console.error(error);
//     return res.status(500).json({ message: 'Unexpected Error Occured', status: 500 });
//   }
// });
