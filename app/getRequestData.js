getRequestData = async (req) => {

    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (part) => {
                body += part.toString();
            });
            req.on("end", () => {
               // let data1 = (body)
                resolve(body);
            });

        } catch (error) {
            reject(error);
        }
    })

}
module.exports = getRequestData