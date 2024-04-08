import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { UserProfile } from '../models/userprofile.model.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
const createUser = asyncHandler(async (req, res) => {
  try {
    if (req.user.valid_email === true) {
      const userID = req.user._id;
      const { firstname, lastname, DOB, gender, show_me, looking_for, Passions, Sexuality } =
        req.body;
      const user = await User.findOne(req.user._id);
      const existedUser = await UserProfile.findOne({
        $or: [{ email: user.email }],
      });
      if (existedUser) {
        throw new ApiError(409, 'Employee with email or phone number already exists');
      }
      let profileImageUrls = [];
      if (req.files) {
        const files = req.files;
        for (const file of files) {
          const coverImageLocalPath = file.path;
          const profileimage = await uploadOnCloudinary(coverImageLocalPath);
          profileImageUrls.push(profileimage.url);
        }
      }
      const userprofile = await UserProfile.create({
        userID,
        firstname,
        lastname,
        DOB,
        profileImage: profileImageUrls,
        email: user.email,
        gender,
        show_me,
        looking_for,
        Passions,
        Sexuality,
      });
      const createdUser = await UserProfile.findById(userprofile._id).select();
      if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the Employee');
      }
      return res
        .status(201)
        .json(new ApiResponse(200, createdUser, 'Employee registered Successfully'));
    } else {
      throw new ApiError(401, 'Please verify your Email by OTP');
    }
  } catch (error) {
    throw new ApiError(400, error);
  }
});
const updateUserDetails = asyncHandler(async (req, res) => {
  const { firstname, lastname, DOB, gender, show_me, looking_for, Passions, Sexuality } = req.body;
  //    console.log(req.body);
  const userID = await UserProfile.find({ userID: req.user._id });
  const user = await UserProfile.findByIdAndUpdate(
    userID[0]._id,
    {
      $set: {
        firstname: firstname,
        lastname: lastname,
        DOB: DOB,
        gender: gender,
        show_me: show_me,
        looking_for: looking_for,
        Passions: Passions,
        Sexuality: Sexuality,
      },
    },
    { new: true }
  ).select();
  console.log(user);
  return res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully'));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.user.valid_email === true) {
    const userID = await UserProfile.find({ userID: req.user._id });
    const currentUser = await UserProfile.findById(userID[0]._id).select(
      'firstname lastname email profileImage DOB gender show_me looking_for Passions Sexuality'
    );
    if (!currentUser) {
      throw new ApiError(400, 'User not Found');
    }
    return res.status(200).json(new ApiResponse(200, currentUser, 'Employee fetched successfully'));
  } else {
    throw new ApiError(401, 'Please verify your Email by OTP');
  }
});
export { createUser, updateUserDetails, getCurrentUser };
