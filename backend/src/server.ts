import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Comment } from './models/Comments.js'
// import { commentSchema } from './schemas/commentSchema.js' ska användas senare i controllers
import { connectDB } from './db.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
// app.use(express.static('public'))

app.post('/comments', async (req: Request, res: Response) => {
    try {
        console.log('req.body', req.body)
        const comment = await Comment.create(req.body)
        res.status(201).json(comment)
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ message: 'Could not create comment' })
    }
})

app.get('/comments', async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find()
        res.json(comments)
    } catch (error) {
        res.status(500).json({ message: 'Could not load comments' })
    }
})

app.get('/comments/:id', async (req: Request, res: Response) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) {
            return res.status(404).json({ message: 'Could not find comment' })
        }
        res.json(comment)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.put('/comments/:id', async (req: Request, res: Response) => {
    try {
        console.log('params', req.params.id)
        console.log('body', req.body)
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updatedComment) {
            return res.status(404).json({ message: 'Could not find comment' })
        }
        res.status(200).json({ message: 'Comment updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.delete('/comments/:id', async (req: Request, res: Response) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id)
        if (!deletedComment) {
            return res.status(404).json({ message: 'Could not find comment' })
        }
        res.status(200).json({ message: 'Comment deleted successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

const PORT = process.env.PORT || 3000
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
