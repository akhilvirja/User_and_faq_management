import mongoose from "mongoose";

const faqCategorySchema = new mongoose.Schema(
    {
        faq_cat_name:{
            type: String,
            required: true,
            unique: true,
        },
        created_by:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const FAQCategory = mongoose.model("FAQCategory", faqCategorySchema)