const moduleAlias = require('module-alias')

const outputPath = __dirname+"/dist/smart-savings-api"

moduleAlias.addAliases({
    "@infrastructure": outputPath+"/src/infrastructure",
    "@application": outputPath+"/src/application",
    "@domain": outputPath+"/src/domain",

    "@Session/infrastructure": outputPath+"/src/infrastructure/modules/Session/infrastructure",
    "@Session/application": outputPath+"/src/infrastructure/modules/Session/application",
    "@Session/domain": outputPath+"/src/infrastructure/modules/Session/domain",

    "@Users/infrastructure": outputPath+"/src/infrastructure/modules/Users/infrastructure",
    "@Users/application": outputPath+"/src/infrastructure/modules/Users/application",
    "@Users/domain": outputPath+"/src/infrastructure/modules/Users/domain",

    "@FinancialControl/infrastructure": outputPath+"/src/infrastructure/modules/FinancialControl/infrastructure",
    "@FinancialControl/application": outputPath+"/src/infrastructure/modules/FinancialControl/application",
    "@FinancialControl/domain": outputPath+"/src/infrastructure/modules/FinancialControl/domain",
})

moduleAlias()