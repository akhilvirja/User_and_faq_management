import jwt from "jsonwebtoken"

async function jwtTokenGenerator(payload){
    return jwt.sign(payload,process.env.JWT_SECRET)
}

export{
    jwtTokenGenerator,
}