

$(async () => {
    let currJoke;
    let punchlineRevealed = false

    async function getRandomJoke() {
        return new Promise((resolve, reject) => {
            $.get("joke/random/", (data) => {
                resolve(data)
            })
        });
    }

    async function newJoke() {
        currJoke = await getRandomJoke()
        punchlineRevealed = false
        $(".joke-setup").text(currJoke.setup)
        $(".joke-punchline")
            .text("Click to reveal punchline...")
            .addClass("joke-hidden")

    }

    function revealPunchline() {
        $(".joke-punchline")
            .text(currJoke.punchline)
            .removeClass("joke-hidden")
        punchlineRevealed = true
    }

    $(document).on("click", () => {
        if (punchlineRevealed == false) revealPunchline()
        else newJoke()
    })

    newJoke()
}); 