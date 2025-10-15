import jwt from "jsonwebtoken"

async function jwtTokenGenerator(payload,time=JWT_EXPIRY){
    return jwt.sign(payload,process.env.JWT_SECRET, {
        expiresIn: time
    })
}

export{
    jwtTokenGenerator,
}