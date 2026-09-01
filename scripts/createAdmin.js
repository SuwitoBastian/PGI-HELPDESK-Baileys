const readline = require("readline");

const {
    createUser
} = require("../services/auth/authService");


function ask(text) {

    return new Promise(resolve => {

        process.stdout.write(text);

        let input = "";

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");

        const onData = key => {

            if (key === "\r" || key === "\n") {

                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener(
                    "data",
                    onData
                );

                process.stdout.write("\n");

                resolve(input);

                return;
            }


            if (key === "\u0003") {

                process.stdout.write("\n");

                process.exit(1);

            }


            if (key === "\u007f") {

                input =
                    input.slice(
                        0,
                        -1
                    );

                return;

            }


            input += key;

        };

        process.stdin.on(
            "data",
            onData
        );

    });

}


function question(text) {

    return new Promise(resolve => {

        const rl =
            readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

        rl.question(
            text,
            answer => {

                rl.close();

                resolve(
                    answer.trim()
                );

            }
        );

    });

}


async function main() {

    try {

        console.log("");
        console.log(
            "================================="
        );
        console.log(
            " CREATE MASTER ACCOUNT"
        );
        console.log(
            "================================="
        );
        console.log("");


        const username =
            await question(
                "Username : "
            );


        const name =
            await question(
                "Nama     : "
            );


        process.stdout.write(
            "Password : "
        );


        const password =
            await ask("");


        if (
            !username ||
            !name ||
            !password
        ) {

            throw new Error(
                "Username, nama, dan password wajib diisi."
            );

        }


        if (password.length < 8) {

            throw new Error(
                "Password minimal 8 karakter."
            );

        }


        const user =
            createUser({
                username,
                password,
                name
            });


        console.log("");

        console.log(
            "✅ Master account berhasil dibuat."
        );

        console.log(
            `Username : ${user.username}`
        );

        console.log(
            `Nama     : ${user.name}`
        );


    } catch (err) {

        console.error("");

        console.error(
            "❌ Gagal membuat account:"
        );

        console.error(
            err.message
        );

        process.exitCode = 1;

    }

}


main();