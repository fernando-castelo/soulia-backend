exports.testRoute = (req, res) => {
 try{
    res.status(200).json({
        status: 'sucess',
        data: {
            message: 'test router'
        }
    })
 } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }

}