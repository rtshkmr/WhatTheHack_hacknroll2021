import { Router } from "express";
//import crypto from "crypto";

import { User } from "../models/User";

const router = Router();

router.route("/").get((req, res) => {
  User.find()
    .then((User: any) => res.json(User))
    .catch((err: any) => res.status(400).json("Error: " + err));
});

router.route("/add").post(async (req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  try {
    const newUser = await User.createUser(username, password);
    res.json(newUser.toJSON());
  } catch (err) {
    res.status(400).json("" + err);
  }
});

router.route("/:id").delete(async (req, res) => {
  const username: string = req.body.username;

  User.findByIdAndDelete(req.params.id)
    .then(() => res.json(`User, ${username} has been deleted successfully.`))
    .catch((err: String) => res.json(`Error: ` + err));
});

router.route("/update/:id").post((req, res) => {
  User.findById(req.params.id).then((user: any) => {
    user.username = req.body.username;
    user.password = req.body.password;

    user
      .save()
      .then(() => res.json("update successful"))
      .catch((err: any) => res.json("error: " + err));
  });
});

router.route("/login").post((req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ message: "Please enter both username and password" });
  } else {
    User.verifyUser(username, password)
      .then((user) => {
        res.send(user);
      })
      .catch((err: string) => res.status(400).send("" + err));
  }
});

export const usersRouter = router;
