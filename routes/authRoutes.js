const express = require("express");

const router = express.Router();

const {
    findByUsername,
    verifyPassword
} = require("../services/auth/authService");

const {
    requireGuest
} = require("../middleware/authMiddleware");


// ==========================================================
// LOGIN PAGE
// ==========================================================

router.get(
    "/login",
    requireGuest,
    (req, res) => {

        res.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, private"
        );

        return res.send(`
<!DOCTYPE html>

<html lang="id">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="robots"
        content="noindex,nofollow"
    >

    <title>
        IT Support - Pusat Gadai Indonesia
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }


        body {

            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Arial,
                sans-serif;

            background:
                linear-gradient(
                    135deg,
                    #f5f9ff 0%,
                    #edf4ff 52%,
                    #f9fbff 100%
                );

            color: #17233c;

            min-height: 100vh;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            position: relative;

            overflow: hidden;

        }


        /* ==================================================
           BACKGROUND
        ================================================== */

        body::before {

            content: "";

            position: fixed;

            width: 360px;
            height: 360px;

            border-radius: 50%;

            background:
                rgba(37, 99, 235, 0.055);

            top: -210px;
            right: -150px;

            pointer-events: none;

        }


        body::after {

            content: "";

            position: fixed;

            width: 300px;
            height: 300px;

            border-radius: 50%;

            background:
                rgba(37, 99, 235, 0.045);

            bottom: -190px;
            left: -150px;

            pointer-events: none;

        }


        /* ==================================================
           LOGIN CARD
        ================================================== */

        .login-card {

            width: 100%;

            max-width: 540px;

            background: #ffffff;

            border:
                1px solid
                rgba(37, 99, 235, 0.08);

            border-radius: 22px;

            padding:
                30px
                42px
                24px;

            box-shadow:
                0 18px 55px
                rgba(30, 64, 120, 0.11);

            position: relative;

            z-index: 2;

        }


        /* ==================================================
           BRAND
        ================================================== */

        .brand {

            text-align: center;

            margin-bottom: 25px;

        }


        .mascot-wrapper {

            width: 100px;
            height: 100px;

            margin:
                0 auto 10px;

            display: flex;

            align-items: center;

            justify-content: center;

        }


        .mascot-wrapper img {

            width: 100px;
            height: 100px;

            object-fit: contain;

            display: block;

        }


        .brand-label {

            margin-bottom: 4px;

            font-size: 13px;

            font-weight: 800;

            letter-spacing: 4px;

            color: #2563eb;

        }


        .brand-title {

            margin: 0;

            font-size: 30px;

            line-height: 1.15;

            font-weight: 800;

            letter-spacing: -0.7px;

            color: #17233c;

        }


        .brand-subtitle {

            margin:
                8px
                0
                0;

            font-size: 14px;

            line-height: 1.4;

            color: #71809a;

        }


        /* ==================================================
           FORM
        ================================================== */

        .login-form {

            width: 100%;

        }


        .form-group {

            margin-bottom: 15px;

        }


        .form-label {

            display: block;

            margin-bottom: 6px;

            font-size: 14px;

            font-weight: 700;

            color: #26344d;

        }


        .input-wrapper {

            position: relative;

        }


        .input-icon {

            position: absolute;

            left: 15px;

            top: 50%;

            transform:
                translateY(-50%);

            width: 18px;
            height: 18px;

            color: #8291aa;

            pointer-events: none;

        }


        .form-input {

            width: 100%;

            height: 48px;

            border:
                1px solid
                #d8e1ef;

            border-radius: 9px;

            background: #ffffff;

            color: #17233c;

            padding:
                0
                45px
                0
                44px;

            outline: none;

            font-size: 14px;

            transition:
                border-color .2s ease,
                box-shadow .2s ease;

        }


        .form-input::placeholder {

            color: #9aa8bd;

        }


        .form-input:focus {

            border-color: #3b82f6;

            box-shadow:
                0 0 0 3px
                rgba(59, 130, 246, 0.10);

        }


        /* ==================================================
           PASSWORD
        ================================================== */

        .password-toggle {

            position: absolute;

            right: 13px;

            top: 50%;

            transform:
                translateY(-50%);

            border: none;

            background: transparent;

            color: #8291aa;

            padding: 5px;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

        }


        .password-toggle:hover {

            color: #2563eb;

        }


        /* ==================================================
           LOGIN BUTTON
        ================================================== */

        .login-button {

            width: 100%;

            height: 50px;

            margin-top: 5px;

            border: none;

            border-radius: 9px;

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #1d5fd1
                );

            color: #ffffff;

            font-size: 15px;

            font-weight: 700;

            cursor: pointer;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 8px;

            box-shadow:
                0 8px 18px
                rgba(37, 99, 235, 0.20);

            transition:
                transform .15s ease,
                box-shadow .15s ease;

        }


        .login-button:hover {

            transform:
                translateY(-1px);

            box-shadow:
                0 11px 23px
                rgba(37, 99, 235, 0.25);

        }


        .login-button:active {

            transform:
                translateY(0);

        }


        /* ==================================================
           ERROR
        ================================================== */

        .login-error {

            display: none;

            margin-bottom: 14px;

            padding:
                10px
                12px;

            border:
                1px solid
                #ffd1d1;

            border-radius: 8px;

            background: #fff5f5;

            color: #c62828;

            font-size: 13px;

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .login-footer {

            margin-top: 18px;

            text-align: center;

            color: #8a98ad;

            font-size: 11px;

        }


        /* ==================================================
           SMALL SCREEN
        ================================================== */

        @media (max-height: 700px) {

            body {

                padding:
                    10px
                    16px;

            }


            .login-card {

                padding:
                    22px
                    36px
                    18px;

            }


            .mascot-wrapper {

                width: 75px;
                height: 75px;

                margin-bottom: 6px;

            }


            .mascot-wrapper img {

                width: 75px;
                height: 75px;

            }


            .brand {

                margin-bottom: 18px;

            }


            .brand-title {

                font-size: 26px;

            }


            .brand-subtitle {

                margin-top: 5px;

                font-size: 13px;

            }


            .form-group {

                margin-bottom: 11px;

            }


            .form-input {

                height: 45px;

            }


            .login-button {

                height: 47px;

            }


            .login-footer {

                margin-top: 12px;

            }

        }


        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 560px) {

            body {

                padding:
                    14px;

            }


            .login-card {

                max-width: 100%;

                padding:
                    28px
                    22px
                    20px;

                border-radius: 18px;

            }


            .mascot-wrapper {

                width: 82px;
                height: 82px;

            }


            .mascot-wrapper img {

                width: 82px;
                height: 82px;

            }


            .brand-title {

                font-size: 26px;

            }


            .brand-label {

                font-size: 12px;

                letter-spacing: 3px;

            }

        }

    </style>

</head>


<body>


    <main class="login-card">


        <!-- ================================================
             BRAND
        ================================================= -->

        <section class="brand">


            <div class="mascot-wrapper">

                <img
                    src="/mascot.png"
                    alt="Maskot IT Support Pusat Gadai Indonesia"
                >

            </div>


            <div class="brand-label">

                IT SUPPORT

            </div>


            <h1 class="brand-title">

                Pusat Gadai Indonesia

            </h1>


            <p class="brand-subtitle">

                Silakan masukkan kredensial Anda untuk melanjutkan.

            </p>


        </section>


        <!-- ================================================
             LOGIN FORM
        ================================================= -->

        <form
            class="login-form"
            method="POST"
            action="/login"
            autocomplete="on"
        >


            <div
                id="login-error"
                class="login-error"
            ></div>


            <!-- USERNAME -->

            <div class="form-group">

                <label
                    class="form-label"
                    for="username"
                >
                    Username
                </label>


                <div class="input-wrapper">

                    <svg
                        class="input-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >

                        <path
                            d="M20 21a8 8 0 0 0-16 0"
                        />

                        <circle
                            cx="12"
                            cy="7"
                            r="4"
                        />

                    </svg>


                    <input
                        class="form-input"
                        id="username"
                        type="text"
                        name="username"
                        required
                        autocomplete="username"
                        placeholder="Masukkan username Anda"
                    >

                </div>

            </div>


            <!-- PASSWORD -->

            <div class="form-group">

                <label
                    class="form-label"
                    for="password"
                >
                    Password
                </label>


                <div class="input-wrapper">

                    <svg
                        class="input-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >

                        <rect
                            x="3"
                            y="11"
                            width="18"
                            height="10"
                            rx="2"
                        />

                        <path
                            d="M7 11V7a5 5 0 0 1 10 0v4"
                        />

                    </svg>


                    <input
                        class="form-input"
                        id="password"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        placeholder="Masukkan password Anda"
                    >


                    <button
                        type="button"
                        class="password-toggle"
                        id="toggle-password"
                        aria-label="Tampilkan password"
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >

                            <path
                                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                            />

                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                            />

                        </svg>

                    </button>

                </div>

            </div>


            <!-- LOGIN BUTTON -->

            <button
                type="submit"
                class="login-button"
            >

                <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >

                    <path
                        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    />

                    <polyline
                        points="10 17 15 12 10 7"
                    />

                    <line
                        x1="15"
                        y1="12"
                        x2="3"
                        y2="12"
                    />

                </svg>


                Login

            </button>


        </form>


        <footer class="login-footer">

            © 2026 Pusat Gadai Indonesia.
            All rights reserved.

        </footer>


    </main>


    <script>

        const passwordInput =
            document.getElementById(
                "password"
            );


        const togglePassword =
            document.getElementById(
                "toggle-password"
            );


        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                );

            }
        );

    </script>


</body>

</html>
        `);

    }
);
// ==========================================================
// LOGIN
// ==========================================================

router.post(
    "/login",
    requireGuest,
    (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;


            if (
                !username ||
                !password
            ) {

                return res.status(400).send(
                    "Username dan password wajib diisi."
                );

            }


            const user =
                findByUsername(
                    username.trim()
                );


            if (
                !user ||
                !user.aktif
            ) {

                return res.status(401).send(
                    "Username atau password salah."
                );

            }


            const valid =
                verifyPassword(
                    password,
                    user.password_hash
                );


            if (!valid) {

                return res.status(401).send(
                    "Username atau password salah."
                );

            }


            req.session.user = {

                id: user.id,

                username: user.username,

                name: user.name

            };


            return res.redirect(
                "/"
            );


        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            return res.status(500).send(
                "Terjadi kesalahan saat login."
            );

        }

    }
);


// ==========================================================
// AUTH STATUS
// ==========================================================

router.get(
    "/auth/status",
    (req, res) => {

        res.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, private"
        );

        const user =
            req.session &&
            req.session.user;


        if (!user) {

            return res.json({

                authenticated: false

            });

        }


        return res.json({

            authenticated: true,

            user: {

                id: user.id,

                username: user.username,

                name: user.name

            }

        });

    }
);


// ==========================================================
// LOGOUT
// ==========================================================

router.post(
    "/logout",
    (req, res) => {

        req.session.destroy(
            err => {

                if (err) {

                    console.error(
                        "Logout error:",
                        err
                    );

                    return res.status(500).json({

                        ok: false,

                        message:
                            "Gagal logout"

                    });

                }


                res.clearCookie(
                    "connect.sid"
                );

                return res.redirect("/");

            }
        );

    }
);


module.exports = router;