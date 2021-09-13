import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Table } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { Popconfirm } from 'antd'



class TableEmployee extends React.Component {


    constructor(props) {
        super(props)
        // const [isModalVisible, setIsModalVisible] = useState(false)
        this.state = {
            isEdit: false,
            isVisibleAdd: false,
            allEmployees: [],
            optionsBosses: [],
            currentId: 0
        }
        this.columns = [
            {
                title: 'Наименование',
                dataIndex: 'name',
            },
            {
                title: 'Отдел',
                dataIndex: 'department',
            },
            {
                title: 'Должность',
                dataIndex: 'position',
            },
            {
                title: 'Действия',
                dataIndex: '',
                key: 'x',
                render: (text, record) => (
                    <>
                        <button onClick={() => this.handleGet(record.key)}>
                            Изменить
                        </button>
                        <Popconfirm title="Действительно удалить?" onConfirm={() => this.handleDelete(record.key)}>
                            <button
                                className="delete">
                                Удалить
                            </button>
                        </Popconfirm>
                    </>
                ),
            }]
    }

    async componentDidMount() {
        await fetch('http://localhost:5000/getall', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).then(res => {
            this.setState({ allEmployees: res })
        })
    }

    handleAdd = () => {
        this.setState({
            isVisibleAdd: true,
            isEdit: false
        })
        let inputs = document.querySelectorAll('input')
        inputs.forEach(el => {
            el.value = ''
        })
    }

    closeModal = () => {
        this.setState({
            isVisibleAdd: false
        })
    }

    okModal = () => {
        let BreakException = {}
        let data = {}
        let form = document.querySelectorAll('.add-modal-content .req')
        let verify = true
        try {
            form.forEach((input) => {
                if (input.value.length < 1) {
                    verify = false
                    alert("Пустое поле")
                    throw BreakException
                }
            })
        } catch (e) {
            if (e != BreakException) throw e
        }
        if (!verify) {
            return false
        }
        else {
            let formData = {
                sname: document.querySelector('.add-modal-content [name=sname]').value,
                fname: document.querySelector('.add-modal-content [name=fname]').value,
                tname: document.querySelector('.add-modal-content [name=tname]').value,
                address: document.querySelector('.add-modal-content [name=address]').value,
                department: document.querySelector('.add-modal-content [name=department]').value,
                position: document.querySelector('.add-modal-content [name=position]').value,
            }
            if (!this.state.isEdit) {
                fetch("http://localhost:5000/addemployee", {
                    body: JSON.stringify(formData),
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    return response.json()
                }).then((response) => {
                    // let data = response
                    console.log(response)
                    const { data } = this.state.allEmployees
                    // data.unshift(response)
                    this.setState({
                        allEmployees: [...this.state.allEmployees, response],
                        isVisibleAdd: false
                    })
                })
            }
            else {
                formData.id = this.state.currentId
                let boss = document.querySelector('select#employees').value || null
                fetch('http://localhost:5000/saveemployee', {
                    method: "POST",
                    body: JSON.stringify({ employee: formData, boss: boss }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(response => {
                        return response.json()
                    })
                    .then((response) => {
                        console.log(response);
                        response.key = this.state.currentId
                        response.name = `${response.sname} ${response.fname} ${response.tname}`

                        const data = [...this.state.allEmployees]
                        this.setState({
                            allEmployees: data.filter((item) => item.key !== this.state.currentId),
                        })
                        this.setState({
                            allEmployees: [...this.state.allEmployees, response],
                            isVisibleAdd: false
                        })
                    })
            }
        }
    }


    handleDelete = (key) => {
        console.log(key)
        fetch("http://localhost:5000/delemployee", {
            method: "POST",
            body: JSON.stringify({ id: key }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => { return response.json() })
            .then(response => {
                console.log(response)
                const data = [...this.state.allEmployees]
                this.setState({
                    allEmployees: data.filter((item) => item.key !== key),
                })
            })
    }

    handleGet = (key) => {
        this.state.currentId = key
        console.log(key)
        fetch("http://localhost:5000/getemployee", {
            method: "POST",
            body: JSON.stringify({ id: key }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => { return response.json() })
            .then(response => {
                this.setState({
                    isVisibleAdd: true,
                    isEdit: true,
                    optionsBosses: response.employees
                })
                document.querySelector('select#employees').value = response.hasOwnProperty('boss') ? response.boss.b_id : 0;
                let data = response.row
                // console.log("-----");
                // console.log(response)
                document.querySelector('.ant-modal-content [name=sname]').value = data.sname
                document.querySelector('.ant-modal-content [name=fname]').value = data.fname
                document.querySelector('.ant-modal-content [name=tname]').value = data.tname
                document.querySelector('.ant-modal-content [name=department]').value = data.department
                document.querySelector('.ant-modal-content [name=position]').value = data.position
                document.querySelector('.ant-modal-content [name=address]').value = data.address
            })
    }

    render() {
        let bosses = ""
        if (this.state.isEdit) {
            bosses =
                <><label><b>Начальник</b></label><select id="employees">
                    <option value='0'>Не указано</option>
                    {this.state.optionsBosses.map((el, i) => {
                        return <option value={el.key} >{el.name}</option>
                    })}</select>
                </>
        }

        return (
            <div className="main">
                <button onClick={this.handleAdd} id="add">Добавить</button>
                <Table columns={this.columns} dataSource={this.state.allEmployees} />
                <Modal title="Добавление сотрудника"
                    visible={this.state.isVisibleAdd}
                    onCancel={this.closeModal}
                    onOk={this.okModal}>
                    <div className="add-modal-content">
                        {/* <span className="close">×</span> */}
                        <h3>Добавление сотрудника</h3>
                        <hr />
                        <label><b>*Фамилия</b></label>
                        <input className="req" type="text" name="sname" />

                        <label><b>*Имя</b></label>
                        <input className="req" type="text" name="fname" />

                        <label><b>Отчество</b></label>
                        <input type="text" name="tname" />

                        <label><b>*Адрес</b></label>
                        <input className="req" type="text" name="address" />

                        <label><b>*Должность</b></label>
                        <input className="req" type="text" name="position" />

                        <label><b>*Отдел</b></label>
                        <input className="req" type="text" name="department" />

                        {bosses}
                    </div>
                </Modal>
            </div>
        )
    }
}

ReactDOM.render(<TableEmployee />, document.getElementById('root'))