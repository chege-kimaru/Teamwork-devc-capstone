import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../utils/db';
import {ResourceNotFoundError, OperationNotAllowedError} from '../utils/errors';

const {pool} = db;

const SALT = 10;

class EmployeeService {
  static async initializeEmployees() {
    try {
      const EMPLOYEE = {
        email: 'employee1@teamwork.com',
        firstName: 'john',
        lastName: 'doe',
        gender: 'MALE',
        jobRole: 'CTO',
        department: 'IT',
        address: '300 Nairobi',
      };

      await this.createEmployee(EMPLOYEE);
      EMPLOYEE.email = 'employee2@teamwork.com';
      await this.createEmployee(EMPLOYEE);
    } catch (err) {
      throw err;
    }
  }


  static async createEmployee(employee) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userA = await client.query('SELECT * FROM users WHERE email = $1', [employee.email]);
      if (userA && userA.rows[0] && userA.rows[0].id) throw new OperationNotAllowedError('A user with this email account already exists.');

      const userQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
      const pass = await bcrypt.hash('1234', SALT);
      const userValues = [employee.email, pass];
      const userRes = await client.query(userQuery, userValues);

      const empQuery = `INSERT INTO employees(id, firstName, lastName, gender, jobRole, department, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const empValues = [userRes.rows[0].id, employee.firstName, employee.lastName,
        employee.gender, employee.jobRole, employee.department, employee.address];
      const empRes = await client.query(empQuery, empValues);

      await client.query('COMMIT');

      const result = empRes.rows[0];
      result.email = userRes.rows[0].email;
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async findEmployeeById(id) {
    try {
      const query = 'SELECT * FROM users, employees where users.id = employees.is AND employees.id=$1';
      const resp = await pool.query(query, [id]);
      const emp = resp.rows[0];
      if (!emp) throw new ResourceNotFoundError('This user does not exist');
      delete emp.password;
      return emp;
    } catch (err) {
      throw (err);
    }
  }
}

export default EmployeeService;
