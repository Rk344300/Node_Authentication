module.exports.homePage = async function (req, res) {
    return res.render("home_page", {
        title: "Home",
    })
}