const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {GetUserInfo, AddNewUsers, ModifyUser, ResetPassword, RemoveUser, ChangeUserDet, ChangeUserPassword} = require('../../controllers/users');

router.get('/info/:email', auth, GetUserInfo);
router.post('/add_users', auth, AddNewUsers);
router.put('/modify_user', auth, ModifyUser);
router.put('/upr', auth, ResetPassword);
router.put('/usr', auth, RemoveUser);
router.put('/usr_det', auth, ChangeUserDet);
router.put('/usr_pas', auth, ChangeUserPassword);

module.exports = router;
