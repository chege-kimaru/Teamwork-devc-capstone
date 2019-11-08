import EmployeeService from '../services/EmployeeService';
import Send from '../utils/Send';
import ReqValidator from '../utils/validator';

class EmployeeController {
  static async createEmployee(req, res) {
    try {
      const valid = await ReqValidator.validate(req, res, {
        email: 'required|email',
        firstName: 'required',
        lastName: 'required',
        gender: 'required|in:MALE,FEMALE,NA',
        jobRole: 'required',
        department: 'required',
        address: 'required',
      });
      if (!valid) return;
      const data = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        jobRole: req.body.jobRole,
        department: req.body.department,
        address: req.body.address,
      };
      const resData = await EmployeeService.createEmployee(data);
      Send.success(res, 200, resData);
    } catch (err) {
      Send.error(res, err);
    }
  }
}

export default EmployeeController;
