const bcrypt = require('bcryptjs');

module.exports = {
    encryptPass: async (password) => {

        let encryptedPassword = await bcrypt.hash(password, 10);
        console.log({ encryptedPassword: encryptedPassword });
        return encryptedPassword;
    },

    decryptPass: async (userpass, encrypted) => {

        let decrypted = await bcrypt.compare(userpass, encrypted)
        console.log({ decrypted: decrypted });
        return decrypted;

    }

}

