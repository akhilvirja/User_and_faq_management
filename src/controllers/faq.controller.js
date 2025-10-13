import { z } from 'zod'
import { FAQCategory } from '../models/faq_category.model.js'
import { FAQ } from '../models/faq.model.js'

async function addFaq(req,res) {
    try {
        const {question, answer, visible, category_name} = req.body
    
        const faqSchema = z.object({
            question: z.string().min(1, 'Question is required'),
            answer: z.string().min(1, "Answer is required"),
            visible: z.boolean(),
            category_name: z.string().min(1, "Category Must with faq")
        })
    
        const parsedData = faqSchema.safeParse(req.body)
    
        if(!parsedData.success){
            return res.status(400).json({
                message: "not suitable data",
                error: z.treeifyError(parsedData.error),
                success: false,
            })
        }
    
        const existedCat = await FAQCategory.findOne({faq_cat_name: category_name})
    
        if(!existedCat){
            return res.status(400).json({
                message : "faq Category is not available",
                success : false
            })
        }
    
        const createdFaq = await FAQ.create({
            question,
            answer,
            visible,
            cat_id: existedCat._id,
            created_by: req.user._id,
        })
    
        return res.status(200).json({
            message : "Faq created successfully",
            data : createdFaq,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message : "Error in addFaq controller",
            success : false,
        })
    }
}

async function updateFaq(req,res) {
    try {
        const {id, question, answer, visible, category_name} = req.body
    
        const faqSchema = z.object({
            id: z.string(),
            question: z.string().min(1, 'Question is required'),
            answer: z.string().min(1, "Answer is required"),
            visible: z.boolean(),
            category_name: z.string().min(1, "Category Must with faq")
        })
    
        const parsedData = faqSchema.safeParse(req.body)
    
        if(!parsedData.success){
            return res.status(400).json({
                message: "not suitable data",
                error: z.treeifyError(parsedData.error),
                success: false,
            })
        }
        
        const existedFaq = await FAQ.findById(id)
    
        if(!existedFaq){
            return res.status(400).json({
                message : "faq id is not available",
                success : false
            })
        }

        if(existedFaq.created_by.toString() !== req.user._id.toString()){
            return res.status(400).json({
                message : "You can only update that faq which is created by you",
                success : false
            })
        }
    
        const existedCat = await FAQCategory.findOne({faq_cat_name: category_name})
        
        if(!existedCat){
            return res.status(400).json({
                message : "faq Category is not available",
                success : false
            })
        }
    
        const updatedFaq = await FAQ.findByIdAndUpdate(id, {question, answer, visible, cat_id: existedCat._id}, {new: true})
    
        return res.status(200).json({
            messagae : "Faq Updated successfully",
            data : updatedFaq,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in updateFaq controller",
            success: false
        })
    }
}

async function deleteFaq(req,res) {
    try {
        const {id} = req.body
    
        if (!id?.trim()){
            return res.status(400).json({
                message : "id should not be empty",
                success : false
            })
        }
    
        const existedFaq = await FAQ.findById(id)
    
        if(!existedFaq){
            return res.status(400).json({
                message : "Faq is not exist",
                success : false
            })
        }
    
        if(existedFaq.created_by !== req.user._id){
            return res.status(400).json({
                message : "You can only delete that faq which is created by you",
                success : false
            })
        }
    
        await FAQ.findByIdAndDelete(existedFaq._id)
    
        res.status(200).json({
            messgae: "faq deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in deleteFaq controller",
            success: false
        })
    }
}

async function faqById(req,res) {
    try {
        const id = req.params.id

        const existedFaq = await FAQ.findById(id).populate("cat_id")

        if(!existedFaq){
            return res.status(400).json({
                message : "faq is not available",
                success : false
            })
        }

        if(existedFaq.created_by.toString() !== req.user._id.toString()){
            return res.status(400).json({
                message : "You can only see that faq which is created by you",
                success : false
            })
        }

        res.status(200).json({
            message: "faq fetched successfully",
            data : existedFaq,
            success: true,
        })

    } catch (error) {
        res.status(500).json({
            message: "Error in faqById controller",
            success: false
        })
    }
}

async function faqByUser(req,res) {
    try {

        const faqs = await FAQ.find({created_by: req.user._id}).populate("cat_id")

        res.status(200).json({
            message: "faq fetched successfully",
            data : faqs,
            success: true,
        })

    } catch (error) {
        res.status(500).json({
            message: "Error in faqByUser controller",
            success: false
        })
    }
}

export {
    addFaq,
    updateFaq,
    deleteFaq,
    faqById,
    faqByUser,
}