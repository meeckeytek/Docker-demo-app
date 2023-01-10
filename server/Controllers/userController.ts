import bcrypt from "bcryptjs";
import User from "../models/user.model";
import msg from "../middlewares/messages";
import { getToken } from "../middlewares/util";
import cloudinary from "../middlewares/cloudinary";

//Get all user
export const allUsers = async (req: any, res: any) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "-1";
  const { search } = req.body || "";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const searchQuery = {
    $or: [
      { userId: new RegExp(String(search), "i") },
      { firstname: new RegExp(String(search), "i") },
      { lastname: new RegExp(String(search), "i") },
      { username: new RegExp(String(search), "i") },
    ],
  };

  const retrievedCounts = await User.countDocuments(searchQuery);
  User.countDocuments(searchQuery).then((usersCount) => {
    User.find(searchQuery)
      .sort(sortQuery)
      .limit(limit)
      .skip(page * limit - limit)
      .then((users) => {
        return res.json({
          users,
          pagination: {
            hasPrevious: page > 1,
            prevPage: page - 1,
            hasNext: page < Math.ceil(usersCount / limit),
            next: page + 1,
            currentPage: Number(page),
            total: retrievedCounts,
            limit: limit,
            lastPage: Math.ceil(usersCount / limit),
          },
        });
      })
      .catch((err) => console.log(err));
  });
};

//Get single user details
export const getUserDetails = async (req: any, res: any) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!users) {
    return res.status(404).send({ message: msg.notFound });
  }
  res.json(users);
};

//Register new user
export const newUser = async (req: any, res: any) => {
  const { firstname, lastname, password, email, isAdmin } = req.body;

  let existed: any;

  try {
    existed = await User.findOne({ email });
  } catch (error) {
    return res.status(500).send({ message: msg.serverError });
  }

  if (existed) {
    return res.status(409).json({ message: msg.alreadyExist });
  }

  let hashedPassword: any, salt: string | number;
  try {
    salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  let userImage: any;

  try {
    userImage = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "Youtube",
    });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  const user = new User({
    image: userImage.secure_url,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    cloudinary_id: userImage.public_id,
    isAdmin: isAdmin ? isAdmin : false
  });
  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  res.status(201).json({ message: msg.newInputSuccess });
};

//Login user
export const auth = async (req: any, res: any) => {
  const { email, password } = req.body;

  let user: any;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!user) {
   return res.status(404).json({ message: msg.notFound });
  }

  let isValidPassword;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
   return res.status(404).json({ message: msg.notFound });
  }

  if (!isValidPassword) {
   return res.status(422).json({ message: msg.inputError });
  }
  res.status(200).json(getToken(user));
};

//edit user details
export const editUserDetails = async (req: any, res: any) => {
  const { firstname, lastname, password } = req.body;

  let existedUser: any;

  try {
    existedUser = await User.findById(req.user.userId);
  } catch (error) {
    return res.status(500).send({ message: msg.serverError });
  }

  if (!existedUser) {
    return res.status(404).json({ message: msg.notFound });
  }

  let hashedPassword: any, salt: string | number;
  try {
    salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  existedUser.firstname = firstname || existedUser.firstname;
  existedUser.lastname = lastname || existedUser.lastname;
  existedUser.password = hashedPassword || existedUser.password;

  try {
    await existedUser.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  res.status(200).json({ message: msg.success });
};


//edit user image
export const editUserImage = async (req: any, res: any) => {
  let existedUser: any;

  try {
    existedUser = await User.findById(req.user.userId);
  } catch (error) {
    return res.status(500).send({ message: msg.serverError });
  }

  if (!existedUser) {
    return res.status(409).json({ message: msg.notFound });
  }

  let userImage:any;

  try {
    await cloudinary.uploader.destroy(existedUser.cloudinary_id);
    userImage = await cloudinary.uploader.upload(req.file.path,{
      upload_preset: "Youtube"
    })
  } catch (error) {
    return res.status(500).send({ message: msg.serverError });
  }

  existedUser.image = userImage.secure_url;
  existedUser.cloudinary_id = userImage.public_id;

  try {
    await existedUser.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  res.status(200).json({ message: msg.success });
};

export const resetPassword = async (req: any, res: any) => {
  res.status(200).json({ message: "Process under review" });
};

export const changePassword = async (req: any, res: any) => {
  res.status(200).json({ message: "Process under review" });
};
