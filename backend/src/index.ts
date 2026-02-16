import "dotenv/config";
import express from "express";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "./generated/prisma/client.js";
import cors from 'cors'



const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })


const app = express(); 
app.use(cors());

app.use(express.json());

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


app.get('/todos', (req, res) => {
    prisma.todo.findMany().then((todos) => {
        res.json(todos)
    })
})


app.post('/todos', async (req, res) => {
    try{
        const {title, description } = req.body;
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
            },
        });
         res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});


app.put('/todos/:id', async (req, res)=>{
    try{
        const { id } = req.params;
        const {title, description } = req.body;
        
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' })
    }
    const todo = await prisma.todo.update({
        where: {
            id: Number(id),
        },
        data: {
            title,
            description,
        }
    })
    res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update todo' });
    }  
})

export { prisma }