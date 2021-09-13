let pool = require('pg').Pool
let Pool = new pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testtask',
    password: 'jojodio',
    port: 5432,
})


module.exports = {
    allEmployee: (req, res) => {
        
        Pool.query(`SELECT id as key, concat(sname, ' ', fname, ' ', tname) as name, address, department, position FROM employee`, (err, result) => {
            if (err) {
                throw err
            }
            console.log(result.rows);
            res.json(result.rows)
        })
    }, 
    addEmployee: (req, res) => {
        let body = req.body
        console.log(body);
        Pool.query(
            `INSERT INTO 
            employee (sname, fname, tname, address, department, position) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING department, address, position, id as key, concat(sname, ' ', fname, ' ', tname) as name`, [
            body.sname,
            body.fname,
            body.tname, 
            body.address,
            body.department,
            body.position
        ], (error, results) => {
            if (error) {
                throw error
            } else {
                console.log(results.rows)
                res.json(results.rows[0])
            }
        })
    },
    delEmployee: (req, res) => {
        let id = req.body.id
        console.log(id);
        Pool.query("DELETE FROM employee WHERE id = $1", [id], (error, result) => {
            if (error) {
                throw error
            } else {
                res.json({ id: id })
            }
        })
    },
    getEmployee: async (req, res) => {
        let id = req.body.id
        console.log(id);
        let row = {}
        let employees = {}
        Pool.query("SELECT * FROM employee WHERE id = $1", [id], (error, result) => {
            if (error) {
                throw error
            } else {
                row = result.rows[0]
            }
            Pool.query(
                "SELECT id as key, concat(sname, ' ', fname, ' ', tname) as name FROM employee WHERE id != $1", [id], (error, employee) => {
                    if (error) {
                        throw error
                    } else {
                        Pool.query("SELECT * FROM bosses WHERE e_id = $1", [id], (error, boss) => {
                            if (error) {
                                throw error
                            } else {
                                res.json({ row: row, employees: employee.rows, boss: boss.rows[0] })
                            }
                        })
                    }
                })
        })
    },
    saveEmployee: (req, res) => {
        let data = req.body.employee
        let boss = req.body.boss
        console.log(boss)
        Pool.query(`UPDATE employee SET 
        sname = $1, 
        fname = $2, 
        tname = $3, 
        department = $4, 
        position = $5, 
        address = $6
        WHERE id = $7 RETURNING department, address, position, id as key, concat(sname, ' ', fname, ' ', tname) as name`, [
            data.sname,
            data.fname,
            data.tname,
            data.department,
            data.position,
            data.address,
            data.id

        ],
            (error, result) => {
                if (error) {
                    throw error
                } else {
                    rows = result.rows[0]
                    Pool.query("DELETE FROM bosses WHERE e_id = $1", [data.id], (error, result) => {
                        if (error) {
                            throw error
                        } else {

                        }
                    })
                    if (boss != 0) {
                        Pool.query("INSERT INTO bosses(e_id, b_id) VALUES ($1, $2)", [data.id, boss || 0], (error, result) => {
                            if (error) {
                                throw error
                            }
                            else {

                            }
                        })
                    }
                    res.json(data)
                }
            })
    }
}