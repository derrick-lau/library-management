
const db = require("../model/data");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const writeLogs = require("../Handlers/WriteLogs");

const SigninHandler = async(req, res) => {
  try{
    const { barcode, password } = req.body;
    if (!barcode || !password) {
      return res.status(400).json('please enter barcode and password');
    } else {
    const admin = await db.Login.findOne({where: { barcode: barcode}});
    const isValid = await bcrypt.compareSync(`${password}`, `${admin.dataValues.hash}`);
      if(isValid){
        return admin.dataValues
      } else {
        res.status(400).json('wrong credentials');
      }
    }
  } catch {return res.status(400).json('wrong credentials');}
}

const verify = (req, res, authorization) => {
  try {
    const verified = jwt.verify(authorization, "shhh");
    req.barcode = verified;
    res.json(verified) ;
  } catch {res.sendStatus(403);} 
}

const Token = (barcode) => {
  const jwtPayload = { barcode };
  return jwt.sign(jwtPayload, "shhh");
}

const signinAuthentication = async (req, res) => {
  try {
    const {authorization} = req.headers;
    if (authorization) { 
      verify(req, res, authorization);

    } else {
      const admin = await SigninHandler(req, res);
      const token = await Token(admin.barcode);
      await res.header('auth-token', token).send(token);
      writeLogs(`Admin ${req.body.barcode} Signed in`);
    }
  } catch {err => res.status(400).json(err)};
}


module.exports = signinAuthentication;
