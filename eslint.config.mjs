
export default [
    {
        files: ["js/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                fetch: "readonly",
                URL: "readonly",
                URLSearchParams: "readonly",
                FormData: "readonly",
                IntersectionObserver: "readonly",
                MutationObserver: "readonly",
                localStorage: "readonly",
                sessionStorage: "readonly",
                HTMLElement: "readonly",
                Element: "readonly",
                Event: "readonly",
                Node: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                crypto: "readonly",
                AbortController: "readonly",
                requestAnimationFrame: "readonly",
                NodeFilter: "readonly",
                history: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "no-unreachable": "error",
            "no-duplicate-imports": "error",
            "eqeqeq": "error",
            "curly": "error"
        }
    }
];
