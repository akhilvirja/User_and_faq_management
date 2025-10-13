import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        visible: {
            type: Boolean,
            default: true,
            required: true,
        },
        cat_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FAQCategory",
            required: true,
        },
        created_by:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export const FAQ = mongoose.model("FAQ", FAQSchema)