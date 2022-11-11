getfetch = async () => {
    console.log("cos")
    const options = {
        method: "POST",
        body: { nick: "zuzia" },
    };

    fetch("/add", options)
        .then(function (response) { return response.json() })
        .then(function (data) { console.log(data) })
        .catch(function (error) { console.log(error) });

}
module.exports = getfetch