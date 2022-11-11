const jwt = require('jsonwebtoken');

module.exports = {
    createToken: async (data) => {

        let token = await jwt.sign(
            {
                email: data.email,
                anyData: data.anyData
            },
            "verysecretkey", // powinno być w .env
            {
                expiresIn: "1d" // "1m", "1d", "24h"
            }
        );
        console.log({ token: token });
        return token
    },

    verifyToken: async (token) => {
        let decoded = undefined;
        try {
            decoded = await jwt.verify(token, "verysecretkey")
            return decoded

        }
        catch (ex) {
            console.log({ message: ex.message });
            return undefined
        }


    },


    // processToken: async () => {
    //     await createToken()
    //     await verifyToken("CI6IkpXVCJ9.eHAiOjE2NTIyMDcyNDZ9.UFylfhywQgHeT20p-Q2DSHMrHhprGkEiH9k4lWYrYEQ")
    // }

}



