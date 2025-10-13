import { FAQCategory } from "../models/faq_category.model.js"

async function viewFAQCategory(req,res) {
    try {
        const cats = await FAQCategory.find({created_by : req.user._id})

        return res.status(200).json({
            message: "All category created by you",
            data : cats,
            success : true
        })
    } catch (error) {
        return res.status(500).send({
            message : "Error in viewFAQCategory controller",
            success : false
        })
    }
}

async function addFAQCategory(req,res){
    try {
        const { name } = req.body
    
        if ( name.trim() === ""){
            return res.status(400).json({
                message : "name field is required",
                success : false
            })
        }

        const existedCat = await FAQCategory.findOne({faq_cat_name:name})

        if(existedCat){
            return res.status(400).json({
                message : "category is already exist",
                success : false
            })
        }
    
        const createdCategory = await FAQCategory.create({
            faq_cat_name: name,
            created_by: req.user._id,
        })

        return res.status(200).json({
            message: "category created successfully",
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message : "Error in addFAQCategory controller",
            success : false
        })
    }

}

async function updateFAQCategory(req, res) {
    try {
        const {existedName, newName} = req.body
    
        if( existedName.trim() === "" && newName === ""){
            return res.status(400).json({
                message : "All fields is required",
                success : false
            })
        }
    
        const existedCat = await FAQCategory.findOne({faq_cat_name:existedName})
    
        if(!existedCat){
            return res.status(400).json({
                message : "Category is not exist which you try to update",
                success : false
            })
        }

        if(existedCat._id === req.user._id){
            return res.status(400).json({
                message : "you can only update that category which is created by you",
                success : false
            })
        }
    
        const updatedCat = await FAQCategory.findOneAndUpdate(existedCat._id, {faq_cat_name: newName},{new: true})
    
        return res.status(200).json({
            message: "category updated successfully",
            success: true,
        })
    } catch (error) {
        return res.status(500).send({
            message : "Error in updateFAQCategory controller",
            success : false
        })
    }
}

async function deleteFAQCategory(req,res) {
    try {
        const { name } = req.body
    
        if( name.trim() === ""){
            res.status(400).json({
                message: "name field is required",
                success: true
            })
        }
    
        const existedCat = await FAQCategory.findOne({faq_cat_name: name})
    
        if(!existedCat){
            res.status(400).json({
                message: "category does not exist",
                success: true,
            })
        }
    
        if(existedCat.created_by === req.user._id){
            return res.status(400).json({
                message : "you can only Delete that category which is created by you",
                success : false
            })
        }
    
        await FAQCategory.findByIdAndDelete(existedCat._id)
    
        return res.status(200).json({
            message: "category deleted successfully",
            success: true,
        })
    } catch (error) {
        return res.status(500).send({
            message : "Error in deleteFAQCategory controller",
            success : false
        })
    }
}

export { addFAQCategory, updateFAQCategory, deleteFAQCategory, viewFAQCategory }