const { cpSync } = require("fs")
const nodemailer = require("nodemailer")
const model = require("./model");
const passwordController = require("./bcrypt")
const jsonwebtoken = require("./jsonwebtoken")
const { users } = require("./model")
const config = {
    service: 'Yahoo',
    auth: {
        user: "zuzannaxyz",
        pass: "ydoqiwhfnqaqfslc"
    }
}
const transporter = nodemailer.createTransport(config)

module.exports = {

    sendMail: async (data) => {
        return new Promise((resolve, reject) => {
            try {
                transporter.sendMail({
                    from: data.from,
                    to: data.to,
                    subject: data.subject,
                    text: data.text,
                    html: data.html
                });
                resolve("Wyslano Maila")
            } catch (error) {
            }
        })
    },

    sendMailToConfirm: async (data) => {
        return new Promise((resolve, reject) => {
            let link = "http://localhost:3000/api/user/confirm/" + data.token
            try {
                transporter.sendMail({
                    from: "zuzannaxyz@yahoo.com",
                    to: data.email, // zmienic na data.email
                    subject: "Confirm your register!",
                    text: "klikij w poniższy link " + link + +" w celu potwierdzenia konta Uwaga: link jest ważny przez godzinę ",
                    html: "<b>klikij w poniższy link" + `<a href=${link}>` + link + "</a> w celu potwierdzenia konta Uwaga: link jest ważny przez godzinę </b>"
                });
                resolve("Wyslano Maila")
            } catch (error) {
            }
        })
    },



    register: async (data) => {

        if (data.name != null || data.lastName != null || data.email != null || data.password != null) {
            let pass = await passwordController.encryptPass(data.password)

            if (!passwordController.decryptPass(data.password, pass)) {
                console.log("Hasło zle zaszyfrowane")
                pass = await passwordController.encryptPass(data.password)
            } else {
                console.log("Hasło zaszyfrowane porpawnie")
            }
            data.token = await jsonwebtoken.createToken(data)

            data.password = pass
            return ({ isReg: true, data: data })
        }


    },


    checkExist: async (email) => {
        users.forEach(user => {
            if (user.email == email) {
                console.log("Exist")
                return true

            }
        });
        return false
    },


    addUser: async (data) => {
        model.users.push({
            id: model.users.length + 1,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            confirmed: false, //ZMIEN
            password: data.password,

        })


    },

    confirmMail: (email) => {
        console.log(email)
        console.log(model.users.find(user => user.email == email))
        model.users.forEach(user => {
            console.log(user)
            if (user.email == email) {

                user.confirmed = true
            }
        })

        return new Promise((resolve, reject) => {
            try {
                transporter.sendMail({
                    from: "zuzannaxyz@yahoo.com",
                    to: email, // zmienic na data.email
                    subject: "Confirm ",
                    text: "text",
                    html: "<b>Konto zostało potweirdzone</b>"
                });
                resolve("Wyslano Maila")
            } catch (error) {
            }
        })

    },

    login: async (data) => {
        let user = model.users.find(user => user.email == data.email)

        if (data.email != null || data.password != null) {
            if (user) {
                let acceptPassword = await passwordController.decryptPass(data.password, user.password)
                if (acceptPassword) {
                    if (user.confirmed) {
                        data = { email: user.email, anyData: "cosik" }
                        token = await jsonwebtoken.createToken(data)
                        return { authorization: "Bearer " + token }
                    } else {
                        return "User is inactive"

                    }

                } else {
                    return "Invalid password"
                }
            } else {
                return "User with this email not exist"
            }
        } else {
            return "User must have name,lastName,email and password"

        }
    },

    getUserFromToken: async (token) => {
        let newToken = await jsonwebtoken.verifyToken(token)
        if (newToken) {
            let user = model.users.find(user => user.email == newToken.email)
            if (user) {
                return {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email
                }
            } else {
                return false
            }

        } else {
            return false
        }
    },

    changeProfileData: async (token, data) => {
        let newToken = await jsonwebtoken.verifyToken(token)
        if (newToken) {
            let user = model.users.find(user => user.email == newToken.email)

            if (user) {
                console.log(data.email != null)

                if (data.name) {
                    model.users.find(user => user.email == newToken.email).name = data.name
                }

                if (data.lastName) {
                    model.users.find(user => user.email == newToken.email).lastName = data.lastName
                }


                if (data.email != null) {
                    model.users.find(user => user.email == newToken.email).email = data.email
                }

                //let user1 = model.users.find(user => user.email == newToken.email)
                return model.users.find(user => user.email == data.email)
            }

        } else {
            return "Cos poszlo nie tak ;/"
        }
    }

}

