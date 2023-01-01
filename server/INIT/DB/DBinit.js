async function DBINIT() {
    await require('./Accounts/DBAccountsINIT.js').DBAccountsINIT();
    await require('./Categories/DBCategoriesINIT.js').DBCategoriesINIT();
    await require('./Questions/DBQuestionsINIT.js').DBQuestionsINIT();
}

DBINIT();