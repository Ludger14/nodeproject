const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

app.set('view engine', 'ejs')

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async(req, res) => {
  const allTasks = await tasks.findAll()
  //const allTasks = await sequelize.query('SELECT * FROM Tasks')
  res.json({ allTasks })
})

// Create task
app.post('/tasks', async(req, res) => {
  try {
    const body = req.body  
    const taskCreate = await tasks.create({
      description: body.description  
    })
    res.json(taskCreate)
  } catch (error) {
    console.log(error);
  }  
})

// Show task
app.get('/tasks/:id', async(req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId)
  res.send({ id: task.id, name: task.description })
})

// Update task
app.put('/tasks/:id', async(req, res) => {  
  try {
    const taskId = req.params.id
    const body = req.body
    const taskUpdate = await tasks.findByPk(taskId)
    taskUpdate.update({
      description: body.description,
      done: body.done
    })    
    res.send("Foi atualizado com sucesso.")
  } catch (error) {
    console.log(error);
  } 
})

// Delete task
app.delete('/tasks/:id', async(req, res) => {
  try {
    const taskId = req.params.id
    const taskRemove = await tasks.destroy({ where: {id: taskId}})
    res.send({ action: 'Deleting task', taskRemove: taskRemove })
  } catch (error) {
    console.log(error);
  } 
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
