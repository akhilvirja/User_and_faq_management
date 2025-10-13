import express from "express"
import cookieParser from "cookie-parser"

export const app = express()

app.use(express.json())
app.use(cookieParser())

import UserRouter from "./routes/user.route.js"
import FAQCategoryRouter from "./routes/faqCategory.route.js"
import FAQRouter from "./routes/faq.route.js"
import adminRoute from "./routes/admin.route.js"

app.use("/user", UserRouter)
app.use("/category", FAQCategoryRouter)
app.use("/faq", FAQRouter)
app.use("/admin", adminRoute)