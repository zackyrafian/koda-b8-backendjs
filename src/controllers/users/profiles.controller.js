import * as userModel from "../../models/users/profiles.model.js"
import sq from '../../models/index.js'

export async function getUserProfile(req, res) { 
  const user_id = parseInt(req.user.userId)
  // const user = await userModel.findProfile(user_id)
  try { 
    const user = await sq.User.findByPk(user_id, {
      attributes: { 
        exclude: ["password"]
      }, 
      include: [{ 
        model: sq.UserProfile, 
        as: 'profile'
      }]
    })

    const response = {
      ...user.toJSON(),
      fullname: user.profile?.fullname || null, 
      phone_number: user.profile?.phone_number || null,
      gender: user.profile?.gender || null,
      date_of_birth: user.profile?.date_of_birth || null,
      image_profile: user.profile?.image_profile || null,
      profile: undefined
    }
    
    // if (!user) {
    //   res.status(404).json({
    //     "success": false,
    //     "message": `404 -> ${user_id}`
    //   })
    //   return;
    // }
    res.status(200).json({ 
      status: true, 
      message: "Successfully get users profile",
      result: response
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}

export async function profileImage(req, res) { 
  const user_id = parseInt(req.user.userId)
  const { file } = req 
  const { body } = req; 
  try { 
    // await userModel.updateProfile(user_id, {
    //   fullname: body.full_name,
    //   email: body.email,
    //   phone_number: body.phone_number,
    //   date_of_birth: body.date_of_birth,
    //   gender: body.gender,
    //   picture_path: file?.path,
    // })

      await sq.User.update(
        { email: body.email },
        { where: { id: user_id } }
      )
  
      await sq.UserProfile.update({
        fullname: body.full_name,
        phone_number: body.phone_number,
        date_of_birth: body.date_of_birth,
        gender: body.gender,
        image_profile: file?.path
      }, {
        where: { user_id }
      })

    res.status(200).json({ 
      "success": true, 
      "message": "Success added profile user profile.",
      "data": { 
        "filename": file?.path
      }
    })
  } catch (error) { 
    res.status(500).json({ 
      "success": false, 
      "message": error.message
    })
  }
}