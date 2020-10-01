const Staff = require('../models/staff');

exports.index = async (req, res, next) => {
    const staff = await Staff.find().sort({ _id: -1 });

    res.status(200).json ({
        data: staff
    });
  }

  exports.show = async (req, res, next) => {
    try {
      const { id } = req.params;
      const staff = await Staff.findById(id);
  
      if (!staff) {
        throw new Error('not data')
      }

      res.status(200).json({
        data: staff
      });

    } catch (error) {
      res.status(400).json({
        error: {
          message: 'error data' + error.message
        }
      });
    }
  }

  exports.create = async (req, res, next) => {
    const { name, salary } = req.body;

    let staff = new Staff({
        name: name,
        salary: salary
    });
    await staff.save();
    
    res.status(201).json ({
        message: 'sucsess'
    });
  }

  exports.edit = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, salary } = req.body;

      // 1.
      // const staff = await Staff.findById(id);
      // staff.name = name;
      // staff.salary = salary;
      // await staff.save();

      // 2.
      // const staff = await Staff.findByIdAndUpdate(id, {
      //   name: name,
      //   salary: salary
      // });

      //3.
      const staff = await Staff.updateOne({ _id: id}, {
        name: name,
        salary: salary
      });
      console.log(staff);

      if (staff.nModified === 0) {
        throw new Error('can not update')
      } else {
        res.status(200).json({
          message: 'update data success'
        })
      }
    
  } catch (error) {
      res.status(400).json({
        error: {
          message: 'error data' + error.message
        }
      });
    }
  }

  exports.del = async (req, res, next) => {
    try {
      const { id } = req.params;
      const staff = await Staff.deleteOne({ _id: id });
      
      if (staff.deletedCount === 0 ) {
        throw new Error('can not id');
      } else {
        res.status(200).json({
          message: 'delete data success'
      });
    }
  } catch (error) {
      res.status(400).json({
        error: {
          message: 'error data' + error.message
        }
      });
    }
  }