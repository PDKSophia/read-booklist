const express = require('express');
const router = express.Router();
const code = require('../utils/code');
const userModal = require('../model/user');

/**
 * @获取token
 */
router.post('/user/login', async (req, res) => {
  await userModal
    .getUserToken(req.body.user_id)
    .then(response => {
      res.json({
        code: code.LOGIN_SUCCESS_CODE,
        msg: '登陆成功',
        data: {
          user_id: response[0].user_id,
          token: response[0].token
        }
      });
    })
    .catch(error => {
      throw new Error(error);
    });
});

/**
 * @通过token登陆
 */
router.get('/user/auth_token', async (req, res) => {
  await userModal
    .accountLoginToken(req.headers['x-auth-token'])
    .then(response => {
      res.json({
        code: code.AUTH_TOKEN_SUCCESS,
        msg: '获取用户信息成功',
        data: response[0]
      });
    })
    .catch(error => {
      throw new Error(error);
    });
});

module.exports = router;
