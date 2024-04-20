module.exports={
    parser:'@typescript-eslint/parser',
    extends:[
        'plugin:@typescript-eslint/recommended'
    ],
    "rules": {
        // Note: you must disable the base rule as it can report incorrect errors
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error"
      }
}