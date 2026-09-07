import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const userData = req.body;
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  userData.password = hashedPass;
  const user = new User(userData);
  await user.save();
  res.send("SuccessFully Done");
};

export const login = async (req, res) => {
  const userData = req.body;
  const { email, password } = userData;
  const findEmail = await User.findOne({ email }); // .find() gives array so we ued here .findOne
  if (!findEmail) {
    return res.status(400).send({ message: "Invalid Credetnials" });
  }
  const newpassword = await bcrypt.compare(password, findEmail.password);
  if (!newpassword) {
    return res.status(400).send({ message: "Invalid Credetnials" });
  }
  const token = jwt.sign({ id: findEmail._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  res.send(token);

  //   return res.status(200).send({ message: `Welcome ${findEmail.name}` });
};
