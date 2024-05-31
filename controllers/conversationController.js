const User = require('../models/userModel');

exports.testRoute = async (req, res) => {
 try{
    // console.log(JSON.stringify(req.user))
    console.log(req.user._id)
    console.log(`ùser: ${req.user}`)
    // const currentUser = await User.findById(req.user._id);
    // console.log(currentUser)
    res.status(200).json({
        status: 'sucess',
        data: {
            user: req.user
        }
    })
 } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }

}